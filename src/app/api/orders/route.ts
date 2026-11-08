import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-service";
import { getPatientOrders, placePharmacyOrder } from "@/lib/order-service";
import { orderPlacementSchema, sanitizeInput } from "@/lib/security";
import { rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await getPatientOrders(user.id, user.role);
  return NextResponse.json({ orders, count: orders.length });
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1";
  const rl = await rateLimit(`order-placement:${ip}`, 30, 60);
  if (!rl.success) {
    return NextResponse.json({ error: "Too many orders placed. Please slow down." }, { status: 429 });
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const rawBody = await req.json();
    const parseResult = orderPlacementSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parseResult.error.format() },
        { status: 400 }
      );
    }

    const { deliveryAddress, prescriptionId, paymentMethod, promoCode, notes } = parseResult.data;

    const order = await placePharmacyOrder({
      patientId: user.id,
      patientName: user.fullName || user.username,
      deliveryAddress: {
        fullName: sanitizeInput(deliveryAddress.fullName),
        phone: sanitizeInput(deliveryAddress.phone),
        addressLine1: sanitizeInput(deliveryAddress.addressLine1),
        addressLine2: deliveryAddress.addressLine2 ? sanitizeInput(deliveryAddress.addressLine2) : undefined,
        city: sanitizeInput(deliveryAddress.city),
        state: sanitizeInput(deliveryAddress.state),
        pincode: sanitizeInput(deliveryAddress.pincode),
        landmark: deliveryAddress.landmark ? sanitizeInput(deliveryAddress.landmark) : undefined,
      },
      prescriptionId: prescriptionId ? sanitizeInput(prescriptionId) : undefined,
      paymentMethod,
      promoCode: promoCode ? sanitizeInput(promoCode) : undefined,
      notes: notes ? sanitizeInput(notes) : undefined,
    });

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to place order" }, { status: 500 });
  }
}
