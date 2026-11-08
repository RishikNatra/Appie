"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Truck,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Shield,
  Loader2,
  Phone,
  Navigation,
  FileCheck2,
  UploadCloud,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function DeliveryPartnerRegisterForm() {
  const router = useRouter();

  // Personal Details
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "other" | "prefer_not_to_say">("male");
  const [city, setCity] = useState("Bengaluru");
  const [operatingZone, setOperatingZone] = useState("Indiranagar, Koramangala & Domlur");

  // Vehicle & Driving License Details
  const [vehicleType, setVehicleType] = useState<"motorcycle" | "scooter" | "electric_vehicle" | "bicycle">("motorcycle");
  const [vehicleRegistrationNumber, setVehicleRegistrationNumber] = useState("");
  const [drivingLicenseNumber, setDrivingLicenseNumber] = useState("");

  // Placeholder Vehicle Registration Verification
  const [vehicleRcFile, setVehicleRcFile] = useState<string>("Vehicle_RC_Book_KA05EP4912.pdf");
  const [isScanningRc, setIsScanningRc] = useState<boolean>(false);
  const [rcVerified, setRcVerified] = useState<boolean>(true);

  // Account Credentials
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [termsConsent, setTermsConsent] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Password validation
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^a-zA-Z0-9]/.test(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;
  const strengthCount = [hasMinLength, hasUppercase, hasLowercase, hasNumber, hasSpecial].filter(Boolean).length;

  const handleSimulateRcUpload = (fileName: string) => {
    setIsScanningRc(true);
    setVehicleRcFile(fileName);
    setTimeout(() => {
      setIsScanningRc(false);
      setRcVerified(true);
    }, 700);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!fullName.trim() || !phone.trim() || !city.trim() || !operatingZone.trim()) {
      setErrorMessage("Please complete all personal and operational zone details.");
      return;
    }

    if (!vehicleRegistrationNumber.trim() || !drivingLicenseNumber.trim()) {
      setErrorMessage("Please complete all vehicle registration and driving license fields.");
      return;
    }

    if (!email.trim() || !username.trim() || !password || !confirmPassword) {
      setErrorMessage("Please complete all account credential fields.");
      return;
    }

    if (!termsConsent) {
      setErrorMessage("You must agree to the Pharmaceutical Delivery & Safe Transit Guidelines.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    if (strengthCount < 4) {
      setErrorMessage("Please ensure your password meets security requirements.");
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        role: "delivery_partner",
        fullName: fullName.trim(),
        phone: phone.trim(),
        dateOfBirth,
        gender,
        city: city.trim(),
        operatingZone: operatingZone.trim(),
        vehicleType,
        vehicleRegistrationNumber: vehicleRegistrationNumber.trim(),
        drivingLicenseNumber: drivingLicenseNumber.trim(),
        vehicleRcFileName: vehicleRcFile,
        email: email.trim(),
        username: username.trim(),
        password,
        confirmPassword,
        termsConsent,
      };

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Registration failed. Please review your details.");
        setIsLoading(false);
        return;
      }

      setSuccessMessage("Delivery Partner registered successfully! Redirecting to contact verification...");
      setTimeout(() => {
        router.push(data.redirectTo || "/delivery/home");
      }, 700);
    } catch {
      setErrorMessage("Network error during delivery partner registration. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-card" style={{ maxWidth: "760px", width: "100%" }}>
      <Link href="/healthcare-registration" className="back-link">
        <ArrowLeft size={16} />
        <span>Back to Partner Tracks</span>
      </Link>

      <div className="auth-header">
        <div className="auth-role-badge">
          <Truck size={16} color="var(--color-accent)" />
          <span>Logistics Partner Onboarding</span>
        </div>

        <h1 className="auth-title">Register as Delivery Partner</h1>
        <p className="auth-subtitle">
          Join Appie&apos;s medicine delivery fleet to pick up fulfilled prescriptions from partner pharmacies and ensure timely doorstep delivery to patients.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {/* Step 1: Personal & Zone Info */}
        <div style={{ marginBottom: "2rem" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "1rem", color: "var(--text-primary)" }}>
            1. Personal &amp; Operating Zone Information
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            <div className="form-group">
              <label className="form-label">Full Legal Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Arun Kumar"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Contact Phone Number *</label>
              <input
                type="tel"
                className="form-input"
                placeholder="+91 97410 99882"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            <div className="form-group">
              <label className="form-label">Operating City *</label>
              <input
                type="text"
                className="form-input"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Preferred Operating Delivery Zone *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Indiranagar, Koramangala & HSR"
                value={operatingZone}
                onChange={(e) => setOperatingZone(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* Step 2: Vehicle & Driving License */}
        <div style={{ marginBottom: "2rem", paddingTop: "1.5rem", borderTop: "1px solid var(--border-subtle)" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "1rem", color: "var(--text-primary)" }}>
            2. Vehicle &amp; Driving License Details
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            <div className="form-group">
              <label className="form-label">Vehicle Type</label>
              <select
                className="form-input"
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value as "motorcycle" | "scooter" | "electric_vehicle" | "bicycle")}
              >
                <option value="motorcycle">Motorcycle (Fuel)</option>
                <option value="scooter">Scooter (Fuel)</option>
                <option value="electric_vehicle">Electric Vehicle (EV 2-Wheeler)</option>
                <option value="bicycle">Bicycle (Hyper-local)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Vehicle Registration Number (Plate No) *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. KA-05-EP-4912"
                value={vehicleRegistrationNumber}
                onChange={(e) => setVehicleRegistrationNumber(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: "1rem" }}>
            <label className="form-label">Driving License Number *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. KA-0520150041289"
              value={drivingLicenseNumber}
              onChange={(e) => setDrivingLicenseNumber(e.target.value)}
              required
            />
          </div>

          {/* PLACEHOLDER VEHICLE REGISTRATION VERIFICATION (Non-negotiable requirement) */}
          <div style={{ marginTop: "1.25rem" }}>
            <label className="form-label" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>Placeholder Vehicle Registration (RC) Verification *</span>
              <span style={{ fontSize: "0.75rem", color: "var(--color-accent)" }}>VAHAN Portal Verification</span>
            </label>

            <div className={`cert-verification-card ${rcVerified ? "verified" : ""}`}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "var(--color-primary-subtle)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-accent)" }}>
                    <FileCheck2 size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: "0.92rem", fontWeight: 700, color: "var(--text-primary)" }}>
                      {vehicleRcFile}
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                      Format: PDF • 1.38 MB • Parivahan Sewa Digital Stamp Validated
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    type="button"
                    className="btn-secondary"
                    style={{ minHeight: "38px", padding: "0 0.85rem", fontSize: "0.8rem" }}
                    onClick={() => handleSimulateRcUpload("Vehicle_RC_Commercial_Fitness_2025.pdf")}
                  >
                    <UploadCloud size={14} style={{ marginRight: "0.35rem" }} />
                    <span>Upload Alternate RC</span>
                  </button>
                </div>
              </div>

              {/* Simulated Scanner Banner */}
              <div className="cert-scanner-box">
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  {isScanningRc ? (
                    <>
                      <Loader2 size={16} className="animate-spin" color="var(--color-accent)" />
                      <span style={{ fontSize: "0.82rem", color: "var(--color-accent)", fontWeight: 700 }}>
                        Verifying Registration Certificate with Ministry of Road Transport (VAHAN)...
                      </span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={16} color="var(--color-success)" />
                      <span style={{ fontSize: "0.82rem", color: "var(--color-success)", fontWeight: 700 }}>
                        Vehicle RC &amp; Valid Commercial Motor Insurance Confirmed
                      </span>
                    </>
                  )}
                </div>

                <span className="scanner-ocr-badge">
                  <Sparkles size={13} />
                  <span>VAHAN Active</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: Account Credentials */}
        <div style={{ marginBottom: "2rem", paddingTop: "1.5rem", borderTop: "1px solid var(--border-subtle)" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "1rem", color: "var(--text-primary)" }}>
            3. Account Credentials &amp; 2FA Security
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                className="form-input"
                placeholder="rider@delivery.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Portal Username *</label>
              <input
                type="text"
                className="form-input"
                placeholder="arun_rider"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            <div className="form-group">
              <label className="form-label">Password *</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-input"
                  placeholder="Min 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password *</label>
              <input
                type="password"
                className="form-input"
                placeholder="Re-type password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password strength indicators */}
          {password && (
            <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "1.25rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <span style={{ color: hasMinLength ? "var(--color-success)" : "inherit" }}>
                {hasMinLength ? "✓" : "○"} 8+ Chars
              </span>
              <span style={{ color: hasUppercase && hasLowercase ? "var(--color-success)" : "inherit" }}>
                {hasUppercase && hasLowercase ? "✓" : "○"} Upper &amp; Lowercase
              </span>
              <span style={{ color: hasNumber ? "var(--color-success)" : "inherit" }}>
                {hasNumber ? "✓" : "○"} Number
              </span>
              <span style={{ color: hasSpecial ? "var(--color-success)" : "inherit" }}>
                {hasSpecial ? "✓" : "○"} Symbol
              </span>
              <span style={{ color: passwordsMatch ? "var(--color-success)" : "inherit" }}>
                {passwordsMatch ? "✓" : "○"} Passwords Match
              </span>
            </div>
          )}

          {/* 2FA Notice */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.75rem 1rem", backgroundColor: "var(--bg-surface)", borderRadius: "10px", border: "1px solid var(--border-subtle)", marginBottom: "1.25rem" }}>
            <Shield size={18} color="var(--color-accent)" />
            <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
              Two-Factor Authentication (2FA) is enabled for delivery partners to secure fulfillment route access.
            </span>
          </div>

          {/* Terms & Consent */}
          <label style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem", cursor: "pointer", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
            <input
              type="checkbox"
              checked={termsConsent}
              onChange={(e) => setTermsConsent(e.target.checked)}
              style={{ marginTop: "3px", accentColor: "var(--color-accent)", width: "18px", height: "18px" }}
            />
            <span>
              I accept the Pharmaceutical Delivery Safety Protocols, Cold-Chain Transit Rules, and Appie Partner Driver Agreement.
            </span>
          </label>
        </div>

        {errorMessage && (
          <div className="form-alert error" role="alert" style={{ marginBottom: "1rem" }}>
            <AlertCircle size={18} />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="form-alert success" role="status" style={{ marginBottom: "1rem" }}>
            <CheckCircle2 size={18} />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="btn-primary"
          style={{ width: "100%", minHeight: "52px", fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem" }}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Verifying &amp; Registering Partner...</span>
            </>
          ) : (
            <>
              <span>Complete Delivery Partner Registration</span>
              <ArrowRight size={18} strokeWidth={2.5} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
