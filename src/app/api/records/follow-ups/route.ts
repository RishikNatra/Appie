import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-service";
import { getCareFollowUps, updateCareFollowUpStatus } from "@/lib/record-service";
import { careFollowUpUpdateSchema, sanitizeInput } from "@/lib/security";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const followUps = await getCareFollowUps(user.id);
  const pendingCount = followUps.filter((f) => f.status === "pending").length;

  return NextResponse.json({ followUps, pendingCount, total: followUps.length });
}

export async function PATCH(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const rawBody = await req.json();
    const parseResult = careFollowUpUpdateSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parseResult.error.format() },
        { status: 400 }
      );
    }

    const { followUpId, status, notes } = parseResult.data;
    const updated = await updateCareFollowUpStatus(
      followUpId,
      status,
      notes ? sanitizeInput(notes) : undefined
    );

    return NextResponse.json({ success: true, followUp: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update follow-up" }, { status: 500 });
  }
}

