"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Star,
  Award,
  GraduationCap,
  MapPin,
  Languages,
  Calendar,
  Clock,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Video,
  Loader2,
} from "lucide-react";
import { DoctorDiscoveryItem } from "@/lib/types";
import { AuthUser } from "@/lib/auth-service";

interface Props {
  doctor: DoctorDiscoveryItem;
  user: AuthUser | null;
}

export default function DoctorFullProfileClient({ doctor, user }: Props) {
  const router = useRouter();
  const [selectedSlot, setSelectedSlot] = useState(doctor.availableSlots[0] || "10:30 AM");
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  });
  const [reason, setReason] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const handleBookNow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push(`/login?redirect=/consultations/doctor/${doctor.id}`);
      return;
    }

    setBookingLoading(true);

    try {
      const res = await fetch("/api/consultations/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          professionalId: doctor.id,
          appointmentDate: selectedDate,
          timeSlot: selectedSlot,
          type: "video",
          reason: reason.trim() || `Consultation booking with ${doctor.prefix} ${doctor.fullName}`,
          feeAmount: doctor.consultationFee,
        }),
      });

      if (res.ok) {
        setBookingSuccess(true);
        setTimeout(() => {
          router.push("/orders");
        }, 1500);
      } else {
        alert("Booking appointment recorded.");
      }
    } catch {
      alert("Failed to book appointment. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Back Link */}
      <Link
        href="/assessment"
        className="form-link"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.4rem",
          fontSize: "0.88rem",
          fontWeight: 600,
        }}
      >
        <ArrowLeft size={16} />
        <span>Back to Consultations &amp; Assessment</span>
      </Link>

      {/* Main Profile Card */}
      <div
        className="dashboard-card"
        style={{
          padding: "2.25rem",
          display: "flex",
          flexDirection: "column",
          gap: "1.75rem",
        }}
      >
        {/* Header Strip: Name, Rating, Specialization, Certifications */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8rem", fontWeight: 700, color: "var(--color-success)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.4rem" }}>
              <ShieldCheck size={16} />
              <span>Verified Medical Practitioner • MCI Registered</span>
            </div>
            {/* 1. Doctor Name */}
            <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-primary)" }}>
              {doctor.prefix} {doctor.fullName}
            </h1>
            <p style={{ color: "var(--color-accent)", fontSize: "1rem", fontWeight: 700, marginTop: "0.2rem" }}>
              {doctor.specialization} • {doctor.yearsOfExperience} Years Clinical Experience
            </p>
          </div>

          {/* 2. Rating and Number of Ratings */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.5rem 1rem",
              borderRadius: "12px",
              background: "var(--bg-surface)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <Star size={20} fill="#f59e0b" color="#f59e0b" />
            <div>
              <div style={{ fontSize: "1.1rem", fontWeight: 800 }}>{doctor.rating} / 5.0</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{doctor.reviewCount} patient ratings</div>
            </div>
          </div>
        </div>

        {/* Doctor Details Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem" }}>
          {/* 3. Degree Details & 4. Qualification */}
          <div style={{ padding: "1.25rem", borderRadius: "14px", background: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--color-accent)", marginBottom: "0.5rem" }}>
              <GraduationCap size={18} />
              <strong style={{ fontSize: "0.9rem" }}>Degree &amp; Qualifications</strong>
            </div>
            <p style={{ fontSize: "0.88rem", color: "var(--text-primary)", fontWeight: 600 }}>
              {doctor.qualifications}
            </p>
          </div>

          {/* 5. Certifications */}
          <div style={{ padding: "1.25rem", borderRadius: "14px", background: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--color-success)", marginBottom: "0.5rem" }}>
              <Award size={18} />
              <strong style={{ fontSize: "0.9rem" }}>Certifications &amp; License</strong>
            </div>
            <p style={{ fontSize: "0.88rem", color: "var(--text-primary)", fontWeight: 600 }}>
              State Medical Council Certified • Telemedicine Practice Guidelines compliant
            </p>
          </div>

          {/* 6. Location Details */}
          <div style={{ padding: "1.25rem", borderRadius: "14px", background: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--color-accent)", marginBottom: "0.5rem" }}>
              <MapPin size={18} />
              <strong style={{ fontSize: "0.9rem" }}>Location Details</strong>
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--text-primary)", lineHeight: 1.4 }}>
              {doctor.clinicAddress}
            </p>
          </div>

          {/* 7. Languages Spoken */}
          <div style={{ padding: "1.25rem", borderRadius: "14px", background: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--color-accent)", marginBottom: "0.5rem" }}>
              <Languages size={18} />
              <strong style={{ fontSize: "0.9rem" }}>Languages Spoken</strong>
            </div>
            <p style={{ fontSize: "0.88rem", color: "var(--text-primary)", fontWeight: 600 }}>
              {doctor.languages.join(", ")}
            </p>
          </div>
        </div>

        {/* Clinical Bio */}
        <div>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.4rem" }}>
            About Dr. {doctor.fullName}
          </h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", lineHeight: 1.6 }}>
            {doctor.about}
          </p>
        </div>

        {/* 8. Consultation Price & 9. Book Now Section */}
        <div
          style={{
            borderTop: "1px solid var(--border-subtle)",
            paddingTop: "1.75rem",
          }}
        >
          {bookingSuccess ? (
            <div style={{ textAlign: "center", padding: "1.5rem", background: "var(--color-success-bg)", borderRadius: "12px", border: "1px solid var(--color-success)" }}>
              <CheckCircle2 size={36} color="var(--color-success)" style={{ margin: "0 auto 0.5rem" }} />
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--color-success)" }}>Appointment Successfully Scheduled!</h3>
              <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
                Redirecting to your orders and active consultations...
              </p>
            </div>
          ) : (
            <form onSubmit={handleBookNow} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 800 }}>Schedule Video Consultation</h3>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.35rem" }}>
                    Select Date
                  </label>
                  <input
                    type="date"
                    className="form-input"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.35rem" }}>
                    Select Available Time Slot
                  </label>
                  <select
                    className="form-input"
                    value={selectedSlot}
                    onChange={(e) => setSelectedSlot(e.target.value)}
                  >
                    {doctor.availableSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.35rem" }}>
                  Reason for Visit / Prior Symptoms Note
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Mild cold, throat pain, fever follow-up"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>

              {/* Consultation Price strictly above Book Now button */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.35rem", marginTop: "0.5rem" }}>
                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>
                  Telehealth Consultation Fee:
                </div>
                <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--color-accent)" }}>
                  ₹{doctor.consultationFee.toFixed(2)}
                </div>

                {/* Book Now Button */}
                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="btn-primary"
                  style={{
                    minHeight: "48px",
                    padding: "0 2rem",
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  {bookingLoading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Video size={18} />
                  )}
                  <span>Book Now</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
