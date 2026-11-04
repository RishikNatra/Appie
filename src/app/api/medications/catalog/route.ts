import { NextRequest, NextResponse } from "next/server";
import { filterMedications, getAllMedications, getMedicationById } from "@/lib/medications-catalog";
import { rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1";
  const rl = await rateLimit(`med-catalog:${ip}`, 60, 60);
  if (!rl.success) {
    return NextResponse.json({ error: "Too many requests. Please slow down." }, { status: 429 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (id) {
    const med = getMedicationById(id);
    if (!med) return NextResponse.json({ error: "Medication not found" }, { status: 404 });
    return NextResponse.json({ medication: med });
  }

  const query = searchParams.get("query") || undefined;
  const category = (searchParams.get("category") as any) || undefined;
  const prescriptionOnly = searchParams.get("prescriptionOnly") === "true";
  const otcOnly = searchParams.get("otcOnly") === "true";

  const medications = filterMedications({ query, category, prescriptionOnly, otcOnly });
  return NextResponse.json({ medications, total: medications.length });
}

