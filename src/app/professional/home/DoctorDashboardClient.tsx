"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Stethoscope,
  CalendarCheck2,
  Clock,
  User,
  Video,
  FileCheck2,
  CheckCircle2,
  AlertCircle,
  Award,
  Sparkles,
  Loader2,
  Plus,
} from "lucide-react";
import { ConsultationAppointment, PrescriptionRecord } from "@/lib/types";
import DoctorIssuePrescriptionModal from "@/components/prescription/DoctorIssuePrescriptionModal";
import { AuthUser } from "@/lib/auth-service";

interface Props {
  user: AuthUser;
}

export default function DoctorDashboardClient({ user }: Props) {
  const [appointments, setAppointments] = useState<ConsultationAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApptForRx, setSelectedApptForRx] = useState<ConsultationAppointment | null>(null);
  const [rxSuccessMsg, setRxSuccessMsg] = useState<string | null>(null);
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);

  const fetchAppointments = () => {
    setLoading(true);
    fetch("/api/consultations/appointments")
      .then((res) => res.json())
      .then((data) => {
        if (data.appointments) setAppointments(data.appointments);
      })
      .catch((err) => console.warn(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleUpdateStatus = async (appointmentId: string, newStatus: string) => {
    setStatusUpdatingId(appointmentId);
    try {
      const res = await fetch(`/api/consultations/appointments/${appointmentId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchAppointments();
      }
    } catch {
      alert("Failed to update status");
    } finally {
      setStatusUpdatingId(null);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Welcome & Credentials Strip */}
      <div
        className="dashboard-card"
        style={{
          padding: "2rem 2.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1.5rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "16px",
              background: "var(--color-primary-subtle)",
              color: "var(--color-accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Stethoscope size={30} />
          </div>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8rem", fontWeight: 700, color: "var(--color-success)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.25rem" }}>
              <Award size={15} />
              <span>NMC Verified Practitioner • Telemedicine License Active</span>
            </div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 800 }}>
              {user.fullName || "Dr. Medical Practitioner"}
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", marginTop: "0.2rem" }}>
              General Medicine &amp; Acute Care • Consultations Fee: <strong>₹499</strong>
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <Link
            href="/prescriptions"
            className="btn-secondary"
            style={{ minHeight: "44px", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
          >
            <FileCheck2 size={16} />
            <span>All Issued e-Prescriptions</span>
          </Link>
        </div>
      </div>

      {rxSuccessMsg && (
        <div style={{ padding: "1rem 1.25rem", borderRadius: "10px", background: "var(--color-success-bg)", color: "var(--color-success)", border: "1px solid var(--color-success)", fontSize: "0.9rem", fontWeight: 600 }}>
          ✓ {rxSuccessMsg}
        </div>
      )}

      {/* Booked Appointments & Incoming Consultation Requests */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <CalendarCheck2 size={22} color="var(--color-accent)" />
            <h2 style={{ fontSize: "1.35rem", fontWeight: 800 }}>Assigned Telehealth Appointments</h2>
            <span style={{ fontSize: "0.8rem", padding: "2px 8px", borderRadius: "10px", background: "var(--color-primary-subtle)", color: "var(--color-accent)", fontWeight: 700 }}>
              {appointments.length}
            </span>
          </div>

          <button
            type="button"
            onClick={fetchAppointments}
            className="btn-secondary"
            style={{ minHeight: "36px", padding: "0 0.85rem", fontSize: "0.82rem" }}
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "3rem" }}>
            <Loader2 size={32} className="animate-spin" color="var(--color-accent)" />
          </div>
        ) : appointments.length === 0 ? (
          <div className="dashboard-card" style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>
            No incoming patient appointments scheduled currently.
          </div>
        ) : (
          <div className="linear-container">
            {appointments.map((appt) => (
              <div
                key={appt.id}
                className="linear-card"
                style={{
                  padding: "1.5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "1.25rem",
                  borderRadius: "16px",
                  border: "1px solid var(--border-subtle)",
                  background: "var(--bg-surface)",
                }}
              >
                {/* Left: Patient and Assessment information */}
                <div style={{ flex: "1 1 360px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.4rem" }}>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: "8px",
                        textTransform: "uppercase",
                        background: appt.status === "confirmed" ? "var(--color-success-bg)" : "var(--color-primary-subtle)",
                        color: appt.status === "confirmed" ? "var(--color-success)" : "var(--color-accent)",
                      }}
                    >
                      {appt.status.toUpperCase()}
                    </span>
                    <span style={{ fontSize: "0.82rem", color: "var(--text-muted)", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                      <Clock size={14} />
                      {appt.appointmentDate} at {appt.timeSlot}
                    </span>
                  </div>

                  <h3 style={{ fontSize: "1.15rem", fontWeight: 700 }}>
                    Patient: {appt.patientName}
                  </h3>

                  {/* Submitted Symptom Assessment Reason */}
                  <div style={{ fontSize: "0.88rem", color: "var(--text-secondary)", marginTop: "0.35rem", padding: "0.6rem 0.85rem", borderRadius: "8px", background: "var(--bg-card)", border: "1px solid var(--border-subtle)" }}>
                    <strong style={{ color: "var(--text-primary)" }}>Reported Symptoms &amp; Notes: </strong>
                    {appt.reason}
                  </div>
                </div>

                {/* Right: Actions (Join Video, Change Status, Issue e-Prescription) */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", alignItems: "flex-end" }}>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <a
                      href={appt.meetingLink || `https://meet.appie-health.in/room/telehealth-${appt.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary"
                      style={{ minHeight: "38px", padding: "0 1rem", fontSize: "0.82rem", display: "inline-flex", alignItems: "center", gap: "0.4rem", textDecoration: "none" }}
                    >
                      <Video size={15} />
                      <span>Launch Video Call</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => setSelectedApptForRx(appt)}
                      className="btn-secondary"
                      style={{ minHeight: "38px", padding: "0 1rem", fontSize: "0.82rem", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
                    >
                      <FileCheck2 size={15} />
                      <span>Issue Prescription</span>
                    </button>
                  </div>

                  {/* Status Toggle */}
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Status:</span>
                    <select
                      className="form-input"
                      value={appt.status}
                      disabled={statusUpdatingId === appt.id}
                      onChange={(e) => handleUpdateStatus(appt.id, e.target.value)}
                      style={{ minHeight: "32px", padding: "2px 8px", fontSize: "0.8rem", width: "auto" }}
                    >
                      <option value="confirmed">Confirmed</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Doctor Issue Prescription Modal */}
      {selectedApptForRx && (
        <DoctorIssuePrescriptionModal
          patientId={selectedApptForRx.patientId}
          patientName={selectedApptForRx.patientName}
          appointmentId={selectedApptForRx.id}
          onClose={() => setSelectedApptForRx(null)}
          onSuccess={(rx: PrescriptionRecord) => {
            setSelectedApptForRx(null);
            setRxSuccessMsg(
              `E-Prescription ${rx.prescriptionCode} issued successfully to ${selectedApptForRx.patientName} and synchronized to their e-Prescriptions section.`
            );
            setTimeout(() => setRxSuccessMsg(null), 6000);
            fetchAppointments();
          }}
        />
      )}
    </div>
  );
}
