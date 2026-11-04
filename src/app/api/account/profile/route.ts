import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, PUBLIC_API_RATE_LIMIT, createRateLimitExceededResponse } from "@/lib/rate-limit";
import { profileUpdateSchema, sanitizeString } from "@/lib/security";
import { getCurrentUser } from "@/lib/auth-service";
import {
  getUserProfile,
  updateUserProfile,
  calculateProfileCompleteness,
} from "@/lib/account-service";

export async function GET(req: NextRequest) {
  const rateLimitResult = await checkRateLimit(req, PUBLIC_API_RATE_LIMIT);
  if (!rateLimitResult.success) {
    return createRateLimitExceededResponse(rateLimitResult);
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const profile = await getUserProfile(user.id);
  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const completeness = calculateProfileCompleteness(profile);

  return NextResponse.json({
    success: true,
    profile,
    completeness,
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

    // Sanitize string inputs
    for (const key of Object.keys(body)) {
      if (typeof body[key] === "string") {
        const check = sanitizeString(body[key], { maxLen: 200 });
        if (!check.isValid) {
          return NextResponse.json({ error: `Field '${key}': ${check.flaggedReason}` }, { status: 400 });
        }
        body[key] = check.clean;
      }
    }

    const validation = profileUpdateSchema.safeParse(body);
    if (!validation.success) {
      const errorMsg = validation.error.issues[0]?.message || "Validation failed";
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const result = await updateUserProfile(user.id, validation.data);
    if (!result.success || !result.profile) {
      return NextResponse.json({ error: result.error || "Failed to update profile" }, { status: 400 });
    }

    const completeness = calculateProfileCompleteness(result.profile);

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully.",
      profile: result.profile,
      completeness,
    });
  } catch (err: unknown) {
    console.error("Profile update error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred while saving profile changes." },
      { status: 500 }
    );
  }
}

