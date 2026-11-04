import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth-service";
import SignOutButton from "@/components/SignOutButton";
import ThemeToggle from "@/components/ThemeToggle";
import AccountNavBar from "@/components/AccountNavBar";
import AppieSystemNav from "@/components/AppieSystemNav";
import HealthAssessmentDashboard from "@/components/assessment/HealthAssessmentDashboard";
import NotificationBell from "@/components/notifications/NotificationBell";
import UnifiedLiveTrackerComponent from "@/components/tracking/UnifiedLiveTrackerComponent";
import {
  User,
  Activity,
  HeartPulse,
  ShieldCheck,
  Settings,
  ArrowRight,
  Droplet,
  Scale,
  Ruler,
  CalendarCheck2,
  Pill,
  FileCheck,
  Truck,
  FileText,
  CreditCard,
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Patient Dashboard - Appie Healthcare",
  description: "Appie Patient Home Portal & Digital Health Assessment System",
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
          <NotificationBell />
          <ThemeToggle />
          <SignOutButton />
        </div>
      </header>

      <main className="main-wrapper">
        <div style={{ width: "100%", maxWidth: "960px", margin: "0 auto" }}>
          <AppieSystemNav role="patient" />

          {/* Welcome Banner */}
          <div className="dashboard-card" style={{ textAlign: "left", padding: "2rem 2.25rem", marginBottom: "1.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div className="dashboard-avatar-box" style={{ width: "52px", height: "52px", margin: 0, fontSize: "1.4rem" }}>
                  {(user.fullName?.[0] || user.username[0]).toUpperCase()}
                </div>
                <div>
                  <h1 style={{ fontSize: "1.65rem", fontWeight: 800 }}>
                    Welcome back, {user.fullName || user.username}
                  </h1>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                    Connected to Appie Digital Healthcare Network • Patient ID: #{user.id.slice(-6).toUpperCase()}
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.5rem" }}>
                <Link
                  href="/account/health-profile"
                  className="btn-secondary"
                  style={{ minHeight: "40px", fontSize: "0.85rem", padding: "0 0.85rem" }}
                >
                  <HeartPulse size={15} color="var(--color-accent)" />
                  <span>Vitals: O+ / 120-80</span>
                </Link>
              </div>
            </div>
          </div>

          {/* LIVE TRACKING SYSTEM WIDGET */}
          <UnifiedLiveTrackerComponent />


          {/* Primary Quick System Navigation Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1rem",
              marginBottom: "2rem",
            }}
          >
            <Link
              href="/consultations"
              className="dashboard-card"
              style={{
                padding: "1.25rem",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                textDecoration: "none",
                color: "inherit",
                border: "1px solid var(--border-subtle)",
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
                  flexShrink: 0,
                }}
              >
                <CalendarCheck2 size={24} />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.2rem" }}>
                  Telehealth Consultations
                </h3>
                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                  Book video & audio consults with verified doctors.
                </p>
              </div>
              <ArrowRight size={18} color="var(--color-accent)" />
            </Link>

            <Link
              href="/medications"
              className="dashboard-card"
              style={{
                padding: "1.25rem",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                textDecoration: "none",
                color: "inherit",
                border: "1px solid var(--border-subtle)",
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
                  flexShrink: 0,
                }}
              >
                <Pill size={24} />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.2rem" }}>
                  Pharmacy & Meds
                </h3>
                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                  Authentic OTC medicines and express home delivery.
                </p>
              </div>
              <ArrowRight size={18} color="var(--color-accent)" />
            </Link>

            <Link
              href="/prescriptions"
              className="dashboard-card"
              style={{
                padding: "1.25rem",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                textDecoration: "none",
                color: "inherit",
                border: "1px solid var(--border-subtle)",
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
                  flexShrink: 0,
                }}
              >
                <FileCheck size={24} />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.2rem" }}>
                  Digital E-Prescriptions
                </h3>
                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                  Signed prescriptions ready to order in 1-click.
                </p>
              </div>
              <ArrowRight size={18} color="var(--color-accent)" />
            </Link>
          </div>

          {/* PRIMARY: FULL HEALTH ASSESSMENT SYSTEM IN PATIENT DASHBOARD */}
          <HealthAssessmentDashboard user={user} />

          {/* SECONDARY: Account System Quick Navigation Grid */}
          <div style={{ marginTop: "3rem" }}>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "1rem" }}>
              Account & Records Systems
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem", marginBottom: "3rem" }}>
              {/* Card 1: User Profile */}
              <Link href="/account/profile" className="role-card" style={{ minHeight: "180px", padding: "1.5rem" }}>
                <div className="role-icon-container" style={{ width: "42px", height: "42px", marginBottom: "0.75rem" }}>
                  <User size={20} />
                </div>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "0.3rem" }}>User Profile</h3>
                <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", flex: 1 }}>
                  Personal info, emergency contacts, digital health ID.
                </p>
                <div className="role-action-link" style={{ minHeight: "auto", marginTop: "0.75rem" }}>
                  <span>Edit Profile</span>
                  <ArrowRight size={14} />
                </div>
              </Link>

              {/* Card 2: Health Profile */}
              <Link href="/account/health-profile" className="role-card" style={{ minHeight: "180px", padding: "1.5rem" }}>
                <div className="role-icon-container" style={{ width: "42px", height: "42px", marginBottom: "0.75rem" }}>
                  <HeartPulse size={20} />
                </div>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "0.3rem" }}>Health Profile</h3>
                <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", flex: 1 }}>
                  Vitals, allergies, chronic conditions, and medications.
                </p>
                <div className="role-action-link" style={{ minHeight: "auto", marginTop: "0.75rem" }}>
                  <span>Update Vitals</span>
                  <ArrowRight size={14} />
                </div>
              </Link>

              {/* Card 3: Consent Management */}
              <Link href="/account/consents" className="role-card" style={{ minHeight: "180px", padding: "1.5rem" }}>
                <div className="role-icon-container" style={{ width: "42px", height: "42px", marginBottom: "0.75rem" }}>
                  <ShieldCheck size={20} />
                </div>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "0.3rem" }}>Consent Management</h3>
                <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", flex: 1 }}>
                  Data storage, telemedicine, and pharmacy sharing consents.
                </p>
                <div className="role-action-link" style={{ minHeight: "auto", marginTop: "0.75rem" }}>
                  <span>Consents</span>
                  <ArrowRight size={14} />
                </div>
              </Link>

              {/* Card 4: Settings */}
              <Link href="/account/settings" className="role-card" style={{ minHeight: "180px", padding: "1.5rem" }}>
                <div className="role-icon-container" style={{ width: "42px", height: "42px", marginBottom: "0.75rem" }}>
                  <Settings size={20} />
                </div>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "0.3rem" }}>Settings</h3>
                <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", flex: 1 }}>
                  Notification channels, 2FA, theme, and language.
                </p>
                <div className="role-action-link" style={{ minHeight: "auto", marginTop: "0.75rem" }}>
                  <span>Settings</span>
                  <ArrowRight size={14} />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
