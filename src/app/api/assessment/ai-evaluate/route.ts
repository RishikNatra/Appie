import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-service";
import { evaluateSymptomsWithAI, EvaluatedSymptomInput } from "@/lib/medical-ai-service";
import { checkRateLimit, AUTH_RATE_LIMIT, createRateLimitExceededResponse } from "@/lib/rate-limit";
import { sanitizeString } from "@/lib/security";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  // 1. Rate Limiting on AI evaluation endpoint
  const rateLimitResult = await checkRateLimit(req, { maxRequests: 15, windowMs: 60 * 1000 });
  if (!rateLimitResult.success) {
    return createRateLimitExceededResponse(rateLimitResult);
  }

  try {
    const user = await getCurrentUser();
    const body = await req.json();

    const symptoms: EvaluatedSymptomInput[] = body.symptoms;
    if (!Array.isArray(symptoms) || symptoms.length === 0) {
      return NextResponse.json({ error: "Please select at least one symptom." }, { status: 400 });
    }

    // 2. Input Sanitization against SQL injection, XSS & Prompt Injection
    const sanitizedSymptoms: EvaluatedSymptomInput[] = symptoms.map((s) => {
      const sanitizedName = sanitizeString(String(s.name || ""), { maxLen: 80 }).clean;
      const cleanSeverity = Math.min(Math.max(Number(s.severity) || 1, 1), 5);
      const cleanDuration = Math.min(Math.max(Number(s.durationDays) || 1, 1), 90);
      const cleanTags = Array.isArray(s.tags)
        ? s.tags.map((t) => sanitizeString(String(t), { maxLen: 50 }).clean)
        : [];
      const cleanNotes = s.notes ? sanitizeString(String(s.notes), { maxLen: 300 }).clean : "";

      return {
        name: sanitizedName,
        severity: cleanSeverity,
        durationDays: cleanDuration,
        tags: cleanTags,
        notes: cleanNotes,
      };
    });

    // 3. Evaluate with Medical AI
    const result = await evaluateSymptomsWithAI(sanitizedSymptoms);

    // 4. Persist to Supabase if patient is authenticated
    if (user && user.id) {
      try {
        const supabase = await createServerSupabaseClient();
        await supabase.from("health_assessments").insert({
          patient_id: user.id,
          title: `Assessment: ${result.condition}`,
          symptoms: sanitizedSymptoms,
          assessment_summary: result.summary,
          possible_conditions: result.possibleConditions,
          urgency_level: result.urgencyLevel,
          confidence_score: result.matchPercentage,
          recommendations: result.recommendations,
          recommended_specialization: result.recommendedSpecialization,
          status: "active",
        });
      } catch (dbErr) {
        console.warn("Could not persist assessment to Supabase:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      assessment: result,
    });
  } catch (err: unknown) {
    console.error("AI Evaluation error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred during medical AI evaluation." },
      { status: 500 }
    );
  }
}
