import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { getCurrentUser } from "@/lib/auth-service";
import SignOutButton from "./SignOutButton";
import NotificationBell from "./notifications/NotificationBell";
import {
  Activity,
  User,
  Settings,
  Stethoscope,
  Pill,
  ClipboardList,
  FileCheck2,
  Package,
} from "lucide-react";

export default async function Navbar() {
  const user = await getCurrentUser();

  const getDashboardHref = () => {
    if (!user) return "/";
    if (user.role === "health_professional") return "/professional/home";
    if (user.role === "pharmacist") return "/pharmacist/home";
    if (user.role === "delivery_partner") return "/delivery/home";
    return "/patient/home";
  };

  const isPatient = !user || user.role === "patient";

  return (
    <header className="app-header" style={{ position: "sticky", top: 0, zIndex: 100 }}>
      {/* 1. Appie logo and text — clicking navigates to Patient Dashboard / Role Dashboard */}
      <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
        <Link href={getDashboardHref()} className="brand-logo-wrap" title="Appie Healthcare Dashboard">
          <div className="brand-icon-box">
            <Activity size={22} strokeWidth={2.5} />
          </div>
          <div>
            <span className="brand-name">Appie</span>
          </div>
          {user && user.role !== "patient" && (
            <span className="brand-badge" style={{ marginLeft: "0.25rem" }}>
              {user.role === "health_professional" ? "Doctor" : user.role === "pharmacist" ? "Pharmacy" : "Delivery"}
            </span>
          )}
        </Link>

        {/* 2-7: Patient Navigation Items in exact specified order */}
        {isPatient && (
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
              flexWrap: "wrap",
            }}
            aria-label="Patient Primary Navigation"
          >
            {/* 2. Health Assessment */}
            <Link
              href="/assessment"
              className="form-link"
              style={{
                minHeight: "40px",
                padding: "0 0.75rem",
                fontSize: "0.88rem",
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                borderRadius: "8px",
              }}
            >
              <span>Health Assessment</span>
            </Link>

            {/* 3. e-Pharmacy */}
            <Link
              href="/medications"
              className="form-link"
              style={{
                minHeight: "40px",
                padding: "0 0.75rem",
                fontSize: "0.88rem",
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                borderRadius: "8px",
              }}
            >
              <span>e-Pharmacy</span>
            </Link>

            {/* 4. Orders */}
            <Link
              href="/orders"
              className="form-link"
              style={{
                minHeight: "40px",
                padding: "0 0.75rem",
                fontSize: "0.88rem",
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                borderRadius: "8px",
              }}
            >
              <span>Orders</span>
            </Link>

            {/* 5. e-Prescriptions */}
            <Link
              href="/prescriptions"
              className="form-link"
              style={{
                minHeight: "40px",
                padding: "0 0.75rem",
                fontSize: "0.88rem",
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                borderRadius: "8px",
              }}
            >
              <span>e-Prescriptions</span>
            </Link>

            {/* 6. Records */}
            <Link
              href="/records"
              className="form-link"
              style={{
                minHeight: "40px",
                padding: "0 0.75rem",
                fontSize: "0.88rem",
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                borderRadius: "8px",
              }}
            >
              <span>Records</span>
            </Link>

            {/* 7. Profile */}
            <Link
              href="/account/profile"
              className="form-link"
              style={{
                minHeight: "40px",
                padding: "0 0.75rem",
                fontSize: "0.88rem",
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                borderRadius: "8px",
              }}
            >
              <span>Profile</span>
            </Link>
          </nav>
        )}

        {/* Professional Navigation for Doctor/Pharmacist/Delivery */}
        {user && user.role === "health_professional" && (
          <nav style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <Link href="/consultations" className="form-link" style={{ minHeight: "40px", padding: "0 0.65rem", fontSize: "0.88rem" }}>
              Appointments
            </Link>
            <Link href="/prescriptions" className="form-link" style={{ minHeight: "40px", padding: "0 0.65rem", fontSize: "0.88rem" }}>
              Issue Prescriptions
            </Link>
            <Link href="/reviews" className="form-link" style={{ minHeight: "40px", padding: "0 0.65rem", fontSize: "0.88rem" }}>
              Review Queue
            </Link>
          </nav>
        )}

        {user && user.role === "pharmacist" && (
          <nav style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <Link href="/pharmacist/home" className="form-link" style={{ minHeight: "40px", padding: "0 0.65rem", fontSize: "0.88rem" }}>
              Order Fulfillment
            </Link>
            <Link href="/medications" className="form-link" style={{ minHeight: "40px", padding: "0 0.65rem", fontSize: "0.88rem" }}>
              Inventory Management
            </Link>
          </nav>
        )}

        {user && user.role === "delivery_partner" && (
          <nav style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <Link href="/delivery/home" className="form-link" style={{ minHeight: "40px", padding: "0 0.65rem", fontSize: "0.88rem" }}>
              Active Dispatches
            </Link>
          </nav>
        )}
      </div>

      {/* Right Controls: Notification, Theme, Sign Out, and 8. Settings icon at extreme top-right */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
        {user ? (
          <>
            <NotificationBell />
            <ThemeToggle />
            <SignOutButton />
          </>
        ) : (
          <>
            <Link
              href="/healthcare-registration"
              className="form-link"
              style={{ minHeight: "40px", padding: "0 0.5rem", fontSize: "0.88rem", color: "var(--color-accent)" }}
            >
              Partner Network
            </Link>
            <Link
              href="/login"
              className="form-link"
              style={{ minHeight: "40px", padding: "0 0.5rem", fontSize: "0.88rem" }}
            >
              Sign In
            </Link>
            <ThemeToggle />
          </>
        )}

        {/* 8. Settings icon at the extreme top-right of the main navigation bar */}
        <Link
          href="/account/settings"
          aria-label="Settings"
          title="Account & System Settings"
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "10px",
            border: "1px solid var(--border-subtle)",
            background: "var(--bg-card)",
            color: "var(--text-primary)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            textDecoration: "none",
            transition: "all 200ms ease",
          }}
        >
          <Settings size={19} />
        </Link>
      </div>
    </header>
  );
}
