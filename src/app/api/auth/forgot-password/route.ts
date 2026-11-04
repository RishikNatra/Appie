import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, AUTH_RATE_LIMIT, createRateLimitExceededResponse } from "@/lib/rate-limit";
import { forgotPasswordSchema, sanitizeString } from "@/lib/security";
import { initiatePasswordRecovery } from "@/lib/auth-service";

export async function POST(req: NextRequest) {
  const rateLimitResult = await checkRateLimit(req, AUTH_RATE_LIMIT);
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

    const validation = forgotPasswordSchema.safeParse(body);
    if (!validation.success) {
      const errorMsg = validation.error.issues[0]?.message || "Invalid input";
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const { identifier, method } = validation.data;
    const result = await initiatePasswordRecovery(identifier, method);

    return NextResponse.json({
      success: true,
      message: result.message,
      maskedTarget: result.maskedTarget,
    });
  } catch (err: unknown) {
    console.error("Forgot password error:", err);
    return NextResponse.json(
      { error: "Unable to process password recovery request." },
      { status: 500 }
    );
  }
}

