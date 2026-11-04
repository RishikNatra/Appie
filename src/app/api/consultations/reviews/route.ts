import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-service";
import { submitConsultationReview, getDoctorReviews } from "@/lib/consultation-service";
import { consultationReviewSchema, sanitizeInput } from "@/lib/security";
import { rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const professionalId = searchParams.get("professionalId");

  if (!professionalId) {
    return NextResponse.json({ error: "professionalId is required" }, { status: 400 });
  }

  const reviews = await getDoctorReviews(professionalId);
  return NextResponse.json({ reviews, count: reviews.length });
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1";
  const rl = await rateLimit(`consult-review:${ip}`, 20, 60);
  if (!rl.success) {
    return NextResponse.json({ error: "Too many requests. Please wait." }, { status: 429 });
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const rawBody = await req.json();
    const parseResult = consultationReviewSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parseResult.error.format() },
        { status: 400 }
      );
    }

    const { appointmentId, professionalId, rating, reviewText, tags, isAnonymous } = parseResult.data;

    const review = await submitConsultationReview({
      appointmentId,
      patientId: user.id,
      patientName: user.fullName || user.username,
      professionalId,
      rating,
      reviewText: reviewText ? sanitizeInput(reviewText) : undefined,
      tags: tags.map((t) => sanitizeInput(t)),
      isAnonymous,
    });

    return NextResponse.json({ success: true, review }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to submit review" }, { status: 500 });
  }
}

