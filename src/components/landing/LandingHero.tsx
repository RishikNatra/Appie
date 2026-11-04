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
        Your Medical Assistant for <span className="gradient-text">Patients and Doctors Alike</span>
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
