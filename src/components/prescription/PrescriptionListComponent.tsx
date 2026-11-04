"use client";

import { PrescriptionRecord } from "@/lib/types";
import {
  FileCheck,
  Calendar,
  ShieldCheck,
  Stethoscope,
  ChevronRight,
  ShoppingCart,
  Clock,
} from "lucide-react";

interface PrescriptionListComponentProps {
  prescriptions: PrescriptionRecord[];
  role: "patient" | "health_professional";
  onSelectPrescription: (prescription: PrescriptionRecord) => void;
  onCreateNew?: () => void;
}

export default function PrescriptionListComponent({
  prescriptions,
  role,
  onSelectPrescription,
  onCreateNew,
}: PrescriptionListComponentProps) {
  const isDoctor = role === "health_professional";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
        <div>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 800 }}>
            {isDoctor ? "Prescriptions Issued by You" : "Your Valid E-Prescriptions"} ({prescriptions.length})
          </h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
            Legally valid digital prescriptions under National Medical Commission guidelines.
          </p>
        </div>

        {isDoctor && onCreateNew && (
          <button
            type="button"
            onClick={onCreateNew}
            className="btn-primary"
            style={{ minHeight: "48px", padding: "0 1.25rem", fontSize: "0.88rem" }}
          >
            <FileCheck size={16} />
            <span>Issue New E-Prescription</span>
          </button>
        )}
      </div>

      {prescriptions.length === 0 ? (
        <div
          className="dashboard-card"
          style={{ textAlign: "center", padding: "3rem 1.5rem", color: "var(--text-secondary)" }}
        >
          <FileCheck size={36} color="var(--text-muted)" style={{ margin: "0 auto 0.75rem" }} />
          <h4 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.35rem" }}>
            No prescriptions found
          </h4>
          <p style={{ fontSize: "0.85rem" }}>
            {isDoctor
              ? "You haven't issued any e-prescriptions yet."
              : "When a healthcare professional issues an e-prescription during your consultation, it will appear here."}
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {prescriptions.map((rx) => (
            <div
              key={rx.id}
              className="dashboard-card"
              style={{
                padding: "1.5rem",
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "1.25rem",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", flex: "1 1 320px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 800,
                      color: "var(--color-accent)",
                      background: "rgba(255, 178, 0, 0.12)",
                      padding: "2px 8px",
                      borderRadius: "6px",
                      fontFamily: "monospace",
                    }}
                  >
                    {rx.prescriptionCode}
                  </span>
                  <span
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      color: "var(--color-success)",
                      background: "var(--color-success-bg)",
                      padding: "2px 8px",
                      borderRadius: "10px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "3px",
                    }}
                  >
                    <ShieldCheck size={13} /> Digitally Signed
                  </span>
                </div>

                <h4 style={{ fontSize: "1.1rem", fontWeight: 700 }}>
                  {isDoctor ? `Patient: ${rx.patientName || "Aditya Verma"}` : rx.doctorName}
                </h4>

                <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                  Diagnosis: <strong>{rx.diagnosis}</strong>
                </p>

                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                  <span>{rx.medications.length} Prescribed Medications</span>
                  <span>Issued: {new Date(rx.createdAt).toLocaleDateString()}</span>
                  <span>Valid until: {rx.validUntil}</span>
                </div>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => onSelectPrescription(rx)}
                  className="btn-primary"
                  style={{ minHeight: "48px", padding: "0 1.25rem", fontSize: "0.88rem" }}
                >
                  <FileCheck size={16} />
                  <span>View Official E-Rx</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

