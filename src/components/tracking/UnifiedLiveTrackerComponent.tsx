"use client";

import Link from "next/link";
import {
  Truck,
  CalendarCheck2,
  HeartPulse,
  ArrowRight,
  Clock,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

interface UnifiedLiveTrackerProps {
  activeOrderCode?: string;
  activeOrderStatus?: string;
  orderEta?: string;
  nextAppointmentDate?: string;
  nextAppointmentDoctor?: string;
  nextAppointmentSlot?: string;
  pendingFollowUpTitle?: string;
  pendingFollowUpDue?: string;
}

export default function UnifiedLiveTrackerComponent({
  activeOrderCode = "ORD-2026-78421",
  activeOrderStatus = "Dispatched via BlueDart Express",
  orderEta = "Arriving within 24 Hours",
  nextAppointmentDate = "Tomorrow",
  nextAppointmentDoctor = "Dr. Priya Sharma (General Physician)",
  nextAppointmentSlot = "10:30 AM",
  pendingFollowUpTitle = "Respiratory Symptom Re-Check",
  pendingFollowUpDue = "In 4 Days",
}: UnifiedLiveTrackerProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "1rem",
        marginBottom: "2rem",
      }}
    >
      {/* Live Tracker 1: Medicine Delivery */}
      <Link
        href="/orders"
        className="dashboard-card"
        style={{
          padding: "1.25rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: "0.75rem",
          textDecoration: "none",
          color: "inherit",
          border: "1.5px solid var(--border-accent)",
          background: "linear-gradient(135deg, rgba(255, 178, 0, 0.08), transparent)",
        }}
      >
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "0.75rem", fontWeight: 700, color: "var(--color-accent)" }}>
              <Truck size={14} /> LIVE MEDICINE DELIVERY
            </span>
            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontFamily: "monospace" }}>
              #{activeOrderCode}
            </span>
          </div>

          <h4 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "0.2rem" }}>
            {activeOrderStatus}
          </h4>
          <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
            Estimated Arrival: <strong>{orderEta}</strong>
          </p>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-subtle)", paddingTop: "0.5rem" }}>
          <span style={{ fontSize: "0.78rem", color: "var(--color-accent)", fontWeight: 700 }}>
            Track Live Shipment
          </span>
          <ArrowRight size={15} color="var(--color-accent)" />
        </div>
      </Link>

      {/* Live Tracker 2: Upcoming Doctor Telehealth Consultation */}
      <Link
        href="/consultations"
        className="dashboard-card"
        style={{
          padding: "1.25rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: "0.75rem",
          textDecoration: "none",
          color: "inherit",
          border: "1.5px solid var(--color-primary)",
          background: "linear-gradient(135deg, rgba(29, 52, 138, 0.15), transparent)",
        }}
      >
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "0.75rem", fontWeight: 700, color: "var(--color-primary)" }}>
              <CalendarCheck2 size={14} /> UPCOMING TELEHEALTH VISIT
            </span>
            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
              {nextAppointmentDate}
            </span>
          </div>

          <h4 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "0.2rem" }}>
            {nextAppointmentDoctor}
          </h4>
          <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
            Time Slot: <strong>{nextAppointmentSlot} (Video Consultation)</strong>
          </p>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-subtle)", paddingTop: "0.5rem" }}>
          <span style={{ fontSize: "0.78rem", color: "var(--color-accent)", fontWeight: 700 }}>
            Open Consultation Room
          </span>
          <ArrowRight size={15} color="var(--color-accent)" />
        </div>
      </Link>

      {/* Live Tracker 3: Care Follow-up Reminder */}
      <Link
        href="/records"
        className="dashboard-card"
        style={{
          padding: "1.25rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: "0.75rem",
          textDecoration: "none",
          color: "inherit",
          border: "1px solid var(--border-subtle)",
        }}
      >
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "0.75rem", fontWeight: 700, color: "var(--color-success)" }}>
              <CheckCircle2 size={14} /> CLINICAL FOLLOW-UP
            </span>
            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
              {pendingFollowUpDue}
            </span>
          </div>

          <h4 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "0.2rem" }}>
            {pendingFollowUpTitle}
          </h4>
          <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
            Follow-up review with clinician & symptom progression check
          </p>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-subtle)", paddingTop: "0.5rem" }}>
          <span style={{ fontSize: "0.78rem", color: "var(--color-accent)", fontWeight: 700 }}>
            View Health Records & Care Plan
          </span>
          <ArrowRight size={15} color="var(--color-accent)" />
        </div>
      </Link>
    </div>
  );
}

