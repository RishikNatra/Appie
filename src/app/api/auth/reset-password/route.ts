import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, AUTH_RATE_LIMIT, createRateLimitExceededResponse } from "@/lib/rate-limit";
import { resetPasswordSchema, sanitizeString } from "@/lib/security";
import { resetPasswordWithCode } from "@/lib/auth-service";

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

    const validation = resetPasswordSchema.safeParse(body);
    if (!validation.success) {
      const errorMsg = validation.error.issues[0]?.message || "Validation failed";
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const { identifier, code, newPassword } = validation.data;
    const result = await resetPasswordWithCode(identifier, code, newPassword);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Password reset failed. Ensure your recovery code is valid." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Your password has been successfully reset. You may now log in with your new password.",
      redirectTo: "/login",
    });
  } catch (err: unknown) {
    console.error("Reset password error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred while resetting your password." },
      { status: 500 }
    );
  }
}

