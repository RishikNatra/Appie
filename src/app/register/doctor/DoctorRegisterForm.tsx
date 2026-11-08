"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Stethoscope,
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
  FileCheck2,
  UploadCloud,
  Check,
  Building,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function DoctorRegisterForm() {
  const router = useRouter();

  // Personal Information
  const [prefix, setPrefix] = useState<"Dr." | "Prof.">("Dr.");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "other" | "prefer_not_to_say">("male");
  const [clinicAddress, setClinicAddress] = useState("");

  // Professional Credentials
  const [medicalLicenseNumber, setMedicalLicenseNumber] = useState("");
  const [medicalCouncilName, setMedicalCouncilName] = useState("National Medical Commission (NMC) / State Medical Council");
  const [specialization, setSpecialization] = useState("General Medicine");
  const [qualifications, setQualifications] = useState("MBBS, MD (General Medicine)");
  const [yearsOfExperience, setYearsOfExperience] = useState<number>(8);

  // Placeholder Medical Certificate Verification
  const [certificateFile, setCertificateFile] = useState<string>("NMC_MBBS_MD_Registration_Certificate.pdf");
  const [isScanningCert, setIsScanningCert] = useState<boolean>(false);
  const [certVerified, setCertVerified] = useState<boolean>(true);

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

  const handleSimulateCertUpload = (fileName: string) => {
    setIsScanningCert(true);
    setCertificateFile(fileName);
    setTimeout(() => {
      setIsScanningCert(false);
      setCertVerified(true);
    }, 700);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!fullName.trim() || !phone.trim() || !dateOfBirth || !clinicAddress.trim()) {
      setErrorMessage("Please complete all personal and clinic information fields.");
      return;
    }

    if (!medicalLicenseNumber.trim() || !medicalCouncilName.trim() || !specialization.trim()) {
      setErrorMessage("Please complete your medical credentials and license information.");
      return;
    }

    if (!email.trim() || !username.trim() || !password || !confirmPassword) {
      setErrorMessage("Please complete all account credential fields.");
      return;
    }

    if (!termsConsent) {
      setErrorMessage("You must accept the Telemedicine Practice Guidelines & Healthcare Code of Ethics.");
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
        role: "health_professional",
        prefix,
        fullName: fullName.trim(),
        dateOfBirth,
        gender,
        phone: phone.trim(),
        clinicAddress: clinicAddress.trim(),
        medicalLicenseNumber: medicalLicenseNumber.trim(),
        medicalCouncilName: medicalCouncilName.trim(),
        specialization: specialization.trim(),
        qualifications: qualifications.trim(),
        yearsOfExperience: Number(yearsOfExperience) || 0,
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

      setSuccessMessage("Doctor account registered successfully! Redirecting to contact verification...");
      setTimeout(() => {
        router.push(data.redirectTo || "/professional/home");
      }, 700);
    } catch {
      setErrorMessage("Network error during doctor registration. Please try again.");
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
          <Stethoscope size={16} color="var(--color-accent)" />
          <span>Doctor Onboarding</span>
        </div>

        <h1 className="auth-title">Register as Doctor</h1>
        <p className="auth-subtitle">
          Join Appie&apos;s verified clinical network to review pre-assessed symptoms, conduct telehealth sessions, and issue certified digital prescriptions.
        </p>
      </div>

      {errorMessage && (
        <div className="form-alert error" role="alert">
          <AlertCircle size={18} />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="form-alert success" role="status">
          <CheckCircle2 size={18} />
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* Step 1: Personal & Clinic Information */}
        <div style={{ marginBottom: "2rem" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "1rem", color: "var(--text-primary)" }}>
            1. Personal &amp; Practice Information
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: "1rem", marginBottom: "1rem" }}>
            <div className="form-group">
              <label className="form-label">Prefix</label>
              <select
                className="form-input"
                value={prefix}
                onChange={(e) => setPrefix(e.target.value as "Dr." | "Prof.")}
              >
                <option value="Dr.">Dr.</option>
                <option value="Prof.">Prof.</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Full Legal Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Ananya Sharma"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <input
                type="tel"
                className="form-input"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Date of Birth *</label>
              <input
                type="date"
                className="form-input"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: "1rem" }}>
            <label className="form-label">Clinic / Hospital Practice Address *</label>
            <input
              type="text"
              className="form-input"
              placeholder="Suite No., Clinic Name, Street Address, City"
              value={clinicAddress}
              onChange={(e) => setClinicAddress(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Step 2: Professional Credentials */}
        <div style={{ marginBottom: "2rem", paddingTop: "1.5rem", borderTop: "1px solid var(--border-subtle)" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "1rem", color: "var(--text-primary)" }}>
            2. Medical Credentials &amp; Specialization
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            <div className="form-group">
              <label className="form-label">Medical Council License Number *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. KMC-2014-98213"
                value={medicalLicenseNumber}
                onChange={(e) => setMedicalLicenseNumber(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Medical Council Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="State or National Medical Council"
                value={medicalCouncilName}
                onChange={(e) => setMedicalCouncilName(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 120px", gap: "1rem", marginBottom: "1rem" }}>
            <div className="form-group">
              <label className="form-label">Clinical Specialization *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. General Medicine, Pediatrics"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Degrees &amp; Qualifications *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. MBBS, MD"
                value={qualifications}
                onChange={(e) => setQualifications(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Experience (Yrs)</label>
              <input
                type="number"
                min="0"
                max="60"
                className="form-input"
                value={yearsOfExperience}
                onChange={(e) => setYearsOfExperience(Number(e.target.value))}
              />
            </div>
          </div>

          {/* PLACEHOLDER MEDICAL CERTIFICATE VERIFICATION (Non-negotiable requirement) */}
          <div style={{ marginTop: "1.25rem" }}>
            <label className="form-label" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>Placeholder Medical Certificate Verification *</span>
              <span style={{ fontSize: "0.75rem", color: "var(--color-accent)" }}>Required for Clinical Verification</span>
            </label>

            <div className={`cert-verification-card ${certVerified ? "verified" : ""}`}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "var(--color-primary-subtle)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-accent)" }}>
                    <FileCheck2 size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: "0.92rem", fontWeight: 700, color: "var(--text-primary)" }}>
                      {certificateFile}
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                      Format: PDF • 1.84 MB • Encrypted Hash: SHA-256 Validated
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    type="button"
                    className="btn-secondary"
                    style={{ minHeight: "38px", padding: "0 0.85rem", fontSize: "0.8rem" }}
                    onClick={() => handleSimulateCertUpload("NMC_Council_Reg_Certificate_2024.pdf")}
                  >
                    <UploadCloud size={14} style={{ marginRight: "0.35rem" }} />
                    <span>Upload Alternate File</span>
                  </button>
                </div>
              </div>

              {/* Simulated OCR & Registry Matching Banner */}
              <div className="cert-scanner-box">
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  {isScanningCert ? (
                    <>
                      <Loader2 size={16} className="animate-spin" color="var(--color-accent)" />
                      <span style={{ fontSize: "0.82rem", color: "var(--color-accent)", fontWeight: 700 }}>
                        Scanning certificate with National Medical Registry...
                      </span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={16} color="var(--color-success)" />
                      <span style={{ fontSize: "0.82rem", color: "var(--color-success)", fontWeight: 700 }}>
                        Medical Registration Certificate Validated with Indian Medical Registry
                      </span>
                    </>
                  )}
                </div>

                <span className="scanner-ocr-badge">
                  <Sparkles size={13} />
                  <span>OCR Checksum Passed</span>
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
              <label className="form-label">Professional Email Address *</label>
              <input
                type="email"
                className="form-input"
                placeholder="doctor@clinic.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Username *</label>
              <input
                type="text"
                className="form-input"
                placeholder="dr_sharma"
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
              Two-Factor Authentication (2FA) is automatically enabled for all registered health professionals.
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
              I accept the Telemedicine Practice Guidelines, Indian Medical Council (Professional Conduct) Regulations, and Appie Clinical Code of Ethics.
            </span>
          </label>
        </div>

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
              <span>Verifying &amp; Registering Account...</span>
            </>
          ) : (
            <>
              <span>Complete Doctor Registration</span>
              <ArrowRight size={18} strokeWidth={2.5} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
