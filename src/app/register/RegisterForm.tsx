"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  User,
  Stethoscope,
  Lock,
  Mail,
  UserCheck,
  Eye,
  EyeOff,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Shield,
  Loader2,
  Check,
  X,
  Phone,
  Calendar,
  MapPin,
  Heart,
  Award,
  Building,
  ArrowRight,
} from "lucide-react";

export default function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Role from query (?role=health_professional or ?role=patient)
  const roleParam = searchParams.get("role");
  const [selectedRole, setSelectedRole] = useState<"patient" | "health_professional">(
    roleParam === "health_professional" ? "health_professional" : "patient"
  );

  const isProfessional = selectedRole === "health_professional";

  // Step 1: Personal & Contact | Step 2: Professional (if doc) | Step 3: Account Credentials & Consent
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Common Personal Information
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "other" | "prefer_not_to_say">("male");

  // Contact Information
  const [phone, setPhone] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [emergencyContactName, setEmergencyContactName] = useState("");
  const [emergencyContactPhone, setEmergencyContactPhone] = useState("");
  const [emergencyContactRelation, setEmergencyContactRelation] = useState("Spouse");

  // Professional Details (if doctor)
  const [prefix, setPrefix] = useState<"Dr." | "Prof.">("Dr.");
  const [medicalLicenseNumber, setMedicalLicenseNumber] = useState("");
  const [medicalCouncilName, setMedicalCouncilName] = useState("Medical Council of India / State Council");
  const [specialization, setSpecialization] = useState("General Medicine");
  const [qualifications, setQualifications] = useState("MBBS, MD");
  const [yearsOfExperience, setYearsOfExperience] = useState<number>(5);
  const [clinicAddress, setClinicAddress] = useState("");

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

  // Password validation checks
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^a-zA-Z0-9]/.test(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const strengthCount = [hasMinLength, hasUppercase, hasLowercase, hasNumber, hasSpecial].filter(
    Boolean
  ).length;

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (currentStep === 1) {
      if (isProfessional) {
        if (!fullName.trim() || !dateOfBirth || !phone.trim() || !clinicAddress.trim()) {
          setErrorMessage("Please complete all personal and contact fields.");
          return;
        }
      } else {
        if (!firstName.trim() || !lastName.trim() || !dateOfBirth || !phone.trim()) {
          setErrorMessage("Please complete your name, date of birth, and contact phone number.");
          return;
        }
      }
      setCurrentStep(2);
      return;
    }

    if (currentStep === 2 && isProfessional) {
      if (!medicalLicenseNumber.trim() || !specialization.trim() || !qualifications.trim()) {
        setErrorMessage("Please complete your medical license and qualification details.");
        return;
      }
      setCurrentStep(3);
      return;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!email.trim() || !username.trim() || !password || !confirmPassword) {
      setErrorMessage("Please complete all account credential fields.");
      return;
    }

    if (!termsConsent) {
      setErrorMessage(
        isProfessional
          ? "You must accept the Telemedicine Guidelines & Professional Code of Ethics."
          : "You must accept the Terms of Service & Healthcare Privacy Consent to proceed."
      );
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    if (strengthCount < 4) {
      setErrorMessage("Please ensure your password meets the security requirements.");
      return;
    }

    setIsLoading(true);

    try {
      const payload = isProfessional
        ? {
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
          }
        : {
            role: "patient",
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            dateOfBirth,
            gender,
            phone: phone.trim(),
            addressLine1: addressLine1.trim(),
            city: city.trim(),
            state: state.trim(),
            pincode: pincode.trim(),
            emergencyContactName: emergencyContactName.trim(),
            emergencyContactPhone: emergencyContactPhone.trim(),
            emergencyContactRelation,
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
        if (res.status === 429) {
          setErrorMessage(
            data.message || "Too many registration attempts. Please wait before retrying."
          );
        } else {
          setErrorMessage(data.error || "Registration failed. Please review your details.");
        }
        setIsLoading(false);
        return;
      }

      setSuccessMessage(
        "Account created! Redirecting to contact verification..."
      );
      setTimeout(() => {
        router.push(data.redirectTo || `/verify-registration?email=${encodeURIComponent(email)}&role=${selectedRole}`);
        router.refresh();
      }, 700);
    } catch {
      setErrorMessage("Network error. Please check your connection and try again.");
      setIsLoading(false);
    }
  };

  const totalSteps = isProfessional ? 3 : 2;

  return (
    <div className="auth-card" style={{ maxWidth: "620px" }}>
      <Link
        href={`/login?role=${selectedRole}`}
        className="back-link"
        aria-label="Go back to login"
      >
        <ArrowLeft size={18} />
        <span>Back to login</span>
      </Link>

      <div className="auth-header" style={{ marginBottom: "1.5rem" }}>
        {/* Account Type Selector Component */}
        <div
          style={{
            display: "inline-flex",
            padding: "4px",
            backgroundColor: "var(--bg-surface)",
            borderRadius: "14px",
            border: "1px solid var(--border-subtle)",
            marginBottom: "1.25rem",
          }}
          role="tablist"
          aria-label="Account Type Selector"
        >
          <button
            type="button"
            role="tab"
            aria-selected={!isProfessional}
            onClick={() => {
              setSelectedRole("patient");
              setCurrentStep(1);
            }}
            style={{
              minHeight: "44px",
              padding: "0 1.25rem",
              borderRadius: "10px",
              border: "none",
              backgroundColor: !isProfessional ? "var(--color-primary)" : "transparent",
              color: !isProfessional ? "#EFEEEE" : "var(--text-secondary)",
              fontWeight: 700,
              fontSize: "0.88rem",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              transition: "all 250ms ease-in-out",
            }}
          >
            <User size={16} />
            <span>Patient Registration</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={isProfessional}
            onClick={() => {
              setSelectedRole("health_professional");
              setCurrentStep(1);
            }}
            style={{
              minHeight: "44px",
              padding: "0 1.25rem",
              borderRadius: "10px",
              border: "none",
              backgroundColor: isProfessional ? "var(--color-primary)" : "transparent",
              color: isProfessional ? "#EFEEEE" : "var(--text-secondary)",
              fontWeight: 700,
              fontSize: "0.88rem",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              transition: "all 250ms ease-in-out",
            }}
          >
            <Stethoscope size={16} />
            <span>Health Professional</span>
          </button>
        </div>

        <h1 className="auth-title">
          {isProfessional ? "Health Professional Registration" : "Patient Registration"}
        </h1>

        <p className="auth-subtitle">
          {isProfessional
            ? "Register to conduct routine telehealth consultations and issue e-prescriptions"
            : "Register to assess routine symptoms and manage family healthcare"}
        </p>

        {/* Step Indicator Component */}
        <div className="step-indicator-wrap" style={{ marginTop: "1.5rem" }}>
          <div className={`step-node ${currentStep === 1 ? "active" : currentStep > 1 ? "completed" : ""}`}>
            <div className="step-circle">{currentStep > 1 ? <Check size={16} /> : "1"}</div>
            <span>Personal & Contact</span>
          </div>

          <div className={`step-connector ${currentStep > 1 ? "completed" : ""}`} />

          {isProfessional && (
            <>
              <div className={`step-node ${currentStep === 2 ? "active" : currentStep > 2 ? "completed" : ""}`}>
                <div className="step-circle">{currentStep > 2 ? <Check size={16} /> : "2"}</div>
                <span>Medical Credentials</span>
              </div>
              <div className={`step-connector ${currentStep > 2 ? "completed" : ""}`} />
            </>
          )}

          <div className={`step-node ${currentStep === totalSteps ? "active" : ""}`}>
            <div className="step-circle">{totalSteps}</div>
            <span>Account & Consent</span>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="alert-box alert-error" role="alert">
          <AlertCircle size={18} className="alert-icon" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="alert-box alert-success" role="alert">
          <CheckCircle2 size={18} className="alert-icon" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* STEP 1: Personal & Contact Information */}
      {currentStep === 1 && (
        <form onSubmit={handleNextStep}>
          <div className="section-header-wrap">
            <h2 className="section-title">1. Personal & Contact Information</h2>
            <p className="section-desc">Provide your basic identification and contact details</p>
          </div>

          {isProfessional ? (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: "1rem" }}>
                <div className="form-group">
                  <label className="form-label">Prefix</label>
                  <select
                    className="form-select"
                    value={prefix}
                    onChange={(e) => setPrefix(e.target.value as "Dr." | "Prof.")}
                  >
                    <option value="Dr.">Dr.</option>
                    <option value="Prof.">Prof.</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Full Legal Name</label>
                  <div className="input-wrapper">
                    <span className="input-leading-icon"><User size={18} /></span>
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
              </div>

              <div className="form-group">
                <label className="form-label">Clinic / Hospital Practice Address</label>
                <div className="input-wrapper">
                  <span className="input-leading-icon"><Building size={18} /></span>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Apollo Clinic, Koramangala 4th Block, Bengaluru"
                    value={clinicAddress}
                    onChange={(e) => setClinicAddress(e.target.value)}
                    required
                  />
                </div>
              </div>
            </>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="form-group">
                <label className="form-label">First Name</label>
                <div className="input-wrapper">
                  <span className="input-leading-icon"><User size={18} /></span>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Rahul"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Last Name</label>
                <div className="input-wrapper">
                  <span className="input-leading-icon"><User size={18} /></span>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Verma"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          )}

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
                  required
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

          <div className="form-group">
            <label className="form-label">Contact Phone Number</label>
            <div className="input-wrapper">
              <span className="input-leading-icon"><Phone size={18} /></span>
              <input
                type="tel"
                className="form-input"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>

          {!isProfessional && (
            <>
              <div className="form-group">
                <label className="form-label">Residential Address</label>
                <div className="input-wrapper">
                  <span className="input-leading-icon"><MapPin size={18} /></span>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Street address / apartment"
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    className="form-input no-icon"
                    placeholder="Bengaluru"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">State</label>
                  <input
                    type="text"
                    className="form-input no-icon"
                    placeholder="Karnataka"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Pincode</label>
                  <input
                    type="text"
                    className="form-input no-icon"
                    placeholder="560038"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                  />
                </div>
              </div>

              {/* Emergency Contact */}
              <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid var(--border-subtle)" }}>
                <label className="form-label" style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <Heart size={16} color="var(--color-accent)" />
                  <span>Emergency Contact (Optional)</span>
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginTop: "0.5rem" }}>
                  <input
                    type="text"
                    className="form-input no-icon"
                    placeholder="Contact Name (e.g. Pooja Verma)"
                    value={emergencyContactName}
                    onChange={(e) => setEmergencyContactName(e.target.value)}
                  />
                  <input
                    type="tel"
                    className="form-input no-icon"
                    placeholder="Contact Phone"
                    value={emergencyContactPhone}
                    onChange={(e) => setEmergencyContactPhone(e.target.value)}
                  />
                </div>
              </div>
            </>
          )}

          <div style={{ marginTop: "1.75rem" }}>
            <button type="submit" className="btn-primary" id="btn-next-step">
              <span>Continue to Next Step</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </form>
      )}

      {/* STEP 2 (Doctor Only): Professional Details Form */}
      {currentStep === 2 && isProfessional && (
        <form onSubmit={handleNextStep}>
          <div className="section-header-wrap">
            <h2 className="section-title">2. Professional Details & License</h2>
            <p className="section-desc">Verify your clinical qualifications and medical council registration</p>
          </div>

          <div className="form-group">
            <label className="form-label">Medical Council Registration / License Number</label>
            <div className="input-wrapper">
              <span className="input-leading-icon"><Award size={18} /></span>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. KMC-2012-78941"
                value={medicalLicenseNumber}
                onChange={(e) => setMedicalLicenseNumber(e.target.value)}
                required
              />
            </div>
            <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
              As registered with the National Medical Commission (NMC) or State Medical Council
            </span>
          </div>

          <div className="form-group">
            <label className="form-label">State Medical Council Name</label>
            <input
              type="text"
              className="form-input no-icon"
              placeholder="e.g. Karnataka Medical Council"
              value={medicalCouncilName}
              onChange={(e) => setMedicalCouncilName(e.target.value)}
              required
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div className="form-group">
              <label className="form-label">Clinical Specialization</label>
              <select
                className="form-select"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
              >
                <option value="General Medicine">General Medicine</option>
                <option value="Family Physician">Family Physician</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="Dermatology">Dermatology</option>
                <option value="ENT Specialist">ENT Specialist</option>
                <option value="Internal Medicine">Internal Medicine</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Years of Clinical Experience</label>
              <input
                type="number"
                min="0"
                max="60"
                className="form-input no-icon"
                value={yearsOfExperience}
                onChange={(e) => setYearsOfExperience(Number(e.target.value))}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Academic Qualifications</label>
            <input
              type="text"
              className="form-input no-icon"
              placeholder="e.g. MBBS, MD (Internal Medicine)"
              value={qualifications}
              onChange={(e) => setQualifications(e.target.value)}
              required
            />
          </div>

          <div style={{ display: "flex", gap: "1rem", marginTop: "1.75rem" }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setCurrentStep(1)}
              style={{ flex: 1 }}
            >
              Back
            </button>
            <button type="submit" className="btn-primary" style={{ flex: 2 }}>
              <span>Continue to Account Setup</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </form>
      )}

      {/* FINAL STEP: Account Credentials & Consent */}
      {currentStep === totalSteps && (
        <form onSubmit={handleSubmit} noValidate>
          <div className="section-header-wrap">
            <h2 className="section-title">{totalSteps}. Account Credentials & Consent</h2>
            <p className="section-desc">Create your login credentials and review digital health compliance</p>
          </div>

          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="reg-email" className="form-label">
              Official Email Address
            </label>
            <div className="input-wrapper">
              <span className="input-leading-icon"><Mail size={18} /></span>
              <input
                id="reg-email"
                type="email"
                name="email"
                autoComplete="email"
                placeholder={isProfessional ? "doctor@hospital.org" : "user@example.com"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Username Field */}
          <div className="form-group">
            <label htmlFor="reg-username" className="form-label">
              Choose Username
            </label>
            <div className="input-wrapper">
              <span className="input-leading-icon"><UserCheck size={18} /></span>
              <input
                id="reg-username"
                type="text"
                name="username"
                autoComplete="username"
                placeholder={isProfessional ? "dr_ananya" : "rahul_verma"}
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                className="form-input"
                required
                disabled={isLoading}
              />
            </div>
            <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
              Letters, numbers, and underscores only (3–30 characters)
            </span>
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label htmlFor="reg-password" className="form-label">
              Create Password
            </label>
            <div className="input-wrapper">
              <span className="input-leading-icon"><Lock size={18} /></span>
              <input
                id="reg-password"
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="new-password"
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                className="input-trailing-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Password strength indicator */}
            {password.length > 0 && (
              <div className="password-strength-wrap">
                <div className="strength-bar-bg">
                  <div
                    className={`strength-bar-segment ${
                      strengthCount >= 1
                        ? strengthCount <= 2
                          ? "active-weak"
                          : strengthCount <= 4
                          ? "active-medium"
                          : "active-strong"
                        : ""
                    }`}
                  />
                  <div
                    className={`strength-bar-segment ${
                      strengthCount >= 3
                        ? strengthCount <= 4
                          ? "active-medium"
                          : "active-strong"
                        : ""
                    }`}
                  />
                  <div
                    className={`strength-bar-segment ${
                      strengthCount === 5 ? "active-strong" : ""
                    }`}
                  />
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "0.35rem",
                    marginTop: "0.45rem",
                    fontSize: "0.76rem",
                  }}
                >
                  <span style={{ color: hasMinLength ? "var(--color-success)" : "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                    {hasMinLength ? <Check size={12} /> : <X size={12} />} At least 8 characters
                  </span>
                  <span style={{ color: hasUppercase ? "var(--color-success)" : "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                    {hasUppercase ? <Check size={12} /> : <X size={12} />} Uppercase letter
                  </span>
                  <span style={{ color: hasLowercase ? "var(--color-success)" : "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                    {hasLowercase ? <Check size={12} /> : <X size={12} />} Lowercase letter
                  </span>
                  <span style={{ color: hasNumber && hasSpecial ? "var(--color-success)" : "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                    {hasNumber && hasSpecial ? <Check size={12} /> : <X size={12} />} Number & symbol
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="form-group">
            <label htmlFor="reg-confirm-password" className="form-label">
              Confirm Password
            </label>
            <div className="input-wrapper">
              <span className="input-leading-icon"><Lock size={18} /></span>
              <input
                id="reg-confirm-password"
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                autoComplete="new-password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="form-input"
                required
                disabled={isLoading}
              />
              {confirmPassword && (
                <span style={{ position: "absolute", right: "1rem", color: passwordsMatch ? "var(--color-success)" : "var(--color-error)" }}>
                  {passwordsMatch ? <Check size={18} /> : <X size={18} />}
                </span>
              )}
            </div>
          </div>

          {/* Terms & Consent Component */}
          <div style={{ margin: "1.25rem 0 1.5rem" }}>
            <label className="checkbox-label" htmlFor="terms-consent-checkbox" style={{ alignItems: "flex-start" }}>
              <input
                id="terms-consent-checkbox"
                type="checkbox"
                checked={termsConsent}
                onChange={(e) => setTermsConsent(e.target.checked)}
                style={{ display: "none" }}
              />
              <span className="custom-checkbox" style={{ marginTop: "2px", flexShrink: 0 }}>
                {termsConsent && <CheckCircle2 size={14} color="#000000" strokeWidth={3} />}
              </span>
              <span style={{ fontSize: "0.85rem", lineHeight: 1.45 }}>
                {isProfessional ? (
                  <>
                    I certify that I am a registered medical practitioner with an active license. I agree to abide by the Telemedicine Practice Guidelines issued by the NMC and adhere to Appie&#39;s Clinical Code of Conduct.
                  </>
                ) : (
                  <>
                    I agree to the Appie <Link href="/account/consents" className="form-link" style={{ minHeight: "auto" }}>Terms of Service</Link> and consent to secure processing of my health profile under HIPAA & Indian Digital Health Guidelines (ABDM).
                  </>
                )}
              </span>
            </label>
          </div>

          {/* Registration Action Component */}
          <div style={{ display: "flex", gap: "1rem" }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setCurrentStep(currentStep - 1)}
              style={{ flex: 1 }}
              disabled={isLoading}
            >
              Back
            </button>
            <button
              type="submit"
              className="btn-primary"
              id="register-submit-btn"
              disabled={isLoading}
              style={{ flex: 2 }}
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Registering account...</span>
                </>
              ) : (
                <span>Complete Registration</span>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Switch to Login */}
      <div style={{ textAlign: "center", marginTop: "1.75rem", fontSize: "0.92rem", color: "var(--text-secondary)" }}>
        <span>Already have an account? </span>
        <Link
          href={`/login?role=${selectedRole}`}
          className="form-link"
          id="link-to-login"
        >
          Sign in here
        </Link>
      </div>
    </div>
  );
}
