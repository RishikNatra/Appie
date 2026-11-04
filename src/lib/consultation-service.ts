import { createClient } from "./supabase/server";
import {
  ConsultationAppointment,
  ConsultationSummary,
  ConsultationReview,
  AppointmentType,
  AppointmentStatus,
} from "./types";
import { getDoctorById } from "./doctors-catalog";

// In-memory persistent fallback store
const inMemoryAppointments = new Map<string, ConsultationAppointment>();
const inMemorySummaries = new Map<string, ConsultationSummary>();
const inMemoryReviews = new Map<string, ConsultationReview>();

// Seed sample initial appointments for realistic demo experience
const sampleApptId = "appt-demo-101";
inMemoryAppointments.set(sampleApptId, {
  id: sampleApptId,
  patientId: "patient-demo-user",
  patientName: "Aditya Verma",
  professionalId: "doc-priya-sharma",
  doctorName: "Dr. Priya Sharma",
  doctorSpecialization: "General Physician",
  appointmentDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
  timeSlot: "10:30 AM",
  type: "video",
  status: "confirmed",
  reason: "Mild fever, throat pain and recurring dry cough for 3 days",
  meetingLink: "https://meet.appie-health.in/room/telehealth-" + sampleApptId,
  feeAmount: 499,
  paymentStatus: "paid",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

// Seed sample initial review
inMemoryReviews.set("rev-sample-1", {
  id: "rev-sample-1",
  appointmentId: "appt-sample-prev",
  patientId: "user-patient-2",
  patientName: "Neha K.",
  professionalId: "doc-priya-sharma",
  rating: 5,
  reviewText: "Dr. Priya was very empathetic and explained the difference between viral fever and bacterial infection clearly. Prescribed standard dosage and followed up promptly.",
  tags: ["Empathetic", "Clear explanations", "Punctual"],
  isAnonymous: false,
  createdAt: new Date(Date.now() - 172800000).toISOString(),
});

export async function getAppointments(userId: string, role: "patient" | "health_professional"): Promise<ConsultationAppointment[]> {
  try {
    const supabase = await createClient();
    const query = supabase
      .from("consultation_appointments")
      .select("*")
      .order("appointment_date", { ascending: false });

    if (role === "patient") {
      query.eq("patient_id", userId);
    } else {
      query.eq("professional_id", userId);
    }

    const { data, error } = await query;
    if (!error && data && data.length > 0) {
      return data.map((d: any) => ({
        id: d.id,
        patientId: d.patient_id,
        professionalId: d.professional_id,
        appointmentDate: d.appointment_date,
        timeSlot: d.time_slot,
        type: d.type as AppointmentType,
        status: d.status as AppointmentStatus,
        reason: d.reason,
        assessmentId: d.assessment_id,
        meetingLink: d.meeting_link,
        feeAmount: Number(d.fee_amount),
        paymentStatus: d.payment_status,
        notes: d.notes,
        createdAt: d.created_at,
        updatedAt: d.updated_at,
      }));
    }
  } catch (err) {
    console.warn("Supabase fetch appointments failed, using in-memory store:", err);
  }

  // Fallback to in-memory store
  const results: ConsultationAppointment[] = [];
  for (const appt of inMemoryAppointments.values()) {
    if (role === "patient" && (appt.patientId === userId || userId.includes("demo") || appt.patientId.includes("demo"))) {
      results.push(appt);
    } else if (role === "health_professional" && (appt.professionalId === userId || userId.includes("doc"))) {
      results.push(appt);
    }
  }
  return results.sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime());
}

export async function getAppointmentById(id: string): Promise<ConsultationAppointment | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("consultation_appointments")
      .select("*")
      .eq("id", id)
      .single();

    if (!error && data) {
      return {
        id: data.id,
        patientId: data.patient_id,
        professionalId: data.professional_id,
        appointmentDate: data.appointment_date,
        timeSlot: data.time_slot,
        type: data.type as AppointmentType,
        status: data.status as AppointmentStatus,
        reason: data.reason,
        assessmentId: data.assessment_id,
        meetingLink: data.meeting_link,
        feeAmount: Number(data.fee_amount),
        paymentStatus: data.payment_status,
        notes: data.notes,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    }
  } catch (err) {
    // In-memory fallback
  }

  return inMemoryAppointments.get(id) || null;
}

export async function bookAppointment(params: {
  patientId: string;
  patientName?: string;
  professionalId: string;
  appointmentDate: string;
  timeSlot: string;
  type?: AppointmentType;
  reason: string;
  assessmentId?: string;
}): Promise<ConsultationAppointment> {
  const doctor = getDoctorById(params.professionalId);
  const doctorName = doctor ? `${doctor.prefix} ${doctor.fullName}` : "Dr. Verified Specialist";
  const doctorSpecialization = doctor ? doctor.specialization : "General Medicine";
  const fee = doctor ? doctor.consultationFee : 499;

  const apptId = "appt-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6);
  const meetingLink = "https://meet.appie-health.in/room/telehealth-" + apptId;

  const newAppt: ConsultationAppointment = {
    id: apptId,
    patientId: params.patientId,
    patientName: params.patientName || "Aditya Verma",
    professionalId: params.professionalId,
    doctorName,
    doctorSpecialization,
    appointmentDate: params.appointmentDate,
    timeSlot: params.timeSlot,
    type: params.type || "video",
    status: "confirmed",
    reason: params.reason,
    assessmentId: params.assessmentId,
    meetingLink,
    feeAmount: fee,
    paymentStatus: "paid",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("consultation_appointments")
      .insert({
        id: apptId,
        patient_id: params.patientId,
        professional_id: params.professionalId,
        appointment_date: params.appointmentDate,
        time_slot: params.timeSlot,
        type: newAppt.type,
        status: newAppt.status,
        reason: newAppt.reason,
        assessment_id: params.assessmentId,
        meeting_link: meetingLink,
        fee_amount: fee,
        payment_status: "paid",
      })
      .select()
      .single();

    if (!error && data) {
      newAppt.id = data.id;
    }
  } catch (err) {
    console.warn("Supabase appointment booking error, saved in memory:", err);
  }

  inMemoryAppointments.set(newAppt.id, newAppt);
  return newAppt;
}

export async function updateAppointmentStatus(
  id: string,
  status: AppointmentStatus,
  notes?: string
): Promise<ConsultationAppointment | null> {
  const existing = inMemoryAppointments.get(id);
  if (existing) {
    existing.status = status;
    if (notes) existing.notes = notes;
    existing.updatedAt = new Date().toISOString();
  }

  try {
    const supabase = await createClient();
    await supabase
      .from("consultation_appointments")
      .update({ status, notes, updated_at: new Date().toISOString() })
      .eq("id", id);
  } catch (err) {
    // fallback
  }

  return existing || null;
}

export async function rescheduleAppointment(
  id: string,
  newDate: string,
  newSlot: string
): Promise<ConsultationAppointment | null> {
  const existing = inMemoryAppointments.get(id);
  if (existing) {
    existing.appointmentDate = newDate;
    existing.timeSlot = newSlot;
    existing.status = "rescheduled";
    existing.updatedAt = new Date().toISOString();
  }

  try {
    const supabase = await createClient();
    await supabase
      .from("consultation_appointments")
      .update({
        appointment_date: newDate,
        time_slot: newSlot,
        status: "rescheduled",
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);
  } catch (err) {
    // fallback
  }

  return existing || null;
}

// ------------------------------------------------------------------------------
// CONSULTATION SUMMARIES
// ------------------------------------------------------------------------------

export async function getConsultationSummary(appointmentId: string): Promise<ConsultationSummary | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("consultation_summaries")
      .select("*")
      .eq("appointment_id", appointmentId)
      .single();

    if (!error && data) {
      return {
        id: data.id,
        appointmentId: data.appointment_id,
        professionalId: data.professional_id,
        patientId: data.patient_id,
        clinicalDiagnosis: data.clinical_diagnosis,
        doctorNotes: data.doctor_notes,
        recommendations: data.recommendations || [],
        followUpDate: data.follow_up_date,
        followUpInstructions: data.follow_up_instructions,
        prescriptionId: data.prescription_id,
        status: data.status,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    }
  } catch (err) {
    // fallback
  }

  return inMemorySummaries.get(appointmentId) || null;
}

export async function saveConsultationSummary(params: {
  appointmentId: string;
  professionalId: string;
  patientId: string;
  doctorName?: string;
  patientName?: string;
  clinicalDiagnosis: string;
  doctorNotes: string;
  recommendations: string[];
  followUpDate?: string;
  followUpInstructions?: string;
  prescriptionId?: string;
}): Promise<ConsultationSummary> {
  const summaryId = "csum-" + Date.now();
  const summary: ConsultationSummary = {
    id: summaryId,
    appointmentId: params.appointmentId,
    professionalId: params.professionalId,
    patientId: params.patientId,
    doctorName: params.doctorName,
    patientName: params.patientName,
    clinicalDiagnosis: params.clinicalDiagnosis,
    doctorNotes: params.doctorNotes,
    recommendations: params.recommendations,
    followUpDate: params.followUpDate,
    followUpInstructions: params.followUpInstructions,
    prescriptionId: params.prescriptionId,
    status: "completed",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    const supabase = await createClient();
    await supabase.from("consultation_summaries").upsert({
      id: summaryId,
      appointment_id: params.appointmentId,
      professional_id: params.professionalId,
      patient_id: params.patientId,
      clinical_diagnosis: params.clinicalDiagnosis,
      doctor_notes: params.doctorNotes,
      recommendations: params.recommendations,
      follow_up_date: params.followUpDate,
      follow_up_instructions: params.followUpInstructions,
      prescription_id: params.prescriptionId,
      status: "completed",
    });
  } catch (err) {
    console.warn("Supabase summary save error:", err);
  }

  inMemorySummaries.set(params.appointmentId, summary);
  // Also mark appointment as completed
  await updateAppointmentStatus(params.appointmentId, "completed");

  return summary;
}

// ------------------------------------------------------------------------------
// CONSULTATION REVIEWS
// ------------------------------------------------------------------------------

export async function submitConsultationReview(params: {
  appointmentId: string;
  patientId: string;
  patientName?: string;
  professionalId: string;
  rating: number;
  reviewText?: string;
  tags?: string[];
  isAnonymous?: boolean;
}): Promise<ConsultationReview> {
  const reviewId = "rev-" + Date.now();
  const review: ConsultationReview = {
    id: reviewId,
    appointmentId: params.appointmentId,
    patientId: params.patientId,
    patientName: params.isAnonymous ? "Verified Patient" : params.patientName || "Aditya V.",
    professionalId: params.professionalId,
    rating: params.rating,
    reviewText: params.reviewText,
    tags: params.tags || [],
    isAnonymous: !!params.isAnonymous,
    createdAt: new Date().toISOString(),
  };

  try {
    const supabase = await createClient();
    await supabase.from("consultation_reviews").insert({
      id: reviewId,
      appointment_id: params.appointmentId,
      patient_id: params.patientId,
      professional_id: params.professionalId,
      rating: params.rating,
      review_text: params.reviewText,
      tags: params.tags || [],
      is_anonymous: params.isAnonymous,
    });
  } catch (err) {
    console.warn("Supabase review submit error:", err);
  }

  inMemoryReviews.set(reviewId, review);
  return review;
}

export async function getDoctorReviews(professionalId: string): Promise<ConsultationReview[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("consultation_reviews")
      .select("*")
      .eq("professional_id", professionalId)
      .order("created_at", { ascending: false });

    if (!error && data && data.length > 0) {
      return data.map((r: any) => ({
        id: r.id,
        appointmentId: r.appointment_id,
        patientId: r.patient_id,
        professionalId: r.professional_id,
        rating: r.rating,
        reviewText: r.review_text,
        tags: r.tags || [],
        isAnonymous: r.is_anonymous,
        createdAt: r.created_at,
      }));
    }
  } catch (err) {
    // fallback
  }

  const results: ConsultationReview[] = [];
  for (const rev of inMemoryReviews.values()) {
    if (rev.professionalId === professionalId || professionalId.includes("doc")) {
      results.push(rev);
    }
  }
  return results;
}

