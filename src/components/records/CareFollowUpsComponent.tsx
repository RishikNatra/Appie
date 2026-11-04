"use client";

import { useState } from "react";
import { CareFollowUpItem, FollowUpStatus, FollowUpType } from "@/lib/types";
import {
  Calendar,
  CheckCircle2,
  Clock,
  RotateCcw,
  Stethoscope,
  Activity,
  Pill,
  FileText,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";

interface CareFollowUpsComponentProps {
  followUps: CareFollowUpItem[];
  onRefresh: () => void;
}

export default function CareFollowUpsComponent({
  followUps,
  onRefresh,
}: CareFollowUpsComponentProps) {
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleUpdateStatus = async (id: string, status: FollowUpStatus) => {
    setUpdatingId(id);
    try {
      const res = await fetch("/api/records/follow-ups", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ followUpId: id, status }),
      });
      if (res.ok) onRefresh();
    } catch (err) {
      alert("Failed to update follow-up");
    } finally {
      setUpdatingId(null);
    }
  };

  const getIconForType = (type: FollowUpType) => {
    switch (type) {
      case "doctor_review":
        return <Stethoscope size={18} color="var(--color-primary)" />;
      case "symptom_recheck":
        return <Activity size={18} color="var(--color-accent)" />;
      case "medication_refill":
        return <Pill size={18} color="var(--color-success)" />;
      case "lab_test":
        return <FileText size={18} color="var(--color-primary)" />;
    }
  };

  const pendingList = followUps.filter((f) => f.status === "pending");
  const completedList = followUps.filter((f) => f.status === "completed");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div>
        <h3 style={{ fontSize: "1.15rem", fontWeight: 800 }}>
          Scheduled Care Follow-Ups ({pendingList.length} Due)
        </h3>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
          Automated clinical alerts for doctor re-consultations, symptom tracking milestones, and medicine renewals.
        </p>
      </div>

      {pendingList.length === 0 ? (
        <div
          className="dashboard-card"
          style={{ textAlign: "center", padding: "2.5rem 1.5rem", color: "var(--text-secondary)" }}
        >
          <CheckCircle2 size={36} color="var(--color-success)" style={{ margin: "0 auto 0.5rem" }} />
          <h4 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "0.2rem" }}>
            All Care Follow-Ups Completed
          </h4>
          <p style={{ fontSize: "0.85rem" }}>No pending doctor reviews or medication refill alerts.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          {pendingList.map((fu) => {
            const isDueToday = fu.dueDate === new Date().toISOString().split("T")[0];
            return (
              <div
                key={fu.id}
                className="dashboard-card"
                style={{
                  padding: "1.25rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "1rem",
                  borderLeft: isDueToday ? "4px solid var(--color-error)" : "4px solid var(--color-accent)",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: "0.85rem", flex: "1 1 320px" }}>
                  <div
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "10px",
                      background: "var(--bg-surface)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {getIconForType(fu.followUpType)}
                  </div>

                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.2rem" }}>
                      <h4 style={{ fontSize: "1rem", fontWeight: 700 }}>{fu.title}</h4>
                      <span
                        style={{
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          padding: "2px 7px",
                          borderRadius: "8px",
                          background: isDueToday ? "var(--color-error-bg)" : "rgba(255, 178, 0, 0.15)",
                          color: isDueToday ? "var(--color-error)" : "var(--color-accent)",
                        }}
                      >
                        {isDueToday ? "Due Today" : `Due: ${fu.dueDate}`}
                      </span>
                    </div>

                    <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>
                      {fu.description}
                    </p>

                    {fu.doctorName && (
                      <span style={{ fontSize: "0.78rem", color: "var(--color-accent)", marginTop: "0.2rem", display: "block" }}>
                        Attending Physician: {fu.doctorName}
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  {fu.followUpType === "doctor_review" && (
                    <Link
                      href="/consultations"
                      className="btn-primary"
                      style={{ minHeight: "42px", fontSize: "0.82rem", padding: "0 1rem", textDecoration: "none" }}
                    >
                      Book Free Follow-Up
                    </Link>
                  )}

                  {fu.followUpType === "symptom_recheck" && (
                    <Link
                      href="/assessment/tracking"
                      className="btn-primary"
                      style={{ minHeight: "42px", fontSize: "0.82rem", padding: "0 1rem", textDecoration: "none" }}
                    >
                      Log Symptom Score
                    </Link>
                  )}

                  {fu.followUpType === "medication_refill" && (
                    <Link
                      href="/medications"
                      className="btn-primary"
                      style={{ minHeight: "42px", fontSize: "0.82rem", padding: "0 1rem", textDecoration: "none" }}
                    >
                      Refill Medicines
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(fu.id, "completed")}
                    disabled={updatingId === fu.id}
                    className="btn-secondary"
                    style={{ minHeight: "42px", fontSize: "0.82rem", padding: "0 0.85rem" }}
                  >
                    <CheckCircle2 size={15} />
                    <span>Done</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Completed Follow-ups Accordion / History */}
      {completedList.length > 0 && (
        <div style={{ marginTop: "1rem" }}>
          <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "0.5rem" }}>
            Completed Follow-Ups ({completedList.length})
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {completedList.map((fu) => (
              <div
                key={fu.id}
                style={{
                  background: "var(--bg-surface)",
                  borderRadius: "8px",
                  padding: "0.75rem 1rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: "0.82rem",
                  color: "var(--text-muted)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <CheckCircle2 size={14} color="var(--color-success)" />
                  <span style={{ textDecoration: "line-through" }}>{fu.title}</span>
                </div>
                <span>Completed</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

