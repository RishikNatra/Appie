import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth-service";
import SignOutButton from "@/components/SignOutButton";
import ThemeToggle from "@/components/ThemeToggle";
import NotificationBell from "@/components/notifications/NotificationBell";
import AccountNavBar from "@/components/AccountNavBar";
import AppieSystemNav from "@/components/AppieSystemNav";
import {
  Stethoscope,
  Activity,
  Award,
  User,
  HeartPulse,
  ShieldCheck,
  Settings,
  ArrowRight,
  CheckCircle2,
  CalendarCheck2,
  ClipboardList,
  FileCheck,
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Health Professional Dashboard - Appie Healthcare",
  description: "Appie Health Professional Home Portal",
};

export default async function ProfessionalHomePage() {
  const user = await getCurrentUser();

  // Route protection
  if (!user) {
    redirect("/login?role=health_professional");
  }

  if (user.role !== "health_professional") {
    redirect("/patient/home");
  }

  return (
    <>
      <header className="app-header">
        <Link href="/professional/home" className="brand-logo-wrap">
          <div className="brand-icon-box">
            <Activity size={22} strokeWidth={2.5} />
          </div>
          <div>
            <span className="brand-name">Appie</span>
          </div>
          <span className="brand-badge" style={{ backgroundColor: "rgba(29, 52, 138, 0.4)", color: "#EFEEEE" }}>
            Doctor Portal
          </span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <NotificationBell />
          <ThemeToggle />
          <SignOutButton />
        </div>
      </header>

      <main className="main-wrapper">
        <div style={{ width: "100%", maxWidth: "960px", margin: "0 auto" }}>
          <AppieSystemNav role="health_professional" />

          {/* Clinician Welcome Banner */}
          <div className="dashboard-card" style={{ textAlign: "left", padding: "2.25rem 2.5rem", marginBottom: "2rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.75rem" }}>
              <div className="dashboard-avatar-box" style={{ width: "54px", height: "54px", margin: 0 }}>
                <Stethoscope size={28} />
              </div>
              <div>
                <h1 style={{ fontSize: "1.75rem", fontWeight: 800 }}>
                  Welcome, {user.fullName || user.username}
                </h1>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem" }}>
                  Your Health Professional Account is verified and registered under the Telemedicine Practice Guidelines.
                </p>
              </div>
            </div>

            <div className="dashboard-info-table" style={{ margin: "1.5rem 0 0", maxWidth: "100%" }}>
              <div className="dashboard-info-row">
                <span className="dashboard-info-label">Account Role:</span>
                <span className="dashboard-info-value" style={{ color: "var(--color-accent)" }}>Health Professional</span>
              </div>
              <div className="dashboard-info-row">
                <span className="dashboard-info-label">Username:</span>
                <span className="dashboard-info-value">@{user.username}</span>
              </div>
              <div className="dashboard-info-row">
                <span className="dashboard-info-label">Email:</span>
                <span className="dashboard-info-value">{user.email}</span>
              </div>
              <div className="dashboard-info-row">
                <span className="dashboard-info-label">Medical Council Verification:</span>
                <span className="dashboard-info-value" style={{ color: "var(--color-success)", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  <Award size={14} /> Verified Practitioner
                </span>
              </div>
            </div>
          </div>

          {/* Primary Clinical Operations Navigation Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1.25rem",
              marginBottom: "2.5rem",
            }}
          >
            <Link
              href="/consultations"
              className="dashboard-card"
              style={{
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background: "rgba(29, 52, 138, 0.2)",
                  color: "var(--color-primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CalendarCheck2 size={24} />
              </div>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 700 }}>
                Consultations & Schedule
              </h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", flex: 1 }}>
                View assigned patient appointments, launch encrypted telehealth rooms, and write consultation summaries.
              </p>
              <div className="role-action-link" style={{ minHeight: "auto" }}>
                <span>Open Schedule</span>
                <ArrowRight size={15} />
              </div>
            </Link>

            <Link
              href="/reviews"
              className="dashboard-card"
              style={{
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background: "rgba(255, 178, 0, 0.15)",
                  color: "var(--color-accent)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ClipboardList size={24} />
              </div>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 700 }}>
                Clinical Review Queue
              </h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", flex: 1 }}>
                Review and endorse patient health assessments, verify medication safety recommendations, and log observations.
              </p>
              <div className="role-action-link" style={{ minHeight: "auto" }}>
                <span>Open Review Queue</span>
                <ArrowRight size={15} />
              </div>
            </Link>

            <Link
              href="/prescriptions"
              className="dashboard-card"
              style={{
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background: "rgba(34, 197, 94, 0.15)",
                  color: "var(--color-success)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FileCheck size={24} />
              </div>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 700 }}>
                Issue & Manage E-Rx
              </h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", flex: 1 }}>
                Issue legally valid e-prescriptions with cryptographic digital signatures and pharmacy cart dispatch.
              </p>
              <div className="role-action-link" style={{ minHeight: "auto" }}>
                <span>Manage Prescriptions</span>
                <ArrowRight size={15} />
              </div>
            </Link>
          </div>

          {/* Quick Access Modules */}
          <h2 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "1rem" }}>
            Professional Account & Verification
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem", marginBottom: "3rem" }}>
            {/* Card 1: Medical Status Verification */}
            <Link href="/professional/verify-status" className="role-card" style={{ minHeight: "220px", padding: "1.75rem" }}>
              <div className="role-icon-container" style={{ width: "48px", height: "48px", marginBottom: "1rem" }}>
                <Award size={24} />
              </div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.4rem" }}>Medical Verification</h3>
              <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", flex: 1 }}>
                Inspect your verified State Medical Council registration, qualifications, license numbers, and uploaded certificate proofs.
              </p>
              <div className="role-action-link" style={{ minHeight: "auto", marginTop: "1rem" }}>
                <span>View Verification</span>
                <ArrowRight size={16} />
              </div>
            </Link>

            {/* Card 2: Professional Profile */}
            <Link href="/account/profile" className="role-card" style={{ minHeight: "220px", padding: "1.75rem" }}>
              <div className="role-icon-container" style={{ width: "48px", height: "48px", marginBottom: "1rem" }}>
                <User size={24} />
              </div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.4rem" }}>Professional Profile</h3>
              <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", flex: 1 }}>
                Update clinical contact numbers, clinic affiliation address, profile photo, and public credentials for patients.
              </p>
              <div className="role-action-link" style={{ minHeight: "auto", marginTop: "1rem" }}>
                <span>Edit Profile</span>
                <ArrowRight size={16} />
              </div>
            </Link>

            {/* Card 3: Consents & Telemedicine Guidelines */}
            <Link href="/account/consents" className="role-card" style={{ minHeight: "220px", padding: "1.75rem" }}>
              <div className="role-icon-container" style={{ width: "48px", height: "48px", marginBottom: "1rem" }}>
                <ShieldCheck size={24} />
              </div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.4rem" }}>Consent & Ethics</h3>
              <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", flex: 1 }}>
                Review active telemedicine practice compliance terms, patient privacy standards, and medical records access controls.
              </p>
              <div className="role-action-link" style={{ minHeight: "auto", marginTop: "1rem" }}>
                <span>Manage Consents</span>
                <ArrowRight size={16} />
              </div>
            </Link>

            {/* Card 4: Settings & 2FA */}
            <Link href="/account/settings" className="role-card" style={{ minHeight: "220px", padding: "1.75rem" }}>
              <div className="role-icon-container" style={{ width: "48px", height: "48px", marginBottom: "1rem" }}>
                <Settings size={24} />
              </div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.4rem" }}>Doctor Settings</h3>
              <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", flex: 1 }}>
                Configure 2FA security, appointment notification alerts, theme appearance, and active device logins.
              </p>
              <div className="role-action-link" style={{ minHeight: "auto", marginTop: "1rem" }}>
                <span>Open Settings</span>
                <ArrowRight size={16} />
              </div>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
