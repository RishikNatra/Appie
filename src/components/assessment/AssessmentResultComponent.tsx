"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  Stethoscope,
  Pill,
  Clock,
  ArrowRight,
  CheckCircle2,
  Share2,
  Printer,
  ChevronRight,
  Info,
  Calendar,
} from "lucide-react";
import { HealthAssessmentRecord } from "@/lib/types";

interface AssessmentResultProps {
  assessment: HealthAssessmentRecord;
  onConsultationPrompt?: () => void;
}

export default function AssessmentResultComponent({
  assessment,
  onConsultationPrompt,
}: AssessmentResultProps) {
  const [copied, setCopied] = useState(false);

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case "emergency":
        return {
          icon: <AlertOctagon size={16} />,
          text: "Critical Emergency Flag",
          bg: "rgba(239, 68, 68, 0.2)",
          color: "var(--color-error)",
          border: "var(--color-error)",
        };
      case "high":
        return {
          icon: <AlertTriangle size={16} />,
          text: "High Clinical Attention Needed",
          bg: "rgba(249, 115, 22, 0.15)",
          color: "#f97316",
          border: "rgba(249, 115, 22, 0.4)",
        };
      case "moderate":
        return {
          icon: <Clock size={16} />,
          text: "Moderate Risk (Telehealth Advised)",
          bg: "rgba(255, 178, 0, 0.15)",
          color: "var(--color-accent)",
          border: "rgba(255, 178, 0, 0.4)",
        };
      default:
        return {
          icon: <CheckCircle2 size={16} />,
          text: "Routine / Low Risk (Manageable Digitally)",
          bg: "rgba(34, 197, 94, 0.15)",
          color: "var(--color-success)",
          border: "rgba(34, 197, 94, 0.4)",
        };
    }
  };

  const urgencyInfo = getUrgencyBadge(assessment.urgencyLevel);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ width: "100%", maxWidth: "960px", margin: "0 auto" }}>
      {/* Header with Title & Action Tools */}
      <div
        className="dashboard-card"
        style={{
          textAlign: "left",
          marginBottom: "1.75rem",
          padding: "2rem 2.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1.5rem",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
            <Sparkles size={24} color="var(--color-accent)" />
            <h1 style={{ fontSize: "1.6rem", fontWeight: 800 }}>{assessment.title}</h1>
          </div>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            Generated on {new Date(assessment.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })} • Reference ID: #{assessment.id.slice(-6).toUpperCase()}
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button
            type="button"
            onClick={handleShare}
            className="btn-secondary"
            style={{ minHeight: "44px", padding: "0 1rem", fontSize: "0.85rem" }}
          >
            <Share2 size={16} />
            <span>{copied ? "Link Copied!" : "Share Summary"}</span>
          </button>
        </div>
      </div>

      {/* Confidence / Assessment Indicator Component & Triage Classification */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr",
          gap: "1.5rem",
          marginBottom: "1.75rem",
        }}
      >
        {/* Urgency Classification Card */}
        <div
          className="dashboard-card"
          style={{
            textAlign: "left",
            padding: "1.75rem",
            border: `1.5px solid ${urgencyInfo.border}`,
            backgroundColor: urgencyInfo.bg,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: urgencyInfo.color, marginBottom: "0.5rem" }}>
            {urgencyInfo.icon}
            <span style={{ fontSize: "0.85rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Clinical Triage Urgency Level
            </span>
          </div>

          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.5rem" }}>
            {urgencyInfo.text}
          </h2>

          <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
            Based on severity patterns across {assessment.symptoms.length} reported symptoms and demographic risk factors.
          </p>
        </div>

        {/* Confidence Indicator Card */}
        <div className="dashboard-card" style={{ textAlign: "left", padding: "1.75rem" }}>
          <span style={{ fontSize: "0.82rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)", display: "block", marginBottom: "0.4rem" }}>
            Assessment Confidence Score
          </span>

          <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "2.3rem", fontWeight: 800, color: "var(--color-accent)" }}>
              {assessment.confidenceScore}%
            </span>
            <span style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>clinical match accuracy</span>
          </div>

          <div className="progress-container" style={{ margin: "0.5rem 0" }}>
            <div className="progress-fill" style={{ width: `${assessment.confidenceScore}%` }} />
          </div>

          <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
            Correlated with established differential diagnostic algorithms
          </span>
        </div>
      </div>

      {/* Assessment Summary Component */}
      <div className="dashboard-card" style={{ textAlign: "left", padding: "2rem", marginBottom: "1.75rem" }}>
        <h2 className="section-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Info size={20} color="var(--color-accent)" />
          <span>Clinical Assessment Summary</span>
        </h2>
        <p style={{ fontSize: "1rem", lineHeight: 1.65, color: "var(--text-primary)", backgroundColor: "var(--bg-surface)", padding: "1.25rem 1.5rem", borderRadius: "14px", border: "1px solid var(--border-subtle)" }}>
          {assessment.assessmentSummary}
        </p>
      </div>

      {/* Possible Condition Component */}
      <div className="dashboard-card" style={{ textAlign: "left", padding: "2rem", marginBottom: "1.75rem" }}>
        <h2 className="section-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
          <Stethoscope size={20} color="var(--color-accent)" />
          <span>Differential Possible Conditions</span>
        </h2>
        <p className="section-desc" style={{ marginBottom: "1.5rem" }}>
          Potential underlying clinical explanations ordered by symptom correlation
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {assessment.possibleConditions.map((cond, idx) => (
            <div
              key={idx}
              style={{
                padding: "1.25rem 1.5rem",
                borderRadius: "16px",
                backgroundColor: "var(--bg-surface)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 800 }}>{cond.name}</h3>
                <span
                  style={{
                    fontSize: "0.82rem",
                    fontWeight: 800,
                    color: "var(--color-accent)",
                    backgroundColor: "var(--color-accent-subtle)",
                    padding: "0.25rem 0.65rem",
                    borderRadius: "9999px",
                    border: "1px solid rgba(255, 178, 0, 0.4)",
                  }}
                >
                  {cond.matchPercentage}% Match
                </span>
              </div>

              <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>
                {cond.description}
              </p>

              <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", backgroundColor: "var(--bg-card)", padding: "0.6rem 0.85rem", borderRadius: "8px" }}>
                <strong>Clinical rationale:</strong> {cond.explanation}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendation Component */}
      <div className="dashboard-card" style={{ textAlign: "left", padding: "2rem", marginBottom: "1.75rem" }}>
        <h2 className="section-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
          <CheckCircle2 size={20} color="var(--color-success)" />
          <span>Evidence-Based Self-Care Recommendations</span>
        </h2>
        <p className="section-desc" style={{ marginBottom: "1.25rem" }}>
          Recommended conservative supportive measures to promote recovery
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {assessment.recommendations.map((rec, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "0.75rem",
                padding: "0.85rem 1rem",
                borderRadius: "12px",
                backgroundColor: "var(--bg-surface)",
                fontSize: "0.92rem",
                lineHeight: 1.5,
              }}
            >
              <span style={{ fontWeight: 800, color: "var(--color-accent)", flexShrink: 0 }}>
                {idx + 1}.
              </span>
              <span>{rec}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Next-Step Action Component & Professional Consultation Prompt Component */}
      <div
        className="dashboard-card"
        style={{
          textAlign: "left",
          padding: "2.25rem",
          marginBottom: "2.5rem",
          border: "1.5px solid var(--color-accent)",
          backgroundColor: "var(--color-accent-subtle)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.5rem" }}>
          <Stethoscope size={24} color="var(--color-accent)" />
          <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--text-primary)" }}>
            Next-Step Action & Professional Consultation
          </h2>
        </div>

        <p style={{ fontSize: "1rem", lineHeight: 1.6, color: "var(--text-primary)", marginBottom: "1.5rem" }}>
          {assessment.nextStepAction}
        </p>

        {/* Professional Consultation Prompt Component */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
            paddingTop: "1.25rem",
            borderTop: "1px solid rgba(255, 178, 0, 0.3)",
          }}
        >
          <div>
            <div style={{ fontSize: "0.95rem", fontWeight: 700 }}>
              Recommended Specialization: <span style={{ color: "var(--color-primary)" }}>{assessment.recommendedSpecialization}</span>
            </div>
            <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginTop: "2px" }}>
              Connect with verified doctors on Appie for an official digital consultation & e-prescription.
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <Link
              href={`/consultations?specialization=${encodeURIComponent(assessment.recommendedSpecialization)}`}
              className="btn-primary"
              id="btn-book-consult-from-assessment"
              style={{ width: "auto", minHeight: "48px", padding: "0 1.5rem", textDecoration: "none" }}
            >
              <Stethoscope size={18} />
              <span>Consult with {assessment.recommendedSpecialization}</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

