import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { getCurrentUser } from "@/lib/auth-service";
import SignOutButton from "./SignOutButton";
import NotificationBell from "./notifications/NotificationBell";
import { Activity, User, Stethoscope } from "lucide-react";

export default async function Navbar() {
  const user = await getCurrentUser();

  return (
    <header className="app-header">
      <Link href={user ? (user.role === "patient" ? "/patient/home" : "/professional/home") : "/"} className="brand-logo-wrap" title="Appie Healthcare">
        <div className="brand-icon-box">
          <Activity size={22} strokeWidth={2.5} />
        </div>
        <div>
          <span className="brand-name">Appie</span>
        </div>
        {user && (
          <span className="brand-badge" style={{ marginLeft: "0.25rem" }}>
            {user.role === "patient" ? "Patient" : "Doctor"}
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
