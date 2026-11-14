import { createAdminClient, createClient } from "./supabase/server";
import { MedicationCartItem, MedicationItem, PrescriptionRecord } from "./types";
import { getMedicationById, getAllMedications, resolveMedicationUuid } from "./medications-catalog";

const inMemoryCart = new Map<string, MedicationCartItem>();

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const DEFAULT_PATIENT_UUID = "a1111111-1111-1111-1111-111111111111";

// Helper to seed initial demo items in inMemoryCart
function seedInitialCartIfEmpty() {
  if (inMemoryCart.size > 0) return;

  const initialMeds = [
    { slug: "med-paracetamol-650", qty: 2 },
    { slug: "med-ibuprofen-paracetamol", qty: 1 },
    { slug: "med-cetirizine-10", qty: 2 },
    { slug: "med-vitamin-c-zinc", qty: 1 },
  ];

  for (const item of initialMeds) {
    const med = getMedicationById(item.slug);
    if (med) {
      const id = "seed-cart-" + item.slug;
      inMemoryCart.set(id, {
        id,
        patientId: DEFAULT_PATIENT_UUID,
        medicationId: med.id,
        medication: med,
        quantity: item.qty,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  }
}

seedInitialCartIfEmpty();

function normalizeMedicationRecord(raw: any, fallbackId: string): MedicationItem {
  if (!raw) {
    const catalogMed = getMedicationById(fallbackId);
    if (catalogMed) return catalogMed;
    return {
      id: fallbackId,
      name: "Healthcare Medicine",
      genericName: "Generic Salt",
      brandName: "Appie Pharmacy",
      category: "fever_pain",
      dosageForm: "Tablet",
      strength: "Standard",
      packSize: "Standard pack",
      price: 50.0,
      prescriptionRequired: false,
      usageInstructions: "Take as directed by doctor or pharmacist.",
      safetyWarnings: "Read packaging instructions carefully before use.",
      sideEffects: [],
      inStock: true,
      manufacturer: "Appie Pharmacy",
    };
  }

  // If raw is already a camelCase MedicationItem
  if (raw.prescriptionRequired !== undefined && typeof raw.price === "number") {
    return raw;
  }

  // Convert snake_case Supabase row to MedicationItem
  const catalogMatch = getMedicationById(raw.id || fallbackId);
  const numPrice = typeof raw.price === "number" ? raw.price : Number(raw.price) || catalogMatch?.price || 50;

  return {
    id: catalogMatch?.id || raw.id || fallbackId,
    name: raw.name || catalogMatch?.name || "Medicine",
    genericName: raw.generic_name || raw.genericName || catalogMatch?.genericName || "",
    brandName: raw.brand_name || raw.brandName || catalogMatch?.brandName || "",
    category: raw.category || catalogMatch?.category || "fever_pain",
    dosageForm: raw.dosage_form || raw.dosageForm || catalogMatch?.dosageForm || "Tablet",
    strength: raw.strength || catalogMatch?.strength || "Standard",
    packSize: raw.pack_size || raw.packSize || catalogMatch?.packSize || "Standard pack",
    price: numPrice,
    prescriptionRequired: Boolean(raw.prescription_required ?? raw.prescriptionRequired ?? catalogMatch?.prescriptionRequired),
    usageInstructions: raw.usage_instructions || raw.usageInstructions || catalogMatch?.usageInstructions || "As directed",
    safetyWarnings: raw.safety_warnings || raw.safetyWarnings || catalogMatch?.safetyWarnings || "Read label carefully",
    sideEffects: Array.isArray(raw.side_effects) ? raw.side_effects : (raw.sideEffects || catalogMatch?.sideEffects || []),
    inStock: raw.in_stock !== false && raw.inStock !== false,
    manufacturer: raw.manufacturer || catalogMatch?.manufacturer || "Appie Health",
  };
}

export async function getCartItems(patientId: string): Promise<MedicationCartItem[]> {
  const queryPatientId = UUID_REGEX.test(patientId) ? patientId : DEFAULT_PATIENT_UUID;

  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("medication_cart_items")
      .select("*, medications(*)")
      .or(`patient_id.eq.${queryPatientId},patient_id.eq.${DEFAULT_PATIENT_UUID}`)
      .order("created_at", { ascending: false });

    if (!error && data && data.length > 0) {
      const items: MedicationCartItem[] = data.map((d: any) => {
        const med = normalizeMedicationRecord(d.medications || getMedicationById(d.medication_id), d.medication_id);
        const cartItem: MedicationCartItem = {
          id: d.id,
          patientId: d.patient_id,
          medicationId: med.id,
          prescriptionId: d.prescription_id || undefined,
          quantity: Number(d.quantity) || 1,
          medication: med,
          createdAt: d.created_at,
          updatedAt: d.updated_at,
        };
        // Sync into inMemoryCart
        inMemoryCart.set(cartItem.id, cartItem);
        return cartItem;
      });

      return items;
    }
  } catch (err) {
    console.warn("Supabase getCartItems fallback to memory:", err);
  }

  // Fallback to inMemoryCart
  seedInitialCartIfEmpty();
  const items: MedicationCartItem[] = [];
  for (const item of inMemoryCart.values()) {
    if (
      item.patientId === patientId ||
      item.patientId === queryPatientId ||
      patientId.includes("demo") ||
      patientId === "guest-patient-cart" ||
      item.patientId.includes("demo")
    ) {
      items.push(item);
    }
  }

  // Ensure price is always numeric
  return items.map((i) => ({
    ...i,
    medication: {
      ...i.medication,
      price: typeof i.medication.price === "number" ? i.medication.price : Number(i.medication.price) || 0,
    },
  }));
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

  const addQty = Math.max(1, params.quantity || 1);
  const now = new Date().toISOString();
  const dbPatientId = UUID_REGEX.test(params.patientId) ? params.patientId : DEFAULT_PATIENT_UUID;
  const dbMedicationId = resolveMedicationUuid(med.id);

  // Check if item already exists in patient cart
  for (const existing of inMemoryCart.values()) {
    const isSameMed =
      existing.medicationId === med.id ||
      existing.medicationId === dbMedicationId ||
      existing.medication.name.toLowerCase() === med.name.toLowerCase();

    const isSamePatient =
      existing.patientId === params.patientId ||
      existing.patientId === dbPatientId ||
      params.patientId.includes("demo") ||
      params.patientId === "guest-patient-cart";

    if (isSameMed && isSamePatient) {
      existing.quantity += addQty;
      if (params.prescriptionId) existing.prescriptionId = params.prescriptionId;
      if (params.prescriptionCode) existing.prescriptionCode = params.prescriptionCode;
      existing.updatedAt = now;

      try {
        const admin = createAdminClient();
        await admin
          .from("medication_cart_items")
          .update({ quantity: existing.quantity, updated_at: now })
          .eq("id", existing.id);
      } catch (err) {
        console.warn("Supabase updateCartQuantity on add warning:", err);
      }

      return existing;
    }
  }

  // Generate valid UUID for new cart item
  const cartItemId = crypto.randomUUID();
  const cartItem: MedicationCartItem = {
    id: cartItemId,
    patientId: params.patientId,
    medicationId: med.id,
    medication: med,
    prescriptionId: params.prescriptionId,
    prescriptionCode: params.prescriptionCode,
    quantity: addQty,
    createdAt: now,
    updatedAt: now,
  };

  inMemoryCart.set(cartItemId, cartItem);

  try {
    const admin = createAdminClient();
    await admin.from("medication_cart_items").insert({
      id: cartItemId,
      patient_id: dbPatientId,
      medication_id: dbMedicationId,
      prescription_id: params.prescriptionId && UUID_REGEX.test(params.prescriptionId) ? params.prescriptionId : null,
      quantity: addQty,
      created_at: now,
      updated_at: now,
    });
  } catch (err) {
    console.warn("Supabase add to cart insert warning, saved in-memory:", err);
  }

  return cartItem;
}

export async function updateCartQuantity(cartItemId: string, quantity: number): Promise<MedicationCartItem | null> {
  if (quantity <= 0) {
    await removeFromCart(cartItemId);
    return null;
  }

  let item = inMemoryCart.get(cartItemId);

  // If item wasn't in memory yet, look for it by UUID
  if (!item) {
    for (const [key, val] of inMemoryCart.entries()) {
      if (key === cartItemId || val.id === cartItemId) {
        item = val;
        break;
      }
    }
  }

  const now = new Date().toISOString();

  if (item) {
    item.quantity = quantity;
    item.updatedAt = now;
  }

  try {
    const admin = createAdminClient();
    await admin
      .from("medication_cart_items")
      .update({ quantity, updated_at: now })
      .eq("id", cartItemId);
  } catch (err) {
    console.warn("Supabase updateCartQuantity warning:", err);
  }

  return item || null;
}

export async function removeFromCart(cartItemId: string): Promise<boolean> {
  // Delete from inMemoryCart
  inMemoryCart.delete(cartItemId);
  for (const [key, val] of inMemoryCart.entries()) {
    if (key === cartItemId || val.id === cartItemId) {
      inMemoryCart.delete(key);
    }
  }

  try {
    const admin = createAdminClient();
    await admin.from("medication_cart_items").delete().eq("id", cartItemId);
  } catch (err) {
    console.warn("Supabase removeFromCart warning:", err);
  }

  return true;
}

export async function clearCart(patientId: string): Promise<void> {
  const queryPatientId = UUID_REGEX.test(patientId) ? patientId : DEFAULT_PATIENT_UUID;

  // Clear from inMemoryCart
  for (const [id, item] of inMemoryCart.entries()) {
    if (
      item.patientId === patientId ||
      item.patientId === queryPatientId ||
      patientId.includes("demo") ||
      patientId === "guest-patient-cart" ||
      item.patientId.includes("demo")
    ) {
      inMemoryCart.delete(id);
    }
  }

  try {
    const admin = createAdminClient();
    await admin
      .from("medication_cart_items")
      .delete()
      .or(`patient_id.eq.${queryPatientId},patient_id.eq.${DEFAULT_PATIENT_UUID}`);
  } catch (err) {
    console.warn("Supabase clearCart warning:", err);
  }
}

export async function transferPrescriptionToCart(prescription: PrescriptionRecord, patientId: string): Promise<number> {
  let count = 0;
  for (const item of prescription.medications) {
    let targetMed = item.medicationId ? getMedicationById(item.medicationId) : undefined;
    if (!targetMed) {
      const all = getAllMedications();
      targetMed = all.find(
        (m) =>
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
