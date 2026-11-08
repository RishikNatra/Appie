import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, AUTH_RATE_LIMIT, createRateLimitExceededResponse } from "@/lib/rate-limit";
import { registerSchema, sanitizeString } from "@/lib/security";
import { registerUser } from "@/lib/auth-service";

export async function POST(req: NextRequest) {
  // 1. Strict Rate Limiting on Register Endpoint (5 requests / min)
  const rateLimitResult = await checkRateLimit(req, AUTH_RATE_LIMIT);
  if (!rateLimitResult.success) {
    return createRateLimitExceededResponse(rateLimitResult);
  }

  try {
    const body = await req.json();

    // 2. Pre-parse sanity check against SQL injection / XSS / Prompt Injection
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

    // 3. Server-side Zod Schema Validation
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || "Validation failed";
      return NextResponse.json(
        { error: firstError, details: validation.error.format() },
        { status: 400 }
      );
    }

    // 4. Register the user
    const result = await registerUser(validation.data);
    if (!result.success) {
      return NextResponse.json({ error: result.error || "Registration failed" }, { status: 400 });
    }

    // Direct dashboard routing (2FA & verification bypassed per instructions)
    const role = result.user?.role || validation.data.role;
    let redirectUrl = "/patient/home";
    if (role === "health_professional") redirectUrl = "/professional/home";
    else if (role === "pharmacist") redirectUrl = "/pharmacist/home";
    else if (role === "delivery_partner") redirectUrl = "/delivery/home";

    return NextResponse.json({
      success: true,
      message: "Registration successful! Welcome to Appie.",
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
