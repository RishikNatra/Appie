"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Plus,
  X,
  Activity,
  AlertTriangle,
  Clock,
  Sparkles,
  Loader2,
  CheckCircle2,
  Sliders,
  FileText,
  ArrowRight,
} from "lucide-react";
import { SymptomItem } from "@/lib/types";
import { SYMPTOMS_CATALOG, CatalogSymptom } from "@/lib/symptoms-catalog";

interface SymptomEntryProps {
  onAssessmentCreated?: (assessment: any) => void;
  standalone?: boolean;
}

export default function SymptomEntryComponent({
  onAssessmentCreated,
  standalone = false,
}: SymptomEntryProps) {
  const router = useRouter();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Selection & Form state
  const [selectedSymptoms, setSelectedSymptoms] = useState<SymptomItem[]>([]);
  const [currentSymptomName, setCurrentSymptomName] = useState("");
  const [currentCategory, setCurrentCategory] = useState("General");
  const [severity, setSeverity] = useState<number>(5);
  const [durationDays, setDurationDays] = useState<number>(2);
  const [frequency, setFrequency] = useState<"constant" | "intermittent" | "worsening">("intermittent");
  const [notes, setNotes] = useState("");

  const [assessmentTitle, setAssessmentTitle] = useState("Routine Health Assessment");
  const [additionalContext, setAdditionalContext] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const categories = ["All", "Head & Neck", "Respiratory", "Digestive", "Systemic & Fever", "Skin & Musculoskeletal"];

  const filteredCatalog = SYMPTOMS_CATALOG.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSelectFromCatalog = (item: CatalogSymptom) => {
    setCurrentSymptomName(item.name);
    setCurrentCategory(item.category);
    setSeverity(item.defaultSeverity || item.commonSeverity || 3);
  };

  const handleAddSymptom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSymptomName.trim()) {
      setFeedback({ type: "error", text: "Please enter or select a symptom name." });
      return;
    }

    const newItem: SymptomItem = {
      id: `sym-${Date.now()}`,
      name: currentSymptomName.trim(),
      category: currentCategory,
      severity,
      durationDays,
      frequency,
      notes: notes.trim(),
    };

    setSelectedSymptoms([...selectedSymptoms, newItem]);
    setCurrentSymptomName("");
    setNotes("");
    setSeverity(5);
    setDurationDays(2);
    setFeedback(null);
  };

  const handleRemoveSymptom = (id: string) => {
    setSelectedSymptoms(selectedSymptoms.filter((s) => s.id !== id));
  };

  const handleSubmitAssessment = async () => {
    if (selectedSymptoms.length === 0) {
      setFeedback({ type: "error", text: "Please add at least one symptom before evaluating." });
      return;
    }

    setSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/assessment/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: assessmentTitle.trim() || "Health Assessment",
          symptoms: selectedSymptoms,
          additionalNotes: additionalContext.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setFeedback({ type: "error", text: data.error || "Assessment generation failed." });
        setSubmitting(false);
      } else {
        setFeedback({ type: "success", text: "Assessment created! Loading clinical results..." });
        if (onAssessmentCreated) {
          onAssessmentCreated(data.assessment);
        } else {
          setTimeout(() => {
            router.push(`/assessment/result?id=${data.assessment.id}`);
          }, 600);
        }
      }
    } catch {
      setFeedback({ type: "error", text: "Network error occurred." });
      setSubmitting(false);
    }
  };

  const getSeverityBadge = (sev: number) => {
    if (sev <= 3) return { text: "Mild", color: "var(--color-success)" };
    if (sev <= 6) return { text: "Moderate", color: "var(--color-accent)" };
    if (sev <= 8) return { text: "Severe", color: "#f97316" };
    return { text: "Critical", color: "var(--color-error)" };
  };

  return (
    <div style={{ width: "100%" }}>
      {feedback && (
        <div className={`alert-box ${feedback.type === "success" ? "alert-success" : "alert-error"}`}>
          {feedback.type === "success" ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Grid: Left Column (Symptom Search & Selection) | Right Column (Symptom Entry Form & List) */}
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: "1.75rem" }}>
        {/* Left Column: Symptom Search Component & Selection Component */}
        <div className="dashboard-card" style={{ textAlign: "left", padding: "1.75rem" }}>
          <h2 className="section-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Search size={20} color="var(--color-accent)" />
            <span>Symptom Search & Catalog</span>
          </h2>
          <p className="section-desc" style={{ marginBottom: "1.25rem" }}>
            Search or select from common routine complaints
          </p>

          {/* Symptom Search Component */}
          <div className="form-group" style={{ marginBottom: "1rem" }}>
            <div className="input-wrapper">
              <span className="input-leading-icon"><Search size={18} /></span>
              <input
                type="text"
                className="form-input"
                placeholder="Search symptoms (e.g. sore throat, fever, cough)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="input-trailing-btn"
                  onClick={() => setSearchQuery("")}
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                style={{
                  minHeight: "36px",
                  padding: "0.3rem 0.85rem",
                  borderRadius: "9999px",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  border: "1px solid",
                  borderColor: selectedCategory === cat ? "var(--color-accent)" : "var(--border-subtle)",
                  backgroundColor: selectedCategory === cat ? "var(--color-accent-subtle)" : "var(--bg-surface)",
                  color: selectedCategory === cat ? "var(--color-accent)" : "var(--text-secondary)",
                  transition: "all 250ms ease-in-out",
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Catalog Results Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "0.6rem",
              maxHeight: "360px",
              overflowY: "auto",
              paddingRight: "0.35rem",
            }}
          >
            {filteredCatalog.map((item) => (
              <div
                key={item.name}
                onClick={() => handleSelectFromCatalog(item)}
                style={{
                  padding: "0.85rem 1rem",
                  borderRadius: "12px",
                  backgroundColor: currentSymptomName === item.name ? "var(--color-primary-subtle)" : "var(--bg-surface)",
                  border: "1px solid",
                  borderColor: currentSymptomName === item.name ? "var(--color-accent)" : "var(--border-subtle)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  transition: "all 250ms ease-in-out",
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ fontWeight: 700, fontSize: "0.92rem", color: "var(--text-primary)" }}>
                      {item.name}
                    </span>
                    <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", padding: "2px 6px", borderRadius: "4px", backgroundColor: "var(--bg-input)" }}>
                      {item.category}
                    </span>
                  </div>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                    {item.description}
                  </p>
                </div>

                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    backgroundColor: currentSymptomName === item.name ? "var(--color-accent)" : "var(--bg-card)",
                    color: currentSymptomName === item.name ? "#000000" : "var(--text-muted)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Plus size={16} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Symptom Entry Form & Symptom List Component */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Symptom Entry Form */}
          <div className="dashboard-card" style={{ textAlign: "left", padding: "1.75rem" }}>
            <h2 className="section-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Sliders size={20} color="var(--color-accent)" />
              <span>Symptom Details & Severity</span>
            </h2>
            <p className="section-desc" style={{ marginBottom: "1.25rem" }}>
              Configure intensity and duration for clinical triage
            </p>

            <form onSubmit={handleAddSymptom}>
              <div className="form-group">
                <label className="form-label">Symptom Name</label>
                <input
                  type="text"
                  className="form-input no-icon"
                  placeholder="e.g. Sore Throat, Migraine..."
                  value={currentSymptomName}
                  onChange={(e) => setCurrentSymptomName(e.target.value)}
                  required
                />
              </div>

              {/* Severity Slider (1-10) with Micro-detailing */}
              <div className="form-group" style={{ marginTop: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
                  <label className="form-label">Severity Level (1 to 10)</label>
                  <span
                    style={{
                      fontSize: "0.82rem",
                      fontWeight: 800,
                      padding: "0.2rem 0.6rem",
                      borderRadius: "6px",
                      backgroundColor: "var(--bg-surface)",
                      color: getSeverityBadge(severity).color,
                      border: `1px solid ${getSeverityBadge(severity).color}`,
                    }}
                  >
                    Level {severity} — {getSeverityBadge(severity).text}
                  </span>
                </div>

                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={severity}
                  onChange={(e) => setSeverity(Number(e.target.value))}
                  style={{
                    width: "100%",
                    height: "8px",
                    accentColor: "var(--color-accent)",
                    cursor: "pointer",
                  }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "4px" }}>
                  <span>1 (Very Mild)</span>
                  <span>5 (Moderate)</span>
                  <span>10 (Unbearable)</span>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "1rem" }}>
                <div className="form-group">
                  <label className="form-label">Duration (Days)</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    className="form-input no-icon"
                    value={durationDays}
                    onChange={(e) => setDurationDays(Number(e.target.value))}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Frequency</label>
                  <select
                    className="form-select"
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value as any)}
                  >
                    <option value="constant">Constant</option>
                    <option value="intermittent">Intermittent</option>
                    <option value="worsening">Worsening</option>
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ marginTop: "0.75rem" }}>
                <label className="form-label">Observation Notes (Optional)</label>
                <input
                  type="text"
                  className="form-input no-icon"
                  placeholder="e.g. Worse in the morning, scratchy throat"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="btn-secondary"
                style={{ width: "100%", marginTop: "1rem", minHeight: "44px" }}
              >
                <Plus size={16} />
                <span>Add Symptom to Evaluation List</span>
              </button>
            </form>
          </div>

          {/* Symptom List Component */}
          <div className="dashboard-card" style={{ textAlign: "left", padding: "1.75rem" }}>
            <h2 className="section-title" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Activity size={20} color="var(--color-accent)" />
                <span>Selected Symptoms ({selectedSymptoms.length})</span>
              </div>
            </h2>

            {selectedSymptoms.length === 0 ? (
              <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", padding: "1rem 0" }}>
                No symptoms added yet. Choose from the left catalog or type in above to add symptoms.
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", margin: "1rem 0" }}>
                {selectedSymptoms.map((sym) => {
                  const badge = getSeverityBadge(sym.severity);
                  return (
                    <div
                      key={sym.id}
                      style={{
                        padding: "0.75rem 1rem",
                        borderRadius: "12px",
                        backgroundColor: "var(--bg-surface)",
                        border: "1px solid var(--border-subtle)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>{sym.name}</span>
                          <span
                            style={{
                              fontSize: "0.72rem",
                              fontWeight: 700,
                              color: badge.color,
                              padding: "2px 6px",
                              borderRadius: "4px",
                              backgroundColor: "var(--bg-input)",
                            }}
                          >
                            Sev {sym.severity} ({badge.text})
                          </span>
                        </div>
                        <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "2px" }}>
                          Active {sym.durationDays} days • {sym.frequency} {sym.notes ? `• ${sym.notes}` : ""}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveSymptom(sym.id)}
                        className="chip-delete-btn"
                        title="Remove symptom"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Additional Context & Assessment Title */}
            <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid var(--border-subtle)" }}>
              <div className="form-group">
                <label className="form-label">Assessment Title</label>
                <input
                  type="text"
                  className="form-input no-icon"
                  value={assessmentTitle}
                  onChange={(e) => setAssessmentTitle(e.target.value)}
                  placeholder="e.g. Seasonal Cold Assessment"
                />
              </div>

              {/* Symptom Submission Component */}
              <button
                type="button"
                onClick={handleSubmitAssessment}
                disabled={submitting || selectedSymptoms.length === 0}
                className="btn-primary"
                id="btn-evaluate-symptoms"
                style={{ width: "100%", marginTop: "1rem", minHeight: "48px" }}
              >
                {submitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Evaluating Clinical Indicators...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    <span>Generate Health Assessment</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
