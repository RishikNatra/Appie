import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-service";
import {
  getClinicalReviews,
  submitClinicalReview,
  getPendingAssessmentQueue,
} from "@/lib/review-service";
import { clinicalReviewSubmissionSchema, sanitizeInput } from "@/lib/security";
import { rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const queue = searchParams.get("queue");

  if (queue === "pending" && user.role === "health_professional") {
    const pendingList = await getPendingAssessmentQueue();
    return NextResponse.json({ pendingQueue: pendingList, count: pendingList.length });
  }

  const reviews = await getClinicalReviews(user.id, user.role as "patient" | "health_professional");
  return NextResponse.json({ reviews, count: reviews.length });
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1";
  const rl = await rateLimit(`clinical-review:${ip}`, 30, 60);
  if (!rl.success) {
    return NextResponse.json({ error: "Too many requests. Please wait." }, { status: 429 });
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (user.role !== "health_professional") {
    return NextResponse.json({ error: "Only verified healthcare professionals can conduct clinical reviews" }, { status: 403 });
  }

  try {
    const rawBody = await req.json();
    const parseResult = clinicalReviewSubmissionSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parseResult.error.format() },
        { status: 400 }
      );
    }

    const { assessmentId, prescriptionId, patientId, reviewType, status, clinicalNotes, prescribedActions } = parseResult.data;

    const review = await submitClinicalReview({
      professionalId: user.id,
      professionalName: user.fullName || `Dr. ${user.username}`,
      patientId,
      assessmentId,
      assessmentTitle: rawBody.assessmentTitle || "Clinical Health Assessment",
      prescriptionId,
      reviewType,
      status,
      clinicalNotes: sanitizeInput(clinicalNotes),
      prescribedActions: prescribedActions.map((a) => sanitizeInput(a)),
    });

    return NextResponse.json({ success: true, review }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to submit clinical review" }, { status: 500 });
  }
}

