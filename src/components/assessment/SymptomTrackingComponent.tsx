"use client";

import { useState, useEffect } from "react";
import {
  Activity,
  Calendar,
  Clock,
  TrendingDown,
  TrendingUp,
  Minus,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Save,
  Loader2,
  ChevronRight,
  ArrowRight,
  Sparkles,
  X,
} from "lucide-react";
import { SymptomTrackerRecord, SymptomProgressPoint } from "@/lib/types";

export default function SymptomTrackingComponent() {
  const [trackers, setTrackers] = useState<SymptomTrackerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTracker, setSelectedTracker] = useState<SymptomTrackerRecord | null>(null);

  // Update modal / drawer state (Symptom Update Component)
  const [updatingTrackerId, setUpdatingTrackerId] = useState<string | null>(null);
  const [updateSeverity, setUpdateSeverity] = useState<number>(4);
  const [updateStatus, setUpdateStatus] = useState<"improving" | "stable" | "worsening" | "resolved">("improving");
  const [updateNotes, setUpdateNotes] = useState("");
  const [submittingUpdate, setSubmittingUpdate] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchTrackers = () => {
    fetch("/api/symptom-tracker/list")
      .then((res) => res.json())
      .then((data) => {
        if (data.trackers) {
          setTrackers(data.trackers);
          if (!selectedTracker && data.trackers.length > 0) {
            setSelectedTracker(data.trackers[0]);
          } else if (selectedTracker) {
            const updatedMatch = data.trackers.find((t: any) => t.id === selectedTracker.id);
            if (updatedMatch) setSelectedTracker(updatedMatch);
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTrackers();
  }, []);

  const handleOpenUpdate = (tracker: SymptomTrackerRecord) => {
    setUpdatingTrackerId(tracker.id);
    setUpdateSeverity(tracker.severity);
    setUpdateStatus(tracker.status);
    setUpdateNotes("");
    setFeedback(null);
  };

  const handleSaveProgress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updatingTrackerId) return;

    setSubmittingUpdate(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/symptom-tracker/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trackerId: updatingTrackerId,
          severity: Number(updateSeverity),
          status: updateStatus,
          notes: updateNotes.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setFeedback({ type: "error", text: data.error || "Failed to log progress." });
      } else {
        setFeedback({ type: "success", text: "Today's symptom progress point logged successfully!" });
        setUpdatingTrackerId(null);
        fetchTrackers();
      }
    } catch {
      setFeedback({ type: "error", text: "Network error occurred." });
    } finally {
      setSubmittingUpdate(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "improving":
        return {
          icon: <TrendingDown size={14} color="var(--color-success)" />,
          text: "Improving",
          bg: "rgba(34, 197, 94, 0.12)",
          color: "var(--color-success)",
          border: "rgba(34, 197, 94, 0.4)",
        };
      case "worsening":
        return {
          icon: <TrendingUp size={14} color="var(--color-error)" />,
          text: "Worsening",
          bg: "rgba(239, 68, 68, 0.12)",
          color: "var(--color-error)",
          border: "rgba(239, 68, 68, 0.4)",
        };
      case "resolved":
        return {
          icon: <CheckCircle2 size={14} color="var(--color-success)" />,
          text: "Resolved",
          bg: "rgba(34, 197, 94, 0.15)",
          color: "var(--color-success)",
          border: "var(--color-success)",
        };
      default:
        return {
          icon: <Minus size={14} color="var(--color-accent)" />,
          text: "Stable",
          bg: "rgba(255, 178, 0, 0.12)",
          color: "var(--color-accent)",
          border: "rgba(255, 178, 0, 0.4)",
        };
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "4rem 0" }}>
        <Loader2 size={36} className="animate-spin" color="var(--color-accent)" />
      </div>
    );
  }

  // Symptom Summary Component Metrics
  const activeCount = trackers.filter((t) => t.status !== "resolved").length;
  const improvingCount = trackers.filter((t) => t.status === "improving").length;
  const resolvedCount = trackers.filter((t) => t.status === "resolved").length;

  return (
    <div style={{ width: "100%" }}>
      {feedback && (
        <div className={`alert-box ${feedback.type === "success" ? "alert-success" : "alert-error"}`}>
          {feedback.type === "success" ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Symptom Summary Component: High-level metrics */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1rem",
          marginBottom: "1.75rem",
        }}
      >
        <div className="dashboard-card" style={{ padding: "1.5rem", textAlign: "left" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--color-accent)", marginBottom: "0.4rem" }}>
            <Activity size={18} />
            <span style={{ fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase" }}>Active Symptoms</span>
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 800 }}>{activeCount}</div>
          <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Monitored daily</span>
        </div>

        <div className="dashboard-card" style={{ padding: "1.5rem", textAlign: "left" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--color-success)", marginBottom: "0.4rem" }}>
            <TrendingDown size={18} />
            <span style={{ fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase" }}>Improving Trajectory</span>
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--color-success)" }}>
            {improvingCount}
          </div>
          <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Demonstrating positive recovery</span>
        </div>

        <div className="dashboard-card" style={{ padding: "1.5rem", textAlign: "left" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--color-primary)", marginBottom: "0.4rem" }}>
            <CheckCircle2 size={18} />
            <span style={{ fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase" }}>Resolved Concerns</span>
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 800 }}>{resolvedCount}</div>
          <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Fully cleared symptoms</span>
        </div>
      </div>

      {/* Grid: Active Symptoms Component & Progress / Timeline Screen */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.35fr", gap: "1.75rem" }}>
        {/* Left Column: Active Symptoms Component */}
        <div className="dashboard-card" style={{ textAlign: "left", padding: "1.75rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
            <h2 className="section-title" style={{ margin: 0, fontSize: "1.2rem" }}>
              Active Trackers ({trackers.length})
            </h2>
          </div>

          {trackers.length === 0 ? (
            <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", padding: "1rem 0" }}>
              No ongoing symptoms currently tracked. Generate a new health assessment to initiate daily tracking.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {trackers.map((tracker) => {
                const badge = getStatusBadge(tracker.status);
                const isSelected = selectedTracker?.id === tracker.id;

                return (
                  <div
                    key={tracker.id}
                    onClick={() => setSelectedTracker(tracker)}
                    style={{
                      padding: "1.1rem 1.25rem",
                      borderRadius: "14px",
                      backgroundColor: isSelected ? "var(--color-primary-subtle)" : "var(--bg-surface)",
                      border: "1.5px solid",
                      borderColor: isSelected ? "var(--color-accent)" : "var(--border-subtle)",
                      cursor: "pointer",
                      transition: "all 250ms ease-in-out",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.4rem" }}>
                      <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-primary)" }}>
                        {tracker.symptomName}
                      </h3>

                      {/* Symptom Status Component */}
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          padding: "0.2rem 0.55rem",
                          borderRadius: "9999px",
                          backgroundColor: badge.bg,
                          color: badge.color,
                          border: `1px solid ${badge.border}`,
                        }}
                      >
                        {badge.icon}
                        <span>{badge.text}</span>
                      </span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>
                      <span>Day {tracker.daysActive} active</span>
                      <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>
                        Severity: {tracker.severity}/10
                      </span>
                    </div>

                    {/* Symptom Tracking Action Component */}
                    <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.85rem" }}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenUpdate(tracker);
                        }}
                        className="btn-secondary"
                        style={{
                          minHeight: "36px",
                          padding: "0 0.85rem",
                          fontSize: "0.82rem",
                          flex: 1,
                        }}
                      >
                        Log Day Progress
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Symptom Progress Screen (Chart & Timeline Component) */}
        {selectedTracker ? (
          <div className="dashboard-card" style={{ textAlign: "left", padding: "1.75rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem", flexWrap: "wrap", gap: "1rem" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <h2 style={{ fontSize: "1.35rem", fontWeight: 800 }}>
                    {selectedTracker.symptomName} Progress
                  </h2>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      padding: "0.2rem 0.6rem",
                      borderRadius: "9999px",
                      backgroundColor: getStatusBadge(selectedTracker.status).bg,
                      color: getStatusBadge(selectedTracker.status).color,
                      border: `1px solid ${getStatusBadge(selectedTracker.status).border}`,
                    }}
                  >
                    {getStatusBadge(selectedTracker.status).text}
                  </span>
                </div>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                  Progression timeline and day-by-day clinical severity log
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleOpenUpdate(selectedTracker)}
                className="btn-primary"
                style={{ minHeight: "40px", padding: "0 1rem", fontSize: "0.85rem", width: "auto" }}
              >
                <Plus size={16} />
                <span>Log Today&apos;s Severity</span>
              </button>
            </div>

            {/* Symptom Progress Chart Component (Visual day-by-day severity progression) */}
            <div
              style={{
                backgroundColor: "var(--bg-surface)",
                borderRadius: "16px",
                padding: "1.5rem",
                border: "1px solid var(--border-subtle)",
                marginBottom: "1.75rem",
              }}
            >
              <h3 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "1rem", color: "var(--text-primary)" }}>
                Severity Progression Curve (10-Point Scale)
              </h3>

              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  gap: "1.5rem",
                  height: "140px",
                  paddingTop: "1rem",
                  borderBottom: "1.5px solid var(--border-medium)",
                }}
              >
                {selectedTracker.timeline.map((point, idx) => {
                  const heightPercent = (point.severity / 10) * 100;
                  return (
                    <div
                      key={idx}
                      style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        height: "100%",
                        justifyContent: "flex-end",
                      }}
                    >
                      <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--color-accent)", marginBottom: "4px" }}>
                        {point.severity}/10
                      </span>
                      <div
                        style={{
                          width: "100%",
                          maxWidth: "42px",
                          height: `${heightPercent}%`,
                          minHeight: "12px",
                          borderRadius: "8px 8px 2px 2px",
                          background: "linear-gradient(180deg, var(--color-accent), var(--color-primary))",
                          transition: "height 250ms ease-in-out",
                        }}
                      />
                      <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "6px" }}>
                        Day {point.day}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Symptom Timeline Component */}
            <div>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "0.75rem" }}>
                Chronological Observation Log
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {selectedTracker.timeline.map((point, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: "0.85rem 1rem",
                      borderRadius: "12px",
                      backgroundColor: "var(--bg-surface)",
                      border: "1px solid var(--border-subtle)",
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: "1rem",
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span style={{ fontWeight: 800, fontSize: "0.92rem", color: "var(--text-primary)" }}>
                          Day {point.day} — {point.date}
                        </span>
                        <span style={{ fontSize: "0.75rem", color: "var(--color-accent)", fontWeight: 700 }}>
                          Severity {point.severity}/10
                        </span>
                      </div>
                      <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                        {point.notes}
                      </p>
                    </div>

                    <span
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        textTransform: "capitalize",
                        color: getStatusBadge(point.status).color,
                        padding: "2px 8px",
                        borderRadius: "6px",
                        backgroundColor: getStatusBadge(point.status).bg,
                      }}
                    >
                      {point.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="dashboard-card" style={{ padding: "3rem", textAlign: "center" }}>
            <Activity size={36} color="var(--color-accent)" style={{ margin: "0 auto 1rem" }} />
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Select a Symptom Tracker</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", maxWidth: "340px", margin: "0 auto" }}>
              Click on any tracked symptom on the left to inspect its progression chart and timeline.
            </p>
          </div>
        )}
      </div>

      {/* Symptom Update Component Modal */}
      {updatingTrackerId && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: "1rem",
          }}
          onClick={() => setUpdatingTrackerId(null)}
        >
          <div
            className="auth-card"
            style={{ maxWidth: "480px", margin: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 800 }}>Log Daily Symptom Update</h2>
              <button
                type="button"
                className="chip-delete-btn"
                onClick={() => setUpdatingTrackerId(null)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProgress}>
              <div className="form-group">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
                  <label className="form-label">Current Severity Level (1 - 10)</label>
                  <span style={{ fontWeight: 800, color: "var(--color-accent)" }}>
                    {updateSeverity}/10
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={updateSeverity}
                  onChange={(e) => setUpdateSeverity(Number(e.target.value))}
                  style={{ width: "100%", accentColor: "var(--color-accent)", height: "8px" }}
                />
              </div>

              <div className="form-group" style={{ marginTop: "1rem" }}>
                <label className="form-label">Progression Status</label>
                <select
                  className="form-select"
                  value={updateStatus}
                  onChange={(e) => setUpdateStatus(e.target.value as any)}
                >
                  <option value="improving">Improving (Pain/Discomfort diminishing)</option>
                  <option value="stable">Stable (No notable change)</option>
                  <option value="worsening">Worsening (Escalating discomfort)</option>
                  <option value="resolved">Resolved (Symptom fully cleared)</option>
                </select>
              </div>

              <div className="form-group" style={{ marginTop: "1rem" }}>
                <label className="form-label">Observations & Response to Care</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder="e.g. Throat feels less scratchy after saline gargles. Able to swallow solid food."
                  value={updateNotes}
                  onChange={(e) => setUpdateNotes(e.target.value)}
                />
              </div>

              <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setUpdatingTrackerId(null)}
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={submittingUpdate}
                  style={{ flex: 1.5 }}
                >
                  {submittingUpdate ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Log Progress Point</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
