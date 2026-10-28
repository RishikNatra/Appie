"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  User,
  Stethoscope,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Shield,
  Loader2,
} from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Determine role from query param (?role=health_professional or ?role=patient)
  const roleParam = searchParams.get("role");
  const isProfessional = roleParam === "health_professional";
  const currentRole = isProfessional ? "health_professional" : "patient";

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // Client-side quick validation
    if (!identifier.trim()) {
      setErrorMessage("Please enter your email address or username.");
      return;
    }

    if (!password) {
      setErrorMessage("Please enter your password.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: currentRole,
          identifier: identifier.trim(),
          password,
          rememberMe,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429) {
          setErrorMessage(
            data.message || "Too many login attempts. Please wait a minute before retrying."
          );
        } else {
          setErrorMessage(data.error || "Failed to sign in. Please verify your credentials.");
        }
        setIsLoading(false);
        return;
      }

      setSuccessMessage("Login successful! Redirecting to your dashboard...");
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
      <Link href="/" className="back-link" aria-label="Go back to role selection">
        <ArrowLeft size={18} />
        <span>Back to selection</span>
      </Link>

      <div className="auth-header">
        <div className="auth-role-badge">
          {isProfessional ? (
            <>
              <Stethoscope size={16} color="var(--color-accent)" />
              <span>Health Professional Portal</span>
            </>
          ) : (
            <>
              <User size={16} color="var(--color-accent)" />
              <span>Patient Portal</span>
            </>
          )}
        </div>

        <h1 className="auth-title">
          {isProfessional ? "Doctor Login" : "Patient Login"}
        </h1>

        <p className="auth-subtitle">
          {isProfessional
            ? "Sign in to manage patient appointments & clinical assessments"
            : "Sign in to access your routine health assessments & prescriptions"}
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
        {/* Email / Username field */}
        <div className="form-group">
          <label htmlFor="identifier-input" className="form-label">
            Email or Username
          </label>
          <div className="input-wrapper">
            <span className="input-leading-icon">
              <Mail size={18} />
            </span>
            <input
              id="identifier-input"
              type="text"
              name="identifier"
              autoComplete="username"
              placeholder={isProfessional ? "doctor@appie.health or dr_sharma" : "patient@appie.health or demo_patient"}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="form-input"
              required
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Password field */}
        <div className="form-group">
          <label htmlFor="password-input" className="form-label">
            Password
          </label>
          <div className="input-wrapper">
            <span className="input-leading-icon">
              <Lock size={18} />
            </span>
            <input
              id="password-input"
              type={showPassword ? "text" : "password"}
              name="password"
              autoComplete="current-password"
              placeholder="Enter your password"
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
        </div>

        {/* Options Row */}
        <div className="form-options-row">
          <label className="checkbox-label" htmlFor="remember-me-checkbox">
            <input
              id="remember-me-checkbox"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{ display: "none" }}
            />
            <span className="custom-checkbox">
              {rememberMe && <CheckCircle2 size={14} color="#000000" strokeWidth={3} />}
            </span>
            <span>Remember me</span>
          </label>

          <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
            Demo: Password123!
          </span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn-primary"
          id="login-submit-btn"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Verifying credentials...</span>
            </>
          ) : (
            <span>Log In</span>
          )}
        </button>
      </form>

      {/* Switch to Register page */}
      <div style={{ textAlign: "center", marginTop: "1.75rem", fontSize: "0.92rem", color: "var(--text-secondary)" }}>
        <span>Don&#39;t have an account? </span>
        <Link
          href={`/register?role=${currentRole}`}
          className="form-link"
          id="link-to-register"
        >
          Register as a new {isProfessional ? "health professional" : "patient"}
        </Link>
      </div>

      {/* Switch role link */}
      <div
        style={{
          textAlign: "center",
          marginTop: "1rem",
          paddingTop: "1rem",
          borderTop: "1px solid var(--border-subtle)",
          fontSize: "0.85rem",
          color: "var(--text-muted)",
        }}
      >
        <span>Not a {isProfessional ? "health professional" : "patient"}? </span>
        <Link
          href={`/login?role=${isProfessional ? "patient" : "health_professional"}`}
          style={{ color: "var(--text-secondary)", fontWeight: 600, textDecoration: "underline" }}
        >
          Switch to {isProfessional ? "Patient Login" : "Doctor Login"}
        </Link>
      </div>

    </div>
  );
}
