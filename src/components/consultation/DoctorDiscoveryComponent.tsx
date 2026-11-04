"use client";

import { useState } from "react";
import { DoctorDiscoveryItem } from "@/lib/types";
import { SPECIALIZATION_LIST } from "@/lib/doctors-catalog";
import {
  Search,
  SlidersHorizontal,
  Star,
  Award,
  Clock,
  MapPin,
  Calendar,
  Languages,
  Video,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

interface DoctorDiscoveryComponentProps {
  initialDoctors: DoctorDiscoveryItem[];
  initialSpecialization?: string;
  onSelectDoctor: (doctor: DoctorDiscoveryItem) => void;
  onBookDoctor: (doctor: DoctorDiscoveryItem) => void;
}

export default function DoctorDiscoveryComponent({
  initialDoctors,
  initialSpecialization,
  onSelectDoctor,
  onBookDoctor,
}: DoctorDiscoveryComponentProps) {
  const [doctors, setDoctors] = useState<DoctorDiscoveryItem[]>(initialDoctors);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState(
    initialSpecialization || "All Specializations"
  );
  const [maxFee, setMaxFee] = useState<number>(1000);

  const filteredDoctors = doctors.filter((doc) => {
    const matchesQuery =
      !searchQuery ||
      doc.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.qualifications.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSpecialization =
      selectedSpecialization === "All Specializations" ||
      doc.specialization.toLowerCase().includes(selectedSpecialization.toLowerCase());

    const matchesFee = doc.consultationFee <= maxFee;

    return matchesQuery && matchesSpecialization && matchesFee;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Search & Filter Header Component */}
      <div
        className="dashboard-card"
        style={{
          padding: "1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "center" }}>
          {/* Professional Search Component */}
          <div style={{ flex: "1 1 280px", position: "relative" }}>
            <Search
              size={18}
              style={{
                position: "absolute",
                left: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted)",
              }}
            />
            <input
              type="text"
              className="form-input"
              placeholder="Search by doctor name, specialty, or condition..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: "42px", minHeight: "48px" }}
              aria-label="Search doctors"
            />
          </div>

          {/* Professional Filter Component: Specialization */}
          <div style={{ flex: "1 1 200px" }}>
            <select
              className="form-input"
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
              style={{ minHeight: "48px" }}
              aria-label="Filter by specialization"
            >
              {SPECIALIZATION_LIST.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>

          {/* Max Fee Filter Slider */}
          <div
            style={{
              flex: "1 1 180px",
              display: "flex",
              flexDirection: "column",
              gap: "0.25rem",
              padding: "0 0.5rem",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem" }}>
              <span style={{ color: "var(--text-secondary)" }}>Max Fee:</span>
              <span style={{ fontWeight: 700, color: "var(--color-accent)" }}>₹{maxFee}</span>
            </div>
            <input
              type="range"
              min="400"
              max="1000"
              step="50"
              value={maxFee}
              onChange={(e) => setMaxFee(Number(e.target.value))}
              style={{ accentColor: "var(--color-accent)", height: "6px", cursor: "pointer" }}
            />
          </div>
        </div>

        {/* Quick Filter Tag Chips */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", fontSize: "0.82rem" }}>
          <span style={{ color: "var(--text-muted)", alignSelf: "center", marginRight: "0.25rem" }}>
            Popular:
          </span>
          {["General Physician", "Pulmonology & Respiratory Care", "Dermatology & Cosmetology"].map(
            (spec) => (
              <button
                key={spec}
                type="button"
                onClick={() => setSelectedSpecialization(spec)}
                style={{
                  background:
                    selectedSpecialization === spec
                      ? "rgba(255, 178, 0, 0.15)"
                      : "rgba(255, 255, 255, 0.05)",
                  color: selectedSpecialization === spec ? "var(--color-accent)" : "var(--text-secondary)",
                  border:
                    selectedSpecialization === spec
                      ? "1px solid var(--color-accent)"
                      : "1px solid var(--border-subtle)",
                  borderRadius: "20px",
                  padding: "0.3rem 0.75rem",
                  cursor: "pointer",
                  transition: "all 250ms ease",
                }}
              >
                {spec}
              </button>
            )
          )}
          {selectedSpecialization !== "All Specializations" && (
            <button
              type="button"
              onClick={() => setSelectedSpecialization("All Specializations")}
              style={{
                background: "transparent",
                color: "var(--color-error)",
                border: "none",
                cursor: "pointer",
                padding: "0.3rem 0.5rem",
                textDecoration: "underline",
              }}
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Professional Result List Component */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>
            Verified Healthcare Specialists ({filteredDoctors.length})
          </h3>
          <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
            Telemedicine Practice Registered
          </span>
        </div>

        {filteredDoctors.length === 0 ? (
          <div
            className="dashboard-card"
            style={{ textAlign: "center", padding: "3rem 1.5rem", color: "var(--text-secondary)" }}
          >
            <p style={{ marginBottom: "0.5rem" }}>No medical professionals matched your search criteria.</p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedSpecialization("All Specializations");
                setMaxFee(1000);
              }}
              className="btn-secondary"
              style={{ minHeight: "44px", marginTop: "0.5rem" }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          filteredDoctors.map((doc) => (
            /* Professional Summary Card Component */
            <div
              key={doc.id}
              className="dashboard-card"
              style={{
                padding: "1.5rem",
                display: "flex",
                flexWrap: "wrap",
                gap: "1.25rem",
                alignItems: "flex-start",
                justifyContent: "space-between",
                transition: "transform 250ms ease, border-color 250ms ease",
              }}
            >
              <div style={{ display: "flex", gap: "1.25rem", flex: "1 1 340px" }}>
                {/* Avatar Box */}
                <div
                  className="dashboard-avatar-box"
                  style={{
                    width: "60px",
                    height: "60px",
                    margin: 0,
                    fontSize: "1.3rem",
                    borderRadius: "14px",
                    flexShrink: 0,
                    background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {doc.fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </div>

                {/* Doctor Details */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                    <h4 style={{ fontSize: "1.15rem", fontWeight: 700 }}>
                      {doc.prefix} {doc.fullName}
                    </h4>
                    {doc.isVerified && (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "3px",
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          color: "var(--color-success)",
                          background: "var(--color-success-bg)",
                          padding: "2px 8px",
                          borderRadius: "12px",
                        }}
                      >
                        <ShieldCheck size={13} /> Verified
                      </span>
                    )}
                  </div>

                  <p style={{ color: "var(--color-accent)", fontSize: "0.88rem", fontWeight: 600 }}>
                    {doc.specialization}
                  </p>

                  <p style={{ color: "var(--text-secondary)", fontSize: "0.82rem" }}>
                    {doc.qualifications} • <strong>{doc.yearsOfExperience} yrs exp</strong>
                  </p>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      marginTop: "0.25rem",
                      fontSize: "0.82rem",
                      color: "var(--text-muted)",
                      flexWrap: "wrap",
                    }}
                  >
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                      <Star size={14} fill="var(--color-accent)" color="var(--color-accent)" />
                      <strong style={{ color: "var(--text-primary)" }}>{doc.rating}</strong> (
                      {doc.reviewCount} reviews)
                    </span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                      <Languages size={14} /> {doc.languages.join(", ")}
                    </span>
                  </div>

                  <p
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--text-muted)",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      marginTop: "0.15rem",
                    }}
                  >
                    <MapPin size={13} /> {doc.clinicAddress}
                  </p>
                </div>
              </div>

              {/* Action & Fee Box */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: "0.6rem",
                  flex: "1 1 200px",
                }}
              >
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>Consultation Fee</span>
                  <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--color-accent)" }}>
                    ₹{doc.consultationFee}
                  </div>
                  <span style={{ fontSize: "0.75rem", color: "var(--color-success)" }}>
                    Free follow-up in 7 days
                  </span>
                </div>

                <div style={{ display: "flex", gap: "0.5rem", width: "100%", justifyContent: "flex-end" }}>
                  <button
                    type="button"
                    onClick={() => onSelectDoctor(doc)}
                    className="btn-secondary"
                    style={{ minHeight: "48px", fontSize: "0.85rem", padding: "0 0.85rem" }}
                  >
                    View Profile
                  </button>
                  <button
                    type="button"
                    onClick={() => onBookDoctor(doc)}
                    className="btn-primary"
                    style={{ minHeight: "48px", fontSize: "0.85rem", padding: "0 1.1rem" }}
                  >
                    <Video size={16} />
                    <span>Book Now</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
