import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-service";
import { processPayment } from "@/lib/payment-service";
import { paymentExecutionSchema, sanitizeInput } from "@/lib/security";
import { rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1";
  const rl = await rateLimit(`payment-process:${ip}`, 30, 60);
  if (!rl.success) {
    return NextResponse.json({ error: "Too many payment attempts. Please wait." }, { status: 429 });
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const rawBody = await req.json();
    const parseResult = paymentExecutionSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parseResult.error.format() },
        { status: 400 }
      );
    }

    const { serviceType, referenceId, referenceTitle, amount, paymentMethod, paymentDetails } = parseResult.data;

    const transaction = await processPayment({
      userId: user.id,
      userName: user.fullName || user.username,
      serviceType,
      referenceId: referenceId ? sanitizeInput(referenceId) : undefined,
      referenceTitle: sanitizeInput(referenceTitle),
      amount,
      paymentMethod,
      metadata: {
        ...paymentDetails,
        processedAt: new Date().toISOString(),
      },
    });

    return NextResponse.json({ success: true, transaction }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Payment processing failed" }, { status: 500 });
  }
}

