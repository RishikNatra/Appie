import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, AUTH_RATE_LIMIT, createRateLimitExceededResponse } from "@/lib/rate-limit";
import { registerSchema, sanitizeString } from "@/lib/security";
import { registerUser } from "@/lib/auth-service";

export async function POST(req: NextRequest) {
  // 1. Strict Rate Limiting on Register Endpoint
  const rateLimitResult = await checkRateLimit(req, AUTH_RATE_LIMIT);
  if (!rateLimitResult.success) {
    return createRateLimitExceededResponse(rateLimitResult);
  }

  try {
    const body = await req.json();

    // 2. Pre-parse sanity check on string fields
    if (typeof body.email === "string") {
      const emailCheck = sanitizeString(body.email, { maxLen: 100 });
      if (!emailCheck.isValid) {
        return NextResponse.json({ error: emailCheck.flaggedReason }, { status: 400 });
      }
    }

    if (typeof body.username === "string") {
      const usernameCheck = sanitizeString(body.username, { maxLen: 30 });
      if (!usernameCheck.isValid) {
        return NextResponse.json({ error: usernameCheck.flaggedReason }, { status: 400 });
      }
    }

    // 3. Server-side Zod Validation
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || "Validation failed";
      return NextResponse.json({ error: firstError, details: validation.error.format() }, { status: 400 });
    }

    // 4. Register the user
    const result = await registerUser(validation.data);
    if (!result.success) {
      return NextResponse.json({ error: result.error || "Registration failed" }, { status: 400 });
    }

    const redirectUrl =
      result.user?.role === "patient" ? "/patient/home" : "/professional/home";

    return NextResponse.json({
      success: true,
      message: "Registration successful",
      user: result.user,
      redirectTo: redirectUrl,
    });
  } catch (err: unknown) {
    console.error("API Register Exception:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred during registration. Please try again." },
      { status: 500 }
    );
  }
}
