import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, VERIFY_RATE_LIMIT, createRateLimitExceededResponse } from "@/lib/rate-limit";
import { verifyCodeSchema, sanitizeString } from "@/lib/security";
import { verifyCode } from "@/lib/account-service";
import { getCurrentUser } from "@/lib/auth-service";

export async function POST(req: NextRequest) {
  const rateLimitResult = await checkRateLimit(req, VERIFY_RATE_LIMIT);
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

    const validation = verifyCodeSchema.safeParse(body);
    if (!validation.success) {
      const errorMsg = validation.error.issues[0]?.message || "Invalid verification code";
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const { identifier, code, type } = validation.data;
    const isValid = verifyCode(identifier, type, code);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid or expired verification code. Use demo OTP 123456 or check your messages." },
        { status: 400 }
      );
    }

    const user = await getCurrentUser();
    const destination =
      user?.role === "health_professional" ? "/professional/verify-status" : "/patient/home";

    return NextResponse.json({
      success: true,
      message: "Verification successful! Account verified.",
      redirectTo: destination,
    });
  } catch (err: unknown) {
    console.error("Verify code error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred during verification." },
      { status: 500 }
    );
  }
}

