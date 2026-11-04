import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-service";
import { getPrescriptionById, updatePrescriptionPharmacyStatus } from "@/lib/prescription-service";
import { transferPrescriptionToCart } from "@/lib/medication-service";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const prescription = await getPrescriptionById(id);

  if (!prescription) {
    return NextResponse.json({ error: "Prescription not found" }, { status: 404 });
  }

  return NextResponse.json({ prescription });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const prescription = await getPrescriptionById(id);

  if (!prescription) {
    return NextResponse.json({ error: "Prescription not found" }, { status: 404 });
  }

  const addedCount = await transferPrescriptionToCart(prescription, user.id);
  await updatePrescriptionPharmacyStatus(prescription.id, "cart_added");

  return NextResponse.json({
    success: true,
    message: `${addedCount} prescribed medications added to your cart`,
    addedCount,
  });
}

