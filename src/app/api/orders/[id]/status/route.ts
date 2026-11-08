import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-service";
import { updateOrderStatus } from "@/lib/order-service";
import { sanitizeString } from "@/lib/security";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    const body = await req.json();
    const cleanStatus = sanitizeString(String(body.status || ""), { maxLen: 50 }).clean;

    if (!cleanStatus) {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
    }

    await updateOrderStatus(id, cleanStatus);
    return NextResponse.json({ success: true, message: `Status updated to ${cleanStatus}` });
  } catch (err: unknown) {
    console.error("Order status update failed:", err);
    return NextResponse.json({ error: "Failed to update order status" }, { status: 500 });
  }
}
