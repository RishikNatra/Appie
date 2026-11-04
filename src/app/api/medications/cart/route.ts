import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-service";
import {
  getCartItems,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
} from "@/lib/medication-service";
import { cartItemAddSchema, cartItemUpdateSchema } from "@/lib/security";
import { rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const items = await getCartItems(user.id);
  const subtotal = items.reduce((sum, item) => sum + item.medication.price * item.quantity, 0);
  const deliveryFee = subtotal > 499 || subtotal === 0 ? 0 : 49;
  const total = subtotal + deliveryFee;

  return NextResponse.json({
    items,
    itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
    subtotal,
    deliveryFee,
    total,
    freeDeliveryThreshold: 499,
  });
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1";
  const rl = await rateLimit(`cart-add:${ip}`, 45, 60);
  if (!rl.success) {
    return NextResponse.json({ error: "Too many cart updates. Please slow down." }, { status: 429 });
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const rawBody = await req.json();
    const parseResult = cartItemAddSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parseResult.error.format() },
        { status: 400 }
      );
    }

    const { medicationId, quantity, prescriptionId } = parseResult.data;
    const cartItem = await addToCart({
      patientId: user.id,
      medicationId,
      quantity,
      prescriptionId,
    });

    return NextResponse.json({ success: true, cartItem }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to add to cart" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const rawBody = await req.json();
    const parseResult = cartItemUpdateSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parseResult.error.format() },
        { status: 400 }
      );
    }

    const { cartItemId, quantity } = parseResult.data;
    const updated = await updateCartQuantity(cartItemId, quantity);
    return NextResponse.json({ success: true, cartItem: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update cart" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const cartItemId = searchParams.get("cartItemId");
  const clearAll = searchParams.get("clearAll") === "true";

  if (clearAll) {
    await clearCart(user.id);
    return NextResponse.json({ success: true, message: "Cart cleared" });
  }

  if (cartItemId) {
    await removeFromCart(cartItemId);
    return NextResponse.json({ success: true, message: "Item removed from cart" });
  }

  return NextResponse.json({ error: "cartItemId or clearAll required" }, { status: 400 });
}

