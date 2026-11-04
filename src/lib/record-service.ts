import { createClient } from "./supabase/server";
import {
  MedicalRecordItem,
  RecordType,
  CareFollowUpItem,
  FollowUpStatus,
  FollowUpType,
} from "./types";
import { getPatientAssessments } from "./assessment-service";
import { getPrescriptions } from "./prescription-service";
import { getAppointments, getConsultationSummary } from "./consultation-service";

const inMemoryRecords = new Map<string, MedicalRecordItem>();
const inMemoryFollowUps = new Map<string, CareFollowUpItem>();

// Seed sample uploaded medical records
const sampleRec1 = "rec-demo-001";
inMemoryRecords.set(sampleRec1, {
  id: sampleRec1,
  patientId: "patient-demo-user",
  recordType: "lab_report",
  title: "Complete Blood Count (CBC) & ESR Panel",
  category: "Diagnostic Report",
  documentUrl: "/documents/cbc_panel_demo.pdf",
  fileSize: "1.2 MB",
  fileType: "PDF",
  recordDate: new Date(Date.now() - 259200000).toISOString().split("T")[0],
  doctorOrFacility: "Dr. Lal PathLabs, Indiranagar",
  notes: "WBC 7,800/mcL (Normal), Platelets 2.4 Lakhs (Normal), Hemoglobin 14.2 g/dL. All parameters within normal reference ranges.",
  isConfidential: false,
  tags: ["Hematology", "Blood Test", "Routine"],
  createdAt: new Date(Date.now() - 259200000).toISOString(),
  updatedAt: new Date(Date.now() - 259200000).toISOString(),
});

const sampleRec2 = "rec-demo-002";
inMemoryRecords.set(sampleRec2, {
  id: sampleRec2,
  patientId: "patient-demo-user",
  recordType: "vaccination",
  title: "COVID-19 Precautionary Dose Certificate",
  category: "Vaccine Certificate",
  documentUrl: "/documents/cowin_vaccination_cert.pdf",
  fileSize: "480 KB",
  fileType: "PDF",
  recordDate: "2024-04-12",
  doctorOrFacility: "Manipal Hospital, Bengaluru",
  notes: "Corbevax Booster administered. Verified with CoWIN digital seal.",
  isConfidential: false,
  tags: ["Immunization", "COVID-19", "Booster"],
  createdAt: "2024-04-12T10:00:00Z",
  updatedAt: "2024-04-12T10:00:00Z",
});

// Seed sample care follow-ups
const sampleFollowUp1 = "fu-demo-001";
inMemoryFollowUps.set(sampleFollowUp1, {
  id: sampleFollowUp1,
  patientId: "patient-demo-user",
  professionalId: "doc-priya-sharma",
  doctorName: "Dr. Priya Sharma",
  consultationId: "appt-demo-101",
  title: "Respiratory Infection Follow-Up Check",
  description: "Review resolution of sore throat and dry cough. Free follow-up within 7-day consultation window.",
  dueDate: new Date(Date.now() + 4 * 86400000).toISOString().split("T")[0],
  status: "pending",
  followUpType: "doctor_review",
  notes: "Return if temperature > 100.5°F or coughing paroxysms worsen.",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

const sampleFollowUp2 = "fu-demo-002";
inMemoryFollowUps.set(sampleFollowUp2, {
  id: sampleFollowUp2,
  patientId: "patient-demo-user",
  title: "Symptom Re-assessment Check-in",
  description: "Update daily severity score on Appie Symptom Tracker for acute bronchitis evaluation.",
  dueDate: new Date(Date.now() + 1 * 86400000).toISOString().split("T")[0],
  status: "pending",
  followUpType: "symptom_recheck",
  notes: "Check whether daytime coughing has subsided.",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export async function uploadMedicalRecord(params: {
  patientId: string;
  title: string;
  category: "Prescription" | "Diagnostic Report" | "Consultation Note" | "Vaccine Certificate" | "Health Assessment" | "Other";
  recordType?: RecordType;
  recordDate: string;
  doctorOrFacility?: string;
  notes?: string;
  isConfidential?: boolean;
  tags?: string[];
  fileSize?: string;
  fileType?: string;
  linkedEntityId?: string;
}): Promise<MedicalRecordItem> {
  const recId = "rec-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6);
  const now = new Date().toISOString();

  const record: MedicalRecordItem = {
    id: recId,
    patientId: params.patientId,
    recordType: params.recordType || "uploaded_document",
    title: params.title,
    category: params.category,
    documentUrl: `/documents/uploaded_${recId}.${params.fileType?.toLowerCase() || "pdf"}`,
    fileSize: params.fileSize || "1.5 MB",
    fileType: params.fileType || "PDF",
    recordDate: params.recordDate,
    doctorOrFacility: params.doctorOrFacility || "Self-Uploaded",
    notes: params.notes,
    isConfidential: !!params.isConfidential,
    tags: params.tags || [],
    linkedEntityId: params.linkedEntityId,
    createdAt: now,
    updatedAt: now,
  };

  try {
    const supabase = await createClient();
    await supabase.from("medical_records").insert({
      id: recId,
      patient_id: params.patientId,
      record_type: record.recordType,
      title: params.title,
      category: params.category,
      document_url: record.documentUrl,
      file_size: record.fileSize,
      file_type: record.fileType,
      record_date: params.recordDate,
      doctor_or_facility: record.doctorOrFacility,
      notes: params.notes,
      is_confidential: record.isConfidential,
      tags: record.tags,
      linked_entity_id: params.linkedEntityId || null,
    });
  } catch (err) {
    console.warn("Supabase record insert warning:", err);
  }

  inMemoryRecords.set(recId, record);
  return record;
}

export async function getUnifiedHealthTimeline(patientId: string): Promise<MedicalRecordItem[]> {
  const timeline: MedicalRecordItem[] = [];

  // 1. Direct medical records
  for (const rec of inMemoryRecords.values()) {
    if (rec.patientId === patientId || patientId.includes("demo") || rec.patientId.includes("demo")) {
      timeline.push(rec);
    }
  }

  // 2. Automatically link past assessments as records
  try {
    const assessments = await getPatientAssessments(patientId);
    assessments.forEach((asm) => {
      timeline.push({
        id: `asm-rec-${asm.id}`,
        patientId,
        recordType: "assessment_report",
        title: `Health Assessment: ${asm.title}`,
        category: "Health Assessment",
        recordDate: asm.createdAt.split("T")[0],
        doctorOrFacility: asm.reviewedBy || "Appie Digital Clinical Inference Engine",
        notes: `Urgency: ${asm.urgencyLevel.toUpperCase()} • Conditions: ${asm.possibleConditions.map((c) => `${c.name} (${c.matchPercentage}%)`).join(", ")}`,
        isConfidential: false,
        tags: ["Symptom Assessment", asm.urgencyLevel],
        linkedEntityId: asm.id,
        fileType: "Report",
        fileSize: "Digital",
        createdAt: asm.createdAt,
        updatedAt: asm.updatedAt,
      });
    });
  } catch (err) {
    // ignore
  }

  // 3. Automatically link e-prescriptions as records
  try {
    const prescriptions = await getPrescriptions(patientId, "patient");
    prescriptions.forEach((rx) => {
      timeline.push({
        id: `rx-rec-${rx.id}`,
        patientId,
        recordType: "prescription",
        title: `E-Prescription ${rx.prescriptionCode}`,
        category: "Prescription",
        recordDate: rx.createdAt.split("T")[0],
        doctorOrFacility: rx.doctorName,
        notes: `Diagnosis: ${rx.diagnosis} • ${rx.medications.length} medicines prescribed.`,
        isConfidential: false,
        tags: ["E-Rx", "Telehealth", rx.status],
        linkedEntityId: rx.id,
        fileType: "Prescription",
        fileSize: "Digital",
        createdAt: rx.createdAt,
        updatedAt: rx.updatedAt,
      });
    });
  } catch (err) {
    // ignore
  }

  return timeline.sort((a, b) => new Date(b.recordDate).getTime() - new Date(a.recordDate).getTime());
}

export async function deleteMedicalRecord(recordId: string): Promise<boolean> {
  inMemoryRecords.delete(recordId);

  try {
    const supabase = await createClient();
    await supabase.from("medical_records").delete().eq("id", recordId);
  } catch (err) {
    // fallback
  }

  return true;
}

// ------------------------------------------------------------------------------
// CARE FOLLOW-UPS
// ------------------------------------------------------------------------------

export async function getCareFollowUps(patientId: string): Promise<CareFollowUpItem[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("care_follow_ups")
      .select("*")
      .eq("patient_id", patientId)
      .order("due_date", { ascending: true });

    if (!error && data && data.length > 0) {
      return data.map((d: any) => ({
        id: d.id,
        patientId: d.patient_id,
        professionalId: d.professional_id,
        consultationId: d.consultation_id,
        title: d.title,
        description: d.description,
        dueDate: d.due_date,
        status: d.status as FollowUpStatus,
        followUpType: d.follow_up_type as FollowUpType,
        notes: d.notes,
        createdAt: d.created_at,
        updatedAt: d.updated_at,
      }));
    }
  } catch (err) {
    // fallback
  }

  const results: CareFollowUpItem[] = [];
  for (const fu of inMemoryFollowUps.values()) {
    if (fu.patientId === patientId || patientId.includes("demo") || fu.patientId.includes("demo")) {
      results.push(fu);
    }
  }
  return results.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
}

export async function updateCareFollowUpStatus(
  followUpId: string,
  status: FollowUpStatus,
  notes?: string
): Promise<CareFollowUpItem | null> {
  const fu = inMemoryFollowUps.get(followUpId);
  if (fu) {
    fu.status = status;
    if (notes) fu.notes = notes;
    fu.updatedAt = new Date().toISOString();
  }

  try {
    const supabase = await createClient();
    await supabase
      .from("care_follow_ups")
      .update({
        status,
        notes,
        updated_at: new Date().toISOString(),
      })
      .eq("id", followUpId);
  } catch (err) {
    // fallback
  }

  return fu || null;
}

