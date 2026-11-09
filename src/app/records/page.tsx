"use client";

import { useEffect, useState, useRef } from "react";
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
  ChevronLeft,
  FolderLock,
  Upload,
  Download,
  FileCheck,
} from "lucide-react";
import { HealthAssessmentRecord, ConsultationAppointment } from "@/lib/types";
import NotificationBell from "@/components/notifications/NotificationBell";

export default function RecordsPage() {
  const [assessments, setAssessments] = useState<HealthAssessmentRecord[]>([]);
  const [consultations, setConsultations] = useState<ConsultationAppointment[]>([]);
  const [loading, setLoading] = useState(true);

  // Horizontal window active pane: "assessments" | "consultations" | "vault"
  const [activePane, setActivePane] = useState<"assessments" | "consultations" | "vault">("assessments");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Search & Filter & Sort
  const [searchQuery, setSearchQuery] = useState("");
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [sortModalOpen, setSortModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<"date_desc" | "date_asc">("date_desc");

  const [selectedAssessment, setSelectedAssessment] = useState<HealthAssessmentRecord | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadedRecords, setUploadedRecords] = useState([
    { id: "doc-1", name: "Complete_Blood_Count_Lab_Report.pdf", date: "2026-10-18", category: "Diagnostic Lab Test", size: "1.4 MB" },
    { id: "doc-2", name: "COVID19_Vaccination_Certificate.pdf", date: "2026-06-12", category: "Immunization", size: "840 KB" },
    { id: "doc-3", name: "Chest_XRay_Digital_Scan.pdf", date: "2026-03-04", category: "Radiology", size: "3.2 MB" },
  ]);
  const [newDocName, setNewDocName] = useState("");
  const [newDocCategory, setNewDocCategory] = useState("Diagnostic Lab Test");
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null);

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
        (c.doctorName || "").toLowerCase().includes(q) ||
        (c.doctorSpecialization || "").toLowerCase().includes(q) ||
        (c.reason || "").toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      const da = new Date(a.appointmentDate).getTime();
      const db = new Date(b.appointmentDate).getTime();
      return sortBy === "date_desc" ? db - da : da - db;
    });

  const scrollToPane = (index: number) => {
    if (scrollRef.current) {
      const paneWidth = scrollRef.current.clientWidth;
      scrollRef.current.scrollTo({
        left: paneWidth * index,
        behavior: "smooth",
      });
      if (index === 0) setActivePane("assessments");
      else if (index === 1) setActivePane("consultations");
      else if (index === 2) setActivePane("vault");
    }
  };

  const handleHorizontalScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const idx = Math.round(scrollLeft / clientWidth);
      if (idx === 0) setActivePane("assessments");
      else if (idx === 1) setActivePane("consultations");
      else if (idx === 2) setActivePane("vault");
    }
  };

  const handleSimulateUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName.trim()) return;
    const item = {
      id: "doc-" + Date.now(),
      name: newDocName.endsWith(".pdf") ? newDocName : `${newDocName}.pdf`,
      date: new Date().toISOString().split("T")[0],
      category: newDocCategory,
      size: "1.2 MB",
    };
    setUploadedRecords([item, ...uploadedRecords]);
    setUploadFeedback("Medical record securely encrypted and added to your health vault!");
    setTimeout(() => {
      setUploadFeedback(null);
      setUploadModalOpen(false);
      setNewDocName("");
    }, 1200);
  };

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

        {/* 8. Constant Notification & Settings icon at extreme right */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <NotificationBell />
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

      <main className="main-wrapper" style={{ maxWidth: "1150px", width: "100%", padding: "1.5rem 1rem 4rem" }}>
        {/* Title */}
        <div style={{ marginBottom: "1.5rem" }}>
          <h1 style={{ fontSize: "1.85rem", fontWeight: 800 }}>Clinical Medical Records</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", marginTop: "0.25rem" }}>
            Navigate horizontally through past assessments, doctor consultations, and your encrypted health vault.
          </p>
        </div>

        {/* Horizontal Navigation Control Pills (Similar to Assessment Page) */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "0.75rem",
            marginBottom: "1.75rem",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "0.35rem",
              borderRadius: "12px",
              background: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
              gap: "0.35rem",
              flexWrap: "wrap",
            }}
            role="tablist"
          >
            <button
              type="button"
              onClick={() => scrollToPane(0)}
              style={{
                padding: "0.6rem 1.25rem",
                borderRadius: "8px",
                border: "none",
                background: activePane === "assessments" ? "var(--color-primary)" : "transparent",
                color: activePane === "assessments" ? "#ffffff" : "var(--text-secondary)",
                fontWeight: 700,
                fontSize: "0.88rem",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                transition: "all 200ms ease",
              }}
            >
              <Sparkles size={16} />
              <span>1. Health Assessments</span>
              <span
                style={{
                  fontSize: "0.72rem",
                  padding: "1px 6px",
                  borderRadius: "10px",
                  background: activePane === "assessments" ? "rgba(255, 255, 255, 0.25)" : "var(--bg-surface)",
                  color: activePane === "assessments" ? "#ffffff" : "var(--color-accent)",
                }}
              >
                {filteredAssessments.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => scrollToPane(1)}
              style={{
                padding: "0.6rem 1.25rem",
                borderRadius: "8px",
                border: "none",
                background: activePane === "consultations" ? "var(--color-primary)" : "transparent",
                color: activePane === "consultations" ? "#ffffff" : "var(--text-secondary)",
                fontWeight: 700,
                fontSize: "0.88rem",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                transition: "all 200ms ease",
              }}
            >
              <Stethoscope size={16} />
              <span>2. Doctor Consultations</span>
              <span
                style={{
                  fontSize: "0.72rem",
                  padding: "1px 6px",
                  borderRadius: "10px",
                  background: activePane === "consultations" ? "rgba(255, 255, 255, 0.25)" : "var(--bg-surface)",
                  color: activePane === "consultations" ? "#ffffff" : "var(--color-accent)",
                }}
              >
                {filteredConsultations.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => scrollToPane(2)}
              style={{
                padding: "0.6rem 1.25rem",
                borderRadius: "8px",
                border: "none",
                background: activePane === "vault" ? "var(--color-primary)" : "transparent",
                color: activePane === "vault" ? "#ffffff" : "var(--text-secondary)",
                fontWeight: 700,
                fontSize: "0.88rem",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                transition: "all 200ms ease",
              }}
            >
              <FolderLock size={16} />
              <span>3. Health Vault & Documents</span>
              <span
                style={{
                  fontSize: "0.72rem",
                  padding: "1px 6px",
                  borderRadius: "10px",
                  background: activePane === "vault" ? "rgba(255, 255, 255, 0.25)" : "var(--bg-surface)",
                  color: activePane === "vault" ? "#ffffff" : "var(--text-muted)",
                }}
              >
                {uploadedRecords.length}
              </span>
            </button>
          </div>

          {/* Quick Horizontal Scroll Arrow Controls */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginRight: "0.25rem" }}>
              Slide horizontally:
            </span>
            <button
              type="button"
              onClick={() => {
                const currentIdx = activePane === "assessments" ? 0 : activePane === "consultations" ? 1 : 2;
                scrollToPane(Math.max(0, currentIdx - 1));
              }}
              className="btn-secondary"
              aria-label="Previous section"
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "8px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 0,
              }}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => {
                const currentIdx = activePane === "assessments" ? 0 : activePane === "consultations" ? 1 : 2;
                scrollToPane(Math.min(2, currentIdx + 1));
              }}
              className="btn-secondary"
              aria-label="Next section"
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "8px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 0,
              }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* ==============================================================
            HORIZONTAL SCROLLING WINDOW CONTAINER
            ============================================================== */}
        <div
          ref={scrollRef}
          onScroll={handleHorizontalScroll}
          style={{
            display: "flex",
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            scrollBehavior: "smooth",
            gap: "2rem",
            paddingBottom: "1.5rem",
            scrollbarWidth: "thin",
          }}
        >
          {/* ============================================================
              PANE 1: ASSESSMENT RECORDS
              ============================================================ */}
          <div
            style={{
              minWidth: "100%",
              width: "100%",
              flexShrink: 0,
              scrollSnapAlign: "start",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.75rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Sparkles size={20} color="var(--color-accent)" />
                <h2 style={{ fontSize: "1.3rem", fontWeight: 800 }}>1. AI Health Assessments</h2>
                <span style={{ fontSize: "0.8rem", padding: "2px 8px", borderRadius: "10px", background: "var(--color-primary-subtle)", color: "var(--color-accent)", fontWeight: 700 }}>
                  {filteredAssessments.length}
                </span>
              </div>
              <Link href="/assessment" className="form-link" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                + Start New Assessment
              </Link>
            </div>

            {/* Search Filter for Assessments */}
            <div style={{ marginBottom: "1rem" }}>
              <div style={{ position: "relative" }}>
                <Search size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Search symptom history, conditions, tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ paddingLeft: "42px", minHeight: "44px" }}
                />
              </div>
            </div>

            <div className="linear-container">
              {filteredAssessments.length === 0 ? (
                <div className="dashboard-card" style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>
                  <Sparkles size={36} style={{ margin: "0 auto 0.75rem", opacity: 0.5 }} />
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.25rem", color: "var(--text-primary)" }}>No assessments recorded</h3>
                  <p style={{ fontSize: "0.85rem" }}>Complete a symptom triage flow to log your first assessment record.</p>
                  <Link href="/assessment" className="btn-secondary" style={{ display: "inline-flex", minHeight: "38px", marginTop: "1rem", textDecoration: "none" }}>
                    Go to Health Assessment
                  </Link>
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
                        Symptoms: {asmt.symptoms.map((s) => `${s.name} (Lvl ${s.severity})`).join(", ")}
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
          </div>

          {/* ============================================================
              PANE 2: DOCTOR CONSULTATIONS
              ============================================================ */}
          <div
            style={{
              minWidth: "100%",
              width: "100%",
              flexShrink: 0,
              scrollSnapAlign: "start",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.75rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Stethoscope size={20} color="var(--color-accent)" />
                <h2 style={{ fontSize: "1.3rem", fontWeight: 800 }}>2. Consultation Appointments</h2>
                <span style={{ fontSize: "0.8rem", padding: "2px 8px", borderRadius: "10px", background: "var(--color-primary-subtle)", color: "var(--color-accent)", fontWeight: 700 }}>
                  {filteredConsultations.length}
                </span>
              </div>
              <Link href="/assessment" className="form-link" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                + Book Doctor Consult
              </Link>
            </div>

            <div className="linear-container">
              {filteredConsultations.length === 0 ? (
                <div className="dashboard-card" style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>
                  <Stethoscope size={36} style={{ margin: "0 auto 0.75rem", opacity: 0.5 }} />
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.25rem", color: "var(--text-primary)" }}>No doctor consultations recorded</h3>
                  <p style={{ fontSize: "0.85rem" }}>Schedule a telemedicine appointment from the consultations tab.</p>
                  <Link href="/assessment" className="btn-secondary" style={{ display: "inline-flex", minHeight: "38px", marginTop: "1rem", textDecoration: "none" }}>
                    Discover Verified Clinicians
                  </Link>
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
                        Clinical Reason: {appt.reason}
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
          </div>

          {/* ============================================================
              PANE 3: HEALTH VAULT & CLINICAL DOCUMENTS
              ============================================================ */}
          <div
            style={{
              minWidth: "100%",
              width: "100%",
              flexShrink: 0,
              scrollSnapAlign: "start",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.75rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <FolderLock size={20} color="var(--color-accent)" />
                <h2 style={{ fontSize: "1.3rem", fontWeight: 800 }}>3. Encrypted Health Vault & Documents</h2>
                <span style={{ fontSize: "0.8rem", padding: "2px 8px", borderRadius: "10px", background: "var(--color-primary-subtle)", color: "var(--color-accent)", fontWeight: 700 }}>
                  {uploadedRecords.length} Files
                </span>
              </div>
              <button
                type="button"
                onClick={() => setUploadModalOpen(true)}
                className="btn-primary"
                style={{ minHeight: "40px", padding: "0 1.25rem", fontSize: "0.85rem", display: "inline-flex", alignItems: "center", gap: "6px" }}
              >
                <Upload size={16} />
                <span>Upload New Medical Document</span>
              </button>
            </div>

            <div className="linear-container">
              {uploadedRecords.map((doc) => (
                <div
                  key={doc.id}
                  className="linear-card"
                  style={{
                    padding: "1.25rem 1.5rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "1.25rem",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "var(--color-primary-subtle)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-accent)", flexShrink: 0 }}>
                      <FileCheck size={22} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: "1rem", fontWeight: 700 }}>{doc.name}</h4>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                        Category: <strong>{doc.category}</strong> • Added: {doc.date} • {doc.size}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      type="button"
                      onClick={() => alert(`Downloading secure encrypted document: ${doc.name}`)}
                      className="btn-secondary"
                      style={{ minHeight: "38px", padding: "0 0.85rem", fontSize: "0.82rem", display: "inline-flex", alignItems: "center", gap: "5px" }}
                    >
                      <Download size={14} />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Assessment Details Modal */}
        {selectedAssessment && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0, 0, 0, 0.75)",
              backdropFilter: "blur(6px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              padding: "1rem",
            }}
          >
            <div className="dashboard-card" style={{ maxWidth: "600px", width: "100%", maxHeight: "88vh", overflowY: "auto", padding: "2rem", position: "relative" }}>
              <button
                type="button"
                onClick={() => setSelectedAssessment(null)}
                style={{ position: "absolute", top: "1.25rem", right: "1.25rem", background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
              >
                <X size={20} />
              </button>

              <h2 style={{ fontSize: "1.35rem", fontWeight: 800, marginBottom: "0.5rem" }}>{selectedAssessment.title}</h2>
              <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "1.25rem" }}>
                Assessment Date: {new Date(selectedAssessment.createdAt).toLocaleString()}
              </div>

              <div style={{ border: "1px solid var(--border-subtle)", borderRadius: "10px", padding: "1rem", marginBottom: "1rem", background: "var(--bg-surface)" }}>
                <h4 style={{ fontSize: "0.88rem", fontWeight: 700, marginBottom: "0.3rem" }}>AI Clinical Summary</h4>
                <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                  {selectedAssessment.assessmentSummary}
                </p>
              </div>

              <div style={{ marginBottom: "1.25rem" }}>
                <h4 style={{ fontSize: "0.88rem", fontWeight: 700, marginBottom: "0.5rem" }}>Reported Symptoms:</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  {selectedAssessment.symptoms.map((s, i) => (
                    <div key={i} style={{ fontSize: "0.82rem", padding: "0.4rem 0.75rem", borderRadius: "6px", background: "var(--bg-surface)", border: "1px solid var(--border-subtle)", display: "flex", justifyContent: "space-between" }}>
                      <span><strong>{s.name}</strong></span>
                      <span style={{ color: "var(--color-accent)" }}>Severity {s.severity}/5</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => setSelectedAssessment(null)}
                  className="btn-primary"
                  style={{ minHeight: "40px", padding: "0 1.25rem" }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Upload Medical Document Modal */}
        {uploadModalOpen && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0, 0, 0, 0.75)",
              backdropFilter: "blur(6px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              padding: "1rem",
            }}
          >
            <div className="dashboard-card" style={{ maxWidth: "480px", width: "100%", padding: "2rem", position: "relative" }}>
              <button
                type="button"
                onClick={() => setUploadModalOpen(false)}
                style={{ position: "absolute", top: "1.25rem", right: "1.25rem", background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
              >
                <X size={20} />
              </button>

              <h2 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "0.5rem" }}>Upload Health Document</h2>
              <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: "1.25rem" }}>
                Store diagnostic lab reports, discharge summaries, or vaccination records securely.
              </p>

              <form onSubmit={handleSimulateUpload} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <label className="form-label">Document Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Thyroid_Profile_Report_2026.pdf"
                    value={newDocName}
                    onChange={(e) => setNewDocName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="form-label">Category</label>
                  <select
                    className="form-input"
                    value={newDocCategory}
                    onChange={(e) => setNewDocCategory(e.target.value)}
                  >
                    <option value="Diagnostic Lab Test">Diagnostic Lab Test</option>
                    <option value="Immunization">Immunization & Vaccine</option>
                    <option value="Radiology">Radiology & Imaging</option>
                    <option value="Prescription Slip">Physical Prescription Slip</option>
                    <option value="Discharge Summary">Hospital Discharge Summary</option>
                  </select>
                </div>

                {uploadFeedback && (
                  <div style={{ padding: "0.6rem 0.85rem", borderRadius: "8px", background: "var(--color-success-bg)", color: "var(--color-success)", fontSize: "0.82rem", display: "flex", alignItems: "center", gap: "6px" }}>
                    <CheckCircle2 size={16} />
                    <span>{uploadFeedback}</span>
                  </div>
                )}

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "0.5rem" }}>
                  <button
                    type="button"
                    onClick={() => setUploadModalOpen(false)}
                    className="btn-secondary"
                    style={{ minHeight: "42px", padding: "0 1rem" }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    style={{ minHeight: "42px", padding: "0 1.25rem" }}
                  >
                    Upload Document
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
