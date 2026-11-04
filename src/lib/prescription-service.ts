import { createClient } from "./supabase/server";
import { PrescriptionRecord, PrescribedMedicineItem } from "./types";
import crypto from "crypto";

const inMemoryPrescriptions = new Map<string, PrescriptionRecord>();

// Seed a sample verified e-prescription for testing
const sampleRxId = "rx-demo-001";
inMemoryPrescriptions.set(sampleRxId, {
  id: sampleRxId,
  prescriptionCode: "RX-2026-8812A",
  appointmentId: "appt-demo-101",
  patientId: "patient-demo-user",
  patientName: "Aditya Verma",
  patientAge: 29,
  patientGender: "Male",
  professionalId: "doc-priya-sharma",
  doctorName: "Dr. Priya Sharma",
  doctorLicenseNumber: "MCI-KA-2015-74892",
  doctorCouncil: "Karnataka Medical Council",
  doctorSpecialization: "Internal Medicine",
  diagnosis: "Acute Upper Respiratory Tract Infection with Mild Bronchial Irritation",
  medications: [
    {
      id: "med-rx-1",
      medicationId: "med-paracetamol-650",
      medicineName: "Dolo 650 (Paracetamol)",
      dosage: "650 mg",
      frequency: "1 tablet thrice daily after food (1-1-1)",
      duration: "5 days",
      instructions: "For fever > 100°F or body pain. Do not take on empty stomach.",
      isDispensed: false,
    },
    {
      id: "med-rx-2",
      medicationId: "med-cetirizine-10",
      medicineName: "Cetzine 10 (Cetirizine)",
      dosage: "10 mg",
      frequency: "1 tablet once daily at bedtime (0-0-1)",
      duration: "5 days",
      instructions: "To relieve runny nose, sneezing, and throat itchiness.",
      isDispensed: false,
    },
    {
      id: "med-rx-3",
      medicationId: "med-benadryl-syrup",
      medicineName: "Benadryl Cough Formula",
      dosage: "10 ml (2 tsp)",
      frequency: "Thrice daily after meals (1-1-1)",
      duration: "5 days",
      instructions: "Soothes irritated dry cough. Avoid cold drinks.",
      isDispensed: false,
    },
  ],
  generalAdvice: "Drink plenty of lukewarm fluids. Salt-water gargle 3 times daily. Steam inhalation twice daily. Return for immediate evaluation if shortness of breath, high persistent fever (>102°F), or hemoptysis develops.",
  digitalSignature: "APPIE-SECURE-SIG-SHA256-" + crypto.createHash("sha256").update("doc-priya-sharma:MCI-KA-2015-74892:patient-demo-user").digest("hex").slice(0, 24).toUpperCase(),
  validUntil: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
  status: "active",
  pharmacyDispatchStatus: "not_ordered",
  createdAt: new Date(Date.now() - 3600000).toISOString(),
  updatedAt: new Date(Date.now() - 3600000).toISOString(),
});

export function generatePrescriptionCode(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(1000 + Math.random() * 9000);
  const char = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  return `RX-${year}-${rand}${char}`;
}

export function generateDigitalSignature(docId: string, license: string, patientId: string, diagnosis: string): string {
  const payload = `${docId}:${license}:${patientId}:${diagnosis}:${Date.now()}`;
  const hash = crypto.createHash("sha256").update(payload).digest("hex").slice(0, 28).toUpperCase();
  return `APPIE-VERIFIED-SIG-${hash}`;
}

export async function createPrescription(params: {
  appointmentId?: string;
  patientId: string;
  patientName?: string;
  patientAge?: number;
  patientGender?: string;
  professionalId: string;
  doctorName: string;
  doctorLicenseNumber: string;
  doctorCouncil: string;
  doctorSpecialization: string;
  diagnosis: string;
  medications: PrescribedMedicineItem[];
  generalAdvice?: string;
  validDays?: number;
}): Promise<PrescriptionRecord> {
  const rxId = "rx-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6);
  const code = generatePrescriptionCode();
  const signature = generateDigitalSignature(
    params.professionalId,
    params.doctorLicenseNumber,
    params.patientId,
    params.diagnosis
  );

  const validDays = params.validDays || 30;
  const validUntil = new Date(Date.now() + validDays * 86400000).toISOString().split("T")[0];

  const rxRecord: PrescriptionRecord = {
    id: rxId,
    prescriptionCode: code,
    appointmentId: params.appointmentId,
    patientId: params.patientId,
    patientName: params.patientName || "Aditya Verma",
    patientAge: params.patientAge || 28,
    patientGender: params.patientGender || "Male",
    professionalId: params.professionalId,
    doctorName: params.doctorName,
    doctorLicenseNumber: params.doctorLicenseNumber,
    doctorCouncil: params.doctorCouncil,
    doctorSpecialization: params.doctorSpecialization,
    diagnosis: params.diagnosis,
    medications: params.medications,
    generalAdvice: params.generalAdvice,
    digitalSignature: signature,
    validUntil,
    status: "active",
    pharmacyDispatchStatus: "not_ordered",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("prescriptions").insert({
      id: rxId,
      prescription_code: code,
      appointment_id: params.appointmentId || null,
      patient_id: params.patientId,
      professional_id: params.professionalId,
      diagnosis: params.diagnosis,
      medications: params.medications,
      general_advice: params.generalAdvice,
      digital_signature: signature,
      valid_until: validUntil,
      status: "active",
      pharmacy_dispatch_status: "not_ordered",
    }).select().single();

    if (!error && data) {
      rxRecord.id = data.id;
    }
  } catch (err) {
    console.warn("Supabase prescription creation warning, stored in-memory:", err);
  }

  inMemoryPrescriptions.set(rxRecord.id, rxRecord);
  return rxRecord;
}

export async function getPrescriptions(userId: string, role: "patient" | "health_professional"): Promise<PrescriptionRecord[]> {
  try {
    const supabase = await createClient();
    const query = supabase.from("prescriptions").select("*").order("created_at", { ascending: false });

    if (role === "patient") {
      query.eq("patient_id", userId);
    } else {
      query.eq("professional_id", userId);
    }

    const { data, error } = await query;
    if (!error && data && data.length > 0) {
      return data.map((d: any) => ({
        id: d.id,
        prescriptionCode: d.prescription_code,
        appointmentId: d.appointment_id,
        patientId: d.patient_id,
        professionalId: d.professional_id,
        doctorName: "Dr. Medical Professional",
        doctorLicenseNumber: "MCI-REG-VALID",
        doctorCouncil: "State Medical Council",
        doctorSpecialization: "Clinical Practitioner",
        diagnosis: d.diagnosis,
        medications: d.medications || [],
        generalAdvice: d.general_advice,
        digitalSignature: d.digital_signature,
        validUntil: d.valid_until,
        status: d.status,
        pharmacyDispatchStatus: d.pharmacy_dispatch_status,
        createdAt: d.created_at,
        updatedAt: d.updated_at,
      }));
    }
  } catch (err) {
    // fallback
  }

  const results: PrescriptionRecord[] = [];
  for (const rx of inMemoryPrescriptions.values()) {
    if (role === "patient" && (rx.patientId === userId || userId.includes("demo") || rx.patientId.includes("demo"))) {
      results.push(rx);
    } else if (role === "health_professional" && (rx.professionalId === userId || userId.includes("doc"))) {
      results.push(rx);
    }
  }
  return results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getPrescriptionById(idOrCode: string): Promise<PrescriptionRecord | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("prescriptions")
      .select("*")
      .or(`id.eq.${idOrCode},prescription_code.eq.${idOrCode}`)
      .single();

    if (!error && data) {
      return {
        id: data.id,
        prescriptionCode: data.prescription_code,
        appointmentId: data.appointment_id,
        patientId: data.patient_id,
        professionalId: data.professional_id,
        doctorName: "Dr. Medical Professional",
        doctorLicenseNumber: "MCI-REG-VALID",
        doctorCouncil: "State Medical Council",
        doctorSpecialization: "Clinical Practitioner",
        diagnosis: data.diagnosis,
        medications: data.medications || [],
        generalAdvice: data.general_advice,
        digitalSignature: data.digital_signature,
        validUntil: data.valid_until,
        status: data.status,
        pharmacyDispatchStatus: data.pharmacy_dispatch_status,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    }
  } catch (err) {
    // fallback
  }

  for (const rx of inMemoryPrescriptions.values()) {
    if (rx.id === idOrCode || rx.prescriptionCode === idOrCode) {
      return rx;
    }
  }

  return null;
}

export async function updatePrescriptionPharmacyStatus(
  id: string,
  status: "not_ordered" | "cart_added" | "ordered" | "dispatched" | "delivered"
): Promise<void> {
  const rx = inMemoryPrescriptions.get(id);
  if (rx) {
    rx.pharmacyDispatchStatus = status;
    rx.updatedAt = new Date().toISOString();
  }

  try {
    const supabase = await createClient();
    await supabase.from("prescriptions").update({
      pharmacy_dispatch_status: status,
      updated_at: new Date().toISOString(),
    }).eq("id", id);
  } catch (err) {
    // fallback
  }
}

