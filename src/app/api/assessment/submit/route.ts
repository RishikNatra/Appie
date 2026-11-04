import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, PUBLIC_API_RATE_LIMIT, createRateLimitExceededResponse } from "@/lib/rate-limit";
import { assessmentSubmissionSchema, sanitizeString } from "@/lib/security";
import { getCurrentUser } from "@/lib/auth-service";
import { createHealthAssessment } from "@/lib/assessment-service";

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

    // Sanitize string inputs
    if (typeof body.title === "string") {
      const check = sanitizeString(body.title, { maxLen: 150 });
      if (!check.isValid) return NextResponse.json({ error: check.flaggedReason }, { status: 400 });
      body.title = check.clean;
    }

    if (typeof body.additionalNotes === "string") {
      const check = sanitizeString(body.additionalNotes, { maxLen: 1000 });
      if (!check.isValid) return NextResponse.json({ error: check.flaggedReason }, { status: 400 });
      body.additionalNotes = check.clean;
    }

    if (Array.isArray(body.symptoms)) {
      body.symptoms = body.symptoms.map((s: any) => ({
        ...s,
        name: typeof s.name === "string" ? sanitizeString(s.name, { maxLen: 100 }).clean : s.name,
        category: typeof s.category === "string" ? sanitizeString(s.category, { maxLen: 50 }).clean : "General",
        notes: typeof s.notes === "string" ? sanitizeString(s.notes, { maxLen: 500 }).clean : "",
      }));
    }

    const validation = assessmentSubmissionSchema.safeParse(body);
    if (!validation.success) {
      const errorMsg = validation.error.issues[0]?.message || "Validation failed";
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const { title, symptoms, additionalNotes } = validation.data;
    const cleanSymptoms = symptoms.map((s, idx) => ({
      id: s.id || `sym-${Date.now()}-${idx}`,
      name: s.name,
      category: s.category,
      severity: s.severity,
      durationDays: s.durationDays,
      frequency: s.frequency,
      notes: s.notes,
    }));

    const result = await createHealthAssessment(user.id, title, cleanSymptoms, additionalNotes);

    if (!result.success || !result.assessment) {
      return NextResponse.json({ error: result.error || "Failed to generate assessment" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "Health assessment generated successfully.",
      assessment: result.assessment,
      redirectTo: `/assessment/result?id=${result.assessment.id}`,
    });
  } catch (err: unknown) {
    console.error("Assessment submission error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred during clinical evaluation." },
      { status: 500 }
    );
  }
}
