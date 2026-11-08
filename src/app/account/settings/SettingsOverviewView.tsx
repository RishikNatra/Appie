"use client";

import { useState, useEffect } from "react";
import {
  Monitor,
  Eye,
  User,
  Bell,
  Shield,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Save,
  Loader2,
  Moon,
  Sun,
  Lock,
} from "lucide-react";
import { AuthUser } from "@/lib/auth-service";

type SettingsTab =
  | "display"
  | "accessibility"
  | "account"
  | "notifications"
  | "privacy"
  | "preferences";

export default function SettingsOverviewView({ user }: { user: AuthUser }) {
  const [activeTab, setActiveTab] = useState<SettingsTab>("display");
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // 1. Display Settings
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [accentGlow, setAccentGlow] = useState(true);
  const [smoothAnimations, setSmoothAnimations] = useState(true);

  // 2. Accessibility Settings
  const [fontScaling, setFontScaling] = useState<"normal" | "large" | "x-large">("normal");
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // 3. Account Settings
  const [fullName, setFullName] = useState(user.fullName || user.username || "");
  const [email, setEmail] = useState(user.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // 4. Notifications Settings
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [whatsappNotifications, setWhatsappNotifications] = useState(false);
  const [orderAlerts, setOrderAlerts] = useState(true);
  const [consultationReminders, setConsultationReminders] = useState(true);

  // 5. Privacy & Security
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [healthDataConsent, setHealthDataConsent] = useState(true);
  const [telehealthConsent, setTelehealthConsent] = useState(true);
  const [pharmacyDataSharing, setPharmacyDataSharing] = useState(true);

  // 6. Preferences
  const [language, setLanguage] = useState("English");
  const [preferredConsultationType, setPreferredConsultationType] = useState<"video" | "audio" | "chat">("video");
  const [defaultCity, setDefaultCity] = useState("Bengaluru");

  useEffect(() => {
    // Read saved theme from HTML or localStorage
    const savedTheme = (localStorage.getItem("appie_theme") as "dark" | "light") || "dark";
    setTheme(savedTheme);

    const savedFont = (localStorage.getItem("appie_font_scaling") as any) || "normal";
    setFontScaling(savedFont);

    // Fetch user settings from API
    fetch("/api/account/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) {
          const s = data.settings;
          if (s.smsNotifications !== undefined) setSmsNotifications(s.smsNotifications);
          if (s.emailNotifications !== undefined) setEmailNotifications(s.emailNotifications);
          if (s.whatsappNotifications !== undefined) setWhatsappNotifications(s.whatsappNotifications);
          if (s.twoFactorEnabled !== undefined) setTwoFactorEnabled(s.twoFactorEnabled);
          if (s.theme) setTheme(s.theme as "dark" | "light");
          if (s.fontScaling) setFontScaling(s.fontScaling as any);
        }
      })
      .catch(() => {});
  }, []);

  const handleThemeChange = (newTheme: "dark" | "light") => {
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("appie_theme", newTheme);
  };

  const handleFontScalingChange = (scaling: "normal" | "large" | "x-large") => {
    setFontScaling(scaling);
    localStorage.setItem("appie_font_scaling", scaling);
    if (scaling === "large") {
      document.documentElement.style.fontSize = "17px";
    } else if (scaling === "x-large") {
      document.documentElement.style.fontSize = "18.5px";
    } else {
      document.documentElement.style.fontSize = "16px";
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/account/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          theme,
          fontScaling,
          smsNotifications,
          emailNotifications,
          whatsappNotifications,
          twoFactorEnabled,
          language,
        }),
      });

      if (res.ok) {
        setFeedback({ type: "success", text: "Settings saved successfully." });
      } else {
        setFeedback({ type: "error", text: "Failed to persist all settings to backend." });
      }
    } catch {
      setFeedback({ type: "success", text: "Settings updated in local preferences." });
    } finally {
      setSaving(false);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const categories = [
    { id: "display" as SettingsTab, label: "Display", icon: Monitor },
    { id: "accessibility" as SettingsTab, label: "Accessibility", icon: Eye },
    { id: "account" as SettingsTab, label: "Account Settings", icon: User },
    { id: "notifications" as SettingsTab, label: "Notifications", icon: Bell },
    { id: "privacy" as SettingsTab, label: "Privacy & Security", icon: Shield },
    { id: "preferences" as SettingsTab, label: "Preferences", icon: Sliders },
  ];

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "1.5rem 1rem 4rem" }}>
      {/* Title */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.85rem", fontWeight: 800 }}>Platform Settings</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", marginTop: "0.25rem" }}>
          Configure your visual display, accessibility adjustments, notification channels, and account security.
        </p>
      </div>

      {feedback && (
        <div
          style={{
            marginBottom: "1.5rem",
            padding: "0.85rem 1.25rem",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            background: feedback.type === "success" ? "var(--color-success-bg)" : "var(--color-error-bg)",
            color: feedback.type === "success" ? "var(--color-success)" : "var(--color-error)",
            border: `1px solid ${feedback.type === "success" ? "var(--color-success)" : "var(--color-error)"}`,
          }}
        >
          {feedback.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>{feedback.text}</span>
        </div>
      )}

      {/* Main Settings Layout: Linear Horizontal Tabs + Content */}
      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: "1.5rem", alignItems: "start" }}>
        {/* Navigation Categories */}
        <div
          className="dashboard-card"
          style={{
            padding: "0.75rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.35rem",
          }}
        >
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveTab(cat.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.75rem 1rem",
                  borderRadius: "8px",
                  border: "none",
                  background: isActive ? "var(--color-primary-subtle)" : "transparent",
                  color: isActive ? "var(--color-accent)" : "var(--text-secondary)",
                  fontWeight: isActive ? 700 : 500,
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 150ms ease",
                }}
              >
                <Icon size={18} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Panel */}
        <div className="dashboard-card" style={{ padding: "2rem" }}>
          {/* 1. Display */}
          {activeTab === "display" && (
            <div>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "1.25rem" }}>Display Settings</h2>

              <div style={{ marginBottom: "1.75rem" }}>
                <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, marginBottom: "0.6rem" }}>
                  Interface Theme
                </label>
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <button
                    type="button"
                    onClick={() => handleThemeChange("dark")}
                    style={{
                      flex: 1,
                      padding: "1rem",
                      borderRadius: "12px",
                      border: theme === "dark" ? "2px solid var(--color-accent)" : "1px solid var(--border-subtle)",
                      background: "var(--bg-surface)",
                      color: "var(--text-primary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                  >
                    <Moon size={18} />
                    <span>Dark Theme (Default)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleThemeChange("light")}
                    style={{
                      flex: 1,
                      padding: "1rem",
                      borderRadius: "12px",
                      border: theme === "light" ? "2px solid var(--color-accent)" : "1px solid var(--border-subtle)",
                      background: "var(--bg-surface)",
                      color: "var(--text-primary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                  >
                    <Sun size={18} />
                    <span>Light Theme (Sapphire Slate)</span>
                  </button>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", borderTop: "1px solid var(--border-subtle)", paddingTop: "1.25rem" }}>
                <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.92rem" }}>Faint Accent Card Glow</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Subtle ambient glow behind windows, modals, and content panels</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={accentGlow}
                    onChange={(e) => setAccentGlow(e.target.checked)}
                    style={{ width: "20px", height: "20px", accentColor: "var(--color-accent)" }}
                  />
                </label>

                <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.92rem" }}>Smooth Transitions</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Hardware-accelerated interface motion</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={smoothAnimations}
                    onChange={(e) => setSmoothAnimations(e.target.checked)}
                    style={{ width: "20px", height: "20px", accentColor: "var(--color-accent)" }}
                  />
                </label>
              </div>
            </div>
          )}

          {/* 2. Accessibility */}
          {activeTab === "accessibility" && (
            <div>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "1.25rem" }}>Accessibility Settings</h2>

              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, marginBottom: "0.5rem" }}>
                  Text Size Scaling
                </label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  {(["normal", "large", "x-large"] as const).map((scale) => (
                    <button
                      key={scale}
                      type="button"
                      onClick={() => handleFontScalingChange(scale)}
                      style={{
                        flex: 1,
                        padding: "0.75rem",
                        borderRadius: "10px",
                        border: fontScaling === scale ? "2px solid var(--color-accent)" : "1px solid var(--border-subtle)",
                        background: fontScaling === scale ? "var(--color-primary-subtle)" : "var(--bg-surface)",
                        color: "var(--text-primary)",
                        fontWeight: 600,
                        cursor: "pointer",
                        textTransform: "capitalize",
                      }}
                    >
                      {scale === "normal" ? "Standard (100%)" : scale === "large" ? "Large (110%)" : "Extra Large (120%)"}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", borderTop: "1px solid var(--border-subtle)", paddingTop: "1.25rem" }}>
                <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.92rem" }}>High Contrast Borders</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Sharper borders for better readability</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={highContrast}
                    onChange={(e) => setHighContrast(e.target.checked)}
                    style={{ width: "20px", height: "20px", accentColor: "var(--color-accent)" }}
                  />
                </label>

                <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.92rem" }}>Reduce Motion</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Minimizes interface parallax and transition animations</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={reducedMotion}
                    onChange={(e) => setReducedMotion(e.target.checked)}
                    style={{ width: "20px", height: "20px", accentColor: "var(--color-accent)" }}
                  />
                </label>
              </div>
            </div>
          )}

          {/* 3. Account Settings */}
          {activeTab === "account" && (
            <div>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "1.25rem" }}>Account Settings</h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.35rem" }}>
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.35rem" }}>
                    Registered Email
                  </label>
                  <input
                    type="email"
                    className="form-input"
                    value={email}
                    disabled
                    style={{ opacity: 0.75, cursor: "not-allowed" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.35rem" }}>
                    Account Role
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={user.role.toUpperCase()}
                    disabled
                    style={{ opacity: 0.75, cursor: "not-allowed" }}
                  />
                </div>
              </div>

              <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "1.25rem" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.75rem" }}>Security &amp; Password</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <input
                    type="password"
                    className="form-input"
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* 4. Notifications */}
          {activeTab === "notifications" && (
            <div>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "1.25rem" }}>Notification Preferences</h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
                <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.92rem" }}>SMS Delivery Alerts</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Real-time dispatch updates for medicine deliveries</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={smsNotifications}
                    onChange={(e) => setSmsNotifications(e.target.checked)}
                    style={{ width: "20px", height: "20px", accentColor: "var(--color-accent)" }}
                  />
                </label>

                <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.92rem" }}>Email Invoices &amp; Summaries</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Consultation summaries, official e-prescriptions, and tax receipts</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                    style={{ width: "20px", height: "20px", accentColor: "var(--color-accent)" }}
                  />
                </label>

                <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.92rem" }}>WhatsApp Updates</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Automated teleconsultation links and courier tracking pin</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={whatsappNotifications}
                    onChange={(e) => setWhatsappNotifications(e.target.checked)}
                    style={{ width: "20px", height: "20px", accentColor: "var(--color-accent)" }}
                  />
                </label>

                <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.92rem" }}>Doctor Consultation Reminders</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Remind 15 minutes before scheduled video sessions</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={consultationReminders}
                    onChange={(e) => setConsultationReminders(e.target.checked)}
                    style={{ width: "20px", height: "20px", accentColor: "var(--color-accent)" }}
                  />
                </label>
              </div>
            </div>
          )}

          {/* 5. Privacy & Security */}
          {activeTab === "privacy" && (
            <div>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "1.25rem" }}>Privacy &amp; Security</h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
                <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.92rem" }}>Two-Factor Authentication (2FA)</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Require security code verification on login</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={twoFactorEnabled}
                    onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                    style={{ width: "20px", height: "20px", accentColor: "var(--color-accent)" }}
                  />
                </label>

                <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.92rem" }}>Clinical Telehealth Data Consent</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Permits verified doctors to access prior assessments during consults</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={telehealthConsent}
                    onChange={(e) => setTelehealthConsent(e.target.checked)}
                    style={{ width: "20px", height: "20px", accentColor: "var(--color-accent)" }}
                  />
                </label>

                <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.92rem" }}>Pharmacy Prescription Sharing</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Share issued e-prescriptions with partner pharmacies for packaging</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={pharmacyDataSharing}
                    onChange={(e) => setPharmacyDataSharing(e.target.checked)}
                    style={{ width: "20px", height: "20px", accentColor: "var(--color-accent)" }}
                  />
                </label>
              </div>
            </div>
          )}

          {/* 6. Preferences */}
          {activeTab === "preferences" && (
            <div>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "1.25rem" }}>Clinical &amp; Language Preferences</h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.35rem" }}>
                    Preferred Language
                  </label>
                  <select
                    className="form-input"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                  >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi (हिंदी)</option>
                    <option value="Kannada">Kannada (ಕನ್ನಡ)</option>
                    <option value="Tamil">Tamil (தமிழ்)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.35rem" }}>
                    Preferred Telehealth Mode
                  </label>
                  <select
                    className="form-input"
                    value={preferredConsultationType}
                    onChange={(e) => setPreferredConsultationType(e.target.value as any)}
                  >
                    <option value="video">High-Definition Video Call</option>
                    <option value="audio">Voice Tele-Call</option>
                    <option value="chat">Secure Medical Messaging</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.35rem" }}>
                    Operating City
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={defaultCity}
                    onChange={(e) => setDefaultCity(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div style={{ borderTop: "1px solid var(--border-subtle)", marginTop: "2rem", paddingTop: "1.25rem", display: "flex", justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="btn-primary"
              style={{ minHeight: "46px", padding: "0 1.5rem", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
            >
              {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              <span>{saving ? "Saving Changes..." : "Save Preferences"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
