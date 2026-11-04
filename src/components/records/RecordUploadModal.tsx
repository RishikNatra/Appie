"use client";

import { useState } from "react";
import { MedicalRecordItem } from "@/lib/types";
import {
  X,
  Upload,
  FileText,
  Calendar,
  Building2,
  ShieldCheck,
  Tag,
  AlertCircle,
} from "lucide-react";

interface RecordUploadModalProps {
  onClose: () => void;
  onSuccess: (record: MedicalRecordItem) => void;
}

export default function RecordUploadModal({
  onClose,
  onSuccess,
}: RecordUploadModalProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<
    "Diagnostic Report" | "Prescription" | "Consultation Note" | "Vaccine Certificate" | "Health Assessment" | "Other"
  >("Diagnostic Report");
  const [recordDate, setRecordDate] = useState(new Date().toISOString().split("T")[0]);
  const [doctorOrFacility, setDoctorOrFacility] = useState("");
  const [notes, setNotes] = useState("");
  const [isConfidential, setIsConfidential] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(["Blood Test", "Routine"]);
  const [fileSize, setFileSize] = useState("1.4 MB");
  const [fileType, setFileType] = useState("PDF");
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg("Please provide a title for this health document.");
      return;
    }

    setIsUploading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          category,
          recordDate,
          doctorOrFacility: doctorOrFacility.trim() || undefined,
          notes: notes.trim() || undefined,
          isConfidential,
          tags,
          fileSize,
          fileType,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to upload health record");
      }

      onSuccess(data.record);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to upload health record");
    } finally {
      setIsUploading(false);
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

        <h3 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "0.25rem" }}>
          Upload Medical Document
        </h3>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "1.25rem" }}>
          Securely store past lab reports, discharge summaries, or vaccination certificates into your encrypted Appie Health Vault.
        </p>

        {errorMsg && (
          <div
            style={{
              padding: "0.75rem 1rem",
              borderRadius: "8px",
              background: "var(--color-error-bg)",
              color: "var(--color-error)",
              fontSize: "0.85rem",
              marginBottom: "1rem",
            }}
          >
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* File Picker Simulator */}
          <div
            style={{
              border: "2px dashed var(--border-medium)",
              borderRadius: "10px",
              padding: "1.5rem",
              textAlign: "center",
              background: "var(--bg-surface)",
              cursor: "pointer",
            }}
          >
            <Upload size={32} color="var(--color-accent)" style={{ margin: "0 auto 0.5rem" }} />
            <div style={{ fontSize: "0.88rem", fontWeight: 700 }}>
              Drag and drop document or click to browse
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px" }}>
              Supports PDF, JPG, PNG (Max 15MB) • Client-side encryption applied
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.3rem" }}>
              Document Title
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="E.g., Lipid Profile Blood Test Report"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{ minHeight: "44px" }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.3rem" }}>
                Record Category
              </label>
              <select
                className="form-input"
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                style={{ minHeight: "44px" }}
              >
                <option value="Diagnostic Report">Diagnostic Lab Report</option>
                <option value="Prescription">Prescription Scan</option>
                <option value="Consultation Note">Consultation Note</option>
                <option value="Vaccine Certificate">Vaccine Certificate</option>
                <option value="Health Assessment">Health Assessment</option>
                <option value="Other">Other Document</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.3rem" }}>
                Date of Record
              </label>
              <input
                type="date"
                className="form-input"
                value={recordDate}
                onChange={(e) => setRecordDate(e.target.value)}
                style={{ minHeight: "44px" }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.3rem" }}>
              Diagnostic Center / Hospital / Doctor Name
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="E.g., Dr. Lal PathLabs, Apollo Clinic"
              value={doctorOrFacility}
              onChange={(e) => setDoctorOrFacility(e.target.value)}
              style={{ minHeight: "44px" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.3rem" }}>
              Key Findings / Clinical Notes
            </label>
            <textarea
              className="form-input"
              rows={2}
              placeholder="Summary of values, abnormal flags, or doctor advice..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{ width: "100%", padding: "0.6rem", fontSize: "0.85rem" }}
            />
          </div>

          {/* Tags */}
          <div>
            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.3rem" }}>
              Tags
            </label>
            <div style={{ display: "flex", gap: "0.4rem", marginBottom: "0.5rem" }}>
              <input
                type="text"
                className="form-input"
                placeholder="Add tag (e.g., Cholesterol, Thyroid)"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
                style={{ minHeight: "40px" }}
              />
              <button
                type="button"
                onClick={addTag}
                className="btn-secondary"
                style={{ minHeight: "40px", padding: "0 0.85rem", fontSize: "0.8rem" }}
              >
                Add
              </button>
            </div>
            <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
              {tags.map((t) => (
                <span
                  key={t}
                  style={{
                    fontSize: "0.75rem",
                    padding: "2px 8px",
                    borderRadius: "12px",
                    background: "rgba(255, 178, 0, 0.12)",
                    color: "var(--color-accent)",
                    border: "1px solid var(--border-accent)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  {t}
                  <button
                    type="button"
                    onClick={() => removeTag(t)}
                    style={{ background: "transparent", border: "none", color: "inherit", cursor: "pointer" }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Confidentiality toggle */}
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "0.85rem" }}>
            <input
              type="checkbox"
              checked={isConfidential}
              onChange={(e) => setIsConfidential(e.target.checked)}
              style={{ width: "18px", height: "18px", accentColor: "var(--color-accent)" }}
            />
            <span>Mark as Confidential (Restricts access from consulting clinicians)</span>
          </label>

          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", marginTop: "0.5rem" }}>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              style={{ minHeight: "48px", padding: "0 1.25rem" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="btn-primary"
              style={{ minHeight: "48px", padding: "0 1.5rem" }}
            >
              {isUploading ? "Encrypting & Saving..." : "Save to Health Records"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

