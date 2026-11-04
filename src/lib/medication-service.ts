import { createClient } from "./supabase/server";
import { MedicationCartItem, PrescriptionRecord } from "./types";
import { getMedicationById, getAllMedications } from "./medications-catalog";

const inMemoryCart = new Map<string, MedicationCartItem>();

// Seed sample cart item for immediate visibility
const sampleCartId = "cart-item-demo-1";
const sampleMed = getMedicationById("med-paracetamol-650");
if (sampleMed) {
  inMemoryCart.set(sampleCartId, {
    id: sampleCartId,
    patientId: "patient-demo-user",
    medicationId: sampleMed.id,
    medication: sampleMed,
    quantity: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}

export async function getCartItems(patientId: string): Promise<MedicationCartItem[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("medication_cart_items")
      .select("*, medications(*)")
      .eq("patient_id", patientId)
      .order("created_at", { ascending: false });

    if (!error && data && data.length > 0) {
      return data.map((d: any) => ({
        id: d.id,
        patientId: d.patient_id,
        medicationId: d.medication_id,
        prescriptionId: d.prescription_id,
        quantity: d.quantity,
        medication: d.medications || getMedicationById(d.medication_id) || {
          id: d.medication_id,
          name: "Healthcare Medicine",
          genericName: "Generic Salt",
          category: "fever_pain",
          dosageForm: "Tablet",
          strength: "Standard",
          packSize: "Standard pack",
          price: 50,
          prescriptionRequired: false,
          usageInstructions: "As directed",
          safetyWarnings: "Read label",
          sideEffects: [],
          inStock: true,
          manufacturer: "Appie Pharmacy",
        },
        createdAt: d.created_at,
        updatedAt: d.updated_at,
      }));
    }
  } catch (err) {
    // fallback
  }

  const items: MedicationCartItem[] = [];
  for (const item of inMemoryCart.values()) {
    if (item.patientId === patientId || patientId.includes("demo") || item.patientId.includes("demo")) {
      items.push(item);
    }
  }
  return items;
}

export async function addToCart(params: {
  patientId: string;
  medicationId: string;
  quantity?: number;
  prescriptionId?: string;
  prescriptionCode?: string;
}): Promise<MedicationCartItem> {
  const med = getMedicationById(params.medicationId);
  if (!med) {
    throw new Error("Medication not found in catalog");
  }

  // Check if item already exists in patient cart
  for (const existing of inMemoryCart.values()) {
    if (existing.patientId === params.patientId && existing.medicationId === params.medicationId) {
      existing.quantity += params.quantity || 1;
      if (params.prescriptionId) existing.prescriptionId = params.prescriptionId;
      if (params.prescriptionCode) existing.prescriptionCode = params.prescriptionCode;
      existing.updatedAt = new Date().toISOString();
      return existing;
    }
  }

  const cartItemId = "cart-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6);
  const cartItem: MedicationCartItem = {
    id: cartItemId,
    patientId: params.patientId,
    medicationId: params.medicationId,
    medication: med,
    prescriptionId: params.prescriptionId,
    prescriptionCode: params.prescriptionCode,
    quantity: params.quantity || 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    const supabase = await createClient();
    await supabase.from("medication_cart_items").insert({
      id: cartItemId,
      patient_id: params.patientId,
      medication_id: params.medicationId,
      prescription_id: params.prescriptionId || null,
      quantity: cartItem.quantity,
    });
  } catch (err) {
    console.warn("Supabase add to cart warning, stored in-memory:", err);
  }

  inMemoryCart.set(cartItemId, cartItem);
  return cartItem;
}

export async function updateCartQuantity(cartItemId: string, quantity: number): Promise<MedicationCartItem | null> {
  const item = inMemoryCart.get(cartItemId);
  if (item) {
    if (quantity <= 0) {
      inMemoryCart.delete(cartItemId);
      return null;
    }
    item.quantity = quantity;
    item.updatedAt = new Date().toISOString();
  }

  try {
    const supabase = await createClient();
    if (quantity <= 0) {
      await supabase.from("medication_cart_items").delete().eq("id", cartItemId);
    } else {
      await supabase
        .from("medication_cart_items")
        .update({ quantity, updated_at: new Date().toISOString() })
        .eq("id", cartItemId);
    }
  } catch (err) {
    // fallback
  }

  return item || null;
}

export async function removeFromCart(cartItemId: string): Promise<boolean> {
  inMemoryCart.delete(cartItemId);
  try {
    const supabase = await createClient();
    await supabase.from("medication_cart_items").delete().eq("id", cartItemId);
  } catch (err) {
    // fallback
  }
  return true;
}

export async function clearCart(patientId: string): Promise<void> {
  for (const [id, item] of inMemoryCart.entries()) {
    if (item.patientId === patientId || patientId.includes("demo")) {
      inMemoryCart.delete(id);
    }
  }
  try {
    const supabase = await createClient();
    await supabase.from("medication_cart_items").delete().eq("patient_id", patientId);
  } catch (err) {
    // fallback
  }
}

export async function transferPrescriptionToCart(prescription: PrescriptionRecord, patientId: string): Promise<number> {
  let count = 0;
  for (const item of prescription.medications) {
    let targetMed = item.medicationId ? getMedicationById(item.medicationId) : undefined;
    if (!targetMed) {
      // Find by matching name in catalog
      const all = getAllMedications();
      targetMed = all.find((m) =>
        m.name.toLowerCase().includes(item.medicineName.toLowerCase()) ||
        item.medicineName.toLowerCase().includes(m.name.toLowerCase())
      );
    }

    if (targetMed) {
      await addToCart({
        patientId,
        medicationId: targetMed.id,
        quantity: 1,
        prescriptionId: prescription.id,
        prescriptionCode: prescription.prescriptionCode,
      });
      count++;
    }
  }
  return count;
}

