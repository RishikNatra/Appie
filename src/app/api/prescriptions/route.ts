import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-service";
import { getPrescriptions, createPrescription } from "@/lib/prescription-service";
import { prescriptionCreateSchema, sanitizeInput } from "@/lib/security";
import { rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const prescriptions = await getPrescriptions(user.id, user.role as "patient" | "health_professional");
  return NextResponse.json({ prescriptions });
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1";
  const rl = await rateLimit(`prescription-create:${ip}`, 20, 60);
  if (!rl.success) {
    return NextResponse.json({ error: "Rate limit reached. Please try again later." }, { status: 429 });
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (user.role !== "health_professional") {
    return NextResponse.json({ error: "Only verified healthcare professionals can issue prescriptions" }, { status: 403 });
  }

  try {
    const rawBody = await req.json();
    const parseResult = prescriptionCreateSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parseResult.error.format() },
        { status: 400 }
      );
    }

    const { patientId, appointmentId, diagnosis, medications, generalAdvice, validDays } = parseResult.data;

    const prescription = await createPrescription({
      appointmentId,
      patientId,
      professionalId: user.id,
      doctorName: user.fullName || user.username,
      doctorLicenseNumber: "MCI-VALID-PRACTITIONER",
      doctorCouncil: "National Medical Commission",
      doctorSpecialization: "Clinical Practitioner",
      diagnosis: sanitizeInput(diagnosis),
      medications: medications.map((m, idx) => ({
        id: "rx-item-" + idx + "-" + Date.now(),
        medicationId: m.medicationId,
        medicineName: sanitizeInput(m.medicineName),
        dosage: sanitizeInput(m.dosage),
        frequency: sanitizeInput(m.frequency),
        duration: sanitizeInput(m.duration),
        instructions: sanitizeInput(m.instructions || ""),
      })),
      generalAdvice: generalAdvice ? sanitizeInput(generalAdvice) : undefined,
      validDays,
    });

    return NextResponse.json({ success: true, prescription }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to create prescription" }, { status: 500 });
  }
}

