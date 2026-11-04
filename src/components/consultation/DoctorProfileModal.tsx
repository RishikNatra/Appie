"use client";

import { useEffect, useState } from "react";
import { DoctorDiscoveryItem, ConsultationReview } from "@/lib/types";
import {
  X,
  Star,
  ShieldCheck,
  Award,
  Calendar,
  Clock,
  MapPin,
  Languages,
  CheckCircle2,
  Video,
  MessageSquare,
  Phone,
} from "lucide-react";

interface DoctorProfileModalProps {
  doctor: DoctorDiscoveryItem | null;
  onClose: () => void;
  onBook: (doctor: DoctorDiscoveryItem) => void;
}

export default function DoctorProfileModal({ doctor, onClose, onBook }: DoctorProfileModalProps) {
  const [reviews, setReviews] = useState<ConsultationReview[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  useEffect(() => {
    if (!doctor) return;
    setLoadingReviews(true);
    fetch(`/api/consultations/reviews?professionalId=${doctor.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.reviews) setReviews(data.reviews);
      })
      .catch((err) => console.warn("Failed to load reviews:", err))
      .finally(() => setLoadingReviews(false));
  }, [doctor]);

  if (!doctor) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
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
      <div
        className="dashboard-card"
        style={{
          width: "100%",
          maxWidth: "680px",
          maxHeight: "90vh",
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
          aria-label="Close modal"
        >
          <X size={22} />
        </button>

        {/* Professional Profile Header */}
        <div style={{ display: "flex", gap: "1.25rem", alignItems: "flex-start", marginBottom: "1.5rem" }}>
          <div
            className="dashboard-avatar-box"
            style={{
              width: "72px",
              height: "72px",
              margin: 0,
              fontSize: "1.6rem",
              background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "16px",
              flexShrink: 0,
            }}
          >
            {doctor.fullName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)}
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
              <h2 style={{ fontSize: "1.4rem", fontWeight: 800 }}>
                {doctor.prefix} {doctor.fullName}
              </h2>
              {doctor.isVerified && (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: "var(--color-success)",
                    background: "var(--color-success-bg)",
                    padding: "2px 8px",
                    borderRadius: "12px",
                  }}
                >
                  <ShieldCheck size={14} /> NMC Verified Practitioner
                </span>
              )}
            </div>

            <p style={{ color: "var(--color-accent)", fontWeight: 600, fontSize: "0.95rem" }}>
              {doctor.specialization}
            </p>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
              {doctor.qualifications} • <strong>{doctor.yearsOfExperience} Years Clinical Experience</strong>
            </p>
            <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
              <MapPin size={13} style={{ display: "inline", verticalAlign: "middle" }} /> {doctor.clinicAddress}
            </p>
          </div>
        </div>

        {/* Bio / About */}
        <div style={{ marginBottom: "1.5rem", background: "var(--bg-surface)", padding: "1rem", borderRadius: "10px" }}>
          <h4 style={{ fontSize: "0.88rem", fontWeight: 700, marginBottom: "0.35rem", color: "var(--text-secondary)" }}>
            About Practitioner
          </h4>
          <p style={{ fontSize: "0.88rem", lineHeight: 1.5 }}>{doctor.about}</p>
        </div>

        {/* Credentials & Details Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "1rem",
            marginBottom: "1.5rem",
          }}
        >
          {/* Credentials Component */}
          <div style={{ border: "1px solid var(--border-subtle)", borderRadius: "10px", padding: "1rem" }}>
            <h4 style={{ fontSize: "0.88rem", fontWeight: 700, marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "6px" }}>
              <Award size={16} color="var(--color-accent)" /> Professional Credentials
            </h4>
            <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
              <div><strong>Registration:</strong> MCI/NMC Validated</div>
              <div><strong>Primary Degree:</strong> MBBS (India)</div>
              <div><strong>Telehealth Cert:</strong> Guidelines Compliant</div>
              <div><strong>Languages:</strong> {doctor.languages.join(", ")}</div>
            </div>
          </div>

          {/* Availability & Fee Component */}
          <div style={{ border: "1px solid var(--border-subtle)", borderRadius: "10px", padding: "1rem" }}>
            <h4 style={{ fontSize: "0.88rem", fontWeight: 700, marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "6px" }}>
              <Calendar size={16} color="var(--color-accent)" /> Schedule & Fees
            </h4>
            <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
              <div><strong>Consultation Fee:</strong> <span style={{ color: "var(--color-accent)", fontWeight: 700, fontSize: "1rem" }}>₹{doctor.consultationFee}</span></div>
              <div><strong>Available Days:</strong> {doctor.availableDays.slice(0, 3).join(", ")} +more</div>
              <div><strong>Typical Hours:</strong> 09:00 AM - 07:00 PM</div>
              <div><strong>Modes:</strong> Video, Audio, Chat</div>
            </div>
          </div>
        </div>

        {/* Professional Rating & Review Component */}
        <div style={{ marginBottom: "1.75rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
            <h4 style={{ fontSize: "0.95rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "6px" }}>
              <Star size={16} fill="var(--color-accent)" color="var(--color-accent)" />
              Patient Reviews ({doctor.reviewCount})
            </h4>
            <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--color-accent)" }}>
              {doctor.rating} / 5.0 Average
            </span>
          </div>

          {loadingReviews ? (
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Loading reviews...</p>
          ) : reviews.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  style={{
                    background: "var(--bg-surface)",
                    padding: "0.85rem 1rem",
                    borderRadius: "8px",
                    border: "1px solid var(--border-subtle)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                    <span style={{ fontWeight: 600, fontSize: "0.85rem" }}>{rev.patientName}</span>
                    <div style={{ display: "flex", gap: "2px" }}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={12}
                          fill={s <= rev.rating ? "var(--color-accent)" : "none"}
                          color={s <= rev.rating ? "var(--color-accent)" : "var(--text-muted)"}
                        />
                      ))}
                    </div>
                  </div>
                  {rev.reviewText && (
                    <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>
                      "{rev.reviewText}"
                    </p>
                  )}
                  {rev.tags.length > 0 && (
                    <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
                      {rev.tags.map((t) => (
                        <span
                          key={t}
                          style={{
                            fontSize: "0.72rem",
                            background: "rgba(255, 255, 255, 0.05)",
                            padding: "2px 8px",
                            borderRadius: "10px",
                            color: "var(--text-muted)",
                          }}
                        >
                          ✓ {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              No reviews recorded yet for this specialist.
            </p>
          )}
        </div>

        {/* Professional Selection Action Component */}
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", borderTop: "1px solid var(--border-subtle)", paddingTop: "1.25rem" }}>
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
            style={{ minHeight: "48px", padding: "0 1.25rem" }}
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onBook(doctor);
            }}
            className="btn-primary"
            style={{ minHeight: "48px", padding: "0 1.5rem" }}
          >
            <Video size={17} />
            <span>Schedule Appointment (₹{doctor.consultationFee})</span>
          </button>
        </div>
      </div>
    </div>
  );
}

