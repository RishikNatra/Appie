import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-service";
import { getOrderById, cancelOrder, advanceOrderStatus } from "@/lib/order-service";
import { sanitizeInput } from "@/lib/security";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({ order });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  if (body.action === "cancel") {
    const cancelled = await cancelOrder(id, body.reason ? sanitizeInput(body.reason) : undefined);
    return NextResponse.json({ success: true, order: cancelled });
  }

  if (body.action === "advance" && body.status) {
    const updated = await advanceOrderStatus(id, body.status);
    return NextResponse.json({ success: true, order: updated });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}

