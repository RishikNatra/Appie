import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, PUBLIC_API_RATE_LIMIT, createRateLimitExceededResponse } from "@/lib/rate-limit";
import { healthProfileUpdateSchema, sanitizeString } from "@/lib/security";
import { getCurrentUser } from "@/lib/auth-service";
import { getHealthProfile, updateHealthProfile } from "@/lib/account-service";

export async function GET(req: NextRequest) {
  const rateLimitResult = await checkRateLimit(req, PUBLIC_API_RATE_LIMIT);
  if (!rateLimitResult.success) {
    return createRateLimitExceededResponse(rateLimitResult);
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const healthProfile = await getHealthProfile(user.id);
  return NextResponse.json({
    success: true,
    healthProfile,
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

    // Sanitize string fields
    if (typeof body.medicalHistoryNotes === "string") {
      const check = sanitizeString(body.medicalHistoryNotes, { maxLen: 2000 });
      if (!check.isValid) {
        return NextResponse.json({ error: check.flaggedReason }, { status: 400 });
      }
      body.medicalHistoryNotes = check.clean;
    }

    if (Array.isArray(body.medicalConditions)) {
      body.medicalConditions = body.medicalConditions.map((c: unknown) =>
        typeof c === "string" ? sanitizeString(c, { maxLen: 100 }).clean : ""
      ).filter(Boolean);
    }

    if (Array.isArray(body.allergies)) {
      body.allergies = body.allergies.map((a: unknown) =>
        typeof a === "string" ? sanitizeString(a, { maxLen: 100 }).clean : ""
      ).filter(Boolean);
    }

    if (Array.isArray(body.currentMedications)) {
      body.currentMedications = body.currentMedications.map((m: unknown) =>
        typeof m === "string" ? sanitizeString(m, { maxLen: 100 }).clean : ""
      ).filter(Boolean);
    }

    const validation = healthProfileUpdateSchema.safeParse(body);
    if (!validation.success) {
      const errorMsg = validation.error.issues[0]?.message || "Validation failed";
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const result = await updateHealthProfile(user.id, validation.data);
    if (!result.success || !result.profile) {
      return NextResponse.json({ error: result.error || "Failed to update health profile" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "Health profile saved successfully.",
      healthProfile: result.profile,
    });
  } catch (err: unknown) {
    console.error("Health profile update error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred while saving health profile." },
      { status: 500 }
    );
  }
}

