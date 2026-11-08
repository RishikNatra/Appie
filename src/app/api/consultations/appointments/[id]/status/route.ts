import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-service";
import { updateAppointmentStatus } from "@/lib/consultation-service";
import { sanitizeString } from "@/lib/security";
import { AppointmentStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    const body = await req.json();
    const cleanStatus = sanitizeString(String(body.status || ""), { maxLen: 50 }).clean as AppointmentStatus;

    if (!cleanStatus) {
      return NextResponse.json({ error: "Invalid appointment status" }, { status: 400 });
    }

    const updated = await updateAppointmentStatus(id, cleanStatus);
    return NextResponse.json({ success: true, appointment: updated });
  } catch (err: unknown) {
    console.error("Appointment status update failed:", err);
    return NextResponse.json({ error: "Failed to update appointment status" }, { status: 500 });
  }
}
