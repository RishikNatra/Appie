import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, PUBLIC_API_RATE_LIMIT, createRateLimitExceededResponse } from "@/lib/rate-limit";
import { getCurrentUser } from "@/lib/auth-service";
import { getAssessmentById } from "@/lib/assessment-service";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const rateLimitResult = await checkRateLimit(req, PUBLIC_API_RATE_LIMIT);
  if (!rateLimitResult.success) {
    return createRateLimitExceededResponse(rateLimitResult);
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const { id } = await context.params;
  const assessment = await getAssessmentById(id);

  if (!assessment) {
    return NextResponse.json({ error: "Assessment record not found" }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    assessment,
  });
}

