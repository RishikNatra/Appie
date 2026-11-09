import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth-service";
import LandingHero from "@/components/landing/LandingHero";
import DemonstrationShowcase from "@/components/landing/DemonstrationShowcase";
import HelpUsDiagnoseSection from "@/components/landing/HelpUsDiagnoseSection";
import Link from "next/link";
import { Activity, ShieldCheck, HeartPulse, Clock, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // If user is already authenticated, redirect directly to role-specific dashboard
  const user = await getCurrentUser();
  if (user) {
    if (user.role === "patient") {
      redirect("/patient/home");
    } else if (user.role === "health_professional") {
      redirect("/professional/home");
    } else if (user.role === "pharmacist") {
      redirect("/pharmacist/home");
    } else if (user.role === "delivery_partner") {
      redirect("/delivery/home");
    }
  }

  return (
    <>

      <main className="landing-container" style={{ paddingBottom: "4rem" }}>
        {/* Minimal Hero Section */}
        <LandingHero />

        {/* Single Horizontally Sliding, Vertically Scrollable MP4 Video Demonstration Window */}
        <DemonstrationShowcase />

        {/* Clinical Partnership & Quality Assurance Banner */}
        <section
          style={{
            width: "100%",
            maxWidth: "1100px",
            margin: "2rem auto",
            padding: "2rem",
            borderRadius: "20px",
            background: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1.5rem",
            boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.2), 0 0 16px 1px var(--accent-glow)",
          }}
        >
          <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "var(--color-primary-subtle)", color: "var(--color-accent)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "0.25rem" }}>Verified Clinicians</h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>
                Every doctor is registered with State Medical Councils &amp; Telemedicine Guidelines.
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "rgba(16, 185, 129, 0.12)", color: "var(--color-success)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <HeartPulse size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "0.25rem" }}>Authentic Medicines</h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>
                100% genuine pharmaceutical inventory sourced directly from licensed pharmacies.
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "rgba(59, 130, 246, 0.12)", color: "var(--color-accent)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Clock size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "0.25rem" }}>Express Doorstep Delivery</h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>
                Direct courier transit to your address with real-time package updates.
              </p>
            </div>
          </div>
        </section>

        {/* Minimal Footer */}
        <footer
          style={{
            width: "100%",
            maxWidth: "1100px",
            margin: "3rem auto 0",
            padding: "2rem 0 1rem",
            borderTop: "1px solid var(--border-subtle)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1.25rem",
            color: "var(--text-muted)",
            fontSize: "0.85rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: "var(--color-primary)", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff" }}>
              <Activity size={16} />
            </div>
            <strong style={{ color: "var(--text-primary)" }}>Appie Digital Healthcare</strong>
            <span>• © {new Date().getFullYear()} All rights reserved.</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <Link href="/login" className="form-link" style={{ fontSize: "0.85rem" }}>Sign In</Link>
            <Link href="/register?role=patient" className="form-link" style={{ fontSize: "0.85rem" }}>Patient Portal</Link>
            <Link href="/healthcare-registration" className="form-link" style={{ fontSize: "0.85rem" }}>Partner Network</Link>
          </div>
        </footer>
      </main>
    </>
  );
}
