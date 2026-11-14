import { createAdminClient, createClient } from "./supabase/server";
import {
  PharmacyOrder,
  OrderStatus,
  TrackingStage,
  DeliveryAddress,
  PharmacyOrderItem,
  PaymentMethod,
} from "./types";
import { getCartItems, clearCart } from "./medication-service";
import { sendNotification } from "./notification-service";
import { processPayment } from "./payment-service";

const inMemoryOrders = new Map<string, PharmacyOrder>();

export function generateOrderCode(): string {
  const rand = Math.floor(10000 + Math.random() * 90000);
  return `ORD-2026-${rand}`;
}

export function buildTrackingTimeline(currentStatus: OrderStatus, createdAt: string): TrackingStage[] {
  const stages: { stage: OrderStatus; title: string; description: string; hoursOffset: number }[] = [
    {
      stage: "placed",
      title: "Order Placed & Confirmed",
      description: "Order received by Appie Digital Pharmacy network.",
      hoursOffset: 0,
    },
    {
      stage: "pharmacist_verified",
      title: "Pharmacist Verified",
      description: "Licensed pharmacist verified prescription and drug inventory.",
      hoursOffset: 1,
    },
    {
      stage: "packed",
      title: "Quality Packed in Sealed Pouch",
      description: "Medications packaged with tamper-proof security seal.",
      hoursOffset: 2,
    },
    {
      stage: "dispatched",
      title: "Dispatched via Express Courier",
      description: "Handed over to BlueDart Express for rapid transit.",
      hoursOffset: 4,
    },
    {
      stage: "out_for_delivery",
      title: "Out for Delivery",
      description: "Rider is delivering to your specified address.",
      hoursOffset: 20,
    },
    {
      stage: "delivered",
      title: "Delivered Successfully",
      description: "Package received and verified by customer.",
      hoursOffset: 24,
    },
  ];

  const statusOrder: OrderStatus[] = [
    "placed",
    "pharmacist_verified",
    "packed",
    "dispatched",
    "out_for_delivery",
    "delivered",
  ];

  const currentIndex = statusOrder.indexOf(currentStatus);
  const baseTime = new Date(createdAt).getTime();

  return stages.map((s) => {
    const stageIndex = statusOrder.indexOf(s.stage);
    const isCompleted = stageIndex < currentIndex || s.stage === currentStatus;
    const isCurrent = s.stage === currentStatus;
    const timestamp = isCompleted
      ? new Date(baseTime + s.hoursOffset * 3600000).toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          day: "numeric",
          month: "short",
        })
      : undefined;

    return {
      stage: s.stage,
      title: s.title,
      description: s.description,
      timestamp,
      location: s.stage === "dispatched" ? "Bengaluru Central Hub" : s.stage === "out_for_delivery" ? "Local Delivery Hub" : "Pharmacy Warehouse",
      isCompleted,
      isCurrent,
    };
  });
}

// Seed sample active order for demonstration
const sampleOrderId = "ord-demo-001";
const sampleOrderCreatedAt = new Date(Date.now() - 7200000).toISOString();
inMemoryOrders.set(sampleOrderId, {
  id: sampleOrderId,
  orderCode: "ORD-2026-78421",
  patientId: "patient-demo-user",
  patientName: "Aditya Verma",
  prescriptionId: "rx-demo-001",
  prescriptionCode: "RX-2026-8812A",
  items: [
    {
      medicationId: "med-paracetamol-650",
      medicineName: "Dolo 650 (Paracetamol)",
      genericName: "Paracetamol 650mg",
      dosageForm: "Tablet",
      quantity: 2,
      unitPrice: 32.5,
      totalPrice: 65.0,
      prescriptionRequired: false,
    },
    {
      medicationId: "med-cetirizine-10",
      medicineName: "Cetzine 10",
      genericName: "Cetirizine Hydrochloride 10mg",
      dosageForm: "Tablet",
      quantity: 1,
      unitPrice: 21.0,
      totalPrice: 21.0,
      prescriptionRequired: false,
    },
    {
      medicationId: "med-benadryl-syrup",
      medicineName: "Benadryl Cough Formula",
      genericName: "Diphenhydramine HCl syrup",
      dosageForm: "Syrup",
      quantity: 1,
      unitPrice: 112.0,
      totalPrice: 112.0,
      prescriptionRequired: false,
    },
  ],
  subtotal: 198.0,
  deliveryFee: 49.0,
  discountAmount: 20.0,
  totalAmount: 227.0,
  deliveryAddress: {
    fullName: "Aditya Verma",
    phone: "+91 98765 43210",
    addressLine1: "Flat 402, Green Glen Layout, Bellandur",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560103",
    landmark: "Near EcoSpace Tech Park",
  },
  orderStatus: "dispatched",
  trackingTimeline: buildTrackingTimeline("dispatched", sampleOrderCreatedAt),
  courierPartner: "BlueDart Express Healthcare",
  trackingNumber: "BD-IN-99482104",
  estimatedDelivery: new Date(Date.now() + 18 * 3600000).toISOString(),
  paymentId: "txn-demo-001",
  paymentStatus: "paid",
  paymentMethod: "upi",
  createdAt: sampleOrderCreatedAt,
  updatedAt: new Date().toISOString(),
});

export async function placePharmacyOrder(params: {
  patientId: string;
  patientName?: string;
  deliveryAddress: DeliveryAddress;
  paymentMethod: PaymentMethod;
  prescriptionId?: string;
  prescriptionCode?: string;
  promoCode?: string;
  notes?: string;
}): Promise<PharmacyOrder> {
  const cartItems = await getCartItems(params.patientId);
  if (!cartItems || cartItems.length === 0) {
    throw new Error("Your cart is empty. Please add medications before placing an order.");
  }

  const orderItems: PharmacyOrderItem[] = cartItems.map((ci) => ({
    medicationId: ci.medicationId,
    medicineName: ci.medication.name,
    genericName: ci.medication.genericName,
    dosageForm: ci.medication.dosageForm,
    quantity: ci.quantity,
    unitPrice: ci.medication.price,
    totalPrice: ci.medication.price * ci.quantity,
    prescriptionRequired: ci.medication.prescriptionRequired,
  }));

  const subtotal = orderItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const deliveryFee = subtotal > 499 ? 0 : 49;
  const discountAmount = params.promoCode?.toUpperCase() === "APPIE50" ? 50 : 0;
  const totalAmount = Math.max(0, subtotal + deliveryFee - discountAmount);

  const orderId = crypto.randomUUID();
  const orderCode = generateOrderCode();
  const now = new Date().toISOString();
  const estimatedDelivery = new Date(Date.now() + 24 * 3600000).toISOString();
  const trackingNumber = `BD-IN-${Math.floor(10000000 + Math.random() * 90000000)}`;
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const dbPatientId = isUuid.test(params.patientId) ? params.patientId : "a1111111-1111-1111-1111-111111111111";

  // Create payment record
  const payment = await processPayment({
    userId: params.patientId,
    userName: params.patientName || "Aditya Verma",
    serviceType: "medicine_order",
    referenceId: orderId,
    referenceTitle: `Pharmacy Order ${orderCode}`,
    amount: totalAmount,
    paymentMethod: params.paymentMethod,
  });

  const newOrder: PharmacyOrder = {
    id: orderId,
    orderCode,
    patientId: params.patientId,
    patientName: params.patientName || "Aditya Verma",
    prescriptionId: params.prescriptionId,
    prescriptionCode: params.prescriptionCode,
    items: orderItems,
    subtotal,
    deliveryFee,
    discountAmount,
    totalAmount,
    deliveryAddress: params.deliveryAddress,
    orderStatus: "placed",
    trackingTimeline: buildTrackingTimeline("placed", now),
    courierPartner: "BlueDart Express Healthcare",
    trackingNumber,
    estimatedDelivery,
    paymentId: payment.id,
    paymentStatus: params.paymentMethod === "cod" ? "cod" : "paid",
    paymentMethod: params.paymentMethod,
    notes: params.notes,
    createdAt: now,
    updatedAt: now,
  };

  try {
    const admin = createAdminClient();
    await admin.from("pharmacy_orders").insert({
      id: orderId,
      order_code: orderCode,
      patient_id: dbPatientId,
      prescription_id: params.prescriptionId && isUuid.test(params.prescriptionId) ? params.prescriptionId : null,
      items: orderItems,
      subtotal,
      delivery_fee: deliveryFee,
      discount_amount: discountAmount,
      total_amount: totalAmount,
      delivery_address: params.deliveryAddress,
      order_status: "placed",
      tracking_timeline: newOrder.trackingTimeline,
      courier_partner: newOrder.courierPartner,
      tracking_number: trackingNumber,
      estimated_delivery: estimatedDelivery,
      payment_id: isUuid.test(payment.id) ? payment.id : null,
      payment_status: newOrder.paymentStatus,
      notes: params.notes,
    });
  } catch (err) {
    console.warn("Supabase order insert error, kept in-memory:", err);
  }

  inMemoryOrders.set(orderId, newOrder);

  // Clear patient's cart upon order placement
  await clearCart(params.patientId);

  // Send real-time notification
  await sendNotification({
    userId: params.patientId,
    type: "order",
    title: `Order ${orderCode} Confirmed`,
    message: `Your pharmacy order for ${orderItems.length} items has been placed. Estimated delivery within 24 hours.`,
    linkUrl: `/orders?id=${orderId}`,
    priority: "high",
  });

  return newOrder;
}

export async function getPatientOrders(patientId: string, role?: string): Promise<PharmacyOrder[]> {
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const dbPatientId = isUuid.test(patientId) ? patientId : "a1111111-1111-1111-1111-111111111111";

  if (role === "pharmacist" || role === "delivery_partner") {
    try {
      const admin = createAdminClient();
      const { data, error } = await admin.from("pharmacy_orders").select("*").order("created_at", { ascending: false });
      if (!error && data && data.length > 0) {
        return data.map((d: any) => ({
          id: d.id,
          orderCode: d.order_code,
          patientId: d.patient_id,
          prescriptionId: d.prescription_id,
          items: d.items || [],
          subtotal: Number(d.subtotal),
          deliveryFee: Number(d.delivery_fee),
          discountAmount: Number(d.discount_amount),
          totalAmount: Number(d.total_amount),
          deliveryAddress: d.delivery_address || {},
          orderStatus: d.order_status,
          trackingTimeline: d.tracking_timeline || buildTrackingTimeline(d.order_status, d.created_at),
          courierPartner: d.courier_partner,
          trackingNumber: d.tracking_number,
          estimatedDelivery: d.estimated_delivery,
          paymentId: d.payment_id,
          paymentStatus: d.payment_status,
          paymentMethod: "upi",
          notes: d.notes,
          createdAt: d.created_at,
          updatedAt: d.updated_at,
        }));
      }
    } catch (e) {}
    return Array.from(inMemoryOrders.values()).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("pharmacy_orders")
      .select("*")
      .or(`patient_id.eq.${dbPatientId},patient_id.eq.a1111111-1111-1111-1111-111111111111`)
      .order("created_at", { ascending: false });

    if (!error && data && data.length > 0) {
      return data.map((d: any) => ({
        id: d.id,
        orderCode: d.order_code,
        patientId: d.patient_id,
        prescriptionId: d.prescription_id,
        items: d.items || [],
        subtotal: Number(d.subtotal),
        deliveryFee: Number(d.delivery_fee),
        discountAmount: Number(d.discount_amount),
        totalAmount: Number(d.total_amount),
        deliveryAddress: d.delivery_address || {},
        orderStatus: d.order_status,
        trackingTimeline: d.tracking_timeline || buildTrackingTimeline(d.order_status, d.created_at),
        courierPartner: d.courier_partner,
        trackingNumber: d.tracking_number,
        estimatedDelivery: d.estimated_delivery,
        paymentId: d.payment_id,
        paymentStatus: d.payment_status,
        paymentMethod: "upi",
        notes: d.notes,
        createdAt: d.created_at,
        updatedAt: d.updated_at,
      }));
    }
  } catch (err) {
    // fallback
  }

  const results: PharmacyOrder[] = [];
  for (const ord of inMemoryOrders.values()) {
    if (ord.patientId === patientId || ord.patientId === dbPatientId || patientId.includes("demo") || ord.patientId.includes("demo")) {
      results.push(ord);
    }
  }
  return results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getOrderById(idOrCode: string): Promise<PharmacyOrder | null> {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("pharmacy_orders")
      .select("*")
      .or(`id.eq.${idOrCode},order_code.eq.${idOrCode}`)
      .single();

    if (!error && data) {
      return {
        id: data.id,
        orderCode: data.order_code,
        patientId: data.patient_id,
        prescriptionId: data.prescription_id,
        items: data.items || [],
        subtotal: Number(data.subtotal),
        deliveryFee: Number(data.delivery_fee),
        discountAmount: Number(data.discount_amount),
        totalAmount: Number(data.total_amount),
        deliveryAddress: data.delivery_address || {},
        orderStatus: data.order_status,
        trackingTimeline: data.tracking_timeline || buildTrackingTimeline(data.order_status, data.created_at),
        courierPartner: data.courier_partner,
        trackingNumber: data.tracking_number,
        estimatedDelivery: data.estimated_delivery,
        paymentId: data.payment_id,
        paymentStatus: data.payment_status,
        paymentMethod: "upi",
        notes: data.notes,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    }
  } catch (err) {
    // fallback
  }

  for (const ord of inMemoryOrders.values()) {
    if (ord.id === idOrCode || ord.orderCode === idOrCode) {
      return ord;
    }
  }
  return null;
}

export async function advanceOrderStatus(orderId: string, nextStatus: OrderStatus): Promise<PharmacyOrder | null> {
  const ord = inMemoryOrders.get(orderId);
  if (ord) {
    ord.orderStatus = nextStatus;
    ord.trackingTimeline = buildTrackingTimeline(nextStatus, ord.createdAt);
    ord.updatedAt = new Date().toISOString();
  }

  try {
    const admin = createAdminClient();
    await admin.from("pharmacy_orders").update({
      order_status: nextStatus,
      tracking_timeline: ord?.trackingTimeline,
      updated_at: new Date().toISOString(),
    }).eq("id", orderId);
  } catch (err) {
    // fallback
  }

  return ord || null;
}

export async function cancelOrder(orderId: string, reason?: string): Promise<PharmacyOrder | null> {
  const ord = inMemoryOrders.get(orderId);
  if (ord) {
    ord.orderStatus = "cancelled";
    ord.notes = reason ? `Cancelled: ${reason}` : "Cancelled by user";
    ord.updatedAt = new Date().toISOString();
  }

  try {
    const admin = createAdminClient();
    await admin.from("pharmacy_orders").update({
      order_status: "cancelled",
      notes: ord?.notes,
      updated_at: new Date().toISOString(),
    }).eq("id", orderId);
  } catch (err) {
    // fallback
  }

  return ord || null;
}


export async function updateOrderStatus(orderId: string, newStatus: string): Promise<boolean> {
  const ord = inMemoryOrders.get(orderId);
  if (ord) {
    ord.orderStatus = newStatus as any;
    ord.updatedAt = new Date().toISOString();
    inMemoryOrders.set(orderId, ord);
  }

  try {
    const admin = createAdminClient();
    await admin.from("pharmacy_orders").update({
      order_status: newStatus,
      updated_at: new Date().toISOString(),
    }).eq("id", orderId);
  } catch (err) {
    console.warn("Supabase updateOrderStatus warning:", err);
  }

  return true;
}
