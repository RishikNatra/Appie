"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  Activity,
  HeartPulse,
  TrendingUp,
  Clock,
  Plus,
  ArrowRight,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Stethoscope,
  ChevronRight,
  Loader2,
} from "lucide-react";
import SymptomEntryComponent from "./SymptomEntryComponent";
import SymptomTrackingComponent from "./SymptomTrackingComponent";
import AssessmentResultComponent from "./AssessmentResultComponent";
import { HealthAssessmentRecord } from "@/lib/types";
import { AuthUser } from "@/lib/auth-service";

interface DashboardProps {
  user: AuthUser;
}

export default function HealthAssessmentDashboard({ user }: { user: AuthUser }) {
  // Navigation tabs in Assessment System
  const [activeTab, setActiveTab] = useState<"overview" | "new_assessment" | "tracking" | "result">("overview");

  const [assessments, setAssessments] = useState<HealthAssessmentRecord[]>([]);
  const [activeAssessment, setActiveAssessment] = useState<HealthAssessmentRecord | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAssessments = () => {
    fetch("/api/assessment/list")
      .then((res) => res.json())
      .then((data) => {
        if (data.assessments) {
          setAssessments(data.assessments);
          if (data.assessments.length > 0 && !activeAssessment) {
            setActiveAssessment(data.assessments[0]);
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAssessments();
  }, []);

  const handleAssessmentCreated = (newAsmt: HealthAssessmentRecord) => {
    setAssessments([newAsmt, ...assessments]);
    setActiveAssessment(newAsmt);
    setActiveTab("result");
  };

  return (
    <div style={{ width: "100%", marginTop: "1rem" }}>
      {/* Assessment System Navigation Tabs */}
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          overflowX: "auto",
          paddingBottom: "0.75rem",
          marginBottom: "1.75rem",
          borderBottom: "1px solid var(--border-subtle)",
        }}
        role="tablist"
        aria-label="Health Assessment Sub-Navigation"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "overview"}
          onClick={() => setActiveTab("overview")}
          className={`account-nav-tab ${activeTab === "overview" ? "active" : ""}`}
        >
          <Activity size={18} />
          <span>Assessment Dashboard</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "new_assessment"}
          onClick={() => setActiveTab("new_assessment")}
          className={`account-nav-tab ${activeTab === "new_assessment" ? "active" : ""}`}
          id="tab-new-assessment"
        >
          <Plus size={18} />
          <span>New Symptom Assessment</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "tracking"}
          onClick={() => setActiveTab("tracking")}
          className={`account-nav-tab ${activeTab === "tracking" ? "active" : ""}`}
          id="tab-symptom-tracking"
        >
          <TrendingUp size={18} />
          <span>Symptom Tracking & Progress</span>
        </button>

        {activeAssessment && (
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "result"}
            onClick={() => setActiveTab("result")}
            className={`account-nav-tab ${activeTab === "result" ? "active" : ""}`}
            id="tab-assessment-result"
          >
            <Sparkles size={18} />
            <span>Latest Clinical Result</span>
          </button>
        )}
      </div>

      {/* TAB 1: OVERVIEW & RECENT ASSESSMENTS */}
      {activeTab === "overview" && (
        <div>
          {/* Quick Start Assessment Hero */}
          <div
            className="dashboard-card"
            style={{
              textAlign: "left",
              padding: "2.25rem 2.5rem",
              marginBottom: "2rem",
              background: "linear-gradient(135deg, var(--bg-card), var(--bg-surface))",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "1.5rem" }}>
              <div style={{ maxWidth: "600px" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", padding: "0.25rem 0.75rem", borderRadius: "9999px", backgroundColor: "var(--color-accent-subtle)", color: "var(--color-accent)", fontSize: "0.78rem", fontWeight: 700, marginBottom: "0.75rem", border: "1px solid rgba(255, 178, 0, 0.3)" }}>
                  <Sparkles size={14} />
                  <span>Routine Health Assessment System</span>
                </div>

                <h2 style={{ fontSize: "1.85rem", fontWeight: 800, marginBottom: "0.5rem" }}>
                  Got a health concern? Assess symptoms in minutes.
                </h2>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>
                  Enter your current routine symptoms (e.g. sore throat, cough, mild fever, digestive discomfort) to receive an immediate triage evaluation, differential possibilities, conservative care advice, and connection with verified doctors.
                </p>

                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                  <button
                    type="button"
                    onClick={() => setActiveTab("new_assessment")}
                    className="btn-primary"
                    id="btn-hero-start-assessment"
                    style={{ width: "auto", minHeight: "48px", padding: "0 1.5rem" }}
                  >
                    <Plus size={18} />
                    <span>Start New Health Assessment</span>
                    <ArrowRight size={18} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("tracking")}
                    className="btn-secondary"
                    style={{ minHeight: "48px" }}
                  >
                    <TrendingUp size={16} />
                    <span>View Symptom Progress</span>
                  </button>
                </div>
              </div>

              {/* Quick Triage Stat Box */}
              <div
                style={{
                  padding: "1.5rem",
                  borderRadius: "18px",
                  backgroundColor: "var(--bg-input)",
                  border: "1px solid var(--border-subtle)",
                  minWidth: "220px",
                }}
              >
                <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700, marginBottom: "0.5rem" }}>
                  Clinical Assessments
                </div>
                <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--color-accent)" }}>
                  {assessments.length}
                </div>
                <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                  Total evaluations recorded
                </p>
              </div>
            </div>
          </div>

          {/* Recent Assessments List */}
          <div className="section-header-wrap" style={{ marginBottom: "1rem" }}>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 800 }}>Recent Health Assessments</h2>
            <p className="section-desc">Review prior evaluations and differential clinical outcomes</p>
          </div>

          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "3rem 0" }}>
              <Loader2 size={32} className="animate-spin" color="var(--color-accent)" />
            </div>
          ) : assessments.length === 0 ? (
            <div className="dashboard-card" style={{ padding: "3rem", textAlign: "center" }}>
              <HeartPulse size={36} color="var(--color-accent)" style={{ margin: "0 auto 1rem" }} />
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700 }}>No Assessments Generated Yet</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", maxWidth: "420px", margin: "0 auto 1.5rem" }}>
                Click below to select symptoms, check severity, and receive an instant triage assessment.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab("new_assessment")}
                className="btn-primary"
                style={{ width: "auto", minHeight: "44px", margin: "0 auto" }}
              >
                <Plus size={16} />
                <span>Begin Assessment</span>
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "3rem" }}>
              {assessments.map((asmt) => (
                <div
                  key={asmt.id}
                  className="dashboard-card"
                  style={{
                    textAlign: "left",
                    padding: "1.5rem 1.75rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "1rem",
                    cursor: "pointer",
                    transition: "all 250ms ease-in-out",
                  }}
                  onClick={() => {
                    setActiveAssessment(asmt);
                    setActiveTab("result");
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.35rem" }}>
                      <h3 style={{ fontSize: "1.15rem", fontWeight: 800 }}>{asmt.title}</h3>
                      <span
                        style={{
                          fontSize: "0.72rem",
                          fontWeight: 800,
                          padding: "0.2rem 0.55rem",
                          borderRadius: "9999px",
                          backgroundColor: asmt.urgencyLevel === "low" ? "rgba(34, 197, 94, 0.15)" : "rgba(255, 178, 0, 0.15)",
                          color: asmt.urgencyLevel === "low" ? "var(--color-success)" : "var(--color-accent)",
                          textTransform: "uppercase",
                        }}
                      >
                        {asmt.urgencyLevel} risk
                      </span>
                    </div>

                    <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", marginBottom: "0.5rem", maxWidth: "680px" }}>
                      {asmt.assessmentSummary.slice(0, 160)}...
                    </p>

                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", fontSize: "0.78rem", color: "var(--text-muted)" }}>
                      <span>Symptoms evaluated: {asmt.symptoms.length}</span>
                      <span>Confidence: {asmt.confidenceScore}%</span>
                      <span>{new Date(asmt.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <button
                      type="button"
                      className="btn-secondary"
                      style={{ minHeight: "40px", fontSize: "0.85rem", padding: "0 1rem" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveAssessment(asmt);
                        setActiveTab("result");
                      }}
                    >
                      <span>View Outcome</span>
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SYMPTOM INPUT MODULE (Symptom Entry Screen) */}
      {activeTab === "new_assessment" && (
        <div>
          <SymptomEntryComponent onAssessmentCreated={handleAssessmentCreated} />
        </div>
      )}

      {/* TAB 3: SYMPTOM TRACKING MODULE (Symptom Overview Screen & Progress Screen) */}
      {activeTab === "tracking" && (
        <div>
          <SymptomTrackingComponent />
        </div>
      )}

      {/* TAB 4: ASSESSMENT MODULE (Assessment Result Screen) */}
      {activeTab === "result" && activeAssessment && (
        <div>
          <AssessmentResultComponent
            assessment={activeAssessment}
            onConsultationPrompt={() => {
              // Can navigate to consultation scheduling or doctor discovery
            }}
          />
        </div>
      )}
    </div>
  );
}

