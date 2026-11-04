"use client";

import { useState, useEffect } from "react";
import AccountNavBar from "@/components/AccountNavBar";
import {
  Award,
  FileText,
  Upload,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Building,
  ShieldCheck,
  Loader2,
  X,
  FileCheck,
} from "lucide-react";
import { HealthProfessionalDetails } from "@/lib/types";

export default function MedicalStatusVerificationView() {
  const [details, setDetails] = useState<HealthProfessionalDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Editable Form inputs
  const [licenseNumber, setLicenseNumber] = useState("");
  const [councilName, setCouncilName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [qualifications, setQualifications] = useState("");
  const [experience, setExperience] = useState(0);
  const [clinicAddress, setClinicAddress] = useState("");

  // Uploaded documents state
  const [licenseFile, setLicenseFile] = useState<string>("State_Medical_Council_Registration.pdf");
  const [idFile, setIdFile] = useState<string>("National_ID_Card.pdf");

  useEffect(() => {
    fetch("/api/account/medical-verification")
      .then((res) => res.json())
      .then((data) => {
        if (data.details) {
          setDetails(data.details);
          setLicenseNumber(data.details.medicalLicenseNumber || "");
          setCouncilName(data.details.medicalCouncilName || "");
          setSpecialization(data.details.specialization || "General Medicine");
          setQualifications(data.details.qualifications || "");
          setExperience(data.details.yearsOfExperience || 0);
          setClinicAddress(data.details.clinicAddress || "");
          if (data.details.licenseDocumentName) setLicenseFile(data.details.licenseDocumentName);
          if (data.details.idProofDocumentName) setIdFile(data.details.idProofDocumentName);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/account/medical-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          medicalLicenseNumber: licenseNumber,
          medicalCouncilName: councilName,
          specialization,
          qualifications,
          yearsOfExperience: Number(experience) || 0,
          clinicAddress,
          licenseDocumentName: licenseFile,
          idProofDocumentName: idFile,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setFeedback({ type: "error", text: data.error || "Submission failed" });
      } else {
        setDetails(data.details);
        setFeedback({
          type: "success",
          text: "Medical credentials submitted successfully! Compliance team is verifying your registration.",
        });
      }
    } catch {
      setFeedback({ type: "error", text: "Network error occurred." });
    } finally {
      setSubmitting(false);
    }
  };

  const status = details?.verificationStatus || "pending";

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "4rem 0" }}>
        <Loader2 size={36} className="animate-spin" color="var(--color-accent)" />
      </div>
    );
  }

  return (
    <div style={{ width: "100%", maxWidth: "960px", margin: "0 auto" }}>
      <AccountNavBar role="health_professional" />

      {/* Verification Status Component */}
      <div
        className="dashboard-card"
        style={{
          textAlign: "left",
          marginBottom: "2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1.5rem",
          padding: "2rem",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
            <Award size={26} color="var(--color-accent)" />
            <h1 style={{ fontSize: "1.75rem", fontWeight: 800 }}>Medical Status Verification</h1>
          </div>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", maxWidth: "600px" }}>
            As per Indian Telemedicine Practice Guidelines, all healthcare practitioners must have their state or national medical council registration verified before consulting patients.
          </p>
        </div>

        <div>
          {status === "verified" ? (
            <div className="badge-status badge-verified" style={{ padding: "0.6rem 1.25rem", fontSize: "0.9rem" }}>
              <CheckCircle2 size={18} />
              <span>Verified Practitioner</span>
            </div>
          ) : status === "pending" ? (
            <div className="badge-status badge-pending" style={{ padding: "0.6rem 1.25rem", fontSize: "0.9rem" }}>
              <Clock size={18} />
              <span>Verification Under Review</span>
            </div>
          ) : (
            <div className="badge-status badge-rejected" style={{ padding: "0.6rem 1.25rem", fontSize: "0.9rem" }}>
              <AlertTriangle size={18} />
              <span>Action Required</span>
            </div>
          )}
        </div>
      </div>

      {feedback && (
        <div className={`alert-box ${feedback.type === "success" ? "alert-success" : "alert-error"}`}>
          {feedback.type === "success" ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Professional Information Component & Credential Upload */}
      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "2rem" }}>
          {/* Card 1: License Details */}
          <div className="dashboard-card" style={{ textAlign: "left", padding: "2rem" }}>
            <h2 className="section-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <FileText size={20} color="var(--color-accent)" />
              <span>Professional Information</span>
            </h2>
            <p className="section-desc" style={{ marginBottom: "1.5rem" }}>
              Council registration and clinical qualifications
            </p>

            <div className="form-group">
              <label className="form-label">Medical Council License Number</label>
              <input
                type="text"
                className="form-input no-icon"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Medical Council Name</label>
              <input
                type="text"
                className="form-input no-icon"
                value={councilName}
                onChange={(e) => setCouncilName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Specialization</label>
              <input
                type="text"
                className="form-input no-icon"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                required
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <div className="form-group">
                <label className="form-label">Degree / Qualifications</label>
                <input
                  type="text"
                  className="form-input no-icon"
                  value={qualifications}
                  onChange={(e) => setQualifications(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Years of Experience</label>
                <input
                  type="number"
                  className="form-input no-icon"
                  value={experience}
                  onChange={(e) => setExperience(Number(e.target.value))}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Clinic / Hospital Affiliation</label>
              <input
                type="text"
                className="form-input no-icon"
                value={clinicAddress}
                onChange={(e) => setClinicAddress(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Card 2: Professional Credential Upload Component */}
          <div className="dashboard-card" style={{ textAlign: "left", padding: "2rem" }}>
            <h2 className="section-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <ShieldCheck size={20} color="var(--color-accent)" />
              <span>Professional Credential Upload</span>
            </h2>
            <p className="section-desc" style={{ marginBottom: "1.5rem" }}>
              Upload high-resolution scans of your license certificates
            </p>

            {/* Document 1: License */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label className="form-label">1. Medical Council Registration Certificate (PDF/PNG)</label>
              <div
                className="file-upload-zone"
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = ".pdf,.png,.jpg,.jpeg";
                  input.onchange = (e: any) => {
                    const f = e.target.files?.[0];
                    if (f) setLicenseFile(f.name);
                  };
                  input.click();
                }}
              >
                <Upload size={28} color="var(--color-accent)" style={{ marginBottom: "0.5rem" }} />
                <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>Click to select certificate file</span>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "4px" }}>
                  PDF, JPG or PNG (Max 10MB)
                </span>
              </div>

              {licenseFile && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: "0.5rem",
                    padding: "0.5rem 0.85rem",
                    borderRadius: "8px",
                    backgroundColor: "var(--bg-surface)",
                    fontSize: "0.85rem",
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <FileCheck size={16} color="var(--color-success)" />
                    {licenseFile}
                  </span>
                  <button
                    type="button"
                    onClick={() => setLicenseFile("")}
                    className="chip-delete-btn"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>

            {/* Document 2: Government ID */}
            <div>
              <label className="form-label">2. Government Photo ID Proof (Aadhaar / Passport)</label>
              <div
                className="file-upload-zone"
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = ".pdf,.png,.jpg,.jpeg";
                  input.onchange = (e: any) => {
                    const f = e.target.files?.[0];
                    if (f) setIdFile(f.name);
                  };
                  input.click();
                }}
              >
                <Upload size={28} color="var(--color-accent)" style={{ marginBottom: "0.5rem" }} />
                <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>Click to select ID proof file</span>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "4px" }}>
                  Official identification issued by Government of India
                </span>
              </div>

              {idFile && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: "0.5rem",
                    padding: "0.5rem 0.85rem",
                    borderRadius: "8px",
                    backgroundColor: "var(--bg-surface)",
                    fontSize: "0.85rem",
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <FileCheck size={16} color="var(--color-success)" />
                    {idFile}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIdFile("")}
                    className="chip-delete-btn"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Verification Submission Component */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
          <button
            type="submit"
            className="btn-primary"
            id="btn-submit-verification"
            disabled={submitting}
            style={{ minHeight: "48px", maxWidth: "320px" }}
          >
            {submitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Submitting credentials...</span>
              </>
            ) : (
              <span>Submit for Clinical Review</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

