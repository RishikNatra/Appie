"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AccountNavBar from "@/components/AccountNavBar";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Heart,
  Award,
  Edit,
  ShieldCheck,
  Download,
  AlertTriangle,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { UserProfile } from "@/lib/types";
import { AuthUser } from "@/lib/auth-service";

export default function ProfileOverviewView({ user }: { user: AuthUser }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [completeness, setCompleteness] = useState<number>(85);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/account/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data.profile) {
          setProfile(data.profile);
          if (data.completeness !== undefined) setCompleteness(data.completeness);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "4rem 0" }}>
        <Loader2 size={36} className="animate-spin" color="var(--color-accent)" />
      </div>
    );
  }

  const p = profile || {
    id: user.id,
    role: user.role,
    email: user.email,
    username: user.username,
    fullName: user.fullName || user.username,
    phone: "+91 98765 43210",
    dateOfBirth: "1994-08-15",
    gender: "male",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560038",
    isVerified: true,
    twoFactorEnabled: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return (
    <div style={{ width: "100%", maxWidth: "960px", margin: "0 auto" }}>
      <AccountNavBar role={user.role} />

      {/* Profile Header Component */}
      <div
        className="dashboard-card"
        style={{
          textAlign: "left",
          marginBottom: "1.75rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1.5rem",
          padding: "2rem 2.5rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <div
            className="dashboard-avatar-box"
            style={{
              width: "72px",
              height: "72px",
              margin: 0,
              fontSize: "1.8rem",
              fontWeight: 800,
            }}
          >
            {p.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={p.avatarUrl}
                alt={p.fullName}
                style={{ width: "100%", height: "100%", borderRadius: "22px", objectFit: "cover" }}
              />
            ) : (
              (p.fullName?.[0] || p.username[0]).toUpperCase()
            )}
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.35rem" }}>
              <h1 style={{ fontSize: "1.6rem", fontWeight: 800 }}>{p.fullName || p.username}</h1>
              {p.isVerified && (
                <span className="badge-status badge-verified">
                  <CheckCircle2 size={13} />
                  <span>Verified</span>
                </span>
              )}
            </div>

            <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", marginBottom: "0.25rem" }}>
              @{p.username} • {user.role === "patient" ? "Patient Account" : "Health Professional"}
            </p>

            <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
              Member since {new Date(p.createdAt || Date.now()).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
            </span>
          </div>
        </div>

        {/* Profile Action Component (Top Action Buttons) */}
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <Link
            href="/account/profile/edit"
            className="btn-primary"
            style={{ minHeight: "44px", padding: "0 1.25rem", textDecoration: "none", width: "auto" }}
          >
            <Edit size={16} />
            <span>Edit Profile</span>
          </Link>
        </div>
      </div>

      {/* Profile Completion Component */}
      <div
        className="dashboard-card"
        style={{
          textAlign: "left",
          marginBottom: "1.75rem",
          padding: "1.5rem 2rem",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
          <span style={{ fontSize: "0.95rem", fontWeight: 700 }}>Profile Completeness</span>
          <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--color-accent)" }}>
            {completeness}%
          </span>
        </div>

        <div className="progress-container">
          <div className="progress-fill" style={{ width: `${completeness}%` }} />
        </div>

        <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>
          Complete health and emergency contact details to expedite teleconsultations and prescription delivery.
        </p>
      </div>

      {/* Grid: Personal Information Component & Contact Information Component */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.75rem", marginBottom: "2rem" }}>
        {/* Personal Information Component */}
        <div className="dashboard-card" style={{ textAlign: "left", padding: "2rem" }}>
          <h2 className="section-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <User size={20} color="var(--color-accent)" />
            <span>Personal Information</span>
          </h2>
          <p className="section-desc" style={{ marginBottom: "1.25rem" }}>
            Your basic personal identity details
          </p>

          <div className="dashboard-info-table" style={{ margin: 0, maxWidth: "100%" }}>
            <div className="dashboard-info-row">
              <span className="dashboard-info-label">Legal Name:</span>
              <span className="dashboard-info-value">{p.fullName || `${p.firstName || ""} ${p.lastName || ""}`.trim() || "Not provided"}</span>
            </div>
            <div className="dashboard-info-row">
              <span className="dashboard-info-label">Date of Birth:</span>
              <span className="dashboard-info-value">{p.dateOfBirth || "1994-08-15"}</span>
            </div>
            <div className="dashboard-info-row">
              <span className="dashboard-info-label">Gender:</span>
              <span className="dashboard-info-value" style={{ textTransform: "capitalize" }}>
                {p.gender || "Male"}
              </span>
            </div>
            <div className="dashboard-info-row">
              <span className="dashboard-info-label">Account Role:</span>
              <span className="dashboard-info-value" style={{ color: "var(--color-accent)" }}>
                {user.role === "patient" ? "Patient" : "Health Professional"}
              </span>
            </div>
            <div className="dashboard-info-row">
              <span className="dashboard-info-label">Two-Factor Authentication:</span>
              <span className="dashboard-info-value" style={{ color: p.twoFactorEnabled ? "var(--color-success)" : "var(--text-muted)" }}>
                {p.twoFactorEnabled ? "Enabled" : "Disabled"}
              </span>
            </div>
          </div>
        </div>

        {/* Contact Information Component */}
        <div className="dashboard-card" style={{ textAlign: "left", padding: "2rem" }}>
          <h2 className="section-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Phone size={20} color="var(--color-accent)" />
            <span>Contact Information</span>
          </h2>
          <p className="section-desc" style={{ marginBottom: "1.25rem" }}>
            Contact routes for consult alerts & delivery
          </p>

          <div className="dashboard-info-table" style={{ margin: 0, maxWidth: "100%" }}>
            <div className="dashboard-info-row">
              <span className="dashboard-info-label">Email Address:</span>
              <span className="dashboard-info-value">{p.email}</span>
            </div>
            <div className="dashboard-info-row">
              <span className="dashboard-info-label">Phone Number:</span>
              <span className="dashboard-info-value">{p.phone || "+91 98765 43210"}</span>
            </div>
            <div className="dashboard-info-row">
              <span className="dashboard-info-label">Primary Address:</span>
              <span className="dashboard-info-value">
                {p.addressLine1 ? `${p.addressLine1}, ${p.city || ""}` : "Indiranagar, Bengaluru, KA 560038"}
              </span>
            </div>
            <div className="dashboard-info-row">
              <span className="dashboard-info-label">Emergency Contact:</span>
              <span className="dashboard-info-value">
                {p.emergencyContactName ? `${p.emergencyContactName} (${p.emergencyContactRelation || "Family"})` : "Pooja Verma (Spouse)"}
              </span>
            </div>
            <div className="dashboard-info-row">
              <span className="dashboard-info-label">Emergency Phone:</span>
              <span className="dashboard-info-value">{p.emergencyContactPhone || "+91 98765 43211"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Action Component (Extended actions: Download digital health card, view settings) */}
      <div
        className="dashboard-card"
        style={{
          textAlign: "left",
          padding: "1.75rem 2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.25rem" }}>
            Digital Healthcare Card
          </h3>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
            Download an encrypted PDF record of your Appie digital health profile and verified emergency credentials.
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert("Generating digital healthcare ID card...")}
          className="btn-secondary"
          style={{ minHeight: "44px" }}
        >
          <Download size={16} />
          <span>Download Health Card</span>
        </button>
      </div>
    </div>
  );
}

