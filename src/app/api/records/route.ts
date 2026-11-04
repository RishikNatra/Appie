import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-service";
import { getUnifiedHealthTimeline, uploadMedicalRecord } from "@/lib/record-service";
import { medicalRecordUploadSchema, sanitizeInput } from "@/lib/security";
import { rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const records = await getUnifiedHealthTimeline(user.id);
  return NextResponse.json({ records, count: records.length });
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1";
  const rl = await rateLimit(`record-upload:${ip}`, 30, 60);
  if (!rl.success) {
    return NextResponse.json({ error: "Too many records uploaded. Please wait." }, { status: 429 });
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const rawBody = await req.json();
    const parseResult = medicalRecordUploadSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parseResult.error.format() },
        { status: 400 }
      );
    }

    const {
      title,
      category,
      recordDate,
      doctorOrFacility,
      notes,
      isConfidential,
      tags,
      linkedEntityId,
      fileSize,
      fileType,
    } = parseResult.data;

    const record = await uploadMedicalRecord({
      patientId: user.id,
      title: sanitizeInput(title),
      category,
      recordDate,
      doctorOrFacility: doctorOrFacility ? sanitizeInput(doctorOrFacility) : undefined,
      notes: notes ? sanitizeInput(notes) : undefined,
      isConfidential,
      tags: tags.map((t) => sanitizeInput(t)),
      linkedEntityId: linkedEntityId ? sanitizeInput(linkedEntityId) : undefined,
      fileSize,
      fileType,
    });

    return NextResponse.json({ success: true, record }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to upload record" }, { status: 500 });
  }
}

