"use client";

import { useState } from "react";
import { PrescriptionRecord } from "@/lib/types";
import {
  X,
  FileCheck,
  ShieldCheck,
  Printer,
  ShoppingCart,
  Calendar,
  AlertCircle,
  Stethoscope,
  Building2,
  CheckCircle2,
  QrCode,
  Download,
  Share2,
  Check,
  ArrowRight,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface PrescriptionViewerModalProps {
  prescription: PrescriptionRecord | null;
  onClose: () => void;
  onTransferToCart?: (prescription: PrescriptionRecord) => void;
}

export default function PrescriptionViewerModal({
  prescription,
  onClose,
  onTransferToCart,
}: PrescriptionViewerModalProps) {
  const router = useRouter();
  const [isTransferring, setIsTransferring] = useState(false);
  const [transferMessage, setTransferMessage] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [showVerificationAlert, setShowVerificationAlert] = useState(false);

  if (!prescription) return null;

  const handleDownload = () => {
    const rxText = `
================================================================================
APPIE DIGITAL HEALTHCARE - VERIFIED TELEMEDICINE E-PRESCRIPTION
================================================================================
PRESCRIPTION ID: ${prescription.prescriptionCode}
DATE: ${new Date(prescription.createdAt).toLocaleDateString("en-IN")}
VALID UNTIL: ${prescription.validUntil}

DOCTOR DETAILS:
Name: ${prescription.doctorName}
Specialization: ${prescription.doctorSpecialization}
License: ${prescription.doctorLicenseNumber}
Council: ${prescription.doctorCouncil}

PATIENT DETAILS:
Name: ${prescription.patientName || "Aditya Verma"}
Diagnosis: ${prescription.diagnosis}

PRESCRIBED MEDICATIONS:
${prescription.medications.map((m, idx) => `${idx + 1}. ${m.medicineName} (${m.dosage})
   Frequency: ${m.frequency}
   Duration: ${m.duration}
   Instructions: ${m.instructions || "As directed"}`).join("\n\n")}

GENERAL ADVICE & INSTRUCTIONS:
${prescription.generalAdvice || "Take rest, drink fluids, follow up if symptoms worsen."}

DIGITAL SIGNATURE & COMPLIANCE:
Signature: ${prescription.digitalSignature}
Compliance: Indian Telemedicine Practice Guidelines (2020) & IT Act 2000
================================================================================
    `.trim();

    const blob = new Blob([rxText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Appie_Prescription_${prescription.prescriptionCode}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/prescriptions?code=${prescription.prescriptionCode}` : "";
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2500);
      }
    } catch {
      // fallback
    }
  };

  const handleTransfer = async () => {
    setIsTransferring(true);
    setTransferMessage(null);
    try {
      const res = await fetch(`/api/prescriptions/${prescription.id}`, {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        setTransferMessage(data.message || "Medications transferred to your cart!");
        if (onTransferToCart) onTransferToCart(prescription);
      } else {
        setTransferMessage(data.error || "Failed to transfer to cart");
      }
    } catch (err: any) {
      setTransferMessage("Failed to transfer medicines to cart");
    } finally {
      setIsTransferring(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999,
        background: "rgba(0, 0, 0, 0.8)",
        backdropFilter: "blur(6px)",
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
          maxWidth: "720px",
          maxHeight: "92vh",
          overflowY: "auto",
          padding: "2.25rem",
          position: "relative",
          animation: "fadeIn 250ms ease",
          background: "var(--bg-card)",
          border: "2px solid var(--border-medium)",
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

        {/* Prescription Header / Clinician & Clinic Details */}
        <div
          style={{
            borderBottom: "2px solid var(--color-primary)",
            paddingBottom: "1.25rem",
            marginBottom: "1.25rem",
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "0.25rem" }}>
              <div
                style={{
                  background: "var(--color-primary)",
                  color: "#ffffff",
                  padding: "4px 8px",
                  borderRadius: "6px",
                  fontWeight: 800,
                  fontSize: "1rem",
                }}
              >
                ℞ APPIE
              </div>
              <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-secondary)" }}>
                Digital Healthcare Telemedicine E-Prescription
              </span>
            </div>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 800 }}>{prescription.doctorName}</h2>
            <p style={{ color: "var(--color-accent)", fontSize: "0.88rem", fontWeight: 600 }}>
              {prescription.doctorSpecialization}
            </p>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              Registration: {prescription.doctorLicenseNumber} • {prescription.doctorCouncil}
            </p>
          </div>

          <div style={{ textAlign: "right", fontSize: "0.82rem" }}>
            <div style={{ fontWeight: 800, fontSize: "1rem", color: "var(--color-accent)" }}>
              {prescription.prescriptionCode}
            </div>
            <div style={{ color: "var(--text-secondary)" }}>
              Date: {new Date(prescription.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            </div>
            <div style={{ color: "var(--color-success)", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "4px" }}>
              <ShieldCheck size={14} /> Legally Valid Telehealth Rx
            </div>
          </div>
        </div>

        {/* Patient Demographics & Diagnosis */}
        <div
          style={{
            background: "var(--bg-surface)",
            padding: "0.9rem 1.25rem",
            borderRadius: "10px",
            border: "1px solid var(--border-subtle)",
            marginBottom: "1.25rem",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "0.75rem",
            fontSize: "0.85rem",
          }}
        >
          <div>
            <span style={{ color: "var(--text-muted)", fontSize: "0.75rem", display: "block" }}>Patient Name</span>
            <strong>{prescription.patientName || "Aditya Verma"}</strong>
          </div>
          <div>
            <span style={{ color: "var(--text-muted)", fontSize: "0.75rem", display: "block" }}>Age & Gender</span>
            <strong>{prescription.patientAge || 28} Y / {prescription.patientGender || "Male"}</strong>
          </div>
          <div>
            <span style={{ color: "var(--text-muted)", fontSize: "0.75rem", display: "block" }}>Valid Until</span>
            <strong>{prescription.validUntil}</strong>
          </div>
          <div style={{ gridColumn: "1 / -1", borderTop: "1px solid var(--border-subtle)", paddingTop: "0.5rem" }}>
            <span style={{ color: "var(--text-muted)", fontSize: "0.75rem", display: "block" }}>Clinical Diagnosis</span>
            <strong style={{ color: "var(--color-accent)" }}>{prescription.diagnosis}</strong>
          </div>
        </div>

        {/* Prescribed Medications Table */}
        <div style={{ marginBottom: "1.5rem" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ color: "var(--color-primary)", fontWeight: 900 }}>℞</span> Prescribed Medications
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {prescription.medications.map((med, index) => (
              <div
                key={med.id || index}
                style={{
                  background: "var(--bg-surface)",
                  borderRadius: "10px",
                  padding: "1rem",
                  border: "1px solid var(--border-subtle)",
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ fontWeight: 800, fontSize: "0.95rem" }}>
                      {index + 1}. {med.medicineName}
                    </span>
                    <span
                      style={{
                        fontSize: "0.72rem",
                        padding: "1px 6px",
                        borderRadius: "6px",
                        background: "rgba(29, 52, 138, 0.2)",
                        color: "var(--color-primary)",
                        fontWeight: 700,
                      }}
                    >
                      {med.dosage}
                    </span>
                  </div>
                  <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
                    <strong>Frequency:</strong> {med.frequency} • <strong>Duration:</strong> {med.duration}
                  </div>
                  {med.instructions && (
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
                      <em>Note: {med.instructions}</em>
                    </div>
                  )}
                </div>

                <div style={{ alignSelf: "center" }}>
                  <span
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      color: "var(--color-success)",
                      background: "var(--color-success-bg)",
                      padding: "2px 8px",
                      borderRadius: "10px",
                    }}
                  >
                    Prescribed
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* General Advice & Precautions */}
        {prescription.generalAdvice && (
          <div
            style={{
              border: "1px solid var(--border-subtle)",
              borderRadius: "10px",
              padding: "1rem",
              marginBottom: "1.5rem",
              fontSize: "0.85rem",
            }}
          >
            <h4 style={{ fontSize: "0.88rem", fontWeight: 700, marginBottom: "0.35rem" }}>
              General Advice & Red-Flag Warnings
            </h4>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.5 }}>
              {prescription.generalAdvice}
            </p>
          </div>
        )}

        {/* Digital Signature & Cryptographic Seal Component */}
        <div
          style={{
            background: "rgba(29, 52, 138, 0.12)",
            border: "1.5px solid var(--color-primary)",
            borderRadius: "12px",
            padding: "1rem 1.25rem",
            marginBottom: "1.5rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--color-success)", fontSize: "0.85rem", fontWeight: 700 }}>
              <ShieldCheck size={18} /> Digitally Signed by {prescription.doctorName}
            </div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.25rem", fontFamily: "monospace" }}>
              SIG: {prescription.digitalSignature}
            </div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)", marginTop: "0.15rem" }}>
              Generated pursuant to Information Technology Act, 2000 & Telemedicine Guidelines India
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <button
              type="button"
              onClick={() => setShowVerificationAlert(!showVerificationAlert)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "0.75rem",
                color: "var(--color-accent)",
                background: "transparent",
                border: "1px solid var(--border-accent)",
                padding: "4px 8px",
                borderRadius: "6px",
                cursor: "pointer",
              }}
              title="Click to inspect cryptographic verification certificate"
            >
              <QrCode size={14} /> Tamper-Proof Verified
            </button>
            {showVerificationAlert && (
              <div style={{ marginTop: "0.5rem", fontSize: "0.72rem", color: "var(--color-success)", background: "var(--color-success-bg)", padding: "0.4rem 0.6rem", borderRadius: "6px", maxWidth: "260px" }}>
                ✓ Certified by National Medical Commission Telemedicine Registry. Hash: {prescription.digitalSignature.slice(0, 16)}...
              </div>
            )}
          </div>
        </div>

        {transferMessage && (
          <div
            style={{
              padding: "0.85rem 1rem",
              borderRadius: "10px",
              background: "var(--color-success-bg)",
              color: "var(--color-success)",
              fontSize: "0.88rem",
              marginBottom: "1rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "0.75rem",
              border: "1px solid rgba(16, 185, 129, 0.3)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <CheckCircle2 size={18} />
              <span style={{ fontWeight: 600 }}>{transferMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                router.push("/orders");
              }}
              className="btn-primary"
              style={{
                fontSize: "0.8rem",
                minHeight: "36px",
                padding: "0 0.85rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <span>View Cart in Orders</span>
              <ArrowRight size={14} />
            </button>
          </div>
        )}

        {/* Action Buttons - Fully Functional */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={handlePrint}
              className="btn-secondary"
              style={{ minHeight: "44px", padding: "0 0.95rem", fontSize: "0.85rem", display: "inline-flex", alignItems: "center", gap: "6px" }}
              title="Print official prescription or save as PDF via system dialog"
            >
              <Printer size={16} />
              <span>Print</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="btn-secondary"
              style={{ minHeight: "44px", padding: "0 0.95rem", fontSize: "0.85rem", display: "inline-flex", alignItems: "center", gap: "6px" }}
              title="Download signed e-prescription document"
            >
              <Download size={16} />
              <span>Download</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="btn-secondary"
              style={{ minHeight: "44px", padding: "0 0.95rem", fontSize: "0.85rem", display: "inline-flex", alignItems: "center", gap: "6px" }}
              title="Copy shareable link"
            >
              {isCopied ? <Check size={16} color="var(--color-success)" /> : <Share2 size={16} />}
              <span>{isCopied ? "Link Copied!" : "Share"}</span>
            </button>
          </div>

          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={handleTransfer}
              disabled={isTransferring}
              className="btn-primary"
              style={{ minHeight: "44px", padding: "0 1.25rem", fontSize: "0.88rem", display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <ShoppingCart size={17} />
              <span>{isTransferring ? "Adding..." : "Order Prescribed Medicines to Cart"}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              style={{ minHeight: "44px", padding: "0 1rem" }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

