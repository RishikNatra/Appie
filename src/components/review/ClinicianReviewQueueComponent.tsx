"use client";

import { useEffect, useState } from "react";
import { ClinicalReviewRecord, HealthAssessmentRecord } from "@/lib/types";
import {
  ClipboardList,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileCheck,
  Stethoscope,
  Activity,
  ArrowRight,
  ShieldCheck,
  Clock,
} from "lucide-react";

interface ClinicianReviewQueueComponentProps {
  onIssuePrescriptionForPatient?: (patientId: string, assessmentId: string) => void;
}

export default function ClinicianReviewQueueComponent({
  onIssuePrescriptionForPatient,
}: ClinicianReviewQueueComponentProps) {
  const [pendingQueue, setPendingQueue] = useState<{ assessment: HealthAssessmentRecord; patientName: string }[]>([]);
  const [reviewHistory, setReviewHistory] = useState<ClinicalReviewRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssessment, setSelectedAssessment] = useState<HealthAssessmentRecord | null>(null);

  // Review submission state
  const [reviewStatus, setReviewStatus] = useState<"approved" | "modification_recommended" | "rejected">("approved");
  const [clinicalNotes, setClinicalNotes] = useState("");
  const [actionsList, setActionsList] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = () => {
    setLoading(true);
    Promise.all([
      fetch("/api/reviews/clinical?queue=pending").then((r) => r.json()),
      fetch("/api/reviews/clinical").then((r) => r.json()),
    ])
      .then(([pendingData, historyData]) => {
        if (pendingData.pendingQueue) setPendingQueue(pendingData.pendingQueue);
        if (historyData.reviews) setReviewHistory(historyData.reviews);
      })
      .catch((err) => console.warn(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStartReview = (assessment: HealthAssessmentRecord) => {
    setSelectedAssessment(assessment);
    setClinicalNotes(
      `Reviewed reported symptoms: ${assessment.symptoms.map((s) => s.name).join(", ")}. Inferred condition (${assessment.possibleConditions[0]?.name || "Routine illness"}) validated under tele-triage guidelines.`
    );
    setActionsList("Hydration & symptomatic rest\nFollow up if red-flag symptoms worsen");
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssessment) return;
    setIsSubmitting(true);

    try {
      const actions = actionsList
        .split("\n")
        .map((a) => a.trim())
        .filter(Boolean);

      const res = await fetch("/api/reviews/clinical", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assessmentId: selectedAssessment.id,
          assessmentTitle: selectedAssessment.title,
          patientId: selectedAssessment.patientId,
          reviewType: "assessment_review",
          status: reviewStatus,
          clinicalNotes,
          prescribedActions: actions,
        }),
      });

      if (res.ok) {
        setSelectedAssessment(null);
        loadData();
      } else {
        alert("Failed to record review");
      }
    } catch (err) {
      alert("Error submitting clinical review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Header */}
      <div className="dashboard-card" style={{ padding: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "0.25rem" }}>
          <ClipboardList size={20} color="var(--color-accent)" />
          <h2 style={{ fontSize: "1.35rem", fontWeight: 800 }}>Clinical Review & Verification Portal</h2>
        </div>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem" }}>
          Review and endorse patient health assessments, verify medication safety recommendations, and issue clinical approvals.
        </p>
      </div>

      {loading ? (
        <p style={{ textAlign: "center", padding: "2rem", color: "var(--text-secondary)" }}>
          Loading clinical review queue...
        </p>
      ) : (
        <>
          {/* Pending Assessments Queue */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <h3 style={{ fontSize: "1.15rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "6px" }}>
              <Clock size={18} color="var(--color-accent)" />
              Pending Patient Health Assessments Needing Verification ({pendingQueue.length})
            </h3>

            {pendingQueue.length === 0 ? (
              <div
                className="dashboard-card"
                style={{ textAlign: "center", padding: "2rem 1.5rem", color: "var(--text-secondary)" }}
              >
                <CheckCircle2 size={32} color="var(--color-success)" style={{ margin: "0 auto 0.5rem" }} />
                <p>All submitted patient assessments have been reviewed and verified.</p>
              </div>
            ) : (
              pendingQueue.map(({ assessment, patientName }) => (
                <div
                  key={assessment.id}
                  className="dashboard-card"
                  style={{
                    padding: "1.25rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "1rem",
                  }}
                >
                  <div style={{ flex: "1 1 300px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                      <span
                        style={{
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          padding: "2px 7px",
                          borderRadius: "8px",
                          background: "rgba(255, 178, 0, 0.15)",
                          color: "var(--color-accent)",
                        }}
                      >
                        Pending Doctor Review
                      </span>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                        {new Date(assessment.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h4 style={{ fontSize: "1.1rem", fontWeight: 700 }}>{assessment.title}</h4>
                    <p style={{ color: "var(--color-accent)", fontSize: "0.85rem", fontWeight: 600 }}>
                      Patient: {patientName} • Triage Urgency: {assessment.urgencyLevel.toUpperCase()}
                    </p>
                    <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>
                      Reported Symptoms ({assessment.symptoms.length}):{" "}
                      {assessment.symptoms.map((s) => `${s.name} (${s.severity}/10)`).join(", ")}
                    </p>
                  </div>

                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      type="button"
                      onClick={() => handleStartReview(assessment)}
                      className="btn-primary"
                      style={{ minHeight: "44px", fontSize: "0.85rem", padding: "0 1.25rem" }}
                    >
                      <Stethoscope size={16} />
                      <span>Conduct Review</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Historical Verified Reviews */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
            <h3 style={{ fontSize: "1.15rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "6px" }}>
              <ShieldCheck size={18} color="var(--color-success)" />
              Completed Verification Endorsements ({reviewHistory.length})
            </h3>

            {reviewHistory.map((rev) => (
              <div
                key={rev.id}
                className="dashboard-card"
                style={{
                  padding: "1.25rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: "8px",
                        background:
                          rev.status === "approved"
                            ? "var(--color-success-bg)"
                            : rev.status === "modification_recommended"
                            ? "rgba(255, 178, 0, 0.15)"
                            : "var(--color-error-bg)",
                        color:
                          rev.status === "approved"
                            ? "var(--color-success)"
                            : rev.status === "modification_recommended"
                            ? "var(--color-accent)"
                            : "var(--color-error)",
                        textTransform: "capitalize",
                      }}
                    >
                      {rev.status.replace("_", " ")}
                    </span>
                    <strong style={{ fontSize: "0.95rem" }}>{rev.assessmentTitle || "Clinical Review"}</strong>
                  </div>
                  <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                    Verified on {new Date(rev.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                  {rev.clinicalNotes}
                </p>

                {rev.prescribedActions && rev.prescribedActions.length > 0 && (
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.25rem" }}>
                    {rev.prescribedActions.map((action, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: "0.75rem",
                          background: "var(--bg-surface)",
                          border: "1px solid var(--border-subtle)",
                          padding: "2px 8px",
                          borderRadius: "6px",
                          color: "var(--text-secondary)",
                        }}
                      >
                        ✓ {action}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Review Modal */}
      {selectedAssessment && (
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
              maxWidth: "650px",
              maxHeight: "92vh",
              overflowY: "auto",
              padding: "2rem",
              position: "relative",
              animation: "fadeIn 250ms ease",
            }}
          >
            <button
              type="button"
              onClick={() => setSelectedAssessment(null)}
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
              <XCircle size={22} />
            </button>

            <h3 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "0.25rem" }}>
              Clinical Verification Form
            </h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "1.25rem" }}>
              Reviewing assessment: <strong>{selectedAssessment.title}</strong>
            </p>

            <form onSubmit={handleSubmitReview} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {/* Decision Selector */}
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.5rem" }}>
                  Clinical Verification Decision
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem" }}>
                  {[
                    { id: "approved", label: "Approve / Endorse" },
                    { id: "modification_recommended", label: "Recommend Changes" },
                    { id: "rejected", label: "Reject / Escalate" },
                  ].map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setReviewStatus(d.id as any)}
                      style={{
                        padding: "0.6rem 0.5rem",
                        borderRadius: "8px",
                        fontSize: "0.8rem",
                        fontWeight: reviewStatus === d.id ? 700 : 500,
                        border:
                          reviewStatus === d.id
                            ? "1.5px solid var(--color-accent)"
                            : "1px solid var(--border-subtle)",
                        background:
                          reviewStatus === d.id ? "rgba(255, 178, 0, 0.12)" : "var(--bg-surface)",
                        color:
                          reviewStatus === d.id ? "var(--color-accent)" : "var(--text-secondary)",
                        cursor: "pointer",
                        minHeight: "48px",
                      }}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.35rem" }}>
                  Clinical Rationale & Practitioner Observations
                </label>
                <textarea
                  className="form-input"
                  rows={4}
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  required
                  style={{ width: "100%", padding: "0.75rem", fontSize: "0.85rem" }}
                />
              </div>

              {/* Prescribed Actions */}
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.35rem" }}>
                  Endorsed Patient Actions (One per line)
                </label>
                <textarea
                  className="form-input"
                  rows={3}
                  value={actionsList}
                  onChange={(e) => setActionsList(e.target.value)}
                  style={{ width: "100%", padding: "0.75rem", fontSize: "0.85rem" }}
                />
              </div>

              {/* Actions */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.5rem" }}>
                {onIssuePrescriptionForPatient && (
                  <button
                    type="button"
                    onClick={() => {
                      const pId = selectedAssessment.patientId;
                      const aId = selectedAssessment.id;
                      setSelectedAssessment(null);
                      onIssuePrescriptionForPatient(pId, aId);
                    }}
                    className="btn-secondary"
                    style={{ minHeight: "48px", fontSize: "0.82rem" }}
                  >
                    <FileCheck size={16} />
                    <span>Issue E-Rx for this Patient</span>
                  </button>
                )}

                <div style={{ display: "flex", gap: "0.5rem", marginLeft: "auto" }}>
                  <button
                    type="button"
                    onClick={() => setSelectedAssessment(null)}
                    className="btn-secondary"
                    style={{ minHeight: "48px" }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary"
                    style={{ minHeight: "48px", padding: "0 1.25rem" }}
                  >
                    {isSubmitting ? "Submitting..." : "Sign & Finalize Verification"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

