"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AccountNavBar from "@/components/AccountNavBar";
import {
  User,
  Phone,
  Calendar,
  MapPin,
  Heart,
  Save,
  ArrowLeft,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Camera,
  X,
} from "lucide-react";
import { UserProfile } from "@/lib/types";
import { AuthUser } from "@/lib/auth-service";

export default function EditProfileView({ user }: { user: AuthUser }) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form Fields
  const [fullName, setFullName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "other" | "prefer_not_to_say">("male");
  const [avatarUrl, setAvatarUrl] = useState("");

  const [phone, setPhone] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");

  const [emergencyContactName, setEmergencyContactName] = useState("");
  const [emergencyContactPhone, setEmergencyContactPhone] = useState("");
  const [emergencyContactRelation, setEmergencyContactRelation] = useState("Spouse");

  useEffect(() => {
    fetch("/api/account/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data.profile) {
          const p: UserProfile = data.profile;
          setFullName(p.fullName || "");
          setFirstName(p.firstName || "");
          setLastName(p.lastName || "");
          setDateOfBirth(p.dateOfBirth || "1994-08-15");
          setGender(p.gender || "male");
          setAvatarUrl(p.avatarUrl || "");
          setPhone(p.phone || "");
          setAddressLine1(p.addressLine1 || "");
          setAddressLine2(p.addressLine2 || "");
          setCity(p.city || "");
          setState(p.state || "");
          setPincode(p.pincode || "");
          setEmergencyContactName(p.emergencyContactName || "");
          setEmergencyContactPhone(p.emergencyContactPhone || "");
          setEmergencyContactRelation(p.emergencyContactRelation || "Spouse");
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/account/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim() || `${firstName} ${lastName}`.trim(),
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          dateOfBirth,
          gender,
          avatarUrl,
          phone: phone.trim(),
          addressLine1: addressLine1.trim(),
          addressLine2: addressLine2.trim(),
          city: city.trim(),
          state: state.trim(),
          pincode: pincode.trim(),
          emergencyContactName: emergencyContactName.trim(),
          emergencyContactPhone: emergencyContactPhone.trim(),
          emergencyContactRelation,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setFeedback({ type: "error", text: data.error || "Failed to save profile changes." });
      } else {
        setFeedback({ type: "success", text: "Profile changes saved successfully." });
        setTimeout(() => {
          router.push("/account/profile");
          router.refresh();
        }, 800);
      }
    } catch {
      setFeedback({ type: "error", text: "Network error occurred." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "4rem 0" }}>
        <Loader2 size={36} className="animate-spin" color="var(--color-accent)" />
      </div>
    );
  }

  return (
    <div style={{ width: "100%", maxWidth: "860px", margin: "0 auto" }}>
      <AccountNavBar role={user.role} />

      <Link href="/account/profile" className="back-link">
        <ArrowLeft size={18} />
        <span>Back to Profile Overview</span>
      </Link>

      <div className="section-header-wrap">
        <h1 className="auth-title" style={{ textAlign: "left" }}>Edit User Profile</h1>
        <p className="auth-subtitle" style={{ textAlign: "left" }}>
          Update your personal records, contact coordinates, and emergency proxies
        </p>
      </div>

      {feedback && (
        <div className={`alert-box ${feedback.type === "success" ? "alert-success" : "alert-error"}`}>
          {feedback.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{feedback.text}</span>
        </div>
      )}

      <form onSubmit={handleSave}>
        {/* Profile Photo Component */}
        <div
          className="dashboard-card"
          style={{
            textAlign: "left",
            marginBottom: "1.75rem",
            padding: "1.75rem 2rem",
            display: "flex",
            alignItems: "center",
            gap: "1.5rem",
          }}
        >
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "20px",
              background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
              border: "2px solid var(--color-accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#EFEEEE",
              fontSize: "1.8rem",
              fontWeight: 800,
              flexShrink: 0,
            }}
          >
            {(fullName?.[0] || user.username[0]).toUpperCase()}
          </div>

          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "0.25rem" }}>
              Profile Avatar
            </h3>
            <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "0.6rem" }}>
              Avatar is generated from your initials, or you may provide an image URL.
            </p>
            <input
              type="text"
              className="form-input no-icon"
              placeholder="Avatar image URL (optional)"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              style={{ minHeight: "40px", fontSize: "0.85rem" }}
            />
          </div>
        </div>

        {/* Personal Information Form */}
        <div className="dashboard-card" style={{ textAlign: "left", marginBottom: "1.75rem", padding: "2rem" }}>
          <h2 className="section-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <User size={20} color="var(--color-accent)" />
            <span>Personal Information</span>
          </h2>
          <p className="section-desc" style={{ marginBottom: "1.5rem" }}>
            Full legal name and biological demographics
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div className="form-group">
              <label className="form-label">First Name</label>
              <input
                type="text"
                className="form-input no-icon"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Rahul"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input
                type="text"
                className="form-input no-icon"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Verma"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Full Display Name</label>
            <input
              type="text"
              className="form-input no-icon"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Rahul Verma"
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div className="form-group">
              <label className="form-label">Date of Birth</label>
              <div className="input-wrapper">
                <span className="input-leading-icon"><Calendar size={18} /></span>
                <input
                  type="date"
                  className="form-input"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Gender</label>
              <select
                className="form-select"
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
            </div>
          </div>
        </div>

        {/* Contact Information Form */}
        <div className="dashboard-card" style={{ textAlign: "left", marginBottom: "1.75rem", padding: "2rem" }}>
          <h2 className="section-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Phone size={20} color="var(--color-accent)" />
            <span>Contact Information</span>
          </h2>
          <p className="section-desc" style={{ marginBottom: "1.5rem" }}>
            Delivery address and telephone reachability
          </p>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <div className="input-wrapper">
              <span className="input-leading-icon"><Phone size={18} /></span>
              <input
                type="tel"
                className="form-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Address Line 1</label>
            <div className="input-wrapper">
              <span className="input-leading-icon"><MapPin size={18} /></span>
              <input
                type="text"
                className="form-input"
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
                placeholder="Flat / House / Street Name"
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
            <div className="form-group">
              <label className="form-label">City</label>
              <input
                type="text"
                className="form-input no-icon"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Bengaluru"
              />
            </div>
            <div className="form-group">
              <label className="form-label">State</label>
              <input
                type="text"
                className="form-input no-icon"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="Karnataka"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Pincode</label>
              <input
                type="text"
                className="form-input no-icon"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="560038"
              />
            </div>
          </div>

          {/* Emergency Contact */}
          <div style={{ marginTop: "1.5rem", paddingTop: "1.25rem", borderTop: "1px solid var(--border-subtle)" }}>
            <label className="form-label" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Heart size={16} color="var(--color-accent)" />
              <span>Emergency Proxy Contact</span>
            </label>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 120px", gap: "0.75rem", marginTop: "0.5rem" }}>
              <input
                type="text"
                className="form-input no-icon"
                placeholder="Emergency Contact Name"
                value={emergencyContactName}
                onChange={(e) => setEmergencyContactName(e.target.value)}
              />
              <input
                type="tel"
                className="form-input no-icon"
                placeholder="Emergency Phone Number"
                value={emergencyContactPhone}
                onChange={(e) => setEmergencyContactPhone(e.target.value)}
              />
              <select
                className="form-select"
                value={emergencyContactRelation}
                onChange={(e) => setEmergencyContactRelation(e.target.value)}
              >
                <option value="Spouse">Spouse</option>
                <option value="Parent">Parent</option>
                <option value="Sibling">Sibling</option>
                <option value="Child">Child</option>
                <option value="Friend">Friend</option>
              </select>
            </div>
          </div>
        </div>

        {/* Profile Save Component */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
          <Link href="/account/profile" className="btn-secondary" style={{ textDecoration: "none" }}>
            Cancel
          </Link>
          <button
            type="submit"
            className="btn-primary"
            id="btn-save-profile"
            disabled={saving}
            style={{ width: "auto", minWidth: "160px" }}
          >
            {saving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>Save Profile Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

