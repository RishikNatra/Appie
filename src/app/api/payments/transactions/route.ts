import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-service";
import { getUserTransactions } from "@/lib/payment-service";
import { ServiceType } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const serviceType = (searchParams.get("serviceType") as ServiceType) || undefined;

  const transactions = await getUserTransactions(user.id, serviceType);
  return NextResponse.json({ transactions, count: transactions.length });
}

