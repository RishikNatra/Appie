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
} from "lucide-react";

export default function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Role from query (?role=health_professional or ?role=patient)
  const roleParam = searchParams.get("role");
  const isProfessional = roleParam === "health_professional";
  const currentRole = isProfessional ? "health_professional" : "patient";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // Client-side quick validation
    if (!email.trim() || !username.trim() || !password || !confirmPassword) {
      setErrorMessage("Please fill out all registration fields.");
      return;
    }

    if (!termsConsent) {
      setErrorMessage("Please accept the Terms of Service & Healthcare Privacy Consent to proceed.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    if (strengthCount < 4) {
      setErrorMessage("Please ensure your password meets the security requirements below.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: currentRole,
          email: email.trim(),
          username: username.trim(),
          password,
          confirmPassword,
          termsConsent,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429) {
          setErrorMessage(
            data.message || "Too many registration attempts from this IP. Please wait before retrying."
          );
        } else {
          setErrorMessage(data.error || "Registration failed. Please review your details.");
        }
        setIsLoading(false);
        return;
      }

      setSuccessMessage("Account created successfully! Preparing your healthcare portal...");
      setTimeout(() => {
        router.push(data.redirectTo || (isProfessional ? "/professional/home" : "/patient/home"));
        router.refresh();
      }, 700);
    } catch {
      setErrorMessage("Network error. Please check your connection and try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <Link
        href={`/login?role=${currentRole}`}
        className="back-link"
        aria-label="Go back to login"
      >
        <ArrowLeft size={18} />
        <span>Back to login</span>
      </Link>

      <div className="auth-header">
        <div className="auth-role-badge">
          {isProfessional ? (
            <>
              <Stethoscope size={16} color="var(--color-accent)" />
              <span>Health Professional Registration</span>
            </>
          ) : (
            <>
              <User size={16} color="var(--color-accent)" />
              <span>Patient Registration</span>
            </>
          )}
        </div>

        <h1 className="auth-title">
          {isProfessional ? "Join as Doctor" : "Create Account"}
        </h1>

        <p className="auth-subtitle">
          {isProfessional
            ? "Register to consult patients and provide verified clinical assessments"
            : "Register to manage symptoms, consultations, and prescriptions"}
        </p>
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

      <form onSubmit={handleSubmit} noValidate>
        {/* Email Field */}
        <div className="form-group">
          <label htmlFor="reg-email" className="form-label">
            Email Address
          </label>
          <div className="input-wrapper">
            <span className="input-leading-icon">
              <Mail size={18} />
            </span>
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
            Username
          </label>
          <div className="input-wrapper">
            <span className="input-leading-icon">
              <UserCheck size={18} />
            </span>
            <input
              id="reg-username"
              type="text"
              name="username"
              autoComplete="username"
              placeholder={isProfessional ? "dr_smith" : "john_doe"}
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
              className="form-input"
              required
              disabled={isLoading}
            />
          </div>
          <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "2px" }}>
            Letters, numbers, and underscores only (3–30 characters)
          </span>
        </div>

        {/* Password Field */}
        <div className="form-group">
          <label htmlFor="reg-password" className="form-label">
            Create Password
          </label>
          <div className="input-wrapper">
            <span className="input-leading-icon">
              <Lock size={18} />
            </span>
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

          {/* Password strength visualizer */}
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
            <span className="input-leading-icon">
              <Lock size={18} />
            </span>
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
              I agree to the Appie <Link href="#" className="form-link" style={{ minHeight: "auto" }}>Terms of Service</Link> and consent to secure processing of my health profile under HIPAA & digital health guidelines.
            </span>
          </label>
        </div>

        {/* Submit Action */}
        <button
          type="submit"
          className="btn-primary"
          id="register-submit-btn"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Creating your account...</span>
            </>
          ) : (
            <span>Complete Registration</span>
          )}
        </button>
      </form>

      {/* Switch to Login */}
      <div style={{ textAlign: "center", marginTop: "1.75rem", fontSize: "0.92rem", color: "var(--text-secondary)" }}>
        <span>Already have an account? </span>
        <Link
          href={`/login?role=${currentRole}`}
          className="form-link"
          id="link-to-login"
        >
          Log in here
        </Link>
      </div>


    </div>
  );
}
