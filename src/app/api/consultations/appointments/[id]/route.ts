import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-service";
import { getAppointmentById, updateAppointmentStatus, rescheduleAppointment } from "@/lib/consultation-service";
import { sanitizeInput } from "@/lib/security";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const appointment = await getAppointmentById(id);

  if (!appointment) {
    return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
  }

  return NextResponse.json({ appointment });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  if (body.action === "cancel") {
    const updated = await updateAppointmentStatus(id, "cancelled", sanitizeInput(body.notes || "Cancelled by user"));
    return NextResponse.json({ success: true, appointment: updated });
  }

  if (body.action === "reschedule") {
    if (!body.appointmentDate || !body.timeSlot) {
      return NextResponse.json({ error: "New date and timeSlot required" }, { status: 400 });
    }
    const updated = await rescheduleAppointment(id, body.appointmentDate, sanitizeInput(body.timeSlot));
    return NextResponse.json({ success: true, appointment: updated });
  }

  if (body.action === "start") {
    const updated = await updateAppointmentStatus(id, "in_progress");
    return NextResponse.json({ success: true, appointment: updated });
  }

  if (body.action === "complete") {
    const updated = await updateAppointmentStatus(id, "completed");
    return NextResponse.json({ success: true, appointment: updated });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}

