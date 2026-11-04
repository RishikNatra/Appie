import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, AUTH_RATE_LIMIT, createRateLimitExceededResponse } from "@/lib/rate-limit";
import { twoFactorSchema, sanitizeString } from "@/lib/security";
import { completeTwoFactorLogin } from "@/lib/auth-service";

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

    const validation = twoFactorSchema.safeParse(body);
    if (!validation.success) {
      const errorMsg = validation.error.issues[0]?.message || "Invalid 2FA code format";
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const { identifier, code } = validation.data;
    const result = await completeTwoFactorLogin(identifier, code);

    if (!result.success) {
      return NextResponse.json({ error: result.error || "2FA verification failed" }, { status: 401 });
    }

    const redirectUrl =
      result.user?.role === "patient" ? "/patient/home" : "/professional/home";

    return NextResponse.json({
      success: true,
      message: "Two-factor authentication verified.",
      user: result.user,
      redirectTo: redirectUrl,
    });
  } catch (err: unknown) {
    console.error("2FA Verification error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred during two-factor verification." },
      { status: 500 }
    );
  }
}

