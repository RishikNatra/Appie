"use client";

import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Stethoscope,
  Activity,
  Clock,
  Pill,
  Truck,
  CheckCircle2,
} from "lucide-react";

export default function LandingHero() {
  return (
    <section className="hero-wrapper" aria-label="Hero Overview">
      {/* Sleek Pill Badge */}
      <div className="hero-pill-badge">
        <Sparkles size={15} />
        <span>Next-Generation Healthcare Intelligence</span>
      </div>

      {/* Main Catchline strictly as instructed */}
      <h1 className="hero-main-title">
        Your Medical Assistant for <span style={{ color: "var(--color-accent)" }}>Patients and Doctors Alike</span>
      </h1>

      {/* Brief Subtext describing what Appie does */}
      <p className="hero-subtext">
        Appie streamlines routine healthcare by uniting intelligent symptom assessment, verified clinician consultations, and doorstep medicine delivery onto one seamless, trusted platform.
      </p>

      {/* Hero Primary Actions */}
      <div className="hero-cta-group">
        <Link
          href="/register?role=patient"
          className="hero-btn-primary"
          id="hero-cta-patient"
          aria-label="Start as a patient"
        >
          <span>Get Started as Patient</span>
          <ArrowRight size={18} strokeWidth={2.5} />
        </Link>

        <Link
          href="/healthcare-registration"
          className="hero-btn-secondary"
          id="hero-cta-partner"
          aria-label="Register as healthcare partner"
        >
          <Stethoscope size={18} color="var(--color-accent)" />
          <span>Join Healthcare Network</span>
        </Link>
      </div>

      {/* Hero Interactive Care Platform Showcase Image */}
      <div
        style={{
          width: "100%",
          maxWidth: "1050px",
          margin: "2.5rem auto 1.5rem",
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: "0 12px 40px -10px rgba(0, 0, 0, 0.5), 0 0 25px 2px var(--accent-glow, rgba(13, 148, 136, 0.2))",
          border: "1.5px solid var(--border-medium, #3f3f46)",
          background: "var(--bg-card, #18181b)",
          transition: "transform 250ms ease, box-shadow 250ms ease",
        }}
      >
        <img
          src="/images/appie-hero-platform.svg"
          alt="Appie Healthcare Unified Care Platform - AI Triage, Doctor Consultations, and Pharmacy Logistics"
          style={{
            width: "100%",
            height: "auto",
            display: "block",
          }}
          loading="eager"
        />
      </div>

      {/* Agiloft-inspired Proof Metrics Strip */}
      <div className="proof-metrics-bar" aria-label="Clinical Metrics">
        <div className="metric-item">
          <div className="metric-val">99.2%</div>
          <div className="metric-lbl">Clinical Triage Match</div>
        </div>

        <div className="metric-item">
          <div className="metric-val">&lt; 15 min</div>
          <div className="metric-lbl">Doctor Consult Dispatch</div>
        </div>

        <div className="metric-item">
          <div className="metric-val">100%</div>
          <div className="metric-lbl">CDSCO Verified Medicines</div>
        </div>

        <div className="metric-item">
          <div className="metric-val">256-Bit</div>
          <div className="metric-lbl">Encrypted Health Vault</div>
        </div>
      </div>
    </section>
  );
}
