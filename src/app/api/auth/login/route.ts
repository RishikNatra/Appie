import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, AUTH_RATE_LIMIT, createRateLimitExceededResponse } from "@/lib/rate-limit";
import { loginSchema, sanitizeString } from "@/lib/security";
import { loginUser } from "@/lib/auth-service";

export async function POST(req: NextRequest) {
  // 1. Strict Rate Limiting on Login Endpoint (prevents brute force)
  const rateLimitResult = await checkRateLimit(req, AUTH_RATE_LIMIT);
  if (!rateLimitResult.success) {
    return createRateLimitExceededResponse(rateLimitResult);
  }

  try {
    const body = await req.json();

    // 2. Pre-parse sanity check on identifier input
    if (typeof body.identifier === "string") {
      const idCheck = sanitizeString(body.identifier, { maxLen: 100 });
      if (!idCheck.isValid) {
        return NextResponse.json({ error: idCheck.flaggedReason }, { status: 400 });
      }
    }

    // 3. Server-side Zod Validation
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || "Invalid input";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    // 4. Authenticate user
    const result = await loginUser(validation.data);
    if (!result.success) {
      return NextResponse.json({ error: result.error || "Authentication failed" }, { status: 401 });
    }

    const redirectUrl =
      result.user?.role === "patient" ? "/patient/home" : "/professional/home";

    return NextResponse.json({
      success: true,
      message: "Authentication successful",
      user: result.user,
      redirectTo: redirectUrl,
    });
  } catch (err: unknown) {
    console.error("API Login Exception:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred during login. Please try again." },
      { status: 500 }
    );
  }
}
