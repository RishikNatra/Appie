"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AccountNavBar from "@/components/AccountNavBar";
import {
  HeartPulse,
  Activity,
  AlertCircle,
  Pill,
  FileText,
  Save,
  ArrowLeft,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Plus,
  X,
  Droplet,
  Scale,
  Ruler,
} from "lucide-react";
import { HealthProfile } from "@/lib/types";
import { AuthUser } from "@/lib/auth-service";

export default function EditHealthProfileView({ user }: { user: AuthUser }) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form Fields
  const [bloodGroup, setBloodGroup] = useState<string>("O+");
  const [heightCm, setHeightCm] = useState<number>(176);
  const [weightKg, setWeightKg] = useState<number>(72.5);
  const [systolicBp, setSystolicBp] = useState<number>(120);
  const [diastolicBp, setDiastolicBp] = useState<number>(80);
  const [isDiabetic, setIsDiabetic] = useState<boolean>(false);
  const [isSmoker, setIsSmoker] = useState<boolean>(false);

  // Dynamic Lists with Add/Remove
  const [medicalConditions, setMedicalConditions] = useState<string[]>([]);
  const [newCondition, setNewCondition] = useState("");

  const [allergies, setAllergies] = useState<string[]>([]);
  const [newAllergy, setNewAllergy] = useState("");

  const [currentMedications, setCurrentMedications] = useState<string[]>([]);
  const [newMedication, setNewMedication] = useState("");

  const [medicalHistoryNotes, setMedicalHistoryNotes] = useState("");

  useEffect(() => {
    fetch("/api/account/health-profile")
      .then((res) => res.json())
      .then((data) => {
        if (data.healthProfile) {
          const hp: HealthProfile = data.healthProfile;
          setBloodGroup(hp.bloodGroup || "O+");
          setHeightCm(hp.heightCm || 170);
          setWeightKg(hp.weightKg || 68);
          setSystolicBp(hp.systolicBp || 120);
          setDiastolicBp(hp.diastolicBp || 80);
          setIsDiabetic(Boolean(hp.isDiabetic));
          setIsSmoker(Boolean(hp.isSmoker));
          setMedicalConditions(hp.medicalConditions || []);
          setAllergies(hp.allergies || []);
          setCurrentMedications(hp.currentMedications || []);
          setMedicalHistoryNotes(hp.medicalHistoryNotes || "");
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const addCondition = () => {
    const val = newCondition.trim();
    if (val && !medicalConditions.includes(val)) {
      setMedicalConditions([...medicalConditions, val]);
      setNewCondition("");
    }
  };

  const removeCondition = (idx: number) => {
    setMedicalConditions(medicalConditions.filter((_, i) => i !== idx));
  };

  const addAllergy = () => {
    const val = newAllergy.trim();
    if (val && !allergies.includes(val)) {
      setAllergies([...allergies, val]);
      setNewAllergy("");
    }
  };

  const removeAllergy = (idx: number) => {
    setAllergies(allergies.filter((_, i) => i !== idx));
  };

  const addMedication = () => {
    const val = newMedication.trim();
    if (val && !currentMedications.includes(val)) {
      setCurrentMedications([...currentMedications, val]);
      setNewMedication("");
    }
  };

  const removeMedication = (idx: number) => {
    setCurrentMedications(currentMedications.filter((_, i) => i !== idx));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/account/health-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bloodGroup,
          heightCm: Number(heightCm),
          weightKg: Number(weightKg),
          systolicBp: Number(systolicBp),
          diastolicBp: Number(diastolicBp),
          isDiabetic,
          isSmoker,
          medicalConditions,
          allergies,
          currentMedications,
          medicalHistoryNotes: medicalHistoryNotes.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setFeedback({ type: "error", text: data.error || "Failed to update health profile." });
      } else {
        setFeedback({ type: "success", text: "Health profile saved successfully." });
        setTimeout(() => {
          router.push("/account/health-profile");
          router.refresh();
        }, 800);
      }
    } catch {
      setFeedback({ type: "error", text: "Network error occurred." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "4rem 0" }}>
        <Loader2 size={36} className="animate-spin" color="var(--color-accent)" />
      </div>
    );
  }

  return (
    <div style={{ width: "100%", maxWidth: "860px", margin: "0 auto" }}>
      <AccountNavBar role={user.role} />

      <Link href="/account/health-profile" className="back-link">
        <ArrowLeft size={18} />
        <span>Back to Health Overview</span>
      </Link>

      <div className="section-header-wrap">
        <h1 className="auth-title" style={{ textAlign: "left" }}>Update Health Information</h1>
        <p className="auth-subtitle" style={{ textAlign: "left" }}>
          Maintain accurate vitals, allergies, and daily medications for clinical accuracy
        </p>
      </div>

      {feedback && (
        <div className={`alert-box ${feedback.type === "success" ? "alert-success" : "alert-error"}`}>
          {feedback.type === "success" ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
          <span>{feedback.text}</span>
        </div>
      )}

      <form onSubmit={handleSave}>
        {/* Medical Information Form (Vitals & Indicators) */}
        <div className="dashboard-card" style={{ textAlign: "left", marginBottom: "1.75rem", padding: "2rem" }}>
          <h2 className="section-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Activity size={20} color="var(--color-accent)" />
            <span>1. Clinical Indicators & Vitals</span>
          </h2>
          <p className="section-desc" style={{ marginBottom: "1.5rem" }}>
            Physical measurements and cardiovascular metrics
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
            <div className="form-group">
              <label className="form-label">Blood Group</label>
              <select
                className="form-select"
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Height (cm)</label>
              <input
                type="number"
                min="50"
                max="250"
                className="form-input no-icon"
                value={heightCm}
                onChange={(e) => setHeightCm(Number(e.target.value))}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Weight (kg)</label>
              <input
                type="number"
                step="0.5"
                min="10"
                max="300"
                className="form-input no-icon"
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "0.5rem" }}>
            <div className="form-group">
              <label className="form-label">Systolic BP (mmHg)</label>
              <input
                type="number"
                min="60"
                max="240"
                className="form-input no-icon"
                value={systolicBp}
                onChange={(e) => setSystolicBp(Number(e.target.value))}
                placeholder="120"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Diastolic BP (mmHg)</label>
              <input
                type="number"
                min="40"
                max="160"
                className="form-input no-icon"
                value={diastolicBp}
                onChange={(e) => setDiastolicBp(Number(e.target.value))}
                placeholder="80"
              />
            </div>
          </div>

          {/* Lifestyle Toggles */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginTop: "1rem" }}>
            <div
              className="switch-wrapper"
              onClick={() => setIsDiabetic(!isDiabetic)}
            >
              <div className={`switch-track ${isDiabetic ? "checked" : ""}`}>
                <div className="switch-thumb" />
              </div>
              <span style={{ fontSize: "0.92rem", fontWeight: 600 }}>Diagnosed Diabetic</span>
            </div>

            <div
              className="switch-wrapper"
              onClick={() => setIsSmoker(!isSmoker)}
            >
              <div className={`switch-track ${isSmoker ? "checked" : ""}`}>
                <div className="switch-thumb" />
              </div>
              <span style={{ fontSize: "0.92rem", fontWeight: 600 }}>Active Tobacco User</span>
            </div>
          </div>
        </div>

        {/* Chronic Conditions Component */}
        <div className="dashboard-card" style={{ textAlign: "left", marginBottom: "1.75rem", padding: "2rem" }}>
          <h2 className="section-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <AlertCircle size={20} color="var(--color-accent)" />
            <span>2. Chronic Medical Conditions</span>
          </h2>
          <p className="section-desc" style={{ marginBottom: "1.25rem" }}>
            Add any recurring or chronic diagnoses (e.g. Hypertension, Asthma, Migraine)
          </p>

          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
            <input
              type="text"
              className="form-input no-icon"
              placeholder="e.g. Hypertension"
              value={newCondition}
              onChange={(e) => setNewCondition(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addCondition();
                }
              }}
            />
            <button
              type="button"
              className="btn-secondary"
              onClick={addCondition}
              style={{ minHeight: "48px", flexShrink: 0 }}
            >
              <Plus size={18} />
              <span>Add</span>
            </button>
          </div>

          <div className="chip-container">
            {medicalConditions.map((cond, idx) => (
              <span key={idx} className="chip-item">
                <span>{cond}</span>
                <button
                  type="button"
                  className="chip-delete-btn"
                  onClick={() => removeCondition(idx)}
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Allergy Information Component */}
        <div className="dashboard-card" style={{ textAlign: "left", marginBottom: "1.75rem", padding: "2rem" }}>
          <h2 className="section-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <AlertTriangle size={20} color="var(--color-error)" />
            <span>3. Known Allergies</span>
          </h2>
          <p className="section-desc" style={{ marginBottom: "1.25rem" }}>
            List any drug, food, or environmental allergies to avoid adverse interactions
          </p>

          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
            <input
              type="text"
              className="form-input no-icon"
              placeholder="e.g. Penicillin, Peanuts, Sulfa drugs"
              value={newAllergy}
              onChange={(e) => setNewAllergy(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addAllergy();
                }
              }}
            />
            <button
              type="button"
              className="btn-secondary"
              onClick={addAllergy}
              style={{ minHeight: "48px", flexShrink: 0 }}
            >
              <Plus size={18} />
              <span>Add</span>
            </button>
          </div>

          <div className="chip-container">
            {allergies.map((allergy, idx) => (
              <span
                key={idx}
                className="chip-item"
                style={{ borderColor: "rgba(239, 68, 68, 0.4)", color: "var(--color-error)" }}
              >
                <span>{allergy}</span>
                <button
                  type="button"
                  className="chip-delete-btn"
                  onClick={() => removeAllergy(idx)}
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Medication Information Component */}
        <div className="dashboard-card" style={{ textAlign: "left", marginBottom: "1.75rem", padding: "2rem" }}>
          <h2 className="section-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Pill size={20} color="var(--color-accent)" />
            <span>4. Current Routine Medications</span>
          </h2>
          <p className="section-desc" style={{ marginBottom: "1.25rem" }}>
            Medicines you currently take on a daily or recurring basis
          </p>

          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
            <input
              type="text"
              className="form-input no-icon"
              placeholder="e.g. Amlodipine 5mg once daily"
              value={newMedication}
              onChange={(e) => setNewMedication(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addMedication();
                }
              }}
            />
            <button
              type="button"
              className="btn-secondary"
              onClick={addMedication}
              style={{ minHeight: "48px", flexShrink: 0 }}
            >
              <Plus size={18} />
              <span>Add</span>
            </button>
          </div>

          <div className="chip-container">
            {currentMedications.map((med, idx) => (
              <span key={idx} className="chip-item">
                <span>{med}</span>
                <button
                  type="button"
                  className="chip-delete-btn"
                  onClick={() => removeMedication(idx)}
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Medical History Component */}
        <div className="dashboard-card" style={{ textAlign: "left", marginBottom: "1.75rem", padding: "2rem" }}>
          <h2 className="section-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <FileText size={20} color="var(--color-accent)" />
            <span>5. Surgical History & Clinical Notes</span>
          </h2>
          <p className="section-desc" style={{ marginBottom: "1.25rem" }}>
            Prior operations, major hospitalizations, or pertinent family medical history
          </p>

          <textarea
            className="form-textarea"
            rows={4}
            placeholder="e.g. Appendectomy in 2018. No complications. Routine childhood immunizations complete."
            value={medicalHistoryNotes}
            onChange={(e) => setMedicalHistoryNotes(e.target.value)}
          />
        </div>

        {/* Health Information Save Component */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
          <Link href="/account/health-profile" className="btn-secondary" style={{ textDecoration: "none" }}>
            Cancel
          </Link>
          <button
            type="submit"
            className="btn-primary"
            id="btn-save-health-profile"
            disabled={saving}
            style={{ width: "auto", minWidth: "160px" }}
          >
            {saving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>Save Health Information</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

