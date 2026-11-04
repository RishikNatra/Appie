import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, PUBLIC_API_RATE_LIMIT, createRateLimitExceededResponse } from "@/lib/rate-limit";
import { symptomProgressUpdateSchema, sanitizeString } from "@/lib/security";
import { getCurrentUser } from "@/lib/auth-service";
import { updateSymptomProgress } from "@/lib/assessment-service";

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
    const body = await req.json();

    if (typeof body.notes === "string") {
      const check = sanitizeString(body.notes, { maxLen: 500 });
      if (!check.isValid) return NextResponse.json({ error: check.flaggedReason }, { status: 400 });
      body.notes = check.clean;
    }

    const validation = symptomProgressUpdateSchema.safeParse(body);
    if (!validation.success) {
      const errorMsg = validation.error.issues[0]?.message || "Validation failed";
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const { trackerId, severity, status, notes } = validation.data;
    const result = await updateSymptomProgress(trackerId, severity, status, notes);

    if (!result.success || !result.tracker) {
      return NextResponse.json({ error: result.error || "Failed to update tracker" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "Symptom progress point logged successfully.",
      tracker: result.tracker,
    });
  } catch (err: unknown) {
    console.error("Symptom tracker update error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred while updating symptom tracker." },
      { status: 500 }
    );
  }
}

