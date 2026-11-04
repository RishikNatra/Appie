import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, PUBLIC_API_RATE_LIMIT, createRateLimitExceededResponse } from "@/lib/rate-limit";
import { getCurrentUser } from "@/lib/auth-service";
import { getPatientAssessments } from "@/lib/assessment-service";

export async function GET(req: NextRequest) {
  const rateLimitResult = await checkRateLimit(req, PUBLIC_API_RATE_LIMIT);
  if (!rateLimitResult.success) {
    return createRateLimitExceededResponse(rateLimitResult);
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const assessments = await getPatientAssessments(user.id);
  return NextResponse.json({
    success: true,
    assessments,
  });
}

