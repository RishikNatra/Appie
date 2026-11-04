import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, PUBLIC_API_RATE_LIMIT, createRateLimitExceededResponse } from "@/lib/rate-limit";
import { consentUpdateSchema } from "@/lib/security";
import { getCurrentUser } from "@/lib/auth-service";
import { getUserConsents, updateConsents } from "@/lib/account-service";

export async function GET(req: NextRequest) {
  const rateLimitResult = await checkRateLimit(req, PUBLIC_API_RATE_LIMIT);
  if (!rateLimitResult.success) {
    return createRateLimitExceededResponse(rateLimitResult);
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const consents = await getUserConsents(user.id);
  return NextResponse.json({
    success: true,
    consents,
  });
}

export async function PUT(req: NextRequest) {
  const rateLimitResult = await checkRateLimit(req, PUBLIC_API_RATE_LIMIT);
  if (!rateLimitResult.success) {
    return createRateLimitExceededResponse(rateLimitResult);
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validation = consentUpdateSchema.safeParse(body);
    if (!validation.success) {
      const errorMsg = validation.error.issues[0]?.message || "Validation failed";
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const result = await updateConsents(user.id, validation.data.consents);
    if (!result.success || !result.consents) {
      return NextResponse.json({ error: result.error || "Failed to update consents" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "Consent preferences updated successfully.",
      consents: result.consents,
    });
  } catch (err: unknown) {
    console.error("Consent update error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred while updating consents." },
      { status: 500 }
    );
  }
}

