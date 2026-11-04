"use client";

import Link from "next/link";
import {
  Stethoscope,
  Pill,
  Truck,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FileCheck2,
  Building,
  Navigation,
} from "lucide-react";

export default function HelpUsDiagnoseSection() {
  return (
    <section className="landing-feature-section" id="help-us-diagnose" aria-label="Help Us Diagnose">
      <div>
        <div className="section-eyebrow">
          <ShieldCheck size={16} />
          <span>03 / Connected Healthcare Ecosystem</span>
        </div>
        <h2 className="section-headline">Help Us Diagnose, Dispense &amp; Deliver</h2>
        <p className="section-desc">
          Appie connects verified medical practitioners, licensed pharmacies, and cold-chain delivery couriers to power accessible routine healthcare across India.
        </p>
      </div>

      <div className="diagnose-section-box">
        <div style={{ textAlign: "center", maxWidth: "780px", margin: "0 auto" }}>
          <h3 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "0.75rem" }}>
            Three Ways to Partner with Appie
          </h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "1rem", lineHeight: 1.6 }}>
            Join our certified healthcare network. Whether you are a clinician, pharmacy owner, or delivery specialist, our digital infrastructure empowers your operations.
          </p>
        </div>

        {/* The Three Required Partner Points in Cards */}
        <div className="diagnose-cards-grid">
          {/* Point 1: Doctors can register on the platform */}
          <div className="partner-track-card" id="card-partner-doctor">
            <div className="partner-track-icon">
              <Stethoscope size={28} />
            </div>

            <div className="partner-req-tag">
              <ShieldCheck size={13} />
              <span>Medical Council License</span>
            </div>

            <h4 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "0.35rem" }}>
              Doctors can register on the platform
            </h4>

            <p className="partner-point-text">
              Licensed medical professionals can register on Appie to evaluate algorithmic patient assessments, conduct encrypted telehealth appointments, provide clinical guidance, and issue legally compliant digital e-prescriptions.
            </p>

            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              <li style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                <CheckCircle2 size={15} color="var(--color-success)" />
                <span>Pre-assessed patient intake summaries</span>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                <CheckCircle2 size={15} color="var(--color-success)" />
                <span>NMC / State Council registry verification</span>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                <CheckCircle2 size={15} color="var(--color-success)" />
                <span>Flexible telemedicine consulting schedule</span>
              </li>
            </ul>

            <Link
              href="/register/doctor"
              className="btn-secondary"
              style={{
                minHeight: "48px",
                padding: "0 1.25rem",
                fontSize: "0.9rem",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                marginTop: "auto",
              }}
            >
              <span>Register as Doctor</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Point 2: Pharmacists can register their medicines for delivery */}
          <div className="partner-track-card" id="card-partner-pharmacist">
            <div className="partner-track-icon">
              <Pill size={28} />
            </div>

            <div className="partner-req-tag">
              <Building size={13} />
              <span>Drug License Form 20/21</span>
            </div>

            <h4 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "0.35rem" }}>
              Pharmacists can register their medicines for delivery
            </h4>

            <p className="partner-point-text">
              Licensed retail and hospital pharmacies can register on Appie to list their medicine inventory, receive verified e-prescription orders, dispense authentic medications, and partner with local dispatch drivers for door delivery.
            </p>

            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              <li style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                <CheckCircle2 size={15} color="var(--color-success)" />
                <span>Automated prescription verification check</span>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                <CheckCircle2 size={15} color="var(--color-success)" />
                <span>Live catalog &amp; inventory synchronization</span>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                <CheckCircle2 size={15} color="var(--color-success)" />
                <span>Direct payout for fulfilled prescriptions</span>
              </li>
            </ul>

            <Link
              href="/register/pharmacist"
              className="btn-secondary"
              style={{
                minHeight: "48px",
                padding: "0 1.25rem",
                fontSize: "0.9rem",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                marginTop: "auto",
              }}
            >
              <span>Register as Pharmacist</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Point 3: Delivery partners can register on the site for delivery jobs */}
          <div className="partner-track-card" id="card-partner-delivery">
            <div className="partner-track-icon">
              <Truck size={28} />
            </div>

            <div className="partner-req-tag">
              <Navigation size={13} />
              <span>Vehicle RC &amp; Driver License</span>
            </div>

            <h4 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "0.35rem" }}>
              Delivery partners can register on the site for delivery jobs
            </h4>

            <p className="partner-point-text">
              Riders and couriers can register on the platform for pharmaceutical delivery jobs, collect sealed packages from partner pharmacies, and ensure temperature-controlled, rapid delivery to patients’ homes.
            </p>

            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              <li style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                <CheckCircle2 size={15} color="var(--color-success)" />
                <span>Flexible working hours &amp; instant payouts</span>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                <CheckCircle2 size={15} color="var(--color-success)" />
                <span>Optimized local pharmaceutical routes</span>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                <CheckCircle2 size={15} color="var(--color-success)" />
                <span>Cold-chain safety &amp; package transit tracking</span>
              </li>
            </ul>

            <Link
              href="/register/delivery-partner"
              className="btn-secondary"
              style={{
                minHeight: "48px",
                padding: "0 1.25rem",
                fontSize: "0.9rem",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                marginTop: "auto",
              }}
            >
              <span>Register as Delivery Partner</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Main CTA: Redirects to Healthcare Registration Page as instructed */}
        <div style={{ textAlign: "center", paddingTop: "1rem", borderTop: "1px solid var(--border-subtle)" }}>
          <Link
            href="/healthcare-registration"
            className="hero-btn-primary"
            style={{
              minHeight: "52px",
              padding: "0 2.5rem",
              fontSize: "1rem",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.75rem",
            }}
            id="cta-healthcare-registration-redirect"
          >
            <span>Proceed to Healthcare Registration Hub</span>
            <ArrowRight size={18} strokeWidth={2.5} />
          </Link>
        </div>
      </div>
    </section>
  );
}
