"use client";

import { useState } from "react";
import { PrescribedMedicineItem, PrescriptionRecord } from "@/lib/types";
import { MEDICATIONS_CATALOG } from "@/lib/medications-catalog";
import {
  X,
  Plus,
  Trash2,
  ShieldCheck,
  FileCheck,
  AlertCircle,
} from "lucide-react";

interface DoctorIssuePrescriptionModalProps {
  patientId: string;
  patientName?: string;
  appointmentId?: string;
  onClose: () => void;
  onSuccess: (prescription: PrescriptionRecord) => void;
}

export default function DoctorIssuePrescriptionModal({
  patientId,
  patientName,
  appointmentId,
  onClose,
  onSuccess,
}: DoctorIssuePrescriptionModalProps) {
  const [diagnosis, setDiagnosis] = useState("Acute Viral Upper Respiratory Infection");
  const [medications, setMedications] = useState<PrescribedMedicineItem[]>([
    {
      id: "med-1",
      medicationId: "med-paracetamol-650",
      medicineName: "Dolo 650 (Paracetamol)",
      dosage: "650 mg",
      frequency: "1 tablet thrice daily after food (1-1-1)",
      duration: "5 days",
      instructions: "Take SOS for body pain or fever > 100°F.",
    },
    {
      id: "med-2",
      medicationId: "med-cetirizine-10",
      medicineName: "Cetzine 10",
      dosage: "10 mg",
      frequency: "1 tablet once daily at night (0-0-1)",
      duration: "5 days",
      instructions: "For runny nose and sneezing.",
    },
  ]);
  const [generalAdvice, setGeneralAdvice] = useState(
    "Drink warm fluids. Steam inhalation twice daily. Return if breathing difficulty or high persistent fever occurs."
  );
  const [validDays, setValidDays] = useState(30);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const addMedicineRow = () => {
    setMedications([
      ...medications,
      {
        id: "med-" + Date.now(),
        medicineName: "",
        dosage: "1 tablet",
        frequency: "Twice daily after meals (1-0-1)",
        duration: "5 days",
        instructions: "",
      },
    ]);
  };

  const updateMedicineRow = (index: number, field: keyof PrescribedMedicineItem, value: string) => {
    const updated = [...medications];
    (updated[index] as any)[field] = value;
    setMedications(updated);
  };

  const handleSelectCatalogMed = (index: number, medId: string) => {
    const med = MEDICATIONS_CATALOG.find((m) => m.id === medId);
    if (!med) return;
    const updated = [...medications];
    updated[index] = {
      ...updated[index],
      medicationId: med.id,
      medicineName: med.name,
      dosage: med.strength,
      instructions: med.usageInstructions.slice(0, 100),
    };
    setMedications(updated);
  };

  const removeMedicineRow = (index: number) => {
    if (medications.length <= 1) return;
    setMedications(medications.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!diagnosis.trim()) {
      setErrorMsg("Please specify a clinical diagnosis");
      return;
    }
    if (medications.some((m) => !m.medicineName.trim())) {
      setErrorMsg("Please complete all medicine names in the prescription");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/prescriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId,
          appointmentId,
          diagnosis,
          medications,
          generalAdvice,
          validDays,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create prescription");
      }

      onSuccess(data.prescription);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to issue prescription");
    } finally {
      setIsSubmitting(false);
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
          maxWidth: "700px",
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

        <h2 style={{ fontSize: "1.35rem", fontWeight: 800, marginBottom: "0.25rem" }}>
          Issue Official E-Prescription
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "1.25rem" }}>
          Prescribing for: <strong>{patientName || "Aditya Verma"}</strong>
        </p>

        {errorMsg && (
          <div
            style={{
              padding: "0.75rem 1rem",
              borderRadius: "8px",
              background: "var(--color-error-bg)",
              color: "var(--color-error)",
              fontSize: "0.85rem",
              marginBottom: "1rem",
            }}
          >
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {/* Diagnosis */}
          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.35rem" }}>
              Clinical Diagnosis
            </label>
            <input
              type="text"
              className="form-input"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="E.g., Acute Viral Bronchitis"
              required
              style={{ minHeight: "48px", width: "100%" }}
            />
          </div>

          {/* Medicines Builder */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 700 }}>Prescribed Medicines (℞)</label>
              <button
                type="button"
                onClick={addMedicineRow}
                className="btn-secondary"
                style={{ minHeight: "36px", padding: "0 0.75rem", fontSize: "0.8rem" }}
              >
                <Plus size={14} /> Add Medicine
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {medications.map((item, idx) => (
                <div
                  key={item.id}
                  style={{
                    background: "var(--bg-surface)",
                    padding: "1rem",
                    borderRadius: "10px",
                    border: "1px solid var(--border-subtle)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.6rem",
                  }}
                >
                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <div style={{ flex: "1 1 240px" }}>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Medicine name (e.g. Paracetamol 650)"
                        value={item.medicineName}
                        onChange={(e) => updateMedicineRow(idx, "medicineName", e.target.value)}
                        style={{ minHeight: "44px" }}
                        required
                      />
                    </div>

                    <div style={{ flex: "0 1 180px" }}>
                      <select
                        className="form-input"
                        onChange={(e) => handleSelectCatalogMed(idx, e.target.value)}
                        value={item.medicationId || ""}
                        style={{ minHeight: "44px", fontSize: "0.8rem" }}
                      >
                        <option value="">Choose Catalog Med...</option>
                        {MEDICATIONS_CATALOG.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {medications.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMedicineRow(idx)}
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "var(--color-error)",
                          cursor: "pointer",
                          padding: "0.5rem",
                          minHeight: "44px",
                        }}
                        title="Remove medicine"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem" }}>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Dosage (e.g. 500mg)"
                      value={item.dosage}
                      onChange={(e) => updateMedicineRow(idx, "dosage", e.target.value)}
                      style={{ minHeight: "44px", fontSize: "0.82rem" }}
                    />
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Frequency (e.g. 1-0-1)"
                      value={item.frequency}
                      onChange={(e) => updateMedicineRow(idx, "frequency", e.target.value)}
                      style={{ minHeight: "44px", fontSize: "0.82rem" }}
                    />
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Duration (e.g. 5 days)"
                      value={item.duration}
                      onChange={(e) => updateMedicineRow(idx, "duration", e.target.value)}
                      style={{ minHeight: "44px", fontSize: "0.82rem" }}
                    />
                  </div>

                  <input
                    type="text"
                    className="form-input"
                    placeholder="Specific instructions (e.g. After food with water)"
                    value={item.instructions}
                    onChange={(e) => updateMedicineRow(idx, "instructions", e.target.value)}
                    style={{ minHeight: "44px", fontSize: "0.82rem" }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Advice */}
          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.35rem" }}>
              General Advice & Precautions
            </label>
            <textarea
              className="form-input"
              rows={3}
              value={generalAdvice}
              onChange={(e) => setGeneralAdvice(e.target.value)}
              style={{ width: "100%", padding: "0.75rem", fontSize: "0.85rem" }}
            />
          </div>

          {/* Validity */}
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 700 }}>Prescription Validity:</label>
            <select
              className="form-input"
              value={validDays}
              onChange={(e) => setValidDays(Number(e.target.value))}
              style={{ minHeight: "44px", width: "160px" }}
            >
              <option value={15}>15 Days</option>
              <option value={30}>30 Days</option>
              <option value={60}>60 Days</option>
              <option value={90}>90 Days</option>
            </select>
          </div>

          {/* Digital Signature Notice */}
          <div
            style={{
              background: "rgba(29, 52, 138, 0.15)",
              border: "1px solid var(--color-primary)",
              borderRadius: "8px",
              padding: "0.85rem 1rem",
              fontSize: "0.8rem",
              color: "var(--text-secondary)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <ShieldCheck size={18} color="var(--color-accent)" />
            <span>
              By issuing this e-prescription, you are applying your verified digital cryptographic signature under the NMC Telemedicine Practice Guidelines.
            </span>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", marginTop: "0.5rem" }}>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              style={{ minHeight: "48px", padding: "0 1.25rem" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
              style={{ minHeight: "48px", padding: "0 1.5rem" }}
            >
              <FileCheck size={17} />
              <span>{isSubmitting ? "Generating Digital Signature..." : "Sign & Issue E-Prescription"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

