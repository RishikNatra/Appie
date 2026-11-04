import { NextRequest, NextResponse } from "next/server";
import { filterDoctors, getAllDoctors } from "@/lib/doctors-catalog";
import { rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1";
  const rl = await rateLimit(`doctors-search:${ip}`, 60, 60);
  if (!rl.success) {
    return NextResponse.json({ error: "Too many requests. Please slow down." }, { status: 429 });
  }

  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") || undefined;
  const specialization = searchParams.get("specialization") || undefined;
  const maxFee = searchParams.get("maxFee") ? Number(searchParams.get("maxFee")) : undefined;

  const doctors = filterDoctors({ query, specialization, maxFee });
  return NextResponse.json({ doctors, total: doctors.length });
}

