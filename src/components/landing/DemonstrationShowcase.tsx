"use client";

import { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Stethoscope,
  Pill,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Play,
  Pause,
} from "lucide-react";

interface DemoItem {
  id: string;
  title: string;
  badge: string;
  subtitle: string;
  videoSrc: string;
  icon: typeof Sparkles;
  highlights: string[];
}

const DEMO_ITEMS: DemoItem[] = [
  {
    id: "assessment",
    title: "AI-Powered Health & Symptom Assessment",
    badge: "Clinical Intelligence",
    subtitle: "Select generalised symptoms with 1–5 severity scoring and receive an instant, evidence-based preliminary triage.",
    videoSrc: "/videos/demo-assessment.mp4",
    icon: Sparkles,
    highlights: ["Searchable generalized symptoms", "Severity scale 1 to 5", "Instant recommended medications"],
  },
  {
    id: "consultation",
    title: "Telehealth Consultations & E-Prescriptions",
    badge: "Verified Medical Care",
    subtitle: "Seamlessly transfer symptom assessments directly to verified clinicians for encrypted video consultations.",
    videoSrc: "/videos/demo-consultation.mp4",
    icon: Stethoscope,
    highlights: ["Doctor discovery by specialty & rating", "Transfer assessment to doctor", "Legally binding e-prescriptions"],
  },
  {
    id: "pharmacy",
    title: "Integrated e-Pharmacy & Express Dispatch",
    badge: "Direct Doorstep Delivery",
    subtitle: "Order authentic medications with real-time inventory checks, live order tracking, and cold-chain compliance.",
    videoSrc: "/videos/demo-pharmacy.mp4",
    icon: Pill,
    highlights: ["Real-time inventory derived from DB", "Live delivery status updates", "Zero fake or unverified drugs"],
  },
];

export default function DemonstrationShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isPausedByUser, setIsPausedByUser] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Automatic transition every 7 seconds if not paused
  useEffect(() => {
    if (isPausedByUser) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % DEMO_ITEMS.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [isPausedByUser]);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % DEMO_ITEMS.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + DEMO_ITEMS.length) % DEMO_ITEMS.length);
  };

  return (
    <section
      style={{
        width: "100%",
        maxWidth: "1100px",
        margin: "3rem auto",
        padding: "0 1rem",
      }}
      aria-label="Platform Demonstration Showcase"
    >
      {/* Section Header */}
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <div className="hero-pill-badge" style={{ margin: "0 auto 0.75rem" }}>
          <Sparkles size={14} />
          <span>Experience Appie In Action</span>
        </div>
        <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-primary)" }}>
          Application Demonstrations
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", maxWidth: "600px", margin: "0.5rem auto 0" }}>
          Explore the streamlined patient journey from initial symptom evaluation to clinician video review and pharmacy dispatch.
        </p>
      </div>

      {/* Demonstration Navigation Tabs */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "0.75rem",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
        }}
      >
        {DEMO_ITEMS.map((item, idx) => {
          const Icon = item.icon;
          const isActive = activeIndex === idx;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setActiveIndex(idx);
                setIsPausedByUser(true);
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.6rem 1.1rem",
                borderRadius: "30px",
                border: isActive ? "1.5px solid var(--color-accent)" : "1px solid var(--border-subtle)",
                background: isActive ? "var(--color-primary-subtle)" : "var(--bg-surface)",
                color: isActive ? "var(--color-accent)" : "var(--text-secondary)",
                fontWeight: isActive ? 700 : 500,
                fontSize: "0.85rem",
                cursor: "pointer",
                transition: "all 200ms ease",
              }}
            >
              <Icon size={16} />
              <span>{item.badge}</span>
            </button>
          );
        })}
      </div>

      {/* Single Horizontally Sliding, Vertically Scrollable Window */}
      <div
        className="window-panel"
        style={{
          position: "relative",
          borderRadius: "20px",
          border: "1px solid var(--border-subtle)",
          background: "var(--bg-card)",
          overflow: "hidden",
          boxShadow: "0 10px 40px -10px rgba(0, 0, 0, 0.4), 0 0 25px 2px var(--accent-glow)",
        }}
        onMouseEnter={() => setIsPausedByUser(true)}
        onMouseLeave={() => setIsPausedByUser(false)}
      >
        {/* Window Top Bar (macOS/App window style) */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.85rem 1.25rem",
            background: "var(--bg-surface)",
            borderBottom: "1px solid var(--border-subtle)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ef4444" }} />
            <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#f59e0b" }} />
            <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#10b981" }} />
            <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-muted)", marginLeft: "0.5rem" }}>
              Appie Live Demonstration • {DEMO_ITEMS[activeIndex].title}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous demonstration"
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                border: "1px solid var(--border-subtle)",
                background: "var(--bg-card)",
                color: "var(--text-primary)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ChevronLeft size={16} />
            </button>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>
              {activeIndex + 1} / {DEMO_ITEMS.length}
            </span>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next demonstration"
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                border: "1px solid var(--border-subtle)",
                background: "var(--bg-card)",
                color: "var(--text-primary)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Sliding Slides Container */}
        <div
          ref={containerRef}
          style={{
            display: "flex",
            width: `${DEMO_ITEMS.length * 100}%`,
            transform: `translateX(-${activeIndex * (100 / DEMO_ITEMS.length)}%)`,
            transition: "transform 400ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {DEMO_ITEMS.map((item, idx) => (
            <div
              key={item.id}
              style={{
                width: `${100 / DEMO_ITEMS.length}%`,
                maxHeight: "520px",
                overflowY: "auto",
                padding: "1.75rem",
                display: "grid",
                gridTemplateColumns: "1fr 1.35fr",
                gap: "1.5rem",
                alignItems: "center",
              }}
            >
              {/* Left Details Column */}
              <div>
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    color: "var(--color-accent)",
                    marginBottom: "0.4rem",
                    display: "inline-block",
                  }}
                >
                  {item.badge}
                </span>
                <h3 style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.6rem" }}>
                  {item.title}
                </h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.5, marginBottom: "1.25rem" }}>
                  {item.subtitle}
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {item.highlights.map((h, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                      <ShieldCheck size={16} color="var(--color-success)" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Demonstration Column: MP4 Video Player with Scroll Safety */}
              <div
                style={{
                  position: "relative",
                  borderRadius: "14px",
                  overflow: "hidden",
                  border: "1px solid var(--border-subtle)",
                  background: "#000000",
                  aspectRatio: "16 / 10",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <video
                  ref={(el) => {
                    videoRefs.current[idx] = el;
                  }}
                  src={item.videoSrc}
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
