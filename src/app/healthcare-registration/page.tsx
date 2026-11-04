import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  Stethoscope,
  Pill,
  Truck,
  ArrowRight,
  ShieldCheck,
  Building,
  Navigation,
  FileCheck2,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";

export const metadata = {
  title: "Healthcare Partner Registration - Appie",
  description: "Register as a Doctor, Pharmacist, or Delivery Partner on Appie Healthcare Platform.",
};

export default function HealthcareRegistrationPage() {
  return (
    <>
      <Navbar />

      <main className="landing-container" style={{ paddingTop: "2.5rem" }}>
        <div style={{ width: "100%", maxWidth: "1100px", marginBottom: "1.5rem" }}>
          <Link
            href="/"
            className="back-link"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "var(--text-secondary)", textDecoration: "none", fontSize: "0.9rem" }}
          >
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </Link>
        </div>

        <section style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto 3rem" }}>
          <div className="section-eyebrow">
            <ShieldCheck size={16} />
            <span>Partner Onboarding Portal</span>
          </div>

          <h1 className="hero-main-title" style={{ fontSize: "2.65rem", marginBottom: "0.75rem" }}>
            Choose Your Healthcare Registration Track
          </h1>

          <p className="hero-subtext" style={{ fontSize: "1.05rem", margin: "0 auto" }}>
            Select your professional role below to proceed to your dedicated registration screen with credential verification.
          </p>
        </section>

        {/* The Three Required Sections */}
        <div className="partner-hub-grid" aria-label="Healthcare Partner Tracks">
          {/* Section 1: Register as Doctor */}
          <div className="partner-track-card" id="track-doctor">
            <div className="partner-track-icon">
              <Stethoscope size={30} />
            </div>

            <div className="partner-req-tag">
              <FileCheck2 size={13} />
              <span>Medical Certificate Verification</span>
            </div>

            <h2 style={{ fontSize: "1.35rem", fontWeight: 800, marginBottom: "0.5rem" }}>
              1. Register as Doctor
            </h2>

            <p className="partner-point-text">
              Join licensed clinicians on Appie. Access digital symptom assessments, conduct secure telehealth appointments, and prescribe legally certified e-prescriptions.
            </p>

            <div style={{ backgroundColor: "var(--bg-card)", padding: "1rem", borderRadius: "12px", border: "1px solid var(--border-subtle)", margin: "0.5rem 0 1.5rem" }}>
              <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
                Credential Requirement
              </div>
              <div style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--text-primary)", marginTop: "0.2rem" }}>
                NMC / State Medical Council License &amp; Degree Certificate
              </div>
            </div>

            <Link
              href="/register/doctor"
              className="btn-primary"
              style={{
                minHeight: "50px",
                padding: "0 1.5rem",
                fontSize: "0.95rem",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.6rem",
                marginTop: "auto",
              }}
              id="btn-goto-doctor-registration"
            >
              <span>Continue to Doctor Registration</span>
              <ArrowRight size={17} strokeWidth={2.5} />
            </Link>
          </div>

          {/* Section 2: Register as Pharmacist */}
          <div className="partner-track-card" id="track-pharmacist">
            <div className="partner-track-icon">
              <Pill size={30} />
            </div>

            <div className="partner-req-tag">
              <Building size={13} />
              <span>Pharmacy Certificate Verification</span>
            </div>

            <h2 style={{ fontSize: "1.35rem", fontWeight: 800, marginBottom: "0.5rem" }}>
              2. Register as Pharmacist
            </h2>

            <p className="partner-point-text">
              Register your pharmacy on Appie. List genuine medications, fulfill validated digital prescriptions, and dispatch packages to local patients.
            </p>

            <div style={{ backgroundColor: "var(--bg-card)", padding: "1rem", borderRadius: "12px", border: "1px solid var(--border-subtle)", margin: "0.5rem 0 1.5rem" }}>
              <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
                Credential Requirement
              </div>
              <div style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--text-primary)", marginTop: "0.2rem" }}>
                State Drug License (Form 20/21) &amp; Pharmacist Council Reg.
              </div>
            </div>

            <Link
              href="/register/pharmacist"
              className="btn-primary"
              style={{
                minHeight: "50px",
                padding: "0 1.5rem",
                fontSize: "0.95rem",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.6rem",
                marginTop: "auto",
              }}
              id="btn-goto-pharmacist-registration"
            >
              <span>Continue to Pharmacist Registration</span>
              <ArrowRight size={17} strokeWidth={2.5} />
            </Link>
          </div>

          {/* Section 3: Register as Delivery Partner */}
          <div className="partner-track-card" id="track-delivery">
            <div className="partner-track-icon">
              <Truck size={30} />
            </div>

            <div className="partner-req-tag">
              <Navigation size={13} />
              <span>Vehicle Registration Verification</span>
            </div>

            <h2 style={{ fontSize: "1.35rem", fontWeight: 800, marginBottom: "0.5rem" }}>
              3. Register as Delivery Partner
            </h2>

            <p className="partner-point-text">
              Join the healthcare logistics network. Deliver vital medicines from pharmacies to patients safely with optimized routes and flexible earning.
            </p>

            <div style={{ backgroundColor: "var(--bg-card)", padding: "1rem", borderRadius: "12px", border: "1px solid var(--border-subtle)", margin: "0.5rem 0 1.5rem" }}>
              <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
                Credential Requirement
              </div>
              <div style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--text-primary)", marginTop: "0.2rem" }}>
                Vehicle RC (Registration Certificate) &amp; Driving License
              </div>
            </div>

            <Link
              href="/register/delivery-partner"
              className="btn-primary"
              style={{
                minHeight: "50px",
                padding: "0 1.5rem",
                fontSize: "0.95rem",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.6rem",
                marginTop: "auto",
              }}
              id="btn-goto-delivery-registration"
            >
              <span>Continue to Delivery Partner Registration</span>
              <ArrowRight size={17} strokeWidth={2.5} />
            </Link>
          </div>
        </div>

        {/* Existing User Login Prompt */}
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <span style={{ color: "var(--text-secondary)", fontSize: "0.92rem" }}>
            Already registered as a healthcare partner?{" "}
          </span>
          <Link href="/login" className="form-link" style={{ fontSize: "0.92rem", fontWeight: 700 }}>
            Sign into your partner account
          </Link>
        </div>
      </main>
    </>
  );
}
