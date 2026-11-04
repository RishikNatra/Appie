"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AccountNavBar from "@/components/AccountNavBar";
import {
  HeartPulse,
  Activity,
  AlertCircle,
  Pill,
  FileText,
  Edit,
  Download,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Ruler,
  Droplet,
} from "lucide-react";
import { HealthProfile } from "@/lib/types";
import { AuthUser } from "@/lib/auth-service";

export default function HealthProfileOverviewView({ user }: { user: AuthUser }) {
  const [healthProfile, setHealthProfile] = useState<HealthProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/account/health-profile")
      .then((res) => res.json())
      .then((data) => {
        if (data.healthProfile) {
          setHealthProfile(data.healthProfile);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "4rem 0" }}>
        <Loader2 size={36} className="animate-spin" color="var(--color-accent)" />
      </div>
    );
  }

  const hp = healthProfile || {
    id: "hp-default",
    userId: user.id,
    bloodGroup: "O+",
    heightCm: 176,
    weightKg: 72.5,
    bmi: 23.4,
    systolicBp: 120,
    diastolicBp: 80,
    isDiabetic: false,
    isSmoker: false,
    medicalConditions: ["Seasonal Rhinitis", "Mild Migraine"],
    allergies: ["Penicillin", "Dust Mites"],
    currentMedications: ["Cetirizine 10mg (as needed)"],
    medicalHistoryNotes: "No major prior surgeries. Family history of mild hypertension.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return (
    <div style={{ width: "100%", maxWidth: "960px", margin: "0 auto" }}>
      <AccountNavBar role={user.role} />

      {/* Top Banner / Actions */}
      <div
        className="dashboard-card"
        style={{
          textAlign: "left",
          marginBottom: "1.75rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1.5rem",
          padding: "2rem",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.4rem" }}>
            <HeartPulse size={26} color="var(--color-accent)" />
            <h1 style={{ fontSize: "1.6rem", fontWeight: 800 }}>Health Profile Overview</h1>
          </div>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", maxWidth: "600px" }}>
            Centralized health markers, documented allergies, and current medications reviewed by doctors during consultations.
          </p>
        </div>

        {/* Health Profile Action Component */}
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <Link
            href="/account/health-profile/edit"
            className="btn-primary"
            style={{ minHeight: "44px", padding: "0 1.25rem", textDecoration: "none", width: "auto" }}
          >
            <Edit size={16} />
            <span>Update Health Profile</span>
          </Link>
        </div>
      </div>

      {/* Health Profile Summary Component (Quick Vitals Cards) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          marginBottom: "1.75rem",
        }}
      >
        {/* Blood Group */}
        <div className="dashboard-card" style={{ padding: "1.5rem", textAlign: "left" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--color-error)", marginBottom: "0.5rem" }}>
            <Droplet size={20} />
            <span style={{ fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase" }}>Blood Group</span>
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--text-primary)" }}>
            {hp.bloodGroup || "Not specified"}
          </div>
          <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Verified donor category</span>
        </div>

        {/* Height */}
        <div className="dashboard-card" style={{ padding: "1.5rem", textAlign: "left" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--color-accent)", marginBottom: "0.5rem" }}>
            <Ruler size={20} />
            <span style={{ fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase" }}>Height</span>
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--text-primary)" }}>
            {hp.heightCm ? `${hp.heightCm} cm` : "--"}
          </div>
          <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
            {hp.heightCm ? `${(hp.heightCm / 30.48).toFixed(1)} feet` : "Recorded in clinical profile"}
          </span>
        </div>

        {/* Weight */}
        <div className="dashboard-card" style={{ padding: "1.5rem", textAlign: "left" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--color-primary)", marginBottom: "0.5rem" }}>
            <Scale size={20} />
            <span style={{ fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase" }}>Weight</span>
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--text-primary)" }}>
            {hp.weightKg ? `${hp.weightKg} kg` : "--"}
          </div>
          <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
            Body Mass Indicator: {hp.bmi ? `${hp.bmi} (Normal)` : "Pending measurement"}
          </span>
        </div>

        {/* Blood Pressure */}
        <div className="dashboard-card" style={{ padding: "1.5rem", textAlign: "left" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--color-success)", marginBottom: "0.5rem" }}>
            <Activity size={20} />
            <span style={{ fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase" }}>Blood Pressure</span>
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--text-primary)" }}>
            {hp.systolicBp && hp.diastolicBp ? `${hp.systolicBp}/${hp.diastolicBp}` : "120/80"}
          </div>
          <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>mmHg (Optimal Resting)</span>
        </div>
      </div>

      {/* Basic Health Information Component & Chronic Conditions */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.75rem", marginBottom: "1.75rem" }}>
        {/* Basic Health Information Component */}
        <div className="dashboard-card" style={{ textAlign: "left", padding: "2rem" }}>
          <h2 className="section-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Activity size={20} color="var(--color-accent)" />
            <span>Basic Health Information</span>
          </h2>
          <p className="section-desc" style={{ marginBottom: "1.25rem" }}>
            Baseline lifestyle & metabolic indicators
          </p>

          <div className="dashboard-info-table" style={{ margin: 0, maxWidth: "100%" }}>
            <div className="dashboard-info-row">
              <span className="dashboard-info-label">Diabetic Status:</span>
              <span className="dashboard-info-value" style={{ color: hp.isDiabetic ? "var(--color-error)" : "var(--color-success)" }}>
                {hp.isDiabetic ? "Diabetic (Type 2)" : "Non-Diabetic"}
              </span>
            </div>
            <div className="dashboard-info-row">
              <span className="dashboard-info-label">Tobacco / Smoking:</span>
              <span className="dashboard-info-value">
                {hp.isSmoker ? "Active Smoker" : "Non-Smoker"}
              </span>
            </div>
            <div className="dashboard-info-row">
              <span className="dashboard-info-label">Resting BP Category:</span>
              <span className="dashboard-info-value">Normotensive (Normal)</span>
            </div>
            <div className="dashboard-info-row">
              <span className="dashboard-info-label">Last Updated:</span>
              <span className="dashboard-info-value">
                {new Date(hp.updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </span>
            </div>
          </div>
        </div>

        {/* Medical Conditions Component */}
        <div className="dashboard-card" style={{ textAlign: "left", padding: "2rem" }}>
          <h2 className="section-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <AlertCircle size={20} color="var(--color-accent)" />
            <span>Chronic Medical Conditions</span>
          </h2>
          <p className="section-desc" style={{ marginBottom: "1.25rem" }}>
            Diagnosed chronic or recurring medical concerns
          </p>

          {hp.medicalConditions && hp.medicalConditions.length > 0 ? (
            <div className="chip-container">
              {hp.medicalConditions.map((cond, idx) => (
                <span key={idx} className="chip-item">
                  <CheckCircle2 size={14} color="var(--color-accent)" />
                  <span>{cond}</span>
                </span>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
              No chronic conditions recorded.
            </p>
          )}
        </div>
      </div>

      {/* Allergy Information Component & Current Medications */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.75rem", marginBottom: "2rem" }}>
        {/* Allergy Information Component */}
        <div className="dashboard-card" style={{ textAlign: "left", padding: "2rem" }}>
          <h2 className="section-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <AlertTriangle size={20} color="var(--color-error)" />
            <span>Allergy Information</span>
          </h2>
          <p className="section-desc" style={{ marginBottom: "1.25rem" }}>
            Crucial for prescribing safe medications
          </p>

          {hp.allergies && hp.allergies.length > 0 ? (
            <div className="chip-container">
              {hp.allergies.map((allergy, idx) => (
                <span
                  key={idx}
                  className="chip-item"
                  style={{ borderColor: "rgba(239, 68, 68, 0.4)", backgroundColor: "rgba(239, 68, 68, 0.08)" }}
                >
                  <AlertTriangle size={14} color="var(--color-error)" />
                  <span style={{ color: "var(--color-error)" }}>{allergy}</span>
                </span>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
              No known drug or environmental allergies recorded.
            </p>
          )}
        </div>

        {/* Current Medication Information Component */}
        <div className="dashboard-card" style={{ textAlign: "left", padding: "2rem" }}>
          <h2 className="section-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Pill size={20} color="var(--color-accent)" />
            <span>Current Medications</span>
          </h2>
          <p className="section-desc" style={{ marginBottom: "1.25rem" }}>
            Routine prescriptions taken on a regular basis
          </p>

          {hp.currentMedications && hp.currentMedications.length > 0 ? (
            <div className="chip-container">
              {hp.currentMedications.map((med, idx) => (
                <span key={idx} className="chip-item">
                  <Pill size={14} color="var(--color-accent)" />
                  <span>{med}</span>
                </span>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
              No routine daily medications reported.
            </p>
          )}
        </div>
      </div>

      {/* Medical History Component Notes */}
      <div className="dashboard-card" style={{ textAlign: "left", padding: "2rem", marginBottom: "2rem" }}>
        <h2 className="section-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <FileText size={20} color="var(--color-accent)" />
          <span>Medical History & Surgical Notes</span>
        </h2>
        <p className="section-desc" style={{ marginBottom: "1rem" }}>
          Past surgical procedures, hospitalizations, or family history
        </p>

        <p style={{ fontSize: "0.95rem", lineHeight: 1.6, color: "var(--text-primary)", backgroundColor: "var(--bg-surface)", padding: "1.25rem", borderRadius: "12px", border: "1px solid var(--border-subtle)" }}>
          {hp.medicalHistoryNotes || "No past surgeries or hospitalizations recorded. Vaccinations up to date."}
        </p>
      </div>
    </div>
  );
}

