import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth-service";
import Navbar from "@/components/Navbar";
import {
  Activity,
  HeartPulse,
  ShieldCheck,
  ArrowRight,
  Droplet,
  CalendarCheck2,
  Pill,
  FileCheck,
  Truck,
  Sparkles,
  FileText,
  Clock,
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
      <Navbar />

      <main className="main-wrapper" style={{ maxWidth: "1100px", width: "100%", padding: "1.5rem 1rem 5rem" }}>
        {/* Welcome Banner */}
        <div
          className="dashboard-card"
          style={{
            padding: "2rem 2.25rem",
            marginBottom: "2rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1.25rem",
          }}
        >
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", fontSize: "0.8rem", fontWeight: 700, color: "var(--color-success)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.3rem" }}>
              <ShieldCheck size={16} />
              <span>Verified Health Account • DPDPA Protected</span>
            </div>
            <h1 style={{ fontSize: "1.85rem", fontWeight: 800 }}>
              Welcome back, {user.fullName || user.username}
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", marginTop: "0.2rem" }}>
              Manage your symptoms, consult registered specialists, and receive verified prescription medicines.
            </p>
          </div>

          <Link
            href="/assessment"
            className="btn-primary"
            style={{ minHeight: "46px", padding: "0 1.5rem", display: "inline-flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}
          >
            <Sparkles size={17} />
            <span>Start Health Assessment</span>
          </Link>
        </div>

        {/* Linear Action Cards (Replacing bento grid with clean vertical layout) */}
        <div className="linear-container">
          {/* Card 1: Health Assessment & Consultations */}
          <Link
            href="/assessment"
            className="linear-card"
            style={{
              padding: "1.5rem 1.75rem",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "14px",
                  background: "var(--color-primary-subtle)",
                  color: "var(--color-accent)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Sparkles size={26} />
              </div>
              <div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 700 }}>AI Symptom Assessment &amp; Clinical Triage</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", marginTop: "0.2rem" }}>
                  Select generalized symptoms with severity scoring to receive instant differential condition insights.
                </p>
              </div>
            </div>
            <ArrowRight size={20} color="var(--color-accent)" />
          </Link>

          {/* Card 2: e-Pharmacy */}
          <Link
            href="/medications"
            className="linear-card"
            style={{
              padding: "1.5rem 1.75rem",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "14px",
                  background: "rgba(16, 185, 129, 0.12)",
                  color: "var(--color-success)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Pill size={26} />
              </div>
              <div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Appie Digital e-Pharmacy</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", marginTop: "0.2rem" }}>
                  Order authentic medications from licensed partner pharmacies with real-time stock availability.
                </p>
              </div>
            </div>
            <ArrowRight size={20} color="var(--color-accent)" />
          </Link>

          {/* Card 3: Orders & Deliveries */}
          <Link
            href="/orders"
            className="linear-card"
            style={{
              padding: "1.5rem 1.75rem",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "14px",
                  background: "rgba(59, 130, 246, 0.12)",
                  color: "var(--color-accent)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Truck size={26} />
              </div>
              <div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Live Orders &amp; Delivery Tracking</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", marginTop: "0.2rem" }}>
                  Monitor courier dispatch stages from Ordered to Collecting and Delivering to your door.
                </p>
              </div>
            </div>
            <ArrowRight size={20} color="var(--color-accent)" />
          </Link>

          {/* Card 4: e-Prescriptions */}
          <Link
            href="/prescriptions"
            className="linear-card"
            style={{
              padding: "1.5rem 1.75rem",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "14px",
                  background: "rgba(168, 85, 247, 0.12)",
                  color: "#a855f7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <FileCheck size={26} />
              </div>
              <div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Digital e-Prescriptions Vault</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", marginTop: "0.2rem" }}>
                  Access doctor-signed digital prescriptions with dosage regimens, QR verification, and refill history.
                </p>
              </div>
            </div>
            <ArrowRight size={20} color="var(--color-accent)" />
          </Link>

          {/* Card 5: Records */}
          <Link
            href="/records"
            className="linear-card"
            style={{
              padding: "1.5rem 1.75rem",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "14px",
                  background: "rgba(245, 158, 11, 0.12)",
                  color: "#f59e0b",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <FileText size={26} />
              </div>
              <div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Medical Assessment &amp; Consultation Records</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", marginTop: "0.2rem" }}>
                  Search and review your past symptom logs, clinician recommendations, and follow-up notes.
                </p>
              </div>
            </div>
            <ArrowRight size={20} color="var(--color-accent)" />
          </Link>
        </div>
      </main>
    </>
  );
}
