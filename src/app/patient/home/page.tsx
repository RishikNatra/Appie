import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth-service";
import SignOutButton from "@/components/SignOutButton";
import ThemeToggle from "@/components/ThemeToggle";
import { User, Activity, ShieldCheck, HeartPulse } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Patient Dashboard - Appie",
  description: "Appie Patient Home Portal",
};

export default async function PatientHomePage() {
  const user = await getCurrentUser();

  // Route protection
  if (!user) {
    redirect("/login?role=patient");
  }

  if (user.role !== "patient") {
    redirect("/professional/home");
  }

  return (
    <>
      <header className="app-header">
        <Link href="/patient/home" className="brand-logo-wrap">
          <div className="brand-icon-box">
            <Activity size={22} strokeWidth={2.5} />
          </div>
          <div>
            <span className="brand-name">Appie</span>
          </div>
          <span className="brand-badge">Patient</span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <ThemeToggle />
          <SignOutButton />
        </div>
      </header>

      <main className="main-wrapper">
        <div className="dashboard-wrap">
          <div className="dashboard-card">
            <div className="dashboard-avatar-box">
              <User size={38} strokeWidth={2.2} />
            </div>

            <h1 className="dashboard-title">Patient Portal</h1>
            <p className="dashboard-subtitle">
              Welcome, {user.fullName || user.username}! This is your primary patient home page. Future modules for symptom assessment, consultations, and digital prescriptions will be rendered here.
            </p>

            <div className="dashboard-info-table">
              <div className="dashboard-info-row">
                <span className="dashboard-info-label">Account Role:</span>
                <span className="dashboard-info-value" style={{ color: "var(--color-accent)" }}>Patient</span>
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
                <span className="dashboard-info-label">Portal Status:</span>
                <span className="dashboard-info-value" style={{ color: "var(--color-success)" }}>Active Session</span>
              </div>
            </div>

          </div>
        </div>
      </main>
    </>
  );
}
