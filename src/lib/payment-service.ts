import { createClient } from "./supabase/server";
import { PaymentTransaction, PaymentMethod, ServiceType, PaymentStatus, PaymentBreakdown } from "./types";
import { sendNotification } from "./notification-service";

const inMemoryTransactions = new Map<string, PaymentTransaction>();

export function generateTransactionCode(): string {
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `TXN-2026-${rand}`;
}

export function calculatePaymentBreakdown(amount: number, serviceType: ServiceType): PaymentBreakdown {
  // Consultation is standard 18% GST included, Medicines 12% GST
  const gstRate = serviceType === "consultation" ? 0.18 : 0.12;
  const taxableAmount = amount / (1 + gstRate);
  const taxAmount = amount - taxableAmount;

  return {
    subtotal: Number(taxableAmount.toFixed(2)),
    taxAmount: Number(taxAmount.toFixed(2)),
    deliveryFee: 0,
    discountAmount: 0,
    totalAmount: Number(amount.toFixed(2)),
  };
}

// Seed initial transactions for realistic demo history
const sampleTxn1 = "txn-demo-001";
inMemoryTransactions.set(sampleTxn1, {
  id: sampleTxn1,
  transactionCode: "TXN-2026-948123",
  userId: "patient-demo-user",
  userName: "Aditya Verma",
  serviceType: "medicine_order",
  referenceId: "ord-demo-001",
  referenceTitle: "Pharmacy Order #ORD-2026-78421",
  amount: 227.0,
  taxAmount: 24.32,
  paymentMethod: "upi",
  paymentGatewayRef: "UPI-ICICI-UTR-994821048",
  status: "success",
  receiptUrl: `/payments/receipt/${sampleTxn1}`,
  metadata: {
    upiApp: "Google Pay",
    vpa: "aditya@okaxis",
  },
  createdAt: new Date(Date.now() - 7200000).toISOString(),
  updatedAt: new Date(Date.now() - 7200000).toISOString(),
});

const sampleTxn2 = "txn-demo-002";
inMemoryTransactions.set(sampleTxn2, {
  id: sampleTxn2,
  transactionCode: "TXN-2026-817293",
  userId: "patient-demo-user",
  userName: "Aditya Verma",
  serviceType: "consultation",
  referenceId: "appt-demo-101",
  referenceTitle: "Telehealth Consultation with Dr. Priya Sharma",
  amount: 499.0,
  taxAmount: 76.12,
  paymentMethod: "card",
  paymentGatewayRef: "CARD-HDFC-AUTH-882194",
  status: "success",
  receiptUrl: `/payments/receipt/${sampleTxn2}`,
  metadata: {
    cardBrand: "Visa",
    cardLast4: "4242",
  },
  createdAt: new Date(Date.now() - 86400000).toISOString(),
  updatedAt: new Date(Date.now() - 86400000).toISOString(),
});

export async function processPayment(params: {
  userId: string;
  userName?: string;
  serviceType: ServiceType;
  referenceId?: string;
  referenceTitle: string;
  amount: number;
  paymentMethod: PaymentMethod;
  metadata?: Record<string, any>;
}): Promise<PaymentTransaction> {
  const txnId = "txn-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6);
  const txnCode = generateTransactionCode();
  const breakdown = calculatePaymentBreakdown(params.amount, params.serviceType);
  const now = new Date().toISOString();

  const gatewayRef =
    params.paymentMethod === "upi"
      ? `UPI-PAYTM-${Math.floor(100000000 + Math.random() * 900000000)}`
      : params.paymentMethod === "card"
      ? `CARD-GATEWAY-${Math.floor(100000 + Math.random() * 900000)}`
      : params.paymentMethod === "cod"
      ? `COD-PENDING-DELIVERY`
      : `NETBANK-SBI-${Math.floor(100000 + Math.random() * 900000)}`;

  const newTxn: PaymentTransaction = {
    id: txnId,
    transactionCode: txnCode,
    userId: params.userId,
    userName: params.userName || "Aditya Verma",
    serviceType: params.serviceType,
    referenceId: params.referenceId,
    referenceTitle: params.referenceTitle,
    amount: params.amount,
    taxAmount: breakdown.taxAmount,
    paymentMethod: params.paymentMethod,
    paymentGatewayRef: gatewayRef,
    status: params.paymentMethod === "cod" ? "pending" : "success",
    receiptUrl: `/payments/receipt/${txnId}`,
    metadata: params.metadata || {},
    createdAt: now,
    updatedAt: now,
  };

  try {
    const supabase = await createClient();
    await supabase.from("payment_transactions").insert({
      id: txnId,
      transaction_code: txnCode,
      user_id: params.userId,
      service_type: params.serviceType,
      reference_id: params.referenceId || null,
      amount: params.amount,
      tax_amount: breakdown.taxAmount,
      payment_method: params.paymentMethod,
      payment_gateway_ref: gatewayRef,
      status: newTxn.status,
      receipt_url: newTxn.receiptUrl,
      metadata: params.metadata || {},
    });
  } catch (err) {
    console.warn("Supabase payment insert warning:", err);
  }

  inMemoryTransactions.set(txnId, newTxn);

  // Send real-time payment notification
  await sendNotification({
    userId: params.userId,
    type: "payment",
    title: `Payment Receipt: ₹${params.amount.toFixed(2)}`,
    message: `Payment successful for ${params.referenceTitle} via ${params.paymentMethod.toUpperCase()}. Transaction Code: ${txnCode}.`,
    linkUrl: `/payments?txn=${txnId}`,
    priority: "normal",
  });

  return newTxn;
}

export async function getUserTransactions(
  userId: string,
  serviceTypeFilter?: ServiceType
): Promise<PaymentTransaction[]> {
  try {
    const supabase = await createClient();
    let query = supabase
      .from("payment_transactions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (serviceTypeFilter) {
      query = query.eq("service_type", serviceTypeFilter);
    }

    const { data, error } = await query;
    if (!error && data && data.length > 0) {
      return data.map((d: any) => ({
        id: d.id,
        transactionCode: d.transaction_code,
        userId: d.user_id,
        serviceType: d.service_type,
        referenceId: d.reference_id,
        referenceTitle: d.metadata?.referenceTitle || `${d.service_type.replace("_", " ")} Payment`,
        amount: Number(d.amount),
        taxAmount: Number(d.tax_amount),
        paymentMethod: d.payment_method,
        paymentGatewayRef: d.payment_gateway_ref,
        status: d.status,
        receiptUrl: d.receipt_url,
        metadata: d.metadata || {},
        createdAt: d.created_at,
        updatedAt: d.updated_at,
      }));
    }
  } catch (err) {
    // fallback
  }

  const results: PaymentTransaction[] = [];
  for (const txn of inMemoryTransactions.values()) {
    if (txn.userId === userId || userId.includes("demo") || txn.userId.includes("demo")) {
      if (!serviceTypeFilter || txn.serviceType === serviceTypeFilter) {
        results.push(txn);
      }
    }
  }
  return results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getTransactionById(idOrCode: string): Promise<PaymentTransaction | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("payment_transactions")
      .select("*")
      .or(`id.eq.${idOrCode},transaction_code.eq.${idOrCode}`)
      .single();

    if (!error && data) {
      return {
        id: data.id,
        transactionCode: data.transaction_code,
        userId: data.user_id,
        serviceType: data.service_type,
        referenceId: data.reference_id,
        amount: Number(data.amount),
        taxAmount: Number(data.tax_amount),
        paymentMethod: data.payment_method,
        paymentGatewayRef: data.payment_gateway_ref,
        status: data.status,
        receiptUrl: data.receipt_url,
        metadata: data.metadata || {},
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    }
  } catch (err) {
    // fallback
  }

  for (const txn of inMemoryTransactions.values()) {
    if (txn.id === idOrCode || txn.transactionCode === idOrCode) {
      return txn;
    }
  }
  return null;
}

