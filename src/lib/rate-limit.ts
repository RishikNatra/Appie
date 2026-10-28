import { NextResponse } from "next/server";

interface RateLimitConfig {
  maxRequests: number; // Maximum allowed requests
  windowMs: number;    // Window timeframe in milliseconds
  prefix?: string;     // Endpoint bucket prefix
}

interface RateLimitRecord {
  timestamps: number[];
}

// In-Memory store for development or when Upstash Redis is not yet provisioned
const memoryStore = new Map<string, RateLimitRecord>();

// Cleanup stale keys every 5 minutes to prevent memory leak
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of memoryStore.entries()) {
      record.timestamps = record.timestamps.filter((ts) => now - ts < 300000);
      if (record.timestamps.length === 0) {
        memoryStore.delete(key);
      }
    }
  }, 300000);
}

/**
 * Extracts client IP from incoming request headers
 */
export function getClientIp(req: Request): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  const cfIp = req.headers.get("cf-connecting-ip");
  if (cfIp) return cfIp.trim();

  return "127.0.0.1";
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetSeconds: number;
  ip: string;
}

/**
 * Checks and increments the rate limit for a client IP.
 * Supports Upstash Redis REST if configured, otherwise uses high-performance memory store.
 */
export async function checkRateLimit(
  req: Request,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const ip = getClientIp(req);
  const key = `${config.prefix || "global"}:${ip}`;
  const now = Date.now();
  const windowStart = now - config.windowMs;

  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  // Use Upstash Redis if configured
  if (upstashUrl && upstashToken) {
    try {
      // Upstash REST API sliding window increment
      const response = await fetch(`${upstashUrl}/pipeline`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${upstashToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify([
          ["ZREMRANGEBYSCORE", key, "0", windowStart.toString()],
          ["ZADD", key, now.toString(), now.toString()],
          ["ZCARD", key],
          ["EXPIRE", key, Math.ceil(config.windowMs / 1000).toString()],
        ]),
        cache: "no-store",
      });

      if (response.ok) {
        const results = await response.json();
        const requestCount = (results[2]?.result as number) || 1;
        const remaining = Math.max(0, config.maxRequests - requestCount);
        const success = requestCount <= config.maxRequests;
        return {
          success,
          limit: config.maxRequests,
          remaining,
          resetSeconds: Math.ceil(config.windowMs / 1000),
          ip,
        };
      }
    } catch {
      // Fallback silently to memory store on network issues
    }
  }

  // Memory sliding window implementation
  let record = memoryStore.get(key);
  if (!record) {
    record = { timestamps: [] };
    memoryStore.set(key, record);
  }

  // Filter timestamps within current window
  record.timestamps = record.timestamps.filter((ts) => ts > windowStart);

  if (record.timestamps.length >= config.maxRequests) {
    const oldestTimestamp = record.timestamps[0];
    const resetSeconds = Math.max(
      1,
      Math.ceil((oldestTimestamp + config.windowMs - now) / 1000)
    );

    return {
      success: false,
      limit: config.maxRequests,
      remaining: 0,
      resetSeconds,
      ip,
    };
  }

  record.timestamps.push(now);
  const remaining = config.maxRequests - record.timestamps.length;

  return {
    success: true,
    limit: config.maxRequests,
    remaining,
    resetSeconds: Math.ceil(config.windowMs / 1000),
    ip,
  };
}

/**
 * Standard preset: Auth endpoints (Login & Registration)
 * Strict limit: 5 requests per 60 seconds
 */
export const AUTH_RATE_LIMIT: RateLimitConfig = {
  maxRequests: 5,
  windowMs: 60 * 1000,
  prefix: "appie_auth",
};

/**
 * Standard preset: Public API endpoints
 * 30 requests per 60 seconds
 */
export const PUBLIC_API_RATE_LIMIT: RateLimitConfig = {
  maxRequests: 30,
  windowMs: 60 * 1000,
  prefix: "appie_public",
};

/**
 * Generates an HTTP 429 Too Many Requests response with standard rate limit headers
 */
export function createRateLimitExceededResponse(result: RateLimitResult): NextResponse {
  return NextResponse.json(
    {
      error: "Too many requests. For your security, rate limiting is strictly enforced.",
      message: `You have reached the request limit. Please try again in ${result.resetSeconds} seconds.`,
      retryAfter: result.resetSeconds,
    },
    {
      status: 429,
      headers: {
        "Retry-After": result.resetSeconds.toString(),
        "X-RateLimit-Limit": result.limit.toString(),
        "X-RateLimit-Remaining": result.remaining.toString(),
        "X-RateLimit-Reset": result.resetSeconds.toString(),
      },
    }
  );
}
