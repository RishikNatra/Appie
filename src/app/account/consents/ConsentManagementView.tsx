"use client";

import { useState, useEffect } from "react";
import AccountNavBar from "@/components/AccountNavBar";
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  Stethoscope,
  Pill,
  Heart,
  Save,
  Loader2,
  AlertCircle,
  Clock,
  Info,
} from "lucide-react";
import { UserConsentItem } from "@/lib/types";
import { AuthUser } from "@/lib/auth-service";

export default function ConsentManagementView({ user }: { user: AuthUser }) {
  const [consents, setConsents] = useState<UserConsentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/account/consents")
      .then((res) => res.json())
      .then((data) => {
        if (data.consents) {
          setConsents(data.consents);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const toggleConsent = (category: UserConsentItem["category"], isRequired: boolean) => {
    if (isRequired) return; // Cannot toggle mandatory consents
    setConsents((prev) =>
      prev.map((item) =>
        item.category === category ? { ...item, isGranted: !item.isGranted } : item
      )
    );
  };

  const handleSaveConsents = async () => {
    setSaving(true);
    setFeedback(null);

    try {
      const payload = consents.map((c) => ({
        category: c.category,
        isGranted: c.isGranted,
      }));

      const res = await fetch("/api/account/consents", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ consents: payload }),
      });

      const data = await res.json();
      if (!res.ok) {
        setFeedback({ type: "error", text: data.error || "Failed to update consents." });
      } else {
        setConsents(data.consents);
        setFeedback({
          type: "success",
          text: "Consent preferences updated and logged in the digital health audit registry.",
        });
      }
    } catch {
      setFeedback({ type: "error", text: "Network error occurred." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "4rem 0" }}>
        <Loader2 size={36} className="animate-spin" color="var(--color-accent)" />
      </div>
    );
  }

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "data_processing":
        return <Lock size={22} color="var(--color-primary)" />;
      case "telehealth_consultation":
        return <Stethoscope size={22} color="var(--color-accent)" />;
      case "pharmacy_sharing":
        return <Pill size={22} color="var(--color-success)" />;
      case "emergency_access":
        return <Heart size={22} color="var(--color-error)" />;
      default:
        return <ShieldCheck size={22} />;
    }
  };

  return (
    <div style={{ width: "100%", maxWidth: "960px", margin: "0 auto" }}>
      <AccountNavBar role={user.role} />

      {/* Consent Explanation Component */}
      <div
        className="dashboard-card"
        style={{
          textAlign: "left",
          marginBottom: "2rem",
          padding: "2rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.4rem" }}>
          <ShieldCheck size={26} color="var(--color-accent)" />
          <h1 style={{ fontSize: "1.6rem", fontWeight: 800 }}>Healthcare Consent Management</h1>
        </div>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.6, maxWidth: "780px" }}>
          Appie empowers you with full sovereignty over your protected health information (PHI). We adhere to the Indian Telemedicine Practice Guidelines, the Ayushman Bharat Digital Mission (ABDM), and HIPAA international privacy benchmarks. You have complete transparency over each consent category below.
        </p>

        <div
          style={{
            marginTop: "1rem",
            padding: "0.85rem 1rem",
            borderRadius: "12px",
            backgroundColor: "var(--bg-surface)",
            border: "1px solid var(--border-subtle)",
            display: "flex",
            alignItems: "center",
            gap: "0.65rem",
            fontSize: "0.82rem",
            color: "var(--text-muted)",
          }}
        >
          <Info size={18} color="var(--color-accent)" style={{ flexShrink: 0 }} />
          <span>
            Required consents are essential to furnish clinical diagnosis and teleconsultation services. Optional consents may be revoked at any time.
          </span>
        </div>
      </div>

      {feedback && (
        <div className={`alert-box ${feedback.type === "success" ? "alert-success" : "alert-error"}`}>
          {feedback.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Consent Category Component & Consent Requirement Component List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginBottom: "2rem" }}>
        {consents.map((item) => (
          <div
            key={item.category}
            className="dashboard-card"
            style={{
              textAlign: "left",
              padding: "1.75rem 2rem",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: "1.5rem",
              transition: "border-color 250ms ease-in-out",
              borderColor: item.isGranted ? "var(--border-subtle)" : "var(--border-medium)",
            }}
          >
            <div style={{ display: "flex", gap: "1.25rem", flex: 1 }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "14px",
                  backgroundColor: "var(--bg-surface)",
                  border: "1px solid var(--border-subtle)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {getCategoryIcon(item.category)}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.35rem", flexWrap: "wrap" }}>
                  <h2 style={{ fontSize: "1.15rem", fontWeight: 700 }}>{item.title}</h2>

                  {/* Consent Requirement Component */}
                  {item.isRequired ? (
                    <span
                      style={{
                        fontSize: "0.7rem",
                        fontWeight: 800,
                        textTransform: "uppercase",
                        padding: "0.2rem 0.6rem",
                        borderRadius: "9999px",
                        backgroundColor: "var(--color-primary-subtle)",
                        color: "var(--text-primary)",
                        border: "1px solid rgba(29, 52, 138, 0.4)",
                      }}
                    >
                      Mandatory
                    </span>
                  ) : (
                    <span
                      style={{
                        fontSize: "0.7rem",
                        fontWeight: 800,
                        textTransform: "uppercase",
                        padding: "0.2rem 0.6rem",
                        borderRadius: "9999px",
                        backgroundColor: "var(--bg-surface)",
                        color: "var(--text-muted)",
                        border: "1px solid var(--border-subtle)",
                      }}
                    >
                      Optional
                    </span>
                  )}
                </div>

                <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: "0.6rem" }}>
                  {item.description}
                </p>

                <div style={{ display: "flex", alignItems: "center", gap: "1rem", fontSize: "0.78rem", color: "var(--text-muted)" }}>
                  <span>Policy Version: {item.version}</span>
                  {item.grantedAt && (
                    <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <Clock size={12} />
                      Last granted: {new Date(item.grantedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  )}
                  {item.revokedAt && (
                    <span style={{ color: "var(--color-error)" }}>
                      Revoked on {new Date(item.revokedAt).toLocaleDateString("en-IN")}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Consent Action Component (Interactive Toggle Switch) */}
            <div style={{ alignSelf: "center", flexShrink: 0 }}>
              <button
                type="button"
                onClick={() => toggleConsent(item.category, item.isRequired)}
                disabled={item.isRequired}
                title={item.isRequired ? "Mandatory for clinical operations" : "Toggle consent"}
                style={{
                  background: "none",
                  border: "none",
                  cursor: item.isRequired ? "not-allowed" : "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  minHeight: "48px",
                  minWidth: "48px",
                  padding: "4px",
                }}
                aria-label={`Toggle ${item.title}`}
              >
                <div className={`switch-track ${item.isGranted ? "checked" : ""}`} style={{ opacity: item.isRequired ? 0.7 : 1 }}>
                  <div className="switch-thumb" />
                </div>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Consent Action Component - Save Button */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
        <button
          type="button"
          onClick={handleSaveConsents}
          disabled={saving}
          className="btn-primary"
          id="btn-save-consents"
          style={{ width: "auto", minWidth: "220px", minHeight: "48px" }}
        >
          {saving ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Saving Preferences...</span>
            </>
          ) : (
            <>
              <Save size={18} />
              <span>Save Consent Preferences</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

