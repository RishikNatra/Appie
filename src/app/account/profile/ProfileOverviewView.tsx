"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  User,
  Heart,
  ShieldCheck,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Lock,
} from "lucide-react";
import { UserProfile, HealthProfile, UserConsentItem } from "@/lib/types";
import { AuthUser } from "@/lib/auth-service";

type ProfileTab = "user_profile" | "health_profile" | "consents";

export default function ProfileOverviewView({ user }: { user: AuthUser }) {
  const [activeTab, setActiveTab] = useState<ProfileTab>("user_profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // 1. User Profile State
  const [fullName, setFullName] = useState(user.fullName || user.username || "");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [dob, setDob] = useState("1995-05-12");
  const [gender, setGender] = useState("male");
  const [city, setCity] = useState("Bengaluru");
  const [state, setState] = useState("Karnataka");
  const [pincode, setPincode] = useState("560038");
  const [emergencyContactName, setEmergencyContactName] = useState("Suresh Verma");
  const [emergencyContactPhone, setEmergencyContactPhone] = useState("+91 98450 11223");

  // 2. Health Profile State
  const [bloodGroup, setBloodGroup] = useState("O+");
  const [allergies, setAllergies] = useState("Penicillin, Dust Mites");
  const [chronicConditions, setChronicConditions] = useState("Mild Allergic Rhinitis");
  const [currentMedications, setCurrentMedications] = useState("Cetirizine 10mg SOS");
  const [emergencyNotes, setEmergencyNotes] = useState("Carry antihistamine when travelling.");

  // 3. Consents State
  const [consents, setConsents] = useState<{
    dataProcessing: boolean;
    telehealthConsultation: boolean;
    pharmacySharing: boolean;
    emergencyAccess: boolean;
  }>({
    dataProcessing: true,
    telehealthConsultation: true,
    pharmacySharing: true,
    emergencyAccess: true,
  });

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch("/api/account/profile").then((r) => r.json()).catch(() => ({})),
      fetch("/api/account/health-profile").then((r) => r.json()).catch(() => ({})),
      fetch("/api/account/consents").then((r) => r.json()).catch(() => ({})),
    ])
      .then(([profData, healthData, consentData]) => {
        if (profData.profile) {
          const p: UserProfile = profData.profile;
          if (p.fullName) setFullName(p.fullName);
          if (p.phone) setPhone(p.phone);
          if (p.dateOfBirth) setDob(p.dateOfBirth);
          if (p.gender) setGender(p.gender);
          if (p.city) setCity(p.city);
          if (p.state) setState(p.state);
          if (p.pincode) setPincode(p.pincode);
          if (p.emergencyContactName) setEmergencyContactName(p.emergencyContactName);
          if (p.emergencyContactPhone) setEmergencyContactPhone(p.emergencyContactPhone);
        }

        if (healthData.healthProfile) {
          const h: HealthProfile = healthData.healthProfile;
          if (h.bloodGroup) setBloodGroup(h.bloodGroup);
          if (h.allergies) setAllergies(h.allergies.join(", "));
          if (h.chronicConditions) setChronicConditions(h.chronicConditions.join(", "));
          if (h.currentMedications) setCurrentMedications(h.currentMedications.join(", "));
          if (h.emergencyMedicalNotes) setEmergencyNotes(h.emergencyMedicalNotes);
        }

        if (consentData.consents && Array.isArray(consentData.consents)) {
          const map: any = {};
          consentData.consents.forEach((c: UserConsentItem) => {
            if (c.category === "data_processing") map.dataProcessing = c.isGranted;
            if (c.category === "telehealth_consultation") map.telehealthConsultation = c.isGranted;
            if (c.category === "pharmacy_sharing") map.pharmacySharing = c.isGranted;
            if (c.category === "emergency_access") map.emergencyAccess = c.isGranted;
          });
          setConsents((prev) => ({ ...prev, ...map }));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSaveProfile = async () => {
    setSaving(true);
    setFeedback(null);

    try {
      if (activeTab === "user_profile") {
        await fetch("/api/account/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName,
            phone,
            dateOfBirth: dob,
            gender,
            city,
            state,
            pincode,
            emergencyContactName,
            emergencyContactPhone,
          }),
        });
      } else if (activeTab === "health_profile") {
        await fetch("/api/account/health-profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bloodGroup,
            allergies: allergies.split(",").map((s) => s.trim()).filter(Boolean),
            chronicConditions: chronicConditions.split(",").map((s) => s.trim()).filter(Boolean),
            currentMedications: currentMedications.split(",").map((s) => s.trim()).filter(Boolean),
            emergencyMedicalNotes: emergencyNotes,
          }),
        });
      } else if (activeTab === "consents") {
        await fetch("/api/account/consents", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(consents),
        });
      }

      setFeedback({ type: "success", text: "Profile records updated and synced with Supabase." });
    } catch {
      setFeedback({ type: "error", text: "Failed to save profile changes. Please try again." });
    } finally {
      setSaving(false);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const handleToggleConsent = (category: keyof typeof consents) => {
    setConsents((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "1.5rem 1rem 4rem" }}>
      {/* Title */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.85rem", fontWeight: 800 }}>Account &amp; Health Profile</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", marginTop: "0.25rem" }}>
          Manage your personal identity, clinical baseline records, and legal telehealth consent policies.
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

      {/* 3 Separate Sections Tabs */}
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          borderBottom: "1px solid var(--border-subtle)",
          paddingBottom: "0.5rem",
          marginBottom: "1.5rem",
          overflowX: "auto",
        }}
      >
        {[
          { id: "user_profile" as ProfileTab, label: "1. User Profile", icon: User },
          { id: "health_profile" as ProfileTab, label: "2. Health Profile", icon: Heart },
          { id: "consents" as ProfileTab, label: "3. Consent Management", icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 1.25rem",
                borderRadius: "10px",
                border: "none",
                background: isActive ? "var(--color-primary-subtle)" : "transparent",
                color: isActive ? "var(--color-accent)" : "var(--text-secondary)",
                fontWeight: isActive ? 700 : 500,
                fontSize: "0.92rem",
                cursor: "pointer",
                transition: "all 150ms ease",
                whiteSpace: "nowrap",
              }}
            >
              <Icon size={17} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Content Card */}
      <div className="dashboard-card" style={{ padding: "2rem" }}>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "3rem 0" }}>
            <Loader2 size={32} className="animate-spin" color="var(--color-accent)" />
          </div>
        ) : (
          <>
            {/* ==============================================================
                SECTION 1: USER PROFILE
                ============================================================== */}
            {activeTab === "user_profile" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <h2 style={{ fontSize: "1.3rem", fontWeight: 700 }}>Personal Identity &amp; Contact Details</h2>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
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
                      Registered Email Address
                    </label>
                    <input
                      type="email"
                      className="form-input"
                      value={user.email}
                      disabled
                      style={{ opacity: 0.75, cursor: "not-allowed" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.35rem" }}>
                      Phone Number
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.35rem" }}>
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      className="form-input"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.35rem" }}>
                      City
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.35rem" }}>
                      State &amp; Pincode
                    </label>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <input
                        type="text"
                        className="form-input"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder="State"
                        style={{ flex: 2 }}
                      />
                      <input
                        type="text"
                        className="form-input"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        placeholder="Pincode"
                        style={{ flex: 1 }}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "1.25rem" }}>
                  <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.75rem" }}>Emergency Contact</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, marginBottom: "0.3rem" }}>
                        Contact Name
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        value={emergencyContactName}
                        onChange={(e) => setEmergencyContactName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, marginBottom: "0.3rem" }}>
                        Contact Phone
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        value={emergencyContactPhone}
                        onChange={(e) => setEmergencyContactPhone(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ==============================================================
                SECTION 2: HEALTH PROFILE
                ============================================================== */}
            {activeTab === "health_profile" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <h2 style={{ fontSize: "1.3rem", fontWeight: 700 }}>Clinical Baseline &amp; Health History</h2>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.35rem" }}>
                      Blood Group
                    </label>
                    <select
                      className="form-input"
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
                    >
                      {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Unknown"].map((bg) => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.35rem" }}>
                      Known Drug / Food Allergies
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Penicillin, Sulfa drugs, Peanuts"
                      value={allergies}
                      onChange={(e) => setAllergies(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.35rem" }}>
                    Chronic Pre-existing Conditions
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Hypertension, Asthma, Type 2 Diabetes"
                    value={chronicConditions}
                    onChange={(e) => setChronicConditions(e.target.value)}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.35rem" }}>
                    Current Daily Medications
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Metformin 500mg, Multivitamin"
                    value={currentMedications}
                    onChange={(e) => setCurrentMedications(e.target.value)}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.35rem" }}>
                    Emergency Medical Notes for Doctors
                  </label>
                  <textarea
                    className="form-input"
                    rows={3}
                    placeholder="Critical instructions for attending physicians during consultations or emergencies..."
                    value={emergencyNotes}
                    onChange={(e) => setEmergencyNotes(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* ==============================================================
                SECTION 3: CONSENT MANAGEMENT
                ============================================================== */}
            {activeTab === "consents" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div>
                  <h2 style={{ fontSize: "1.3rem", fontWeight: 700 }}>Website Consent &amp; Data Handling Policies</h2>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", marginTop: "0.25rem" }}>
                    Under the Digital Personal Data Protection Act (DPDPA) and Telemedicine Practice Guidelines, you control how your health records and personal data are shared across Appie.
                  </p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div
                    style={{
                      padding: "1.25rem",
                      borderRadius: "14px",
                      background: "var(--bg-surface)",
                      border: "1px solid var(--border-subtle)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "1rem",
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: "0.95rem" }}>1. Clinical Data Processing &amp; Health AI Triage</strong>
                      <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginTop: "0.25rem", lineHeight: 1.4 }}>
                        Permits Appie to run algorithmic triage models on reported symptoms to suggest differential conditions and preliminary non-prescription care.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggleConsent("dataProcessing")}
                      style={{
                        padding: "0.45rem 1rem",
                        borderRadius: "8px",
                        border: "none",
                        background: consents.dataProcessing ? "var(--color-success)" : "var(--bg-card)",
                        color: consents.dataProcessing ? "#ffffff" : "var(--text-muted)",
                        fontWeight: 700,
                        fontSize: "0.82rem",
                        cursor: "pointer",
                        flexShrink: 0,
                      }}
                    >
                      {consents.dataProcessing ? "Granted ✓" : "Revoked ✕"}
                    </button>
                  </div>

                  <div
                    style={{
                      padding: "1.25rem",
                      borderRadius: "14px",
                      background: "var(--bg-surface)",
                      border: "1px solid var(--border-subtle)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "1rem",
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: "0.95rem" }}>2. Telehealth Consultation Data Transfer</strong>
                      <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginTop: "0.25rem", lineHeight: 1.4 }}>
                        Allows verified registered doctors to inspect your preliminary symptom assessments and prior consultation notes during appointment scheduling.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggleConsent("telehealthConsultation")}
                      style={{
                        padding: "0.45rem 1rem",
                        borderRadius: "8px",
                        border: "none",
                        background: consents.telehealthConsultation ? "var(--color-success)" : "var(--bg-card)",
                        color: consents.telehealthConsultation ? "#ffffff" : "var(--text-muted)",
                        fontWeight: 700,
                        fontSize: "0.82rem",
                        cursor: "pointer",
                        flexShrink: 0,
                      }}
                    >
                      {consents.telehealthConsultation ? "Granted ✓" : "Revoked ✕"}
                    </button>
                  </div>

                  <div
                    style={{
                      padding: "1.25rem",
                      borderRadius: "14px",
                      background: "var(--bg-surface)",
                      border: "1px solid var(--border-subtle)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "1rem",
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: "0.95rem" }}>3. Pharmacy Prescription Sharing &amp; Dispensation</strong>
                      <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginTop: "0.25rem", lineHeight: 1.4 }}>
                        Authorizes Appie partner pharmacies to review issued e-prescriptions to verify drug legality, dosage validity, and tamper-proof packaging.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggleConsent("pharmacySharing")}
                      style={{
                        padding: "0.45rem 1rem",
                        borderRadius: "8px",
                        border: "none",
                        background: consents.pharmacySharing ? "var(--color-success)" : "var(--bg-card)",
                        color: consents.pharmacySharing ? "#ffffff" : "var(--text-muted)",
                        fontWeight: 700,
                        fontSize: "0.82rem",
                        cursor: "pointer",
                        flexShrink: 0,
                      }}
                    >
                      {consents.pharmacySharing ? "Granted ✓" : "Revoked ✕"}
                    </button>
                  </div>

                  <div
                    style={{
                      padding: "1.25rem",
                      borderRadius: "14px",
                      background: "var(--bg-surface)",
                      border: "1px solid var(--border-subtle)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "1rem",
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: "0.95rem" }}>4. Emergency Responder Access</strong>
                      <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginTop: "0.25rem", lineHeight: 1.4 }}>
                        Grants read-only access to emergency contacts and critical allergies during acute health crises or hospital transfers.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggleConsent("emergencyAccess")}
                      style={{
                        padding: "0.45rem 1rem",
                        borderRadius: "8px",
                        border: "none",
                        background: consents.emergencyAccess ? "var(--color-success)" : "var(--bg-card)",
                        color: consents.emergencyAccess ? "#ffffff" : "var(--text-muted)",
                        fontWeight: 700,
                        fontSize: "0.82rem",
                        cursor: "pointer",
                        flexShrink: 0,
                      }}
                    >
                      {consents.emergencyAccess ? "Granted ✓" : "Revoked ✕"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button for active section */}
            <div style={{ borderTop: "1px solid var(--border-subtle)", marginTop: "2rem", paddingTop: "1.25rem", display: "flex", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={saving}
                className="btn-primary"
                style={{ minHeight: "46px", padding: "0 1.75rem", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
              >
                {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                <span>{saving ? "Saving Changes..." : "Save Profile Updates"}</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
