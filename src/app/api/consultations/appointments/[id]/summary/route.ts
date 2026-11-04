import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-service";
import { getConsultationSummary, saveConsultationSummary, getAppointmentById } from "@/lib/consultation-service";
import { consultationSummarySchema, sanitizeInput } from "@/lib/security";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const summary = await getConsultationSummary(id);
  return NextResponse.json({ summary });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const appointment = await getAppointmentById(id);

  if (!appointment) {
    return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
  }

  try {
    const rawBody = await req.json();
    const parseResult = consultationSummarySchema.safeParse({ ...rawBody, appointmentId: id });

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parseResult.error.format() },
        { status: 400 }
      );
    }

    const { clinicalDiagnosis, doctorNotes, recommendations, followUpDate, followUpInstructions } = parseResult.data;

    const summary = await saveConsultationSummary({
      appointmentId: id,
      professionalId: user.id,
      patientId: appointment.patientId,
      doctorName: user.fullName || user.username,
      clinicalDiagnosis: sanitizeInput(clinicalDiagnosis),
      doctorNotes: sanitizeInput(doctorNotes),
      recommendations: recommendations.map((r) => sanitizeInput(r)),
      followUpDate,
      followUpInstructions: followUpInstructions ? sanitizeInput(followUpInstructions) : undefined,
      prescriptionId: rawBody.prescriptionId,
    });

    return NextResponse.json({ success: true, summary });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to save summary" }, { status: 500 });
  }
}

