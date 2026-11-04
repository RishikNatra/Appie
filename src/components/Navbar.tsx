import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { getCurrentUser } from "@/lib/auth-service";
import SignOutButton from "./SignOutButton";
import NotificationBell from "./notifications/NotificationBell";
import { Activity, User, Stethoscope } from "lucide-react";

export default async function Navbar() {
  const user = await getCurrentUser();

  const getDashboardHref = () => {
    if (!user) return "/";
    if (user.role === "health_professional") return "/professional/home";
    if (user.role === "pharmacist") return "/pharmacist/home";
    if (user.role === "delivery_partner") return "/delivery/home";
    return "/patient/home";
  };

  const getRoleLabel = () => {
    if (!user) return "";
    if (user.role === "health_professional") return "Doctor";
    if (user.role === "pharmacist") return "Pharmacist";
    if (user.role === "delivery_partner") return "Delivery";
    return "Patient";
  };

  return (
    <header className="app-header">
      <Link href={getDashboardHref()} className="brand-logo-wrap" title="Appie Healthcare">
        <div className="brand-icon-box">
          <Activity size={22} strokeWidth={2.5} />
        </div>
        <div>
          <span className="brand-name">Appie</span>
        </div>
        {user && (
          <span className="brand-badge" style={{ marginLeft: "0.25rem" }}>
            {getRoleLabel()}
          </span>
        )}
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        {user ? (
          <>
            <NotificationBell />
            <Link
              href="/account/profile"
              className="btn-secondary"
              style={{
                minHeight: "42px",
                padding: "0 0.85rem",
                fontSize: "0.88rem",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.45rem",
              }}
            >
              <User size={16} />
              <span>{user.fullName || user.username}</span>
            </Link>
            <ThemeToggle />
            <SignOutButton />
          </>
        ) : (
          <>
            <Link
              href="/healthcare-registration"
              className="form-link"
              style={{ minHeight: "48px", padding: "0 0.5rem", fontSize: "0.9rem", color: "var(--color-accent)" }}
            >
              Partner Network
            </Link>
            <Link
              href="/login"
              className="form-link"
              style={{ minHeight: "48px", padding: "0 0.5rem" }}
            >
              Sign In
            </Link>
            <ThemeToggle />
          </>
        )}
      </div>
    </header>
  );
}
