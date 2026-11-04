import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-service";
import { getAppointments, bookAppointment } from "@/lib/consultation-service";
import { appointmentBookingSchema, sanitizeInput } from "@/lib/security";
import { rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const appointments = await getAppointments(user.id, user.role as "patient" | "health_professional");
  return NextResponse.json({ appointments });
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1";
  const rl = await rateLimit(`appt-booking:${ip}`, 30, 60);
  if (!rl.success) {
    return NextResponse.json({ error: "Rate limit reached. Please try again later." }, { status: 429 });
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const rawBody = await req.json();
    const parseResult = appointmentBookingSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parseResult.error.format() },
        { status: 400 }
      );
    }

    const { professionalId, appointmentDate, timeSlot, type, reason, assessmentId } = parseResult.data;

    const appointment = await bookAppointment({
      patientId: user.id,
      patientName: user.fullName || user.username,
      professionalId: sanitizeInput(professionalId),
      appointmentDate,
      timeSlot: sanitizeInput(timeSlot),
      type,
      reason: sanitizeInput(reason),
      assessmentId: assessmentId ? sanitizeInput(assessmentId) : undefined,
    });

    return NextResponse.json({ success: true, appointment }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to book appointment" }, { status: 500 });
  }
}

