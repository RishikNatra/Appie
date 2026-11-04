"use client";

import { useState } from "react";
import Link from "next/link";
import { MedicalRecordItem } from "@/lib/types";
import {
  FileText,
  FileCheck,
  Activity,
  Upload,
  Calendar,
  Search,
  ShieldCheck,
  Tag,
  Trash2,
  Eye,
  Download,
  AlertCircle,
  X,
} from "lucide-react";

interface MedicalRecordsTimelineComponentProps {
  records: MedicalRecordItem[];
  onUploadClick: () => void;
  onDeleteRecord?: (id: string) => void;
  onRefresh: () => void;
}

export default function MedicalRecordsTimelineComponent({
  records,
  onUploadClick,
  onDeleteRecord,
  onRefresh,
}: MedicalRecordsTimelineComponentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecordItem | null>(null);

  const filtered = records.filter((rec) => {
    const matchesSearch =
      !searchQuery ||
      rec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (rec.doctorOrFacility && rec.doctorOrFacility.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (rec.notes && rec.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = categoryFilter === "all" || rec.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "Prescription":
        return { bg: "rgba(22, 163, 74, 0.15)", color: "var(--color-success)" };
      case "Diagnostic Report":
        return { bg: "rgba(29, 52, 138, 0.2)", color: "var(--color-primary)" };
      case "Health Assessment":
        return { bg: "rgba(255, 178, 0, 0.15)", color: "var(--color-accent)" };
      case "Vaccine Certificate":
        return { bg: "rgba(34, 197, 94, 0.15)", color: "var(--color-success)" };
      default:
        return { bg: "var(--bg-surface)", color: "var(--text-secondary)" };
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* Header and Upload action */}
      <div className="dashboard-card" style={{ padding: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h2 style={{ fontSize: "1.35rem", fontWeight: 800 }}>Encrypted Health Records Vault</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
            Unified chronological medical timeline: Diagnostic tests, e-prescriptions, clinical notes, and health assessments.
          </p>
        </div>

        <button
          type="button"
          onClick={onUploadClick}
          className="btn-primary"
          style={{ minHeight: "48px", padding: "0 1.25rem", fontSize: "0.88rem" }}
        >
          <Upload size={17} />
          <span>Upload Medical Document</span>
        </button>
      </div>

      {/* Search and Category Filter Chips */}
      <div className="dashboard-card" style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.85rem" }}>
        <div style={{ position: "relative" }}>
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
            placeholder="Search records by test name, clinic, doctor, or diagnosis..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: "42px", minHeight: "46px" }}
          />
        </div>

        <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap", overflowX: "auto" }}>
          {[
            { id: "all", label: "All Records" },
            { id: "Diagnostic Report", label: "Lab & Scans" },
            { id: "Prescription", label: "E-Prescriptions" },
            { id: "Health Assessment", label: "Assessments" },
            { id: "Vaccine Certificate", label: "Vaccinations" },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategoryFilter(cat.id)}
              style={{
                padding: "0.4rem 0.85rem",
                borderRadius: "16px",
                fontSize: "0.8rem",
                fontWeight: categoryFilter === cat.id ? 700 : 500,
                background: categoryFilter === cat.id ? "rgba(255, 178, 0, 0.15)" : "var(--bg-surface)",
                color: categoryFilter === cat.id ? "var(--color-accent)" : "var(--text-secondary)",
                border: categoryFilter === cat.id ? "1px solid var(--color-accent)" : "1px solid var(--border-subtle)",
                cursor: "pointer",
                minHeight: "38px",
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Records List */}
      {filtered.length === 0 ? (
        <div
          className="dashboard-card"
          style={{ textAlign: "center", padding: "3rem 1.5rem", color: "var(--text-secondary)" }}
        >
          <FileText size={40} color="var(--text-muted)" style={{ margin: "0 auto 0.75rem" }} />
          <h4 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.25rem" }}>
            No records matched your criteria
          </h4>
          <p style={{ fontSize: "0.85rem" }}>
            Upload lab reports or complete an assessment to automatically build your health record.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          {filtered.map((rec) => {
            const badge = getCategoryBadge(rec.category);
            return (
              <div
                key={rec.id}
                className="dashboard-card"
                style={{
                  padding: "1.25rem 1.5rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "1rem",
                }}
              >
                <div style={{ flex: "1 1 340px", display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                    <span
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: "10px",
                        background: badge.bg,
                        color: badge.color,
                      }}
                    >
                      {rec.category}
                    </span>
                    <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                      Date: {new Date(rec.recordDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                    {rec.isConfidential && (
                      <span
                        style={{
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          padding: "1px 6px",
                          borderRadius: "6px",
                          background: "var(--color-error-bg)",
                          color: "var(--color-error)",
                        }}
                      >
                        Confidential
                      </span>
                    )}
                  </div>

                  <h4 style={{ fontSize: "1.1rem", fontWeight: 700 }}>{rec.title}</h4>

                  {rec.doctorOrFacility && (
                    <div style={{ fontSize: "0.82rem", color: "var(--color-accent)", fontWeight: 600 }}>
                      Facility / Doctor: {rec.doctorOrFacility}
                    </div>
                  )}

                  {rec.notes && (
                    <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>
                      {rec.notes}
                    </p>
                  )}

                  {rec.tags.length > 0 && (
                    <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", marginTop: "0.2rem" }}>
                      {rec.tags.map((t) => (
                        <span
                          key={t}
                          style={{
                            fontSize: "0.7rem",
                            background: "var(--bg-surface)",
                            border: "1px solid var(--border-subtle)",
                            padding: "2px 6px",
                            borderRadius: "6px",
                            color: "var(--text-muted)",
                          }}
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <button
                    type="button"
                    onClick={() => setSelectedRecord(rec)}
                    className="btn-primary"
                    style={{ minHeight: "44px", fontSize: "0.82rem", padding: "0 1rem" }}
                  >
                    <Eye size={15} />
                    <span>View Record</span>
                  </button>

                  {rec.recordType === "uploaded_document" && onDeleteRecord && (
                    <button
                      type="button"
                      onClick={() => onDeleteRecord(rec.id)}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "var(--text-muted)",
                        cursor: "pointer",
                        padding: "0.5rem",
                        minHeight: "44px",
                        minWidth: "44px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      title="Delete record"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Record Details Modal */}
      {selectedRecord && (
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
              onClick={() => setSelectedRecord(null)}
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

            <div style={{ marginBottom: "1.5rem" }}>
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  padding: "2px 8px",
                  borderRadius: "8px",
                  background: "rgba(29, 52, 138, 0.2)",
                  color: "var(--color-primary)",
                  display: "inline-block",
                  marginBottom: "0.4rem",
                }}
              >
                {selectedRecord.category}
              </span>
              <h2 style={{ fontSize: "1.35rem", fontWeight: 800, marginBottom: "0.25rem" }}>
                {selectedRecord.title}
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                Recorded on {selectedRecord.recordDate} • Facility: {selectedRecord.doctorOrFacility || "Appie Health"}
              </p>
            </div>

            {/* Document Viewer Box */}
            <div
              style={{
                background: "var(--bg-surface)",
                borderRadius: "10px",
                padding: "1.5rem",
                marginBottom: "1.25rem",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <h5 style={{ fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.5rem" }}>
                Clinical Observations & Data
              </h5>
              <p style={{ fontSize: "0.88rem", lineHeight: 1.6, color: "var(--text-primary)" }}>
                {selectedRecord.notes || "No additional clinician notes entered for this document."}
              </p>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.78rem", color: "var(--color-success)", fontWeight: 700 }}>
                <ShieldCheck size={16} /> Authenticated & Digitally Verified
              </div>

              <div style={{ display: "flex", gap: "0.5rem" }}>
                {selectedRecord.linkedEntityId && selectedRecord.recordType === "prescription" && (
                  <Link
                    href={`/prescriptions`}
                    className="btn-primary"
                    style={{ minHeight: "44px", fontSize: "0.82rem", padding: "0 1rem", textDecoration: "none" }}
                  >
                    Open Full E-Prescription
                  </Link>
                )}

                <button
                  type="button"
                  onClick={() => setSelectedRecord(null)}
                  className="btn-secondary"
                  style={{ minHeight: "44px", padding: "0 1.25rem" }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
