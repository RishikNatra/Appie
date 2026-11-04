import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import { getCurrentUser } from "@/lib/auth-service";
import LandingHero from "@/components/landing/LandingHero";
import AssessSymptomsSection from "@/components/landing/AssessSymptomsSection";
import ScheduleConsultationSection from "@/components/landing/ScheduleConsultationSection";
import HelpUsDiagnoseSection from "@/components/landing/HelpUsDiagnoseSection";
import Link from "next/link";
import { Activity, ShieldCheck, HeartHandshake, Phone } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // If user is already logged in, redirect them directly to their role dashboard
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
      <Navbar />

      <main className="landing-container">
        {/* Hero Section */}
        <LandingHero />

        {/* Section 1: Assess Symptoms (Redirects to Patient Login/Register) */}
        <AssessSymptomsSection />

        {/* Section 2: Schedule a Consultation (Redirects to Patient Login/Register) */}
        <ScheduleConsultationSection />

        {/* Section 3: Help us Diagnose (Three Points & Redirects to Healthcare Registration) */}
        <HelpUsDiagnoseSection />

        {/* Minimal Footer */}
        <footer style={{ width: "100%", maxWidth: "1100px", padding: "2.5rem 0 1rem", borderTop: "1px solid var(--border-subtle)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.25rem", color: "var(--text-muted)", fontSize: "0.85rem" }}>
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
