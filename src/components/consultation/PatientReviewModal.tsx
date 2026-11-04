"use client";

import { useState } from "react";
import { ConsultationAppointment } from "@/lib/types";
import { X, Star, CheckCircle2, AlertCircle } from "lucide-react";

interface PatientReviewModalProps {
  appointment: ConsultationAppointment | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PatientReviewModal({
  appointment,
  onClose,
  onSuccess,
}: PatientReviewModalProps) {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([
    "Thorough explanation",
    "Empathetic",
  ]);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!appointment) return null;

  const availableTags = [
    "Punctual",
    "Thorough explanation",
    "Empathetic",
    "Accurate diagnosis",
    "Friendly demeanor",
    "Detailed prescription",
    "Highly recommended",
  ];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/consultations/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointmentId: appointment.id,
          professionalId: appointment.professionalId,
          rating,
          reviewText,
          tags: selectedTags,
          isAnonymous,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit review");
      }

      onSuccess();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to submit review");
    } finally {
      setIsSubmitting(false);
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
          maxWidth: "540px",
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
          Rate & Review Doctor
        </h3>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "1.25rem" }}>
          Your feedback helps other patients make informed healthcare decisions for{" "}
          <strong>{appointment.doctorName || "Dr. Medical Specialist"}</strong>.
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

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {/* Star Rating Selector */}
          <div style={{ textAlign: "center", padding: "1rem 0" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.5rem" }}>
              Overall Experience
            </span>
            <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem" }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: "6px",
                    minHeight: "48px",
                    minWidth: "48px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  aria-label={`${star} star rating`}
                >
                  <Star
                    size={32}
                    fill={(hoverRating || rating) >= star ? "var(--color-accent)" : "none"}
                    color={(hoverRating || rating) >= star ? "var(--color-accent)" : "var(--text-muted)"}
                  />
                </button>
              ))}
            </div>
            <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--color-accent)", marginTop: "0.35rem", display: "block" }}>
              {rating === 5 ? "Excellent (5/5)" : rating === 4 ? "Very Good (4/5)" : rating === 3 ? "Good (3/5)" : rating === 2 ? "Fair (2/5)" : "Poor (1/5)"}
            </span>
          </div>

          {/* Quick Tag Pills */}
          <div>
            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.5rem" }}>
              What went well?
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
              {availableTags.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    style={{
                      padding: "0.4rem 0.75rem",
                      borderRadius: "16px",
                      fontSize: "0.78rem",
                      fontWeight: isSelected ? 700 : 500,
                      background: isSelected ? "rgba(255, 178, 0, 0.15)" : "var(--bg-surface)",
                      color: isSelected ? "var(--color-accent)" : "var(--text-secondary)",
                      border: isSelected ? "1px solid var(--color-accent)" : "1px solid var(--border-subtle)",
                      cursor: "pointer",
                      minHeight: "40px",
                    }}
                  >
                    {isSelected ? "✓ " : "+ "}
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Written Feedback Form */}
          <div>
            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.4rem" }}>
              Detailed Feedback (Optional)
            </label>
            <textarea
              className="form-input"
              rows={3}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Share your experience regarding diagnosis, wait time, and clarity..."
              style={{ width: "100%", padding: "0.75rem", fontSize: "0.85rem" }}
            />
          </div>

          {/* Anonymous Option Component */}
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "0.85rem" }}>
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              style={{ width: "18px", height: "18px", accentColor: "var(--color-accent)" }}
            />
            <span>Post review anonymously on doctor's public profile</span>
          </label>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
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
              disabled={isSubmitting}
              className="btn-primary"
              style={{ minHeight: "48px", padding: "0 1.5rem" }}
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

