"use client";

import { useEffect, useState } from "react";
import { ConsultationAppointment, ConsultationSummary } from "@/lib/types";
import {
  X,
  FileText,
  Calendar,
  CheckCircle2,
  Star,
  FileCheck,
  ArrowRight,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";

interface ConsultationSummaryModalProps {
  appointment: ConsultationAppointment | null;
  role: "patient" | "health_professional";
  onClose: () => void;
  onOpenPrescription?: (prescriptionId: string) => void;
  onRateDoctor?: (appointment: ConsultationAppointment) => void;
}

export default function ConsultationSummaryModal({
  appointment,
  role,
  onClose,
  onOpenPrescription,
  onRateDoctor,
}: ConsultationSummaryModalProps) {
  const [summary, setSummary] = useState<ConsultationSummary | null>(null);
  const [loading, setLoading] = useState(true);

  // Clinician creation form state
  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");
  const [recommendationsText, setRecommendationsText] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const isDoctor = role === "health_professional";

  useEffect(() => {
    if (!appointment) return;
    setLoading(true);
    fetch(`/api/consultations/appointments/${appointment.id}/summary`)
      .then((res) => res.json())
      .then((data) => {
        if (data.summary) {
          setSummary(data.summary);
        } else {
          // Prepopulate default clinical notes for demo convenience
          setDiagnosis("Acute Upper Respiratory Infection (Mild) with Rhinitis");
          setNotes(
            "Patient presented with throat irritation, clear rhinorrhea, and intermittent dry cough for 3 days. Chest is clear bilaterally on auscultation. Vitals stable. Advised rest, steam inhalation, and oral hydration."
          );
          setRecommendationsText(
            "Lukewarm water gargles 3x daily\nDrink 2.5-3 liters of fluids daily\nSteam inhalation before sleep"
          );
        }
      })
      .catch((err) => console.warn(err))
      .finally(() => setLoading(false));
  }, [appointment]);

  if (!appointment) return null;

  const handleSaveSummary = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const recs = recommendationsText
        .split("\n")
        .map((r) => r.trim())
        .filter(Boolean);

      const res = await fetch(`/api/consultations/appointments/${appointment.id}/summary`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clinicalDiagnosis: diagnosis,
          doctorNotes: notes,
          recommendations: recs,
          followUpDate: followUpDate || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok && data.summary) {
        setSummary(data.summary);
      }
    } catch (err) {
      alert("Failed to save summary");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999,
        background: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <div
        className="dashboard-card"
        style={{
          width: "100%",
          maxWidth: "680px",
          maxHeight: "92vh",
          overflowY: "auto",
          padding: "2rem",
          position: "relative",
          animation: "fadeIn 250ms ease",
        }}
      >
        <button
          type="button"
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1.25rem",
            right: "1.25rem",
            background: "transparent",
            border: "none",
            color: "var(--text-secondary)",
            cursor: "pointer",
            minHeight: "44px",
            minWidth: "44px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-label="Close"
        >
          <X size={22} />
        </button>

        {/* Modal Header */}
        <div style={{ marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--color-success)", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.25rem" }}>
            <ShieldCheck size={16} /> Verified Clinical Record
          </div>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 800 }}>Consultation Summary</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem" }}>
            Conducted by <strong>{appointment.doctorName || "Dr. Medical Specialist"}</strong> with{" "}
            <strong>{appointment.patientName || "Aditya Verma"}</strong>
          </p>
        </div>

        {loading ? (
          <p style={{ padding: "2rem", textAlign: "center", color: "var(--text-secondary)" }}>
            Loading consultation records...
          </p>
        ) : summary ? (
          /* View Mode */
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {/* Consultation Summary Component */}
            <div
              style={{
                background: "var(--bg-surface)",
                padding: "1rem 1.25rem",
                borderRadius: "10px",
                border: "1px solid var(--border-subtle)",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "0.75rem",
                fontSize: "0.85rem",
              }}
            >
              <div>
                <span style={{ color: "var(--text-muted)", fontSize: "0.78rem", display: "block" }}>Date & Time</span>
                <strong>{appointment.appointmentDate} • {appointment.timeSlot}</strong>
              </div>
              <div>
                <span style={{ color: "var(--text-muted)", fontSize: "0.78rem", display: "block" }}>Clinical Diagnosis</span>
                <strong style={{ color: "var(--color-accent)" }}>{summary.clinicalDiagnosis}</strong>
              </div>
            </div>

            {/* Professional Notes Component */}
            <div style={{ border: "1px solid var(--border-subtle)", borderRadius: "10px", padding: "1.25rem" }}>
              <h4 style={{ fontSize: "0.92rem", fontWeight: 700, marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "6px" }}>
                <Stethoscope size={16} color="var(--color-accent)" /> Physician Clinical Notes
              </h4>
              <p style={{ fontSize: "0.88rem", lineHeight: 1.6, color: "var(--text-secondary)" }}>
                {summary.doctorNotes}
              </p>
            </div>

            {/* Recommendations Component */}
            {summary.recommendations && summary.recommendations.length > 0 && (
              <div style={{ border: "1px solid var(--border-subtle)", borderRadius: "10px", padding: "1.25rem" }}>
                <h4 style={{ fontSize: "0.92rem", fontWeight: 700, marginBottom: "0.5rem" }}>
                  Clinical Recommendations & Care
                </h4>
                <ul style={{ paddingLeft: "1.25rem", fontSize: "0.88rem", color: "var(--text-secondary)", display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                  {summary.recommendations.map((rec, i) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Follow-up Information Component */}
            {summary.followUpDate && (
              <div
                style={{
                  background: "rgba(255, 178, 0, 0.08)",
                  border: "1px solid var(--border-accent)",
                  borderRadius: "10px",
                  padding: "1rem",
                  fontSize: "0.85rem",
                }}
              >
                <strong>Follow-up Scheduled:</strong> {summary.followUpDate} (Free consultation window applies)
              </div>
            )}

            {/* Prescription Reference Component */}
            <div
              style={{
                background: "rgba(29, 52, 138, 0.15)",
                border: "1px solid var(--color-primary)",
                borderRadius: "10px",
                padding: "1rem 1.25rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "0.75rem",
              }}
            >
              <div>
                <span style={{ fontSize: "0.78rem", color: "var(--color-accent)", fontWeight: 700, display: "block" }}>
                  Prescription Available
                </span>
                <span style={{ fontSize: "0.95rem", fontWeight: 700 }}>
                  E-Prescription #RX-2026-8812A
                </span>
              </div>

              {onOpenPrescription && (
                <button
                  type="button"
                  onClick={() => onOpenPrescription(summary.prescriptionId || "rx-demo-001")}
                  className="btn-primary"
                  style={{ minHeight: "44px", fontSize: "0.85rem", padding: "0 1rem" }}
                >
                  <FileCheck size={16} />
                  <span>View E-Prescription</span>
                </button>
              )}
            </div>

            {/* Consultation Completion Component (Review trigger for patients) */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.5rem", flexWrap: "wrap", gap: "0.5rem" }}>
              {!isDoctor && onRateDoctor && (
                <button
                  type="button"
                  onClick={() => onRateDoctor(appointment)}
                  className="btn-secondary"
                  style={{ minHeight: "48px", padding: "0 1rem" }}
                >
                  <Star size={16} fill="var(--color-accent)" />
                  <span>Rate Doctor Consultation</span>
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                className="btn-primary"
                style={{ minHeight: "48px", padding: "0 1.5rem", marginLeft: "auto" }}
              >
                Close Summary
              </button>
            </div>
          </div>
        ) : isDoctor ? (
          /* Doctor Input Form Mode */
          <form onSubmit={handleSaveSummary} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.4rem" }}>
                Primary Clinical Diagnosis
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="E.g., Acute Viral Rhinopharyngitis"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                required
                style={{ minHeight: "48px", width: "100%" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.4rem" }}>
                Physician Observations & Consultation Notes
              </label>
              <textarea
                className="form-input"
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter physical observations, symptom progression, and rationale..."
                required
                style={{ width: "100%", padding: "0.75rem", fontSize: "0.88rem" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.4rem" }}>
                Recommendations & Lifestyle Advice (One per line)
              </label>
              <textarea
                className="form-input"
                rows={3}
                value={recommendationsText}
                onChange={(e) => setRecommendationsText(e.target.value)}
                placeholder="Warm water gargles&#10;Hydration 3L daily&#10;Adequate sleep"
                style={{ width: "100%", padding: "0.75rem", fontSize: "0.88rem" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.4rem" }}>
                Recommended Follow-up Date (Optional)
              </label>
              <input
                type="date"
                className="form-input"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                style={{ minHeight: "48px", width: "100%" }}
              />
            </div>

            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
                style={{ minHeight: "48px" }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="btn-primary"
                style={{ minHeight: "48px", padding: "0 1.5rem" }}
              >
                {isSaving ? "Saving..." : "Save & Finalize Consultation Summary"}
              </button>
            </div>
          </form>
        ) : (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <p style={{ color: "var(--text-secondary)", marginBottom: "1rem" }}>
              The clinician has not finalized the consultation summary for this session yet.
            </p>
            <button type="button" onClick={onClose} className="btn-secondary" style={{ minHeight: "48px" }}>
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

