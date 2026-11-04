"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Stethoscope,
  ArrowRight,
  Star,
  CheckCircle2,
  Calendar,
  Clock,
  Video,
  ShieldCheck,
  Award,
  MapPin,
  FileCheck,
} from "lucide-react";

interface DoctorData {
  id: string;
  name: string;
  specialty: string;
  degrees: string;
  experience: number;
  rating: number;
  reviewsCount: number;
  council: string;
  fee: number;
  clinic: string;
  slots: string[];
}

const DOCTORS: DoctorData[] = [
  {
    id: "doc-1",
    name: "Dr. Ananya Sharma",
    specialty: "General Physician & Telehealth",
    degrees: "MBBS, MD (Internal Medicine)",
    experience: 12,
    rating: 4.9,
    reviewsCount: 482,
    council: "Karnataka Medical Council (KMC Verified)",
    fee: 399,
    clinic: "Apollo Clinic Network, Bengaluru",
    slots: ["Today 4:30 PM", "Today 5:00 PM", "Today 5:45 PM", "Tomorrow 10:00 AM", "Tomorrow 11:30 AM"],
  },
  {
    id: "doc-2",
    name: "Dr. Rajesh Mehta",
    specialty: "Internal Medicine Specialist",
    degrees: "MBBS, DNB (General Medicine)",
    experience: 15,
    rating: 4.85,
    reviewsCount: 390,
    council: "Delhi Medical Council (DMC Verified)",
    fee: 449,
    clinic: "Fortis Health Enclave, New Delhi",
    slots: ["Today 5:15 PM", "Today 6:00 PM", "Today 7:00 PM", "Tomorrow 11:00 AM"],
  },
  {
    id: "doc-3",
    name: "Dr. Priya Nair",
    specialty: "Dermatologist & Cosmetologist",
    degrees: "MBBS, MD (Dermatology)",
    experience: 9,
    rating: 4.92,
    reviewsCount: 310,
    council: "Maharashtra Medical Council (MMC Verified)",
    fee: 499,
    clinic: "Skin & Care Clinic, Mumbai",
    slots: ["Today 4:00 PM", "Today 5:30 PM", "Tomorrow 2:00 PM", "Tomorrow 4:30 PM"],
  },
];

export default function ScheduleConsultationSection() {
  const [selectedDoctorIndex, setSelectedDoctorIndex] = useState(0);
  const doctor = DOCTORS[selectedDoctorIndex];
  const [selectedSlot, setSelectedSlot] = useState(doctor.slots[0]);
  const [consultType, setConsultType] = useState<"video" | "audio">("video");

  const handleSelectDoctor = (index: number) => {
    setSelectedDoctorIndex(index);
    setSelectedSlot(DOCTORS[index].slots[0]);
  };

  return (
    <section className="landing-feature-section" id="schedule-consultation" aria-label="Schedule a Consultation">
      <div>
        <div className="section-eyebrow">
          <Stethoscope size={16} />
          <span>02 / Verified Telehealth Care</span>
        </div>
        <h2 className="section-headline">Schedule a Consultation with Licensed Doctors</h2>
        <p className="section-desc">
          Connect in minutes with board-certified healthcare professionals who review your symptoms, conduct secure high-definition video consultations, and issue certified digital prescriptions.
        </p>
      </div>

      <div className="demo-showcase-box">
        {/* Speciality Switcher */}
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.75rem" }}>
          {DOCTORS.map((doc, idx) => (
            <button
              key={doc.id}
              type="button"
              className={`interactive-chip ${selectedDoctorIndex === idx ? "selected" : ""}`}
              onClick={() => handleSelectDoctor(idx)}
              style={{ minHeight: "44px", fontSize: "0.85rem" }}
            >
              <span>{doc.specialty.split("&")[0].trim()}</span>
            </button>
          ))}
        </div>

        <div className="consult-grid-demo">
          {/* Doctor Profile Card */}
          <div className="doctor-profile-preview">
            <div className="doctor-head-info">
              <div className="doctor-avatar-circle">
                {doctor.name.split(" ")[1]?.charAt(0) || "D"}
              </div>

              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <h3 style={{ fontSize: "1.15rem", fontWeight: 800 }}>{doctor.name}</h3>
                  <span title="Verified Doctor" style={{ display: "inline-flex" }}>
                    <Award size={16} color="var(--color-accent)" />
                  </span>
                </div>

                <div style={{ fontSize: "0.82rem", color: "var(--color-accent)", fontWeight: 700 }}>
                  {doctor.degrees}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "0.82rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "0.2rem", color: "#eab308", fontWeight: 700 }}>
                    <Star size={13} fill="#eab308" /> {doctor.rating}
                  </span>
                  <span>•</span>
                  <span>{doctor.experience} Yrs Experience</span>
                </div>
              </div>
            </div>

            <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", display: "flex", flexDirection: "column", gap: "0.35rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                <ShieldCheck size={14} color="var(--color-success)" />
                <span>{doctor.council}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                <MapPin size={14} />
                <span>{doctor.clinic}</span>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem 1rem", backgroundColor: "var(--bg-input)", borderRadius: "12px", border: "1px solid var(--border-subtle)" }}>
              <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Consultation Fee:</span>
              <strong style={{ fontSize: "1.2rem", color: "var(--color-accent)" }}>₹{doctor.fee}</strong>
            </div>

            <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
              ✓ End-to-end encrypted telehealth session<br />
              ✓ Automatic symptom triage summary transmission<br />
              ✓ Legally valid e-prescription with CDSCO compliance
            </div>
          </div>

          {/* Interactive Appointment Slot Picker */}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "1.5rem" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--text-primary)" }}>
                  Consultation Format:
                </span>
                <span style={{ fontSize: "0.78rem", color: "var(--color-success)", fontWeight: 700 }}>
                  ● Instant Doctor Availability
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1.5rem" }}>
                <button
                  type="button"
                  className={`slot-btn ${consultType === "video" ? "active" : ""}`}
                  onClick={() => setConsultType("video")}
                  style={{ gap: "0.5rem" }}
                >
                  <Video size={16} />
                  <span>HD Video Telehealth</span>
                </button>

                <button
                  type="button"
                  className={`slot-btn ${consultType === "audio" ? "active" : ""}`}
                  onClick={() => setConsultType("audio")}
                  style={{ gap: "0.5rem" }}
                >
                  <Clock size={16} />
                  <span>Audio Clinical Call</span>
                </button>
              </div>

              <div style={{ marginBottom: "0.75rem" }}>
                <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--text-primary)" }}>
                  Select Preferred Consultation Time Slot:
                </span>
              </div>

              <div className="slot-picker-grid">
                {doctor.slots.map((slot) => {
                  const isActive = selectedSlot === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      className={`slot-btn ${isActive ? "active" : ""}`}
                      onClick={() => setSelectedSlot(slot)}
                    >
                      <span>{slot}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Booking Summary & Redirect to Patient Login/Registration */}
            <div style={{ padding: "1.25rem", backgroundColor: "var(--bg-surface)", borderRadius: "16px", border: "1px solid var(--border-subtle)", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                    Selected Slot
                  </div>
                  <div style={{ fontSize: "1rem", fontWeight: 800, color: "var(--color-accent)" }}>
                    {selectedSlot} ({consultType === "video" ? "Video" : "Audio"})
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                    Total Payable
                  </div>
                  <div style={{ fontSize: "1.1rem", fontWeight: 800 }}>
                    ₹{doctor.fee}
                  </div>
                </div>
              </div>

              <Link
                href="/register?role=patient"
                className="btn-primary"
                style={{
                  minHeight: "48px",
                  padding: "0 1.5rem",
                  fontSize: "0.95rem",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.6rem",
                  width: "100%",
                }}
                id="cta-schedule-consultation-redirect"
              >
                <span>Book This Consultation Now</span>
                <ArrowRight size={17} strokeWidth={2.5} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
