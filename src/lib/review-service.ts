import { createClient } from "./supabase/server";
import { ClinicalReviewRecord, ClinicalReviewType, ClinicalReviewStatus, HealthAssessmentRecord } from "./types";
import { getPatientAssessments, updateAssessmentStatus } from "./assessment-service";

const inMemoryClinicalReviews = new Map<string, ClinicalReviewRecord>();

// Seed sample clinical review
const sampleRevId = "crev-demo-01";
inMemoryClinicalReviews.set(sampleRevId, {
  id: sampleRevId,
  professionalId: "doc-priya-sharma",
  professionalName: "Dr. Priya Sharma",
  patientId: "patient-demo-user",
  patientName: "Aditya Verma",
  assessmentId: "asm-sample-01",
  assessmentTitle: "Acute Viral Rhinitis & Seasonal Cough Assessment",
  reviewType: "assessment_review",
  status: "approved",
  clinicalNotes: "Patient reports low-grade fever with clear rhinorrhea and throat irritation. No red-flag respiratory distress observed. Symptom progression is consistent with mild upper respiratory viral illness. Hydration, antipyretics and steam inhalation recommended.",
  prescribedActions: [
    "Confirmed Paracetamol 650mg SOS for body ache",
    "Advised saline nasal drops & warm fluids",
    "Instructed patient to seek immediate in-person review if fever persists past day 5",
  ],
  reviewedAt: new Date(Date.now() - 7200000).toISOString(),
  createdAt: new Date(Date.now() - 7200000).toISOString(),
  updatedAt: new Date(Date.now() - 7200000).toISOString(),
});

export async function getClinicalReviews(userId: string, role: "patient" | "health_professional"): Promise<ClinicalReviewRecord[]> {
  try {
    const supabase = await createClient();
    const query = supabase
      .from("clinical_reviews")
      .select("*")
      .order("created_at", { ascending: false });

    if (role === "patient") {
      query.eq("patient_id", userId);
    } else {
      query.eq("professional_id", userId);
    }

    const { data, error } = await query;
    if (!error && data && data.length > 0) {
      return data.map((d: any) => ({
        id: d.id,
        professionalId: d.professional_id,
        patientId: d.patient_id,
        assessmentId: d.assessment_id,
        prescriptionId: d.prescription_id,
        reviewType: d.review_type as ClinicalReviewType,
        status: d.status as ClinicalReviewStatus,
        clinicalNotes: d.clinical_notes,
        prescribedActions: d.prescribed_actions || [],
        reviewedAt: d.reviewed_at,
        createdAt: d.created_at,
        updatedAt: d.updated_at,
      }));
    }
  } catch (err) {
    // fallback
  }

  const results: ClinicalReviewRecord[] = [];
  for (const rev of inMemoryClinicalReviews.values()) {
    if (role === "patient" && (rev.patientId === userId || userId.includes("demo") || rev.patientId.includes("demo"))) {
      results.push(rev);
    } else if (role === "health_professional" && (rev.professionalId === userId || userId.includes("doc"))) {
      results.push(rev);
    }
  }
  return results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function submitClinicalReview(params: {
  professionalId: string;
  professionalName?: string;
  patientId: string;
  patientName?: string;
  assessmentId?: string;
  assessmentTitle?: string;
  prescriptionId?: string;
  reviewType: ClinicalReviewType;
  status: ClinicalReviewStatus;
  clinicalNotes: string;
  prescribedActions: string[];
}): Promise<ClinicalReviewRecord> {
  const revId = "crev-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6);
  const now = new Date().toISOString();

  const record: ClinicalReviewRecord = {
    id: revId,
    professionalId: params.professionalId,
    professionalName: params.professionalName || "Dr. Medical Professional",
    patientId: params.patientId,
    patientName: params.patientName || "Aditya Verma",
    assessmentId: params.assessmentId,
    assessmentTitle: params.assessmentTitle,
    prescriptionId: params.prescriptionId,
    reviewType: params.reviewType,
    status: params.status,
    clinicalNotes: params.clinicalNotes,
    prescribedActions: params.prescribedActions,
    reviewedAt: now,
    createdAt: now,
    updatedAt: now,
  };

  try {
    const supabase = await createClient();
    await supabase.from("clinical_reviews").insert({
      id: revId,
      professional_id: params.professionalId,
      patient_id: params.patientId,
      assessment_id: params.assessmentId || null,
      prescription_id: params.prescriptionId || null,
      review_type: params.reviewType,
      status: params.status,
      clinical_notes: params.clinicalNotes,
      prescribed_actions: params.prescribedActions,
      reviewed_at: now,
    });
  } catch (err) {
    console.warn("Supabase clinical review insert warning:", err);
  }

  inMemoryClinicalReviews.set(revId, record);

  // If this was an assessment review, update the assessment record's status and review notes
  if (params.assessmentId) {
    await updateAssessmentStatus(
      params.assessmentId,
      "reviewed",
      params.professionalName || "Verified Doctor",
      params.clinicalNotes
    );
  }

  return record;
}

export async function getPendingAssessmentQueue(): Promise<{
  assessment: HealthAssessmentRecord;
  patientName: string;
}[]> {
  const assessments = await getPatientAssessments("all");
  return assessments
    .filter((a) => a.status === "active")
    .map((a) => ({
      assessment: a,
      patientName: "Aditya Verma",
    }));
}

