"use client";

import { useState } from "react";
import { DoctorDiscoveryItem, AppointmentType, ConsultationAppointment } from "@/lib/types";
import {
  X,
  Calendar,
  Clock,
  Video,
  Phone,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface AppointmentSchedulerModalProps {
  doctor: DoctorDiscoveryItem | null;
  assessmentId?: string;
  onClose: () => void;
  onSuccess: (appointment: ConsultationAppointment) => void;
}

export default function AppointmentSchedulerModal({
  doctor,
  assessmentId,
  onClose,
  onSuccess,
}: AppointmentSchedulerModalProps) {
  // Generate next 5 available dates
  const availableDates: { label: string; dateStr: string }[] = [];
  for (let i = 0; i < 6; i++) {
    const d = new Date(Date.now() + i * 86400000);
    const dayName = i === 0 ? "Today" : i === 1 ? "Tomorrow" : d.toLocaleDateString("en-US", { weekday: "short" });
    const dateFormatted = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    availableDates.push({
      label: `${dayName}, ${dateFormatted}`,
      dateStr: d.toISOString().split("T")[0],
    });
  }

  const [selectedDate, setSelectedDate] = useState<string>(availableDates[1]?.dateStr || availableDates[0].dateStr);
  const [selectedSlot, setSelectedSlot] = useState<string>(doctor?.availableSlots[0] || "10:30 AM");
  const [appointmentType, setAppointmentType] = useState<AppointmentType>("video");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!doctor) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setErrorMsg("Please briefly state your symptoms or reason for consultation.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/consultations/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          professionalId: doctor.id,
          appointmentDate: selectedDate,
          timeSlot: selectedSlot,
          type: appointmentType,
          reason,
          assessmentId,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to schedule appointment");
      }

      onSuccess(data.appointment);
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong. Please try again.");
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
          maxWidth: "600px",
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

        {/* Modal Header */}
        <div style={{ marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.35rem", fontWeight: 800, marginBottom: "0.25rem" }}>
            Schedule Consultation
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem" }}>
            Booking with <strong>{doctor.prefix} {doctor.fullName}</strong> ({doctor.specialization})
          </p>
        </div>

        {errorMsg && (
          <div
            style={{
              padding: "0.85rem 1rem",
              borderRadius: "8px",
              background: "var(--color-error-bg)",
              border: "1px solid var(--color-error)",
              color: "var(--color-error)",
              fontSize: "0.85rem",
              marginBottom: "1.25rem",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {/* Appointment Type Component */}
          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.5rem" }}>
              Select Consultation Mode
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem" }}>
              {[
                { type: "video" as AppointmentType, label: "Video Call", icon: Video },
                { type: "audio" as AppointmentType, label: "Audio Call", icon: Phone },
                { type: "chat" as AppointmentType, label: "Instant Chat", icon: MessageSquare },
              ].map(({ type, label, icon: Icon }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setAppointmentType(type)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.35rem",
                    padding: "0.75rem 0.5rem",
                    borderRadius: "10px",
                    border:
                      appointmentType === type
                        ? "2px solid var(--color-accent)"
                        : "1px solid var(--border-subtle)",
                    background:
                      appointmentType === type ? "rgba(255, 178, 0, 0.12)" : "var(--bg-surface)",
                    color:
                      appointmentType === type ? "var(--color-accent)" : "var(--text-secondary)",
                    cursor: "pointer",
                    minHeight: "48px",
                    transition: "all 250ms ease",
                  }}
                >
                  <Icon size={18} />
                  <span style={{ fontSize: "0.78rem", fontWeight: 700 }}>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Date Selector Component */}
          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.5rem" }}>
              Choose Date
            </label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
                gap: "0.5rem",
              }}
            >
              {availableDates.map((item) => (
                <button
                  key={item.dateStr}
                  type="button"
                  onClick={() => setSelectedDate(item.dateStr)}
                  style={{
                    padding: "0.6rem 0.5rem",
                    borderRadius: "8px",
                    textAlign: "center",
                    fontSize: "0.8rem",
                    fontWeight: selectedDate === item.dateStr ? 700 : 500,
                    border:
                      selectedDate === item.dateStr
                        ? "1.5px solid var(--color-accent)"
                        : "1px solid var(--border-subtle)",
                    background:
                      selectedDate === item.dateStr ? "rgba(255, 178, 0, 0.12)" : "var(--bg-surface)",
                    color:
                      selectedDate === item.dateStr ? "var(--color-accent)" : "var(--text-secondary)",
                    cursor: "pointer",
                    minHeight: "48px",
                    transition: "all 250ms ease",
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Time Slot Component */}
          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.5rem" }}>
              Choose Available Slot
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {doctor.availableSlots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setSelectedSlot(slot)}
                  style={{
                    padding: "0.5rem 0.85rem",
                    borderRadius: "8px",
                    fontSize: "0.82rem",
                    fontWeight: selectedSlot === slot ? 700 : 500,
                    border:
                      selectedSlot === slot
                        ? "1.5px solid var(--color-primary)"
                        : "1px solid var(--border-subtle)",
                    background:
                      selectedSlot === slot ? "var(--color-primary)" : "var(--bg-surface)",
                    color: selectedSlot === slot ? "#ffffff" : "var(--text-secondary)",
                    cursor: "pointer",
                    minHeight: "48px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    transition: "all 250ms ease",
                  }}
                >
                  <Clock size={14} />
                  <span>{slot}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Reason / Chief Complaint Form */}
          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.5rem" }}>
              Primary Reason / Symptoms for Consultation
            </label>
            <textarea
              className="form-input"
              rows={3}
              placeholder="E.g., Fever for 2 days with sore throat, headache, and body fatigue..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              style={{ width: "100%", padding: "0.75rem", fontSize: "0.88rem" }}
              required
            />
          </div>

          {/* Fee & Confirmation Summary */}
          <div
            style={{
              background: "var(--bg-surface)",
              borderRadius: "10px",
              padding: "1rem",
              border: "1px solid var(--border-subtle)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)", display: "block" }}>
                Total Consultation Payable
              </span>
              <span style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--color-accent)" }}>
                ₹{doctor.consultationFee}
              </span>
              <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", display: "block" }}>
                Includes 7-day follow-up chat & e-prescription
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--color-success)", fontSize: "0.8rem", fontWeight: 600 }}>
              <ShieldCheck size={16} /> Instant Confirmation
            </div>
          </div>

          {/* Scheduling Action Component */}
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", marginTop: "0.5rem" }}>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
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
              {isSubmitting ? "Confirming..." : `Confirm & Book Appointment (₹${doctor.consultationFee})`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

