"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Pill,
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
  Building,
  FileCheck2,
  UploadCloud,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function PharmacistRegisterForm() {
  const router = useRouter();

  // Pharmacy Details
  const [pharmacyName, setPharmacyName] = useState("");
  const [pharmacistName, setPharmacistName] = useState("");
  const [pharmacyType, setPharmacyType] = useState<"retail" | "hospital" | "community" | "chain">("retail");
  const [gstNumber, setGstNumber] = useState("");

  // License & Location Details
  const [drugLicenseNumber, setDrugLicenseNumber] = useState("");
  const [pharmacyCouncilRegNo, setPharmacyCouncilRegNo] = useState("");
  const [pharmacyAddress, setPharmacyAddress] = useState("");
  const [city, setCity] = useState("Bengaluru");
  const [state, setState] = useState("Karnataka");
  const [pincode, setPincode] = useState("");
  const [phone, setPhone] = useState("");

  // Placeholder Pharmacy Certificate Verification
  const [certificateFile, setCertificateFile] = useState<string>("State_Drug_License_Form20B_21B.pdf");
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

    if (!pharmacyName.trim() || !pharmacistName.trim() || !gstNumber.trim()) {
      setErrorMessage("Please complete all pharmacy business information.");
      return;
    }

    if (!drugLicenseNumber.trim() || !pharmacyCouncilRegNo.trim() || !pharmacyAddress.trim() || !phone.trim() || !pincode.trim()) {
      setErrorMessage("Please complete all license and physical address details.");
      return;
    }

    if (!email.trim() || !username.trim() || !password || !confirmPassword) {
      setErrorMessage("Please complete all account credential fields.");
      return;
    }

    if (!termsConsent) {
      setErrorMessage("You must accept the Good Pharmacy Practice & Medicine Dispensing Guidelines.");
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
        role: "pharmacist",
        pharmacyName: pharmacyName.trim(),
        pharmacistName: pharmacistName.trim(),
        pharmacyType,
        gstNumber: gstNumber.trim(),
        drugLicenseNumber: drugLicenseNumber.trim(),
        pharmacyCouncilRegNo: pharmacyCouncilRegNo.trim(),
        pharmacyAddress: pharmacyAddress.trim(),
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.trim(),
        phone: phone.trim(),
        certificateFileName: certificateFile,
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

      setSuccessMessage("Pharmacy account registered successfully! Redirecting to contact verification...");
      setTimeout(() => {
        router.push(data.redirectTo || "/pharmacist/home");
      }, 700);
    } catch {
      setErrorMessage("Network error during pharmacy registration. Please try again.");
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
          <Pill size={16} color="var(--color-accent)" />
          <span>Pharmacy Network Onboarding</span>
        </div>

        <h1 className="auth-title">Register as Pharmacist</h1>
        <p className="auth-subtitle">
          Connect your pharmacy to fulfill certified digital prescriptions, manage pharmaceutical inventory, and supply doorstep medicines safely.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {/* Step 1: Pharmacy Business Info */}
        <div style={{ marginBottom: "2rem" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "1rem", color: "var(--text-primary)" }}>
            1. Pharmacy Business &amp; In-Charge Pharmacist
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            <div className="form-group">
              <label className="form-label">Pharmacy Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. MedPlus Pharmacy - Indiranagar"
                value={pharmacyName}
                onChange={(e) => setPharmacyName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Registered Pharmacist In-Charge *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Vikrant Joshi, B.Pharm"
                value={pharmacistName}
                onChange={(e) => setPharmacistName(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            <div className="form-group">
              <label className="form-label">Pharmacy Type</label>
              <select
                className="form-input"
                value={pharmacyType}
                onChange={(e) => setPharmacyType(e.target.value as "retail" | "hospital" | "community" | "chain")}
              >
                <option value="retail">Retail Pharmacy</option>
                <option value="hospital">Hospital Pharmacy</option>
                <option value="community">Community Pharmacy</option>
                <option value="chain">Chain Pharmacy Franchise</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">GST Number *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 29ABCDE1234F1Z5"
                value={gstNumber}
                onChange={(e) => setGstNumber(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* Step 2: Drug License & Address */}
        <div style={{ marginBottom: "2rem", paddingTop: "1.5rem", borderTop: "1px solid var(--border-subtle)" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "1rem", color: "var(--text-primary)" }}>
            2. Drug License Details &amp; Physical Address
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            <div className="form-group">
              <label className="form-label">Drug License Number (Form 20/21) *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. KA-BLR-20B-98741 / 21B-98742"
                value={drugLicenseNumber}
                onChange={(e) => setDrugLicenseNumber(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">State Pharmacy Council Reg. No *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. KSPC-REG-54812"
                value={pharmacyCouncilRegNo}
                onChange={(e) => setPharmacyCouncilRegNo(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: "1rem" }}>
            <label className="form-label">Physical Pharmacy Address *</label>
            <input
              type="text"
              className="form-input"
              placeholder="Shop/Unit No., Commercial Complex, Street, Area"
              value={pharmacyAddress}
              onChange={(e) => setPharmacyAddress(e.target.value)}
              required
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 120px 140px", gap: "1rem", marginBottom: "1rem" }}>
            <div className="form-group">
              <label className="form-label">City *</label>
              <input
                type="text"
                className="form-input"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">State *</label>
              <input
                type="text"
                className="form-input"
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Pincode *</label>
              <input
                type="text"
                className="form-input"
                placeholder="560038"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Contact Phone *</label>
              <input
                type="tel"
                className="form-input"
                placeholder="+91 98450 77112"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>

          {/* PLACEHOLDER PHARMACY CERTIFICATE VERIFICATION (Non-negotiable requirement) */}
          <div style={{ marginTop: "1.25rem" }}>
            <label className="form-label" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>Placeholder Pharmacy Certificate Verification *</span>
              <span style={{ fontSize: "0.75rem", color: "var(--color-accent)" }}>Drug License Form 20/21</span>
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
                      Format: PDF • 2.15 MB • CDSCO &amp; State Drug Controller Seal Validated
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    type="button"
                    className="btn-secondary"
                    style={{ minHeight: "38px", padding: "0 0.85rem", fontSize: "0.8rem" }}
                    onClick={() => handleSimulateCertUpload("Drug_License_Form_20B_21B_Renewal.pdf")}
                  >
                    <UploadCloud size={14} style={{ marginRight: "0.35rem" }} />
                    <span>Upload Alternate License</span>
                  </button>
                </div>
              </div>

              {/* Simulated Scanner Banner */}
              <div className="cert-scanner-box">
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  {isScanningCert ? (
                    <>
                      <Loader2 size={16} className="animate-spin" color="var(--color-accent)" />
                      <span style={{ fontSize: "0.82rem", color: "var(--color-accent)", fontWeight: 700 }}>
                        Cross-checking Drug License Form 20/21 with Central Drugs Standard Control Organisation...
                      </span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={16} color="var(--color-success)" />
                      <span style={{ fontSize: "0.82rem", color: "var(--color-success)", fontWeight: 700 }}>
                        Drug License Form 20B/21B Verified with State Drug Control Administration
                      </span>
                    </>
                  )}
                </div>

                <span className="scanner-ocr-badge">
                  <Sparkles size={13} />
                  <span>License Active</span>
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
              <label className="form-label">Pharmacy Email Address *</label>
              <input
                type="email"
                className="form-input"
                placeholder="orders@pharmacy.com"
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
                placeholder="medplus_indiranagar"
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
              Two-Factor Authentication (2FA) is enforced for all partner pharmacy logins to protect prescription records.
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
              I accept the Good Pharmacy Practice (GPP) Guidelines, Drugs &amp; Cosmetics Act Standards, and Appie Partner Pharmacy Terms of Service.
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
              <span>Verifying &amp; Registering Pharmacy...</span>
            </>
          ) : (
            <>
              <span>Complete Pharmacist Registration</span>
              <ArrowRight size={18} strokeWidth={2.5} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
