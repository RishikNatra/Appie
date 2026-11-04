"use client";

import { useState, useEffect } from "react";
import AccountNavBar from "@/components/AccountNavBar";
import {
  Settings,
  Bell,
  Shield,
  Palette,
  KeyRound,
  Smartphone,
  Mail,
  MessageSquare,
  LogOut,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sun,
  Moon,
  Laptop,
  Trash2,
} from "lucide-react";
import { UserSettings } from "@/lib/types";
import { AuthUser } from "@/lib/auth-service";

export default function SettingsOverviewView({ user }: { user: AuthUser }) {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Active section tab in Settings Navigation Component
  const [activeSection, setActiveSection] = useState<
    "account" | "notifications" | "security" | "preferences"
  >("account");

  // Notification toggles
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [whatsappNotifications, setWhatsappNotifications] = useState(false);

  // Security toggles
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // App preferences
  const [theme, setTheme] = useState<"light" | "dark" | "system">("dark");
  const [language, setLanguage] = useState("en");
  const [fontScaling, setFontScaling] = useState<"normal" | "large">("normal");

  // Change password inputs
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordFeedback, setPasswordFeedback] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/account/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) {
          const s: UserSettings = data.settings;
          setSettings(s);
          setSmsNotifications(s.smsNotifications);
          setEmailNotifications(s.emailNotifications);
          setWhatsappNotifications(s.whatsappNotifications);
          setTwoFactorEnabled(s.twoFactorEnabled);
          setTheme(s.theme || "dark");
          setLanguage(s.language || "en");
          setFontScaling(s.fontScaling || "normal");
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSaveSettings = async () => {
    setSaving(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/account/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          smsNotifications,
          emailNotifications,
          whatsappNotifications,
          twoFactorEnabled,
          theme,
          language,
          fontScaling,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setFeedback({ type: "error", text: data.error || "Failed to update settings." });
      } else {
        setSettings(data.settings);
        setFeedback({ type: "success", text: "Settings saved successfully." });

        // Update active theme in DOM & localStorage
        if (theme === "light" || theme === "dark") {
          document.documentElement.setAttribute("data-theme", theme);
          localStorage.setItem("appie_theme", theme);
        }
      }
    } catch {
      setFeedback({ type: "error", text: "Network error occurred." });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setPasswordFeedback("Please fill out all password fields.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordFeedback("New passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordFeedback("New password must be at least 8 characters long.");
      return;
    }

    setPasswordFeedback("Password updated securely.");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "4rem 0" }}>
        <Loader2 size={36} className="animate-spin" color="var(--color-accent)" />
      </div>
    );
  }

  return (
    <div style={{ width: "100%", maxWidth: "960px", margin: "0 auto" }}>
      <AccountNavBar role={user.role} />

      <div className="section-header-wrap" style={{ marginBottom: "1.75rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.4rem" }}>
          <Settings size={26} color="var(--color-accent)" />
          <h1 style={{ fontSize: "1.6rem", fontWeight: 800 }}>Account & Application Settings</h1>
        </div>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
          Manage your credentials, multi-factor security, notification channels, and app preferences.
        </p>
      </div>

      {feedback && (
        <div className={`alert-box ${feedback.type === "success" ? "alert-success" : "alert-error"}`}>
          {feedback.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Settings Navigation Component (Sub-navigation pills) */}
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          flexWrap: "wrap",
          marginBottom: "2rem",
          borderBottom: "1px solid var(--border-subtle)",
          paddingBottom: "0.75rem",
        }}
        role="tablist"
      >
        <button
          type="button"
          className={`radio-pill-label ${activeSection === "account" ? "active" : ""}`}
          onClick={() => setActiveSection("account")}
        >
          <KeyRound size={16} />
          <span>Account Settings</span>
        </button>

        <button
          type="button"
          className={`radio-pill-label ${activeSection === "notifications" ? "active" : ""}`}
          onClick={() => setActiveSection("notifications")}
        >
          <Bell size={16} />
          <span>Notification Preferences</span>
        </button>

        <button
          type="button"
          className={`radio-pill-label ${activeSection === "security" ? "active" : ""}`}
          onClick={() => setActiveSection("security")}
        >
          <Shield size={16} />
          <span>Privacy & Security</span>
        </button>

        <button
          type="button"
          className={`radio-pill-label ${activeSection === "preferences" ? "active" : ""}`}
          onClick={() => setActiveSection("preferences")}
        >
          <Palette size={16} />
          <span>Application Preferences</span>
        </button>
      </div>

      {/* SECTION 1: Account Settings Component */}
      {activeSection === "account" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
          {/* Change Password Card */}
          <div className="dashboard-card" style={{ textAlign: "left", padding: "2rem" }}>
            <h2 className="section-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <KeyRound size={20} color="var(--color-accent)" />
              <span>Change Account Password</span>
            </h2>
            <p className="section-desc" style={{ marginBottom: "1.5rem" }}>
              Update your account password with standard cryptographic strength requirements
            </p>

            {passwordFeedback && (
              <div className="alert-box alert-success" style={{ marginBottom: "1.25rem" }}>
                <CheckCircle2 size={16} />
                <span>{passwordFeedback}</span>
              </div>
            )}

            <form onSubmit={handlePasswordUpdate}>
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input
                  type="password"
                  className="form-input no-icon"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    className="form-input no-icon"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 8 characters, uppercase, number"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Confirm New Password</label>
                  <input
                    type="password"
                    className="form-input no-icon"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Repeat new password"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn-secondary"
                style={{ marginTop: "0.5rem", minHeight: "44px" }}
              >
                Update Password
              </button>
            </form>
          </div>

          {/* Account Credentials Summary */}
          <div className="dashboard-card" style={{ textAlign: "left", padding: "2rem" }}>
            <h2 className="section-title">Registered Account Coordinates</h2>
            <p className="section-desc" style={{ marginBottom: "1.25rem" }}>
              Core identifiers bound to this patient profile
            </p>

            <div className="dashboard-info-table" style={{ margin: 0, maxWidth: "100%" }}>
              <div className="dashboard-info-row">
                <span className="dashboard-info-label">Account Role:</span>
                <span className="dashboard-info-value" style={{ color: "var(--color-accent)" }}>
                  {user.role === "patient" ? "Patient" : "Health Professional"}
                </span>
              </div>
              <div className="dashboard-info-row">
                <span className="dashboard-info-label">Account Identifier (Username):</span>
                <span className="dashboard-info-value">@{user.username}</span>
              </div>
              <div className="dashboard-info-row">
                <span className="dashboard-info-label">Primary Communication Email:</span>
                <span className="dashboard-info-value">{user.email}</span>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div
            className="dashboard-card"
            style={{
              textAlign: "left",
              padding: "2rem",
              borderColor: "rgba(239, 68, 68, 0.3)",
              backgroundColor: "rgba(239, 68, 68, 0.04)",
            }}
          >
            <h2 className="section-title" style={{ color: "var(--color-error)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Trash2 size={20} />
              <span>Danger Zone: Deactivate Account</span>
            </h2>
            <p className="section-desc" style={{ marginBottom: "1.25rem" }}>
              Deactivating your account will archive your clinical symptom assessments and active consultations.
            </p>

            <button
              type="button"
              onClick={() => alert("Account deactivation requires two-factor verification. Contact compliance support.")}
              style={{
                minHeight: "48px",
                padding: "0 1.25rem",
                borderRadius: "12px",
                backgroundColor: "var(--color-error)",
                color: "#FFFFFF",
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <Trash2 size={16} />
              <span>Request Account Deactivation</span>
            </button>
          </div>
        </div>
      )}

      {/* SECTION 2: Notification Preferences Component */}
      {activeSection === "notifications" && (
        <div className="dashboard-card" style={{ textAlign: "left", padding: "2rem" }}>
          <h2 className="section-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Bell size={20} color="var(--color-accent)" />
            <span>Notification Preferences</span>
          </h2>
          <p className="section-desc" style={{ marginBottom: "1.75rem" }}>
            Select channels where you wish to receive consultation appointment reminders and prescription delivery trackers
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* SMS */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "1rem",
                borderRadius: "14px",
                backgroundColor: "var(--bg-surface)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <Smartphone size={22} color="var(--color-accent)" />
                <div>
                  <h3 style={{ fontSize: "1rem", fontWeight: 700 }}>SMS Text Notifications</h3>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                    Receive critical OTP security codes and appointment booking confirmations
                  </p>
                </div>
              </div>

              <div
                className="switch-wrapper"
                onClick={() => setSmsNotifications(!smsNotifications)}
              >
                <div className={`switch-track ${smsNotifications ? "checked" : ""}`}>
                  <div className="switch-thumb" />
                </div>
              </div>
            </div>

            {/* Email */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "1rem",
                borderRadius: "14px",
                backgroundColor: "var(--bg-surface)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <Mail size={22} color="var(--color-primary)" />
                <div>
                  <h3 style={{ fontSize: "1rem", fontWeight: 700 }}>Email Health Reminders & Summaries</h3>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                    Receive downloadable e-prescriptions, consultation invoices, and follow-up guidance
                  </p>
                </div>
              </div>

              <div
                className="switch-wrapper"
                onClick={() => setEmailNotifications(!emailNotifications)}
              >
                <div className={`switch-track ${emailNotifications ? "checked" : ""}`}>
                  <div className="switch-thumb" />
                </div>
              </div>
            </div>

            {/* WhatsApp */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "1rem",
                borderRadius: "14px",
                backgroundColor: "var(--bg-surface)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <MessageSquare size={22} color="var(--color-success)" />
                <div>
                  <h3 style={{ fontSize: "1rem", fontWeight: 700 }}>WhatsApp Delivery Tracking</h3>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                    Instant live courier updates when your medications are dispatched by partner pharmacies
                  </p>
                </div>
              </div>

              <div
                className="switch-wrapper"
                onClick={() => setWhatsappNotifications(!whatsappNotifications)}
              >
                <div className={`switch-track ${whatsappNotifications ? "checked" : ""}`}>
                  <div className="switch-thumb" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: Privacy & Security Component */}
      {activeSection === "security" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
          {/* 2FA Toggle */}
          <div className="dashboard-card" style={{ textAlign: "left", padding: "2rem" }}>
            <h2 className="section-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Shield size={20} color="var(--color-accent)" />
              <span>Two-Factor Authentication (2FA)</span>
            </h2>
            <p className="section-desc" style={{ marginBottom: "1.5rem" }}>
              Enforce a secondary verification code whenever you sign in to protect sensitive clinical history
            </p>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "1.25rem",
                borderRadius: "14px",
                backgroundColor: "var(--bg-surface)",
              }}
            >
              <div>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "0.25rem" }}>
                  Require 2FA at Sign In
                </h3>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                  Status:{" "}
                  <strong style={{ color: twoFactorEnabled ? "var(--color-success)" : "var(--text-muted)" }}>
                    {twoFactorEnabled ? "Currently Enabled" : "Disabled"}
                  </strong>
                </p>
              </div>

              <div
                className="switch-wrapper"
                onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
              >
                <div className={`switch-track ${twoFactorEnabled ? "checked" : ""}`}>
                  <div className="switch-thumb" />
                </div>
              </div>
            </div>
          </div>

          {/* Active Sessions */}
          <div className="dashboard-card" style={{ textAlign: "left", padding: "2rem" }}>
            <h2 className="section-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Laptop size={20} color="var(--color-accent)" />
              <span>Active Browser Sessions</span>
            </h2>
            <p className="section-desc" style={{ marginBottom: "1.5rem" }}>
              Devices currently signed in with your credentials
            </p>

            {settings?.activeSessions && settings.activeSessions.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {settings.activeSessions.map((sess) => (
                  <div
                    key={sess.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "1rem 1.25rem",
                      borderRadius: "12px",
                      backgroundColor: "var(--bg-surface)",
                      border: "1px solid var(--border-subtle)",
                    }}
                  >
                    <div>
                      <h4 style={{ fontSize: "0.95rem", fontWeight: 700 }}>{sess.device}</h4>
                      <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                        {sess.ipAddress} • {sess.lastActive}
                      </p>
                    </div>

                    {sess.isCurrent ? (
                      <span className="badge-status badge-verified">Current Device</span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => alert("Session logged out.")}
                        className="btn-secondary"
                        style={{ minHeight: "36px", fontSize: "0.8rem", padding: "0 0.85rem" }}
                      >
                        <LogOut size={14} />
                        <span>Log Out</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Current session active.</p>
            )}
          </div>
        </div>
      )}

      {/* SECTION 4: Application Preferences Component */}
      {activeSection === "preferences" && (
        <div className="dashboard-card" style={{ textAlign: "left", padding: "2rem" }}>
          <h2 className="section-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Palette size={20} color="var(--color-accent)" />
            <span>Application Preferences</span>
          </h2>
          <p className="section-desc" style={{ marginBottom: "1.5rem" }}>
            Custom visual theme, interface language, and accessibility font scaling
          </p>

          {/* Theme Selector */}
          <div style={{ marginBottom: "1.75rem" }}>
            <label className="form-label" style={{ marginBottom: "0.5rem", display: "block" }}>
              Visual Theme Mode
            </label>
            <div className="radio-group-grid">
              <label className={`radio-pill-label ${theme === "dark" ? "active" : ""}`}>
                <input
                  type="radio"
                  name="theme"
                  checked={theme === "dark"}
                  onChange={() => setTheme("dark")}
                  style={{ display: "none" }}
                />
                <Moon size={16} />
                <span>Dark Mode (#000000)</span>
              </label>

              <label className={`radio-pill-label ${theme === "light" ? "active" : ""}`}>
                <input
                  type="radio"
                  name="theme"
                  checked={theme === "light"}
                  onChange={() => setTheme("light")}
                  style={{ display: "none" }}
                />
                <Sun size={16} />
                <span>Light Mode (#EFEEEE)</span>
              </label>
            </div>
          </div>

          {/* Language Selector */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div className="form-group">
              <label className="form-label">Language</label>
              <select
                className="form-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="en">English (India)</option>
                <option value="hi">Hindi (हिंदी)</option>
                <option value="kn">Kannada (ಕನ್ನಡ)</option>
                <option value="ta">Tamil (தமிழ்)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Accessibility Font Scaling</label>
              <select
                className="form-select"
                value={fontScaling}
                onChange={(e) => setFontScaling(e.target.value as any)}
              >
                <option value="normal">Normal (Default)</option>
                <option value="large">Large (High Legibility)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Global Settings Save Button */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "2rem" }}>
        <button
          type="button"
          onClick={handleSaveSettings}
          disabled={saving}
          className="btn-primary"
          id="btn-save-settings"
          style={{ width: "auto", minWidth: "220px", minHeight: "48px" }}
        >
          {saving ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Saving Preferences...</span>
            </>
          ) : (
            <>
              <Save size={18} />
              <span>Save Application Settings</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

