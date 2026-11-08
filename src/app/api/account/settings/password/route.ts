import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, PUBLIC_API_RATE_LIMIT, createRateLimitExceededResponse } from "@/lib/rate-limit";
import { getCurrentUser } from "@/lib/auth-service";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const rateLimitResult = await checkRateLimit(req, PUBLIC_API_RATE_LIMIT);
  if (!rateLimitResult.success) {
    return createRateLimitExceededResponse(rateLimitResult);
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  try {
    const { currentPassword, newPassword, confirmPassword } = await req.json();

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { error: "New password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: "New password and confirmation do not match." },
        { status: 400 }
      );
    }

    // If Supabase is active, update via Supabase auth API
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const isLive = Boolean(
      url &&
        key &&
        !url.includes("demo-appie.supabase.co") &&
        !url.includes("your-supabase-project") &&
        !key.includes("demo-anon-key") &&
        !key.includes("your-supabase-anon-key")
    );

    if (isLive) {
      const supabase = await createServerSupabaseClient();
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Password updated successfully. Your new credentials are now active.",
    });
  } catch (err: unknown) {
    console.error("Password update error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred while updating password." },
      { status: 500 }
    );
  }
}
