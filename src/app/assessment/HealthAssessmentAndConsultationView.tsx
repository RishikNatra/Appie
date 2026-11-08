"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Stethoscope,
  Search,
  Filter,
  ArrowUpDown,
  Star,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  ShoppingCart,
  ArrowRight,
  ShieldCheck,
  Loader2,
  X,
  ExternalLink,
} from "lucide-react";
import { CatalogSymptom } from "@/lib/symptoms-catalog";
import { DoctorDiscoveryItem, MedicationItem } from "@/lib/types";
import { MedicalAiAssessmentResult } from "@/lib/medical-ai-service";
import { AuthUser } from "@/lib/auth-service";

interface SelectedSymptomState {
  catalogId: string;
  name: string;
  severity: number; // 1 to 5
  selectedTags: string[];
}

interface Props {
  user: AuthUser | null;
  symptomsCatalog: CatalogSymptom[];
  doctorsCatalog: DoctorDiscoveryItem[];
  medicationsCatalog: MedicationItem[];
}

export default function HealthAssessmentAndConsultationView({
  user,
  symptomsCatalog,
  doctorsCatalog,
  medicationsCatalog,
}: Props) {
  const router = useRouter();

  // Active Alternate Window: "assessment" | "consultations"
  const [activeWindow, setActiveWindow] = useState<"assessment" | "consultations">("assessment");

  // --- Health Assessment State ---
  const [symptomSearch, setSymptomSearch] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState<SelectedSymptomState[]>([]);
  const [evaluating, setEvaluating] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<MedicalAiAssessmentResult | null>(null);
  const [cartSuccessMessage, setCartSuccessMessage] = useState<string | null>(null);
  const [assessmentError, setAssessmentError] = useState<string | null>(null);

  // --- Consultations State ---
  const [doctorSearch, setDoctorSearch] = useState("");
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [sortModalOpen, setSortModalOpen] = useState(false);
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>("All");
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [sortBy, setSortBy] = useState<"rating" | "experience" | "price_low">("rating");

  // Booking Modal
  const [bookingDoctor, setBookingDoctor] = useState<DoctorDiscoveryItem | null>(null);
  const [bookingSlot, setBookingSlot] = useState("10:30 AM");
  const [bookingDate, setBookingDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Filtered symptoms from catalog
  const filteredCatalogSymptoms = symptomsCatalog.filter((sym) => {
    const q = symptomSearch.toLowerCase().trim();
    if (!q) return true;
    return (
      sym.name.toLowerCase().includes(q) ||
      sym.description.toLowerCase().includes(q) ||
      sym.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  const handleToggleSymptom = (sym: CatalogSymptom) => {
    const existing = selectedSymptoms.find((s) => s.catalogId === sym.id);
    if (existing) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s.catalogId !== sym.id));
    } else {
      setSelectedSymptoms([
        ...selectedSymptoms,
        {
          catalogId: sym.id,
          name: sym.name,
          severity: sym.defaultSeverity,
          selectedTags: sym.tags.length > 0 ? [sym.tags[0]] : [],
        },
      ]);
    }
  };

  const handleSeverityChange = (catalogId: string, val: number) => {
    setSelectedSymptoms((prev) =>
      prev.map((s) => (s.catalogId === catalogId ? { ...s, severity: val } : s))
    );
  };

  const handleToggleTag = (catalogId: string, tag: string) => {
    setSelectedSymptoms((prev) =>
      prev.map((s) => {
        if (s.catalogId !== catalogId) return s;
        const hasTag = s.selectedTags.includes(tag);
        const newTags = hasTag
          ? s.selectedTags.filter((t) => t !== tag)
          : [...s.selectedTags, tag];
        return { ...s, selectedTags: newTags };
      })
    );
  };

  const handleRunAssessment = async () => {
    if (selectedSymptoms.length === 0) {
      setAssessmentError("Please choose at least one symptom from the list below.");
      return;
    }

    setEvaluating(true);
    setAssessmentError(null);

    try {
      const res = await fetch("/api/assessment/ai-evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symptoms: selectedSymptoms.map((s) => ({
            name: s.name,
            severity: s.severity,
            tags: s.selectedTags,
            durationDays: 3,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setAssessmentError(data.error || "Unable to complete AI evaluation. Please try again.");
      } else {
        setAssessmentResult(data.assessment);
      }
    } catch {
      setAssessmentError("Network communication error. Please try again.");
    } finally {
      setEvaluating(false);
    }
  };

  const handleAddToCart = async (medId: string) => {
    try {
      const res = await fetch("/api/medications/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ medicationId: medId, quantity: 1 }),
      });
      if (res.ok) {
        const med = medicationsCatalog.find((m) => m.id === medId);
        setCartSuccessMessage(`Added ${med?.name || "medicine"} to your e-Pharmacy cart.`);
        setTimeout(() => setCartSuccessMessage(null), 3500);
      }
    } catch {
      alert("Failed to add medication to cart");
    }
  };

  const handleTransferToConsultation = () => {
    setActiveWindow("consultations");
    // If the assessment recommended a specialization, pre-filter to that specialization
    if (assessmentResult?.recommendedSpecialization) {
      setSelectedSpecialization(assessmentResult.recommendedSpecialization);
    }
  };

  // --- Doctor Filter & Sort Logic ---
  const filteredDoctors = doctorsCatalog
    .filter((doc) => {
      const q = doctorSearch.toLowerCase().trim();
      const matchesQuery =
        !q ||
        doc.fullName.toLowerCase().includes(q) ||
        doc.specialization.toLowerCase().includes(q) ||
        doc.qualifications.toLowerCase().includes(q);

      const matchesSpec =
        selectedSpecialization === "All" ||
        doc.specialization.toLowerCase().includes(selectedSpecialization.toLowerCase());

      const matchesPrice = doc.consultationFee <= maxPrice;

      return matchesQuery && matchesSpec && matchesPrice;
    })
    .sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "experience") return b.yearsOfExperience - a.yearsOfExperience;
      if (sortBy === "price_low") return a.consultationFee - b.consultationFee;
      return 0;
    });

  const handleConfirmBooking = async () => {
    if (!bookingDoctor) return;
    setBookingLoading(true);

    try {
      const reason = assessmentResult
        ? `Assessment Transfer: ${assessmentResult.condition}. Reported symptoms: ${selectedSymptoms
            .map((s) => `${s.name} (Severity ${s.severity}/5)`)
            .join(", ")}`
        : "Routine general consultation requested by patient";

      const res = await fetch("/api/consultations/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          professionalId: bookingDoctor.id,
          appointmentDate: bookingDate,
          timeSlot: bookingSlot,
          type: "video",
          reason,
          feeAmount: bookingDoctor.consultationFee,
        }),
      });

      if (res.ok) {
        setBookingSuccess(true);
        setTimeout(() => {
          setBookingSuccess(false);
          setBookingDoctor(null);
          router.push("/orders");
        }, 1500);
      } else {
        alert("Booking appointment recorded.");
        setBookingDoctor(null);
      }
    } catch {
      alert("Failed to book appointment");
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Top Banner & Alternate Windows Switcher */}
      <div
        className="dashboard-card"
        style={{
          padding: "1.75rem 2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1.25rem",
        }}
      >
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800 }}>Clinical Assessment &amp; Care</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", marginTop: "0.25rem" }}>
            Self-assess your routine health complaints with AI and connect with accredited medical practitioners.
          </p>
        </div>

        {/* Alternate Window Switcher */}
        <div
          style={{
            display: "inline-flex",
            padding: "4px",
            borderRadius: "12px",
            background: "var(--bg-surface)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <button
            type="button"
            onClick={() => setActiveWindow("assessment")}
            style={{
              padding: "0.6rem 1.25rem",
              borderRadius: "8px",
              border: "none",
              background: activeWindow === "assessment" ? "var(--color-primary)" : "transparent",
              color: activeWindow === "assessment" ? "#ffffff" : "var(--text-secondary)",
              fontWeight: 700,
              fontSize: "0.88rem",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.45rem",
              transition: "all 200ms ease",
            }}
          >
            <Sparkles size={16} />
            <span>Health Assessment</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveWindow("consultations")}
            style={{
              padding: "0.6rem 1.25rem",
              borderRadius: "8px",
              border: "none",
              background: activeWindow === "consultations" ? "var(--color-primary)" : "transparent",
              color: activeWindow === "consultations" ? "#ffffff" : "var(--text-secondary)",
              fontWeight: 700,
              fontSize: "0.88rem",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.45rem",
              transition: "all 200ms ease",
            }}
          >
            <Stethoscope size={16} />
            <span>Consultations</span>
          </button>
        </div>
      </div>

      {/* Main Alternating Window Container with Subtle Scroll Blur Effect at Bottom */}
      <div className="scroll-blur-wrapper">
        <div
          className="window-panel"
          style={{
            maxHeight: "750px",
            overflowY: "auto",
            padding: "2rem",
            borderRadius: "20px",
            border: "1px solid var(--border-subtle)",
            background: "var(--bg-card)",
            paddingBottom: "4.5rem", // clearance for blur overlay
          }}
        >
          {/* ==============================================================
              SECTION 1: HEALTH ASSESSMENT
              ============================================================== */}
          {activeWindow === "assessment" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              {/* Option to Transfer to Consultation at all times */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.9rem 1.25rem",
                  borderRadius: "12px",
                  background: "var(--color-primary-subtle)",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Stethoscope size={18} color="var(--color-accent)" />
                  <span style={{ fontSize: "0.88rem", fontWeight: 600 }}>
                    Prefer speaking to a registered doctor right away?
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleTransferToConsultation}
                  className="btn-secondary"
                  style={{ minHeight: "38px", padding: "0 1rem", fontSize: "0.85rem" }}
                >
                  <span>Transfer to Consultation</span>
                  <ArrowRight size={14} />
                </button>
              </div>

              {/* Assessment AI Results Panel (If Evaluated) */}
              {assessmentResult && (
                <div
                  className="dashboard-card"
                  style={{
                    padding: "1.75rem",
                    border: "1.5px solid var(--color-accent)",
                    background: "var(--bg-surface)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "1rem" }}>
                    <div>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8rem", fontWeight: 700, color: "var(--color-accent)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.35rem" }}>
                        <Sparkles size={15} />
                        <span>Most Likely Clinical Evaluation • {assessmentResult.matchPercentage}% Match</span>
                      </div>
                      <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--text-primary)" }}>
                        {assessmentResult.condition}
                      </h2>
                    </div>

                    <div
                      style={{
                        padding: "0.4rem 0.85rem",
                        borderRadius: "20px",
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        background:
                          assessmentResult.urgencyLevel === "urgent"
                            ? "var(--color-error-bg)"
                            : assessmentResult.urgencyLevel === "moderate"
                            ? "rgba(245, 158, 11, 0.15)"
                            : "var(--color-success-bg)",
                        color:
                          assessmentResult.urgencyLevel === "urgent"
                            ? "var(--color-error)"
                            : assessmentResult.urgencyLevel === "moderate"
                            ? "#f59e0b"
                            : "var(--color-success)",
                        border: "1px solid currentColor",
                      }}
                    >
                      Urgency: {assessmentResult.urgencyLevel}
                    </div>
                  </div>

                  <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>
                    {assessmentResult.summary}
                  </p>

                  {/* Differential Conditions */}
                  {assessmentResult.possibleConditions && assessmentResult.possibleConditions.length > 0 && (
                    <div style={{ marginBottom: "1.5rem" }}>
                      <h4 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "0.6rem" }}>
                        Differential Diagnostics
                      </h4>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        {assessmentResult.possibleConditions.map((cond, i) => (
                          <div
                            key={i}
                            style={{
                              padding: "0.75rem 1rem",
                              borderRadius: "8px",
                              background: "var(--bg-card)",
                              border: "1px solid var(--border-subtle)",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <div>
                              <strong style={{ fontSize: "0.9rem" }}>{cond.name}</strong>
                              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "2px" }}>
                                {cond.explanation || cond.description}
                              </p>
                            </div>
                            <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--color-accent)" }}>
                              {cond.matchPercentage}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommendations */}
                  <div style={{ marginBottom: "1.5rem" }}>
                    <h4 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "0.6rem" }}>
                      Evidence-Based Recommendations
                    </h4>
                    <ul style={{ paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.4rem", fontSize: "0.88rem", color: "var(--text-secondary)" }}>
                      {assessmentResult.recommendations.map((rec, i) => (
                        <li key={i}>{rec}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Suggested Medications with Add to Cart */}
                  {assessmentResult.recommendedMedicationIds && assessmentResult.recommendedMedicationIds.length > 0 && (
                    <div style={{ marginBottom: "1.5rem" }}>
                      <h4 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "0.6rem" }}>
                        Suggested Suitable Medicines from e-Pharmacy
                      </h4>
                      {cartSuccessMessage && (
                        <div style={{ padding: "0.5rem 0.75rem", borderRadius: "8px", background: "var(--color-success-bg)", color: "var(--color-success)", fontSize: "0.82rem", marginBottom: "0.6rem" }}>
                          ✓ {cartSuccessMessage}
                        </div>
                      )}
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
                        {assessmentResult.recommendedMedicationIds.map((medId) => {
                          const med = medicationsCatalog.find((m) => m.id === medId);
                          if (!med) return null;
                          return (
                            <div
                              key={med.id}
                              style={{
                                padding: "0.75rem 1rem",
                                borderRadius: "10px",
                                background: "var(--bg-card)",
                                border: "1px solid var(--border-subtle)",
                                display: "flex",
                                alignItems: "center",
                                gap: "1rem",
                              }}
                            >
                              <div>
                                <div style={{ fontSize: "0.88rem", fontWeight: 700 }}>{med.name}</div>
                                <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                                  ₹{med.price.toFixed(2)} • {med.dosageForm}
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleAddToCart(med.id)}
                                className="btn-primary"
                                style={{ minHeight: "34px", padding: "0 0.85rem", fontSize: "0.8rem", display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
                              >
                                <ShoppingCart size={14} />
                                <span>Add to Cart</span>
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Medical Disclaimer */}
                  <div
                    style={{
                      padding: "0.85rem 1rem",
                      borderRadius: "10px",
                      background: "rgba(220, 38, 38, 0.08)",
                      border: "1px solid rgba(220, 38, 38, 0.2)",
                      fontSize: "0.82rem",
                      color: "var(--text-secondary)",
                      lineHeight: 1.5,
                      marginBottom: "1.25rem",
                    }}
                  >
                    <strong style={{ color: "var(--color-error)" }}>Medical Disclaimer: </strong>
                    {assessmentResult.disclaimer}
                  </div>

                  {/* Action buttons */}
                  <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                    <button
                      type="button"
                      onClick={handleTransferToConsultation}
                      className="btn-primary"
                      style={{ minHeight: "44px", padding: "0 1.25rem", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
                    >
                      <Stethoscope size={16} />
                      <span>Transfer Assessment to Doctor Consultation</span>
                    </button>
                    <Link
                      href="/medications"
                      className="btn-secondary"
                      style={{ minHeight: "44px", padding: "0 1.25rem", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
                    >
                      <ShoppingCart size={16} />
                      <span>View Cart &amp; Pharmacy</span>
                    </Link>
                  </div>
                </div>
              )}

              {/* Symptom Selection Form */}
              <div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.5rem" }}>
                  Select Reported Symptoms
                </h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", marginBottom: "1rem" }}>
                  Search and pick your generalised symptoms. Adjust the severity from 1 (mild) to 5 (severe) for each.
                </p>

                {/* Symptom Search Bar */}
                <div style={{ position: "relative", marginBottom: "1.25rem" }}>
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
                    placeholder="Search symptoms (e.g. Cough, Fever, Headache, Throat, Rash)..."
                    value={symptomSearch}
                    onChange={(e) => setSymptomSearch(e.target.value)}
                    style={{ paddingLeft: "42px", minHeight: "46px" }}
                  />
                </div>

                {assessmentError && (
                  <div style={{ padding: "0.75rem 1rem", borderRadius: "8px", background: "var(--color-error-bg)", color: "var(--color-error)", fontSize: "0.85rem", marginBottom: "1rem" }}>
                    {assessmentError}
                  </div>
                )}

                {/* Generalized Symptoms List */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                  {filteredCatalogSymptoms.map((sym) => {
                    const isSelected = selectedSymptoms.some((s) => s.catalogId === sym.id);
                    const selectedObj = selectedSymptoms.find((s) => s.catalogId === sym.id);

                    return (
                      <div
                        key={sym.id}
                        style={{
                          padding: "1.1rem 1.25rem",
                          borderRadius: "14px",
                          border: isSelected ? "1.5px solid var(--color-accent)" : "1px solid var(--border-subtle)",
                          background: isSelected ? "var(--color-primary-subtle)" : "var(--bg-surface)",
                          transition: "all 200ms ease",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                              <h4 style={{ fontSize: "1.05rem", fontWeight: 700 }}>{sym.name}</h4>
                              <span style={{ fontSize: "0.75rem", padding: "2px 8px", borderRadius: "12px", background: "var(--bg-card)", color: "var(--text-muted)" }}>
                                {sym.category}
                              </span>
                            </div>
                            <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>
                              {sym.description}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleToggleSymptom(sym)}
                            style={{
                              padding: "0.45rem 0.9rem",
                              borderRadius: "8px",
                              border: isSelected ? "1px solid var(--color-accent)" : "1px solid var(--border-subtle)",
                              background: isSelected ? "var(--color-accent)" : "var(--bg-card)",
                              color: isSelected ? "#ffffff" : "var(--text-primary)",
                              fontSize: "0.82rem",
                              fontWeight: 600,
                              cursor: "pointer",
                              flexShrink: 0,
                            }}
                          >
                            {isSelected ? "Selected ✓" : "+ Add"}
                          </button>
                        </div>

                        {/* If selected: show tags & 1-5 severity slider */}
                        {isSelected && selectedObj && (
                          <div style={{ borderTop: "1px solid var(--border-subtle)", marginTop: "0.85rem", paddingTop: "0.85rem" }}>
                            {/* Tags */}
                            {sym.tags.length > 0 && (
                              <div style={{ marginBottom: "0.85rem" }}>
                                <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", display: "block", marginBottom: "0.35rem" }}>
                                  Characteristic Tags:
                                </span>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                                  {sym.tags.map((tag) => {
                                    const isTagSelected = selectedObj.selectedTags.includes(tag);
                                    return (
                                      <button
                                        key={tag}
                                        type="button"
                                        onClick={() => handleToggleTag(sym.id, tag)}
                                        style={{
                                          padding: "0.25rem 0.65rem",
                                          borderRadius: "14px",
                                          border: isTagSelected ? "1px solid var(--color-accent)" : "1px solid var(--border-subtle)",
                                          background: isTagSelected ? "var(--color-accent)" : "var(--bg-card)",
                                          color: isTagSelected ? "#ffffff" : "var(--text-secondary)",
                                          fontSize: "0.75rem",
                                          cursor: "pointer",
                                        }}
                                      >
                                        {tag}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Severity Slider (1 to 5) */}
                            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                              <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", minWidth: "130px" }}>
                                Severity Scale (1–5):
                              </span>
                              <input
                                type="range"
                                min={1}
                                max={5}
                                step={1}
                                value={selectedObj.severity}
                                onChange={(e) => handleSeverityChange(sym.id, Number(e.target.value))}
                                style={{ flex: 1, accentColor: "var(--color-accent)", cursor: "pointer" }}
                              />
                              <span
                                style={{
                                  fontSize: "0.82rem",
                                  fontWeight: 800,
                                  color: "var(--color-accent)",
                                  padding: "2px 8px",
                                  borderRadius: "6px",
                                  background: "var(--bg-card)",
                                  minWidth: "75px",
                                  textAlign: "center",
                                }}
                              >
                                {selectedObj.severity} / 5 ({selectedObj.severity <= 2 ? "Mild" : selectedObj.severity <= 4 ? "Moderate" : "Severe"})
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Assessment Action Button */}
                <div style={{ marginTop: "1.75rem", display: "flex", justifyContent: "flex-end" }}>
                  <button
                    type="button"
                    onClick={handleRunAssessment}
                    disabled={evaluating || selectedSymptoms.length === 0}
                    className="btn-primary"
                    style={{
                      minHeight: "48px",
                      padding: "0 1.75rem",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      fontSize: "0.92rem",
                    }}
                  >
                    {evaluating ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                    <span>{evaluating ? "Evaluating Symptoms with AI..." : "Evaluate Symptoms with Medical AI"}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ==============================================================
              SECTION 2: CONSULTATIONS (CLEAN LINEAR DOCTOR LISTING)
              ============================================================== */}
          {activeWindow === "consultations" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {/* Top Controls: Search Bar + Single Filter Icon + Single Sorting Icon */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  flexWrap: "wrap",
                }}
              >
                {/* Search Bar */}
                <div style={{ flex: "1 1 300px", position: "relative" }}>
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
                    placeholder="Search doctor by name, qualification, or specialty..."
                    value={doctorSearch}
                    onChange={(e) => setDoctorSearch(e.target.value)}
                    style={{ paddingLeft: "42px", minHeight: "46px" }}
                  />
                </div>

                {/* Single Filter Icon Button */}
                <button
                  type="button"
                  onClick={() => setFilterModalOpen(true)}
                  aria-label="Filter doctors"
                  title="Filter options"
                  style={{
                    minHeight: "46px",
                    padding: "0 1rem",
                    borderRadius: "10px",
                    border: selectedSpecialization !== "All" || maxPrice < 1000 ? "1.5px solid var(--color-accent)" : "1px solid var(--border-subtle)",
                    background: "var(--bg-surface)",
                    color: "var(--text-primary)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                  }}
                >
                  <Filter size={18} />
                  <span>Filter</span>
                </button>

                {/* Single Sorting Icon Button */}
                <button
                  type="button"
                  onClick={() => setSortModalOpen(true)}
                  aria-label="Sort doctors"
                  title="Sort options"
                  style={{
                    minHeight: "46px",
                    padding: "0 1rem",
                    borderRadius: "10px",
                    border: "1px solid var(--border-subtle)",
                    background: "var(--bg-surface)",
                    color: "var(--text-primary)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                  }}
                >
                  <ArrowUpDown size={18} />
                  <span>Sort</span>
                </button>
              </div>

              {/* Linear Doctor Listing */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {filteredDoctors.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--text-muted)" }}>
                    No doctors found matching your filter criteria.
                  </div>
                ) : (
                  filteredDoctors.map((doc) => (
                    <div
                      key={doc.id}
                      className="linear-card"
                      style={{
                        padding: "1.25rem 1.5rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: "1.25rem",
                        borderRadius: "16px",
                        border: "1px solid var(--border-subtle)",
                        background: "var(--bg-surface)",
                      }}
                    >
                      {/* Left: Doctor Details (Rating 1-5, Number of ratings, Qualification, View Full Profile) */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", flex: "1 1 320px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <h3 style={{ fontSize: "1.2rem", fontWeight: 800 }}>
                            {doc.prefix} {doc.fullName}
                          </h3>
                          <span style={{ fontSize: "0.78rem", padding: "2px 8px", borderRadius: "10px", background: "var(--color-primary-subtle)", color: "var(--color-accent)", fontWeight: 600 }}>
                            {doc.specialization}
                          </span>
                        </div>

                        {/* Rating (1-5 stars) and Number of Ratings Received */}
                        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "2px", color: "#f59e0b" }}>
                            <Star size={15} fill="#f59e0b" />
                            <strong style={{ marginLeft: "2px", color: "var(--text-primary)" }}>{doc.rating}</strong>
                          </div>
                          <span style={{ color: "var(--text-muted)" }}>
                            ({doc.reviewCount} verified reviews)
                          </span>
                        </div>

                        {/* Qualification */}
                        <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                          <strong style={{ color: "var(--text-primary)" }}>Qualification: </strong>
                          {doc.qualifications}
                        </div>

                        {/* View Full Profile link */}
                        <Link
                          href={`/consultations/doctor/${doc.id}`}
                          className="form-link"
                          style={{
                            fontSize: "0.85rem",
                            fontWeight: 700,
                            color: "var(--color-accent)",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.3rem",
                            marginTop: "0.25rem",
                          }}
                        >
                          <span>View Full Profile</span>
                          <ExternalLink size={14} />
                        </Link>
                      </div>

                      {/* Right: Consultation Price above Book Now button */}
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-end",
                          justifyContent: "center",
                          gap: "0.35rem",
                          flexShrink: 0,
                        }}
                      >
                        {/* Price strictly above Book Now */}
                        <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--color-accent)" }}>
                          ₹{doc.consultationFee.toFixed(2)}
                        </div>

                        {/* Book Now Button */}
                        <button
                          type="button"
                          onClick={() => setBookingDoctor(doc)}
                          className="btn-primary"
                          style={{ minHeight: "42px", padding: "0 1.25rem", fontSize: "0.88rem" }}
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Subtle blur effect at the bottom of the windows during scrolling */}
        <div className="scroll-blur-overlay" />
      </div>

      {/* Filter Modal */}
      {filterModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.65)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "1rem",
          }}
        >
          <div className="dashboard-card" style={{ maxWidth: "420px", width: "100%", padding: "1.75rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Filter Doctors</h3>
              <button
                type="button"
                onClick={() => setFilterModalOpen(false)}
                style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.4rem" }}>
                  Medical Specialization
                </label>
                <select
                  className="form-input"
                  value={selectedSpecialization}
                  onChange={(e) => setSelectedSpecialization(e.target.value)}
                >
                  <option value="All">All Specializations</option>
                  <option value="General Physician">General Physician</option>
                  <option value="Pulmonology">Pulmonology &amp; Respiratory</option>
                  <option value="Dermatology">Dermatology &amp; Skin</option>
                  <option value="Gastroenterology">Gastroenterology</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.4rem" }}>
                  Maximum Consultation Fee: ₹{maxPrice}
                </label>
                <input
                  type="range"
                  min={300}
                  max={1200}
                  step={50}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  style={{ width: "100%", accentColor: "var(--color-accent)" }}
                />
              </div>

              <button
                type="button"
                onClick={() => setFilterModalOpen(false)}
                className="btn-primary"
                style={{ minHeight: "44px", marginTop: "0.5rem" }}
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sorting Modal */}
      {sortModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.65)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "1rem",
          }}
        >
          <div className="dashboard-card" style={{ maxWidth: "380px", width: "100%", padding: "1.75rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Sort Clinicians</h3>
              <button
                type="button"
                onClick={() => setSortModalOpen(false)}
                style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {[
                { id: "rating", label: "Highest Rated (Stars)" },
                { id: "experience", label: "Years of Clinical Experience" },
                { id: "price_low", label: "Consultation Fee (Lowest First)" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setSortBy(opt.id as any);
                    setSortModalOpen(false);
                  }}
                  style={{
                    padding: "0.85rem 1rem",
                    borderRadius: "10px",
                    border: sortBy === opt.id ? "1.5px solid var(--color-accent)" : "1px solid var(--border-subtle)",
                    background: sortBy === opt.id ? "var(--color-primary-subtle)" : "var(--bg-surface)",
                    color: "var(--text-primary)",
                    fontWeight: 600,
                    fontSize: "0.88rem",
                    textAlign: "left",
                    cursor: "pointer",
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {bookingDoctor && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.65)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "1rem",
          }}
        >
          <div className="dashboard-card" style={{ maxWidth: "460px", width: "100%", padding: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 800 }}>Confirm Telehealth Appointment</h3>
              <button
                type="button"
                onClick={() => setBookingDoctor(null)}
                style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>

            {bookingSuccess ? (
              <div style={{ textAlign: "center", padding: "2rem 0" }}>
                <CheckCircle2 size={48} color="var(--color-success)" style={{ margin: "0 auto 1rem" }} />
                <h4 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Appointment Confirmed!</h4>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", marginTop: "0.4rem" }}>
                  Your telehealth session with {bookingDoctor.fullName} is scheduled. Redirecting to your orders...
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ padding: "0.85rem", borderRadius: "10px", background: "var(--bg-surface)" }}>
                  <div style={{ fontWeight: 700 }}>{bookingDoctor.prefix} {bookingDoctor.fullName}</div>
                  <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>{bookingDoctor.specialization}</div>
                  <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--color-accent)", marginTop: "0.3rem" }}>
                    Fee: ₹{bookingDoctor.consultationFee.toFixed(2)}
                  </div>
                </div>

                {assessmentResult && (
                  <div style={{ padding: "0.75rem", borderRadius: "8px", background: "var(--color-primary-subtle)", fontSize: "0.82rem" }}>
                    <strong>Attached Symptom Assessment:</strong> {assessmentResult.condition}
                  </div>
                )}

                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, marginBottom: "0.3rem" }}>
                    Appointment Date
                  </label>
                  <input
                    type="date"
                    className="form-input"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, marginBottom: "0.3rem" }}>
                    Time Slot
                  </label>
                  <select
                    className="form-input"
                    value={bookingSlot}
                    onChange={(e) => setBookingSlot(e.target.value)}
                  >
                    {bookingDoctor.availableSlots.map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={handleConfirmBooking}
                  disabled={bookingLoading}
                  className="btn-primary"
                  style={{ minHeight: "46px", marginTop: "0.5rem" }}
                >
                  {bookingLoading ? <Loader2 size={18} className="animate-spin" /> : "Confirm & Schedule Appointment"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
