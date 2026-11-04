"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Thermometer,
  AlertTriangle,
  FileText,
  Clock,
  UserCheck,
} from "lucide-react";

interface SymptomPreset {
  id: string;
  name: string;
  category: string;
  condition: string;
  confidence: number;
  urgency: "low" | "moderate";
  recommendation: string;
  prescriptionStatus: string;
}

const PRESETS: SymptomPreset[] = [
  {
    id: "throat",
    name: "Sore Throat & Hoarseness",
    category: "ENT / Respiratory",
    condition: "Acute Viral Pharyngitis (Mild)",
    confidence: 94,
    urgency: "low",
    recommendation: "Warm saline gargles, throat lozenges, and digital doctor review for anti-inflammatory support.",
    prescriptionStatus: "Eligible for Digital E-Prescription",
  },
  {
    id: "cough",
    name: "Persistent Dry Cough (3 Days)",
    category: "Respiratory",
    condition: "Post-Viral Bronchial Irritation",
    confidence: 91,
    urgency: "low",
    recommendation: "Oral hydration, honey-glycerol cough syrup, and routine telehealth evaluation if duration exceeds 5 days.",
    prescriptionStatus: "Eligible for Digital E-Prescription",
  },
  {
    id: "fever",
    name: "Low-Grade Fever (99.8°F) & Chills",
    category: "General Medicine",
    condition: "Mild Viral Syndrome / Flu Triage",
    confidence: 89,
    urgency: "low",
    recommendation: "Paracetamol 650mg as prescribed, electrolyte hydration, and monitoring temperature every 4 hours.",
    prescriptionStatus: "Verified Doctor Review Recommended",
  },
  {
    id: "headache",
    name: "Tension Headache & Eye Strain",
    category: "Neurology / General",
    condition: "Bilateral Tension-Type Headache",
    confidence: 96,
    urgency: "low",
    recommendation: "Ergonomic rest, screen breaks, hydration, and OTC analgesic consultation.",
    prescriptionStatus: "Routine Self-Care & Follow-Up",
  },
  {
    id: "gerd",
    name: "Acid Reflux & Post-Meal Heartburn",
    category: "Gastroenterology",
    condition: "Gastroesophageal Reflux (GERD)",
    confidence: 93,
    urgency: "low",
    recommendation: "Antacid suspension, smaller evening meals, avoid lying down immediately post meal.",
    prescriptionStatus: "Eligible for Digital E-Prescription",
  },
];

export default function AssessSymptomsSection() {
  const [selectedPreset, setSelectedPreset] = useState<SymptomPreset>(PRESETS[0]);
  const [severity, setSeverity] = useState<number>(4);

  return (
    <section className="landing-feature-section" id="assess-symptoms" aria-label="Assess Symptoms">
      <div>
        <div className="section-eyebrow">
          <Activity size={16} />
          <span>01 / Intelligent Symptom Triage</span>
        </div>
        <h2 className="section-headline">Assess Symptoms in Under Two Minutes</h2>
        <p className="section-desc">
          Appie’s clinical assessment engine evaluates routine health concerns with evidence-based diagnostic protocols, guiding you safely toward appropriate home management or doctor consultation.
        </p>
      </div>

      <div className="demo-showcase-box">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Interactive Clinical Simulator
            </span>
            <h3 style={{ fontSize: "1.35rem", fontWeight: 800, marginTop: "0.2rem" }}>
              Select a Routine Symptom to Test Triage:
            </h3>
          </div>

          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "0.82rem", color: "var(--color-accent)", fontWeight: 700 }}>
            <Sparkles size={16} />
            <span>Real-time Algorithmic Analysis</span>
          </div>
        </div>

        {/* Interactive Symptom Chips */}
        <div className="interactive-chip-grid" role="tablist">
          {PRESETS.map((preset) => {
            const isSelected = selectedPreset.id === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                className={`interactive-chip ${isSelected ? "selected" : ""}`}
                onClick={() => setSelectedPreset(preset)}
                aria-selected={isSelected}
                role="tab"
              >
                <span>{preset.name}</span>
                {isSelected && <CheckCircle2 size={16} color="var(--color-accent)" />}
              </button>
            );
          })}
        </div>

        {/* Severity Slider */}
        <div style={{ marginBottom: "1.75rem", padding: "1rem 1.25rem", backgroundColor: "var(--bg-surface)", borderRadius: "14px", border: "1px solid var(--border-subtle)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--text-primary)" }}>
              Symptom Severity Level: <strong style={{ color: "var(--color-accent)" }}>{severity}/10</strong>
            </span>
            <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
              {severity <= 3 ? "Mild discomfort" : severity <= 6 ? "Moderate routine concern" : "Noticeable acute discomfort"}
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={severity}
            onChange={(e) => setSeverity(Number(e.target.value))}
            style={{ width: "100%", accentColor: "var(--color-accent)", cursor: "pointer", height: "6px" }}
            aria-label="Adjust symptom severity"
          />
        </div>

        {/* Real-time Triage Outcome Card */}
        <div className="assessment-preview-card">
          <div className="triage-header-row">
            <div>
              <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
                Primary Diagnostic Impression
              </div>
              <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)", marginTop: "0.2rem" }}>
                {selectedPreset.condition}
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div className="triage-badge low">
                <ShieldCheck size={14} />
                <span>Low Risk Routine Concern</span>
              </div>

              <div className="triage-confidence-bar">
                <span>{selectedPreset.confidence}% Confidence</span>
                <div className="confidence-track">
                  <div
                    className="confidence-fill"
                    style={{ width: `${selectedPreset.confidence}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "1.5rem" }}>
            <div>
              <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase" }}>
                Clinical Recommendation
              </span>
              <p style={{ fontSize: "0.95rem", color: "var(--text-primary)", lineHeight: 1.55, marginTop: "0.35rem" }}>
                {selectedPreset.recommendation}
              </p>
            </div>

            <div style={{ borderLeft: "1px solid var(--border-subtle)", paddingLeft: "1.25rem" }}>
              <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase" }}>
                Prescription & Follow-Up
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", marginTop: "0.4rem", color: "var(--color-accent)", fontSize: "0.88rem", fontWeight: 700 }}>
                <FileText size={16} />
                <span>{selectedPreset.prescriptionStatus}</span>
              </div>
            </div>
          </div>

          {/* Action Row: Redirects to Patient Login / Registration */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", paddingTop: "1rem", borderTop: "1px solid var(--border-subtle)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.82rem", color: "var(--text-muted)" }}>
              <Clock size={15} />
              <span>Takes less than 2 minutes • No clinic waiting required</span>
            </div>

            <Link
              href="/register?role=patient"
              className="btn-primary"
              style={{
                minHeight: "48px",
                padding: "0 1.75rem",
                fontSize: "0.95rem",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.6rem",
              }}
              id="cta-assess-symptoms-redirect"
            >
              <span>Assess Symptoms Now</span>
              <ArrowRight size={17} strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
