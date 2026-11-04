"use client";

import { useState } from "react";
import { ConsultationAppointment } from "@/lib/types";
import {
  X,
  Video,
  Mic,
  Camera,
  ShieldCheck,
  CheckCircle2,
  FileText,
  AlertCircle,
  ExternalLink,
  Activity,
} from "lucide-react";

interface ConsultationPreparationModalProps {
  appointment: ConsultationAppointment | null;
  role: "patient" | "health_professional";
  onClose: () => void;
  onCallEnded: () => void;
}

export default function ConsultationPreparationModal({
  appointment,
  role,
  onClose,
  onCallEnded,
}: ConsultationPreparationModalProps) {
  const [isInCall, setIsInCall] = useState(false);
  const [micActive, setMicActive] = useState(true);
  const [camActive, setCamActive] = useState(true);
  const [callDuration, setCallDuration] = useState(0);

  if (!appointment) return null;

  const isDoctor = role === "health_professional";

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
          maxWidth: isInCall ? "820px" : "620px",
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

        {!isInCall ? (
          /* Consultation Preparation Screen */
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "var(--color-success)",
                  background: "var(--color-success-bg)",
                  padding: "2px 8px",
                  borderRadius: "10px",
                  marginBottom: "0.5rem",
                }}
              >
                <ShieldCheck size={14} /> End-to-End Encrypted Telehealth Session
              </span>
              <h2 style={{ fontSize: "1.4rem", fontWeight: 800 }}>Consultation Preparation</h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem" }}>
                Preparing connection with{" "}
                <strong>
                  {isDoctor
                    ? appointment.patientName || "Aditya Verma"
                    : `${appointment.doctorName || "Dr. Medical Specialist"} (${appointment.doctorSpecialization || "Physician"})`}
                </strong>
              </p>
            </div>

            {/* Appointment Summary Component */}
            <div
              style={{
                background: "var(--bg-surface)",
                padding: "1rem 1.25rem",
                borderRadius: "10px",
                border: "1px solid var(--border-subtle)",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "0.75rem",
                fontSize: "0.85rem",
              }}
            >
              <div>
                <span style={{ color: "var(--text-muted)", display: "block", fontSize: "0.78rem" }}>Scheduled Time</span>
                <strong>{appointment.timeSlot} • {appointment.appointmentDate}</strong>
              </div>
              <div>
                <span style={{ color: "var(--text-muted)", display: "block", fontSize: "0.78rem" }}>Mode</span>
                <strong style={{ textTransform: "capitalize" }}>{appointment.type} Teleconsultation</strong>
              </div>
              <div>
                <span style={{ color: "var(--text-muted)", display: "block", fontSize: "0.78rem" }}>Fee Paid</span>
                <strong style={{ color: "var(--color-accent)" }}>₹{appointment.feeAmount}</strong>
              </div>
            </div>

            {/* Patient Information Component */}
            <div style={{ border: "1px solid var(--border-subtle)", borderRadius: "10px", padding: "1rem" }}>
              <h4 style={{ fontSize: "0.88rem", fontWeight: 700, marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "6px" }}>
                <Activity size={16} color="var(--color-accent)" /> Clinical & Record Access
              </h4>
              <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                <div><strong>Chief Complaint:</strong> {appointment.reason || "Routine Health Concern"}</div>
                <div><strong>Patient Medical Profile:</strong> Blood Group O+, No Known Drug Allergies</div>
                <div><strong>Previous Assessment:</strong> Attached & accessible to clinician</div>
              </div>
            </div>

            {/* Consultation Preparation Hardware Check Component */}
            <div
              style={{
                background: "rgba(29, 52, 138, 0.1)",
                border: "1px solid var(--color-primary)",
                borderRadius: "10px",
                padding: "1rem",
              }}
            >
              <h4 style={{ fontSize: "0.88rem", fontWeight: 700, marginBottom: "0.5rem" }}>
                Pre-Call Device Check
              </h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", fontSize: "0.82rem" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--color-success)" }}>
                  <CheckCircle2 size={16} /> Camera Connected
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--color-success)" }}>
                  <CheckCircle2 size={16} /> Microphone Ready
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--color-success)" }}>
                  <CheckCircle2 size={16} /> High-Speed Internet
                </span>
              </div>
            </div>

            {/* Consultation Start Component */}
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", marginTop: "0.5rem" }}>
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
                style={{ minHeight: "48px", padding: "0 1.25rem" }}
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setIsInCall(true)}
                className="btn-primary"
                style={{ minHeight: "48px", padding: "0 1.5rem" }}
              >
                <Video size={17} />
                <span>Launch Consultation Room</span>
              </button>
            </div>
          </div>
        ) : (
          /* Active Consultation Video / Chat Room Simulation */
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--color-error)", fontSize: "0.82rem", fontWeight: 700 }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--color-error)", display: "inline-block" }} />
                  LIVE CONSULTATION SESSION
                </span>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 800 }}>
                  {isDoctor ? appointment.patientName : appointment.doctorName}
                </h3>
              </div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                ID: #{appointment.id.slice(-6).toUpperCase()}
              </div>
            </div>

            {/* Video Viewport Mock */}
            <div
              style={{
                width: "100%",
                height: "360px",
                background: "#080a10",
                borderRadius: "14px",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid var(--border-medium)",
                overflow: "hidden",
              }}
            >
              {/* Doctor / Remote Avatar */}
              <div
                className="dashboard-avatar-box"
                style={{
                  width: "90px",
                  height: "90px",
                  fontSize: "2.2rem",
                  background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))",
                  color: "#ffffff",
                  borderRadius: "50%",
                  marginBottom: "1rem",
                }}
              >
                {isDoctor ? "AV" : "PS"}
              </div>
              <h4 style={{ color: "#ffffff", fontSize: "1.1rem", fontWeight: 700 }}>
                {isDoctor ? appointment.patientName || "Aditya Verma" : appointment.doctorName || "Dr. Priya Sharma"}
              </h4>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.82rem" }}>
                Connected via Telehealth RTC Secure Bridge
              </p>

              {/* Self view PIP */}
              <div
                style={{
                  position: "absolute",
                  bottom: "16px",
                  right: "16px",
                  width: "110px",
                  height: "80px",
                  background: "#161b2b",
                  borderRadius: "8px",
                  border: "1.5px solid var(--border-medium)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.75rem",
                  color: "var(--text-muted)",
                }}
              >
                {camActive ? "You (Active)" : "Camera Off"}
              </div>
            </div>

            {/* Call Controls */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "1rem",
                padding: "0.75rem 0",
              }}
            >
              <button
                type="button"
                onClick={() => setMicActive(!micActive)}
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  border: "1px solid var(--border-subtle)",
                  background: micActive ? "var(--bg-card)" : "var(--color-error-bg)",
                  color: micActive ? "var(--text-primary)" : "var(--color-error)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                title={micActive ? "Mute Microphone" : "Unmute Microphone"}
              >
                <Mic size={20} />
              </button>

              <button
                type="button"
                onClick={() => setCamActive(!camActive)}
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  border: "1px solid var(--border-subtle)",
                  background: camActive ? "var(--bg-card)" : "var(--color-error-bg)",
                  color: camActive ? "var(--text-primary)" : "var(--color-error)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                title={camActive ? "Disable Camera" : "Enable Camera"}
              >
                <Camera size={20} />
              </button>

              <button
                type="button"
                onClick={async () => {
                  await fetch(`/api/consultations/appointments/${appointment.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ action: "complete" }),
                  });
                  setIsInCall(false);
                  onCallEnded();
                }}
                style={{
                  minHeight: "48px",
                  padding: "0 1.5rem",
                  borderRadius: "24px",
                  border: "none",
                  background: "var(--color-error)",
                  color: "#ffffff",
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                End Consultation
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

