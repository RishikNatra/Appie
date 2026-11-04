import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, PUBLIC_API_RATE_LIMIT, createRateLimitExceededResponse } from "@/lib/rate-limit";
import { settingsUpdateSchema } from "@/lib/security";
import { getCurrentUser } from "@/lib/auth-service";
import {
  getUserSettings,
  updateUserSettings,
  updateUserProfile,
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

  const settings = await getUserSettings(user.id);
  return NextResponse.json({
    success: true,
    settings,
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
    const validation = settingsUpdateSchema.safeParse(body);
    if (!validation.success) {
      const errorMsg = validation.error.issues[0]?.message || "Validation failed";
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const result = await updateUserSettings(user.id, validation.data);
    if (!result.success || !result.settings) {
      return NextResponse.json({ error: result.error || "Failed to update settings" }, { status: 400 });
    }

    // Also synchronize 2FA toggle into the user profile if modified
    if (validation.data.twoFactorEnabled !== undefined) {
      await updateUserProfile(user.id, {
        twoFactorEnabled: validation.data.twoFactorEnabled,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Application settings updated successfully.",
      settings: result.settings,
    });
  } catch (err: unknown) {
    console.error("Settings update error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred while saving settings." },
      { status: 500 }
    );
  }
}

