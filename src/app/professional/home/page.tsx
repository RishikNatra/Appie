import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth-service";
import SignOutButton from "@/components/SignOutButton";
import ThemeToggle from "@/components/ThemeToggle";
import { Stethoscope, Activity, ShieldCheck, Award } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Health Professional Dashboard - Appie",
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
          <ThemeToggle />
          <SignOutButton />
        </div>
      </header>

      <main className="main-wrapper">
        <div className="dashboard-wrap">
          <div className="dashboard-card">
            <div className="dashboard-avatar-box">
              <Stethoscope size={38} strokeWidth={2.2} />
            </div>

            <h1 className="dashboard-title">Health Professional Portal</h1>
            <p className="dashboard-subtitle">
              Welcome, {user.fullName || user.username}! This is your clinician workspace. Future modules for reviewing patient assessments, conducting appointments, and signing digital prescriptions will appear here.
            </p>

            <div className="dashboard-info-table">
              <div className="dashboard-info-row">
                <span className="dashboard-info-label">Account Role:</span>
                <span className="dashboard-info-value" style={{ color: "var(--color-accent)" }}>
                  Health Professional
                </span>
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
                <span className="dashboard-info-label">Medical Verification:</span>
                <span className="dashboard-info-value" style={{ color: "var(--color-success)", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  <Award size={14} /> Verified Practitioner
                </span>
              </div>
            </div>


          </div>
        </div>
      </main>
    </>
  );
}
