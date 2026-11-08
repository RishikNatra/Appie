"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Activity,
  FileText,
  Search,
  Filter,
  ArrowUpDown,
  Sparkles,
  Stethoscope,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Settings,
  X,
  ChevronRight,
} from "lucide-react";
import { HealthAssessmentRecord, ConsultationAppointment } from "@/lib/types";

export default function RecordsPage() {
  const [assessments, setAssessments] = useState<HealthAssessmentRecord[]>([]);
  const [consultations, setConsultations] = useState<ConsultationAppointment[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter & Sort
  const [searchQuery, setSearchQuery] = useState("");
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [sortModalOpen, setSortModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<"all" | "assessments" | "consultations">("all");
  const [sortBy, setSortBy] = useState<"date_desc" | "date_asc">("date_desc");

  const [selectedAssessment, setSelectedAssessment] = useState<HealthAssessmentRecord | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch("/api/assessment").then((r) => r.json()),
      fetch("/api/consultations/appointments").then((r) => r.json()),
    ])
      .then(([asmts, appts]) => {
        if (asmts.assessments) setAssessments(asmts.assessments);
        if (appts.appointments) setConsultations(appts.appointments);
      })
      .catch((err) => console.warn(err))
      .finally(() => setLoading(false));
  }, []);

  // Filtered & Sorted Assessments
  const filteredAssessments = assessments
    .filter((a) => {
      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;
      return (
        a.title.toLowerCase().includes(q) ||
        a.assessmentSummary.toLowerCase().includes(q) ||
        a.symptoms.some((s) => s.name.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => {
      const da = new Date(a.createdAt).getTime();
      const db = new Date(b.createdAt).getTime();
      return sortBy === "date_desc" ? db - da : da - db;
    });

  // Filtered & Sorted Consultations
  const filteredConsultations = consultations
    .filter((c) => {
      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;
      return (
        (c.doctorName || '').toLowerCase().includes(q) ||
        (c.doctorSpecialization || '').toLowerCase().includes(q) ||
        (c.reason || '').toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      const da = new Date(a.appointmentDate).getTime();
      const db = new Date(b.appointmentDate).getTime();
      return sortBy === "date_desc" ? db - da : da - db;
    });

  return (
    <>
      {/* Persistent Top Navigation Bar */}
      <header className="app-header" style={{ position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          {/* 1. Appie logo and text */}
          <Link href="/patient/home" className="brand-logo-wrap" title="Appie Patient Dashboard">
            <div className="brand-icon-box">
              <Activity size={22} strokeWidth={2.5} />
            </div>
            <div>
              <span className="brand-name">Appie</span>
            </div>
          </Link>

          {/* 2-7. Patient Persistent Nav items */}
          <nav style={{ display: "flex", alignItems: "center", gap: "0.25rem", flexWrap: "wrap" }}>
            <Link href="/assessment" className="form-link" style={{ minHeight: "40px", padding: "0 0.75rem", fontSize: "0.88rem", fontWeight: 600 }}>
              Health Assessment
            </Link>
            <Link href="/medications" className="form-link" style={{ minHeight: "40px", padding: "0 0.75rem", fontSize: "0.88rem", fontWeight: 600 }}>
              e-Pharmacy
            </Link>
            <Link href="/orders" className="form-link" style={{ minHeight: "40px", padding: "0 0.75rem", fontSize: "0.88rem", fontWeight: 600 }}>
              Orders
            </Link>
            <Link href="/prescriptions" className="form-link" style={{ minHeight: "40px", padding: "0 0.75rem", fontSize: "0.88rem", fontWeight: 600 }}>
              e-Prescriptions
            </Link>
            <Link href="/records" className="form-link" style={{ minHeight: "40px", padding: "0 0.75rem", fontSize: "0.88rem", fontWeight: 700, color: "var(--color-accent)" }}>
              Records
            </Link>
            <Link href="/account/profile" className="form-link" style={{ minHeight: "40px", padding: "0 0.75rem", fontSize: "0.88rem", fontWeight: 600 }}>
              Profile
            </Link>
          </nav>
        </div>

        {/* 8. Settings icon at extreme right */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <Link
            href="/account/settings"
            aria-label="Settings"
            title="Account & System Settings"
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "10px",
              border: "1px solid var(--border-subtle)",
              background: "var(--bg-card)",
              color: "var(--text-primary)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
            }}
          >
            <Settings size={19} />
          </Link>
        </div>
      </header>

      <main className="main-wrapper" style={{ maxWidth: "1100px", width: "100%", padding: "1.5rem 1rem 4rem" }}>
        {/* Title */}
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "1.85rem", fontWeight: 800 }}>Clinical Medical Records</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", marginTop: "0.25rem" }}>
            Review past health assessments, AI evaluations, doctor consultations, and diagnostic histories.
          </p>
        </div>

        {/* Search Bar with Single Sort Icon & Single Filter Icon beside it */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            flexWrap: "wrap",
            marginBottom: "1.75rem",
          }}
        >
          {/* Search Bar */}
          <div style={{ flex: "1 1 320px", position: "relative" }}>
            <Search
              size={18}
              style={{
                position: "absolute",
                left: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted)",
              }}
            />
            <input
              type="text"
              className="form-input"
              placeholder="Search records by condition, doctor name, symptoms, or notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: "42px", minHeight: "46px" }}
            />
          </div>

          {/* Single Sort Icon Button */}
          <button
            type="button"
            onClick={() => setSortModalOpen(true)}
            aria-label="Sort records"
            style={{
              minHeight: "46px",
              padding: "0 1.1rem",
              borderRadius: "10px",
              border: "1px solid var(--border-subtle)",
              background: "var(--bg-surface)",
              color: "var(--text-primary)",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              cursor: "pointer",
              fontSize: "0.88rem",
              fontWeight: 600,
            }}
          >
            <ArrowUpDown size={18} />
            <span>Sort</span>
          </button>

          {/* Single Filter Icon Button */}
          <button
            type="button"
            onClick={() => setFilterModalOpen(true)}
            aria-label="Filter records"
            style={{
              minHeight: "46px",
              padding: "0 1.1rem",
              borderRadius: "10px",
              border: activeSection !== "all" ? "1.5px solid var(--color-accent)" : "1px solid var(--border-subtle)",
              background: "var(--bg-surface)",
              color: "var(--text-primary)",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              cursor: "pointer",
              fontSize: "0.88rem",
              fontWeight: 600,
            }}
          >
            <Filter size={18} />
            <span>Filter</span>
          </button>
        </div>

        {/* 2 Distinct Sections: 1. Assessment Records and 2. Consultation Records */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
          {/* SECTION 1: ASSESSMENT RECORDS */}
          {(activeSection === "all" || activeSection === "assessments") && (
            <section>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                <Sparkles size={20} color="var(--color-accent)" />
                <h2 style={{ fontSize: "1.3rem", fontWeight: 800 }}>1. Assessment Records</h2>
                <span style={{ fontSize: "0.8rem", padding: "2px 8px", borderRadius: "10px", background: "var(--color-primary-subtle)", color: "var(--color-accent)", fontWeight: 700 }}>
                  {filteredAssessments.length}
                </span>
              </div>

              <div className="linear-container">
                {filteredAssessments.length === 0 ? (
                  <div className="dashboard-card" style={{ textAlign: "center", padding: "2.5rem", color: "var(--text-muted)" }}>
                    No assessment records found. Complete a symptom assessment to log clinical history.
                  </div>
                ) : (
                  filteredAssessments.map((asmt) => (
                    <div
                      key={asmt.id}
                      className="linear-card"
                      style={{
                        padding: "1.25rem 1.5rem",
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
                      <div style={{ flex: "1 1 320px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.3rem" }}>
                          <span
                            style={{
                              fontSize: "0.72rem",
                              fontWeight: 700,
                              padding: "2px 8px",
                              borderRadius: "8px",
                              textTransform: "uppercase",
                              background: asmt.urgencyLevel === "high" || asmt.urgencyLevel === "emergency" ? "var(--color-error-bg)" : "var(--color-success-bg)",
                              color: asmt.urgencyLevel === "high" || asmt.urgencyLevel === "emergency" ? "var(--color-error)" : "var(--color-success)",
                            }}
                          >
                            Urgency: {asmt.urgencyLevel}
                          </span>
                          <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                            {new Date(asmt.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                          </span>
                        </div>

                        <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>{asmt.title}</h3>
                        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "0.25rem", lineHeight: 1.4 }}>
                          {asmt.assessmentSummary}
                        </p>
                        <div style={{ fontSize: "0.78rem", color: "var(--color-accent)", marginTop: "0.4rem", fontWeight: 600 }}>
                          Reported Symptoms: {asmt.symptoms.map((s) => `${s.name} (${s.severity}/5)`).join(", ")}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedAssessment(asmt)}
                        className="btn-secondary"
                        style={{ minHeight: "40px", padding: "0 1.1rem", fontSize: "0.85rem" }}
                      >
                        View Full Details
                      </button>
                    </div>
                  ))
                )}
              </div>
            </section>
          )}

          {/* SECTION 2: CONSULTATION RECORDS */}
          {(activeSection === "all" || activeSection === "consultations") && (
            <section>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                <Stethoscope size={20} color="var(--color-accent)" />
                <h2 style={{ fontSize: "1.3rem", fontWeight: 800 }}>2. Consultation Records</h2>
                <span style={{ fontSize: "0.8rem", padding: "2px 8px", borderRadius: "10px", background: "var(--color-primary-subtle)", color: "var(--color-accent)", fontWeight: 700 }}>
                  {filteredConsultations.length}
                </span>
              </div>

              <div className="linear-container">
                {filteredConsultations.length === 0 ? (
                  <div className="dashboard-card" style={{ textAlign: "center", padding: "2.5rem", color: "var(--text-muted)" }}>
                    No doctor consultations recorded yet.
                  </div>
                ) : (
                  filteredConsultations.map((appt) => (
                    <div
                      key={appt.id}
                      className="linear-card"
                      style={{
                        padding: "1.25rem 1.5rem",
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
                      <div style={{ flex: "1 1 320px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.3rem" }}>
                          <span style={{ fontSize: "0.75rem", fontWeight: 700, padding: "2px 8px", borderRadius: "8px", background: "var(--color-primary-subtle)", color: "var(--color-accent)" }}>
                            {appt.status.toUpperCase()}
                          </span>
                          <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                            Date: {appt.appointmentDate} at {appt.timeSlot}
                          </span>
                        </div>

                        <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>
                          Consultation with {appt.doctorName}
                        </h3>
                        <div style={{ fontSize: "0.82rem", color: "var(--color-accent)", fontWeight: 600 }}>
                          {appt.doctorSpecialization}
                        </div>
                        <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
                          Reason: {appt.reason}
                        </p>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: "1.15rem", fontWeight: 800 }}>₹{appt.feeAmount}</div>
                          <div style={{ fontSize: "0.75rem", color: "var(--color-success)", fontWeight: 600 }}>
                            {appt.paymentStatus === "paid" ? "Paid" : "Pending"}
                          </div>
                        </div>

                        <Link
                          href="/prescriptions"
                          className="btn-secondary"
                          style={{ minHeight: "40px", padding: "0 1rem", fontSize: "0.85rem", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
                        >
                          <FileText size={15} />
                          <span>e-Prescription</span>
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          )}
        </div>

        {/* Assessment Detail Modal */}
        {selectedAssessment && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0, 0, 0, 0.65)",
              backdropFilter: "blur(4px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              padding: "1rem",
            }}
          >
            <div className="dashboard-card" style={{ maxWidth: "560px", width: "100%", padding: "2rem", maxHeight: "85vh", overflowY: "auto" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h3 style={{ fontSize: "1.3rem", fontWeight: 800 }}>{selectedAssessment.title}</h3>
                <button
                  type="button"
                  onClick={() => setSelectedAssessment(null)}
                  style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
                >
                  <X size={20} />
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <p style={{ fontSize: "0.92rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                  {selectedAssessment.assessmentSummary}
                </p>

                <div>
                  <h4 style={{ fontSize: "0.9rem", fontWeight: 700, marginBottom: "0.4rem" }}>Reported Symptoms:</h4>
                  <ul style={{ paddingLeft: "1.25rem", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                    {selectedAssessment.symptoms.map((s, idx) => (
                      <li key={idx}>
                        <strong>{s.name}</strong> — Severity {s.severity}/5 ({s.frequency}, duration: {s.durationDays} days)
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 style={{ fontSize: "0.9rem", fontWeight: 700, marginBottom: "0.4rem" }}>Recommendations:</h4>
                  <ul style={{ paddingLeft: "1.25rem", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                    {selectedAssessment.recommendations.map((r, idx) => (
                      <li key={idx}>{r}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "1rem", display: "flex", justifyContent: "flex-end" }}>
                  <button
                    type="button"
                    onClick={() => setSelectedAssessment(null)}
                    className="btn-primary"
                    style={{ minHeight: "40px", padding: "0 1.25rem" }}
                  >
                    Close Record
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filter Modal */}
        {filterModalOpen && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0, 0, 0, 0.65)",
              backdropFilter: "blur(4px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              padding: "1rem",
            }}
          >
            <div className="dashboard-card" style={{ maxWidth: "380px", width: "100%", padding: "1.75rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Filter Record Types</h3>
                <button
                  type="button"
                  onClick={() => setFilterModalOpen(false)}
                  style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
                >
                  <X size={20} />
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {[
                  { id: "all", label: "All Records (Assessments & Consultations)" },
                  { id: "assessments", label: "Health Assessments Only" },
                  { id: "consultations", label: "Doctor Consultations Only" },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setActiveSection(s.id as any);
                      setFilterModalOpen(false);
                    }}
                    style={{
                      padding: "0.75rem 1rem",
                      borderRadius: "8px",
                      border: activeSection === s.id ? "1.5px solid var(--color-accent)" : "1px solid var(--border-subtle)",
                      background: activeSection === s.id ? "var(--color-primary-subtle)" : "var(--bg-surface)",
                      color: "var(--text-primary)",
                      fontSize: "0.88rem",
                      fontWeight: 600,
                      textAlign: "left",
                      cursor: "pointer",
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Sort Modal */}
        {sortModalOpen && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0, 0, 0, 0.65)",
              backdropFilter: "blur(4px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              padding: "1rem",
            }}
          >
            <div className="dashboard-card" style={{ maxWidth: "380px", width: "100%", padding: "1.75rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Sort Records</h3>
                <button
                  type="button"
                  onClick={() => setSortModalOpen(false)}
                  style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
                >
                  <X size={20} />
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {[
                  { id: "date_desc", label: "Date: Most Recent First" },
                  { id: "date_asc", label: "Date: Oldest First" },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setSortBy(s.id as any);
                      setSortModalOpen(false);
                    }}
                    style={{
                      padding: "0.75rem 1rem",
                      borderRadius: "8px",
                      border: sortBy === s.id ? "1.5px solid var(--color-accent)" : "1px solid var(--border-subtle)",
                      background: sortBy === s.id ? "var(--color-primary-subtle)" : "var(--bg-surface)",
                      color: "var(--text-primary)",
                      fontSize: "0.88rem",
                      fontWeight: 600,
                      textAlign: "left",
                      cursor: "pointer",
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
