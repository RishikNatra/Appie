"use client";

import { useState } from "react";
import { ConsultationAppointment, AppointmentStatus } from "@/lib/types";
import {
  Calendar,
  Clock,
  Video,
  Phone,
  MessageSquare,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  ArrowRight,
  FileText,
  Star,
  ExternalLink,
} from "lucide-react";

interface AppointmentManagementComponentProps {
  appointments: ConsultationAppointment[];
  role: "patient" | "health_professional";
  onPrepare: (appointment: ConsultationAppointment) => void;
  onViewSummary: (appointment: ConsultationAppointment) => void;
  onRateDoctor?: (appointment: ConsultationAppointment) => void;
  onIssuePrescription?: (appointment: ConsultationAppointment) => void;
  onRefresh: () => void;
}

export default function AppointmentManagementComponent({
  appointments,
  role,
  onPrepare,
  onViewSummary,
  onRateDoctor,
  onIssuePrescription,
  onRefresh,
}: AppointmentManagementComponentProps) {
  const [activeTab, setActiveTab] = useState<"upcoming" | "completed" | "all">("upcoming");
  const [reschedulingAppt, setReschedulingAppt] = useState<ConsultationAppointment | null>(null);
  const [newDate, setNewDate] = useState("");
  const [newSlot, setNewSlot] = useState("10:30 AM");
  const [isUpdating, setIsUpdating] = useState(false);

  const filteredAppointments = appointments.filter((appt) => {
    if (activeTab === "upcoming") {
      return ["scheduled", "confirmed", "in_progress"].includes(appt.status);
    }
    if (activeTab === "completed") {
      return ["completed", "cancelled"].includes(appt.status);
    }
    return true;
  });

  const handleCancel = async (apptId: string) => {
    if (!confirm("Are you sure you want to cancel this consultation appointment?")) return;
    try {
      const res = await fetch(`/api/consultations/appointments/${apptId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "cancel", notes: "Cancelled by user" }),
      });
      if (res.ok) onRefresh();
    } catch (err) {
      alert("Failed to cancel appointment");
    }
  };

  const handleRescheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reschedulingAppt || !newDate) return;
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/consultations/appointments/${reschedulingAppt.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reschedule",
          appointmentDate: newDate,
          timeSlot: newSlot,
        }),
      });
      if (res.ok) {
        setReschedulingAppt(null);
        onRefresh();
      }
    } catch (err) {
      alert("Failed to reschedule");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* Appointment Status Component Tabs */}
      <div style={{ display: "flex", gap: "0.5rem", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "0.75rem" }}>
        {[
          { id: "upcoming", label: "Active & Upcoming" },
          { id: "completed", label: "Completed & History" },
          { id: "all", label: "All Consultations" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              border: "none",
              fontSize: "0.88rem",
              fontWeight: activeTab === tab.id ? 700 : 500,
              color: activeTab === tab.id ? "var(--color-accent)" : "var(--text-secondary)",
              background: activeTab === tab.id ? "rgba(255, 178, 0, 0.12)" : "transparent",
              cursor: "pointer",
              transition: "all 250ms ease",
              minHeight: "44px",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filteredAppointments.length === 0 ? (
        <div
          className="dashboard-card"
          style={{ textAlign: "center", padding: "3rem 1.5rem", color: "var(--text-secondary)" }}
        >
          <Calendar size={36} color="var(--text-muted)" style={{ margin: "0 auto 0.75rem" }} />
          <h4 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.35rem" }}>
            No appointments found
          </h4>
          <p style={{ fontSize: "0.85rem" }}>
            {activeTab === "upcoming"
              ? "You do not have any upcoming consultation appointments scheduled."
              : "No historical consultations recorded."}
          </p>
        </div>
      ) : (
        filteredAppointments.map((appt) => {
          const isDoctor = role === "health_professional";
          const title = isDoctor ? (appt.patientName || "Patient") : (appt.doctorName || "Dr. Medical Specialist");
          const subtitle = isDoctor ? "Registered Patient" : (appt.doctorSpecialization || "General Medicine");

          const getStatusBadge = (status: AppointmentStatus) => {
            switch (status) {
              case "confirmed":
                return { label: "Confirmed", bg: "var(--color-success-bg)", color: "var(--color-success)" };
              case "in_progress":
                return { label: "In Progress", bg: "rgba(255, 178, 0, 0.15)", color: "var(--color-accent)" };
              case "completed":
                return { label: "Completed", bg: "rgba(29, 52, 138, 0.2)", color: "var(--color-primary)" };
              case "rescheduled":
                return { label: "Rescheduled", bg: "rgba(255, 178, 0, 0.15)", color: "var(--color-accent)" };
              case "cancelled":
                return { label: "Cancelled", bg: "var(--color-error-bg)", color: "var(--color-error)" };
              default:
                return { label: "Scheduled", bg: "var(--bg-surface)", color: "var(--text-secondary)" };
            }
          };

          const statusBadge = getStatusBadge(appt.status);

          return (
            <div
              key={appt.id}
              className="dashboard-card"
              style={{
                padding: "1.5rem",
                display: "flex",
                flexWrap: "wrap",
                gap: "1.25rem",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {/* Appointment Details Component */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", flex: "1 1 320px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <h4 style={{ fontSize: "1.15rem", fontWeight: 700 }}>{title}</h4>
                  <span
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      background: statusBadge.bg,
                      color: statusBadge.color,
                      padding: "2px 8px",
                      borderRadius: "10px",
                    }}
                  >
                    {statusBadge.label}
                  </span>
                </div>

                <p style={{ color: "var(--color-accent)", fontSize: "0.85rem", fontWeight: 600 }}>
                  {subtitle}
                </p>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    fontSize: "0.82rem",
                    color: "var(--text-secondary)",
                    flexWrap: "wrap",
                    marginTop: "0.2rem",
                  }}
                >
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    <Calendar size={14} color="var(--color-accent)" />
                    {new Date(appt.appointmentDate).toLocaleDateString("en-IN", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    <Clock size={14} />
                    {appt.timeSlot}
                  </span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    <Video size={14} />
                    {appt.type.toUpperCase()}
                  </span>
                </div>

                {appt.reason && (
                  <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                    <strong>Reason:</strong> {appt.reason}
                  </p>
                )}
              </div>

              {/* Actions Component */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  flex: "1 1 240px",
                }}
              >
                {/* Active / In Progress Actions */}
                {["confirmed", "scheduled", "rescheduled", "in_progress"].includes(appt.status) && (
                  <>
                    <button
                      type="button"
                      onClick={() => onPrepare(appt)}
                      className="btn-primary"
                      style={{ minHeight: "48px", padding: "0 1.25rem", fontSize: "0.85rem" }}
                    >
                      <Video size={16} />
                      <span>{isDoctor ? "Join Doctor Room" : "Prepare & Join Call"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setReschedulingAppt(appt)}
                      className="btn-secondary"
                      style={{ minHeight: "48px", padding: "0 0.85rem", fontSize: "0.82rem" }}
                    >
                      <RotateCcw size={14} />
                      <span>Reschedule</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCancel(appt.id)}
                      style={{
                        background: "transparent",
                        border: "1px solid var(--color-error)",
                        color: "var(--color-error)",
                        borderRadius: "8px",
                        padding: "0 0.85rem",
                        fontSize: "0.82rem",
                        minHeight: "48px",
                        cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                  </>
                )}

                {/* Completed Actions */}
                {appt.status === "completed" && (
                  <>
                    <button
                      type="button"
                      onClick={() => onViewSummary(appt)}
                      className="btn-secondary"
                      style={{ minHeight: "48px", padding: "0 1rem", fontSize: "0.85rem" }}
                    >
                      <FileText size={15} />
                      <span>Consultation Summary</span>
                    </button>

                    {!isDoctor && onRateDoctor && (
                      <button
                        type="button"
                        onClick={() => onRateDoctor(appt)}
                        className="btn-primary"
                        style={{ minHeight: "48px", padding: "0 1rem", fontSize: "0.85rem" }}
                      >
                        <Star size={15} fill="var(--color-accent)" />
                        <span>Rate & Review</span>
                      </button>
                    )}

                    {isDoctor && onIssuePrescription && (
                      <button
                        type="button"
                        onClick={() => onIssuePrescription(appt)}
                        className="btn-primary"
                        style={{ minHeight: "48px", padding: "0 1rem", fontSize: "0.85rem" }}
                      >
                        <FileText size={15} />
                        <span>Issue E-Rx</span>
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })
      )}

      {/* Reschedule Modal */}
      {reschedulingAppt && (
        <div
          role="dialog"
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
          <div className="dashboard-card" style={{ width: "100%", maxWidth: "480px", padding: "2rem" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "1rem" }}>
              Reschedule Appointment
            </h3>
            <form onSubmit={handleRescheduleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.35rem" }}>
                  Select New Date
                </label>
                <input
                  type="date"
                  className="form-input"
                  min={new Date().toISOString().split("T")[0]}
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  required
                  style={{ minHeight: "48px", width: "100%" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.35rem" }}>
                  Select Time Slot
                </label>
                <select
                  className="form-input"
                  value={newSlot}
                  onChange={(e) => setNewSlot(e.target.value)}
                  style={{ minHeight: "48px", width: "100%" }}
                >
                  {["09:30 AM", "10:30 AM", "11:30 AM", "02:00 PM", "04:30 PM", "06:00 PM"].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end", marginTop: "0.5rem" }}>
                <button
                  type="button"
                  onClick={() => setReschedulingAppt(null)}
                  className="btn-secondary"
                  style={{ minHeight: "48px" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="btn-primary"
                  style={{ minHeight: "48px" }}
                >
                  {isUpdating ? "Rescheduling..." : "Save Rescheduled Slot"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

