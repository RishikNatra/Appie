import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, RESEND_RATE_LIMIT, createRateLimitExceededResponse } from "@/lib/rate-limit";
import { resendCodeSchema, sanitizeString } from "@/lib/security";
import { generateVerificationCode } from "@/lib/account-service";

export async function POST(req: NextRequest) {
  // Very strict rate limit: 3 resend requests per minute
  const rateLimitResult = await checkRateLimit(req, RESEND_RATE_LIMIT);
  if (!rateLimitResult.success) {
    return createRateLimitExceededResponse(rateLimitResult);
  }

  try {
    const body = await req.json();

    if (typeof body.identifier === "string") {
      const idCheck = sanitizeString(body.identifier, { maxLen: 100 });
      if (!idCheck.isValid) {
        return NextResponse.json({ error: idCheck.flaggedReason }, { status: 400 });
      }
    }

    const validation = resendCodeSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
    }

    const { identifier, type } = validation.data;
    const newCode = generateVerificationCode(identifier, type);

    return NextResponse.json({
      success: true,
      message: `A new verification code has been dispatched. For testing, use code: ${newCode} or universal test code 123456`,
      cooldownSeconds: 60,
    });
  } catch (err: unknown) {
    console.error("Resend code error:", err);
    return NextResponse.json(
      { error: "Failed to dispatch verification code." },
      { status: 500 }
    );
  }
}

