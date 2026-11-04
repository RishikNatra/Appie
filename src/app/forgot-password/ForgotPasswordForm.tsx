"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  KeyRound,
  Mail,
  Smartphone,
  Lock,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Check,
  X,
  Eye,
  EyeOff,
} from "lucide-react";

export default function ForgotPasswordForm() {
  const router = useRouter();

  // Step 1: Identification & Method | Step 2: Code & New Password | Step 3: Success Status
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form Fields
  const [identifier, setIdentifier] = useState("");
  const [recoveryMethod, setRecoveryMethod] = useState<"email" | "sms">("email");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [maskedTarget, setMaskedTarget] = useState("");

  // Password rules
  const hasMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[^a-zA-Z0-9]/.test(newPassword);
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;

  const strengthCount = [hasMinLength, hasUppercase, hasLowercase, hasNumber, hasSpecial].filter(
    Boolean
  ).length;

  // Step 1: Request Code
  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!identifier.trim()) {
      setErrorMessage("Please enter your registered email address or username.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: identifier.trim(),
          method: recoveryMethod,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Unable to send recovery code. Check your identifier.");
        setIsLoading(false);
        return;
      }

      setMaskedTarget(data.maskedTarget || identifier);
      setSuccessMessage(data.message || "Recovery code dispatched.");
      setStep(2);
    } catch {
      setErrorMessage("Network error during recovery request.");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (code.length !== 6) {
      setErrorMessage("Please enter the 6-digit recovery code.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    if (strengthCount < 4) {
      setErrorMessage("Please choose a stronger password meeting the requirements.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: identifier.trim(),
          code: code.trim(),
          newPassword,
          confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Password reset failed. Ensure code is valid.");
        setIsLoading(false);
        return;
      }

      setStep(3);
    } catch {
      setErrorMessage("Network error while resetting password.");
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-card" style={{ maxWidth: "520px" }}>
      <Link href="/login" className="back-link">
        <ArrowLeft size={18} />
        <span>Back to Login</span>
      </Link>

      <div className="auth-header">
        <div className="auth-role-badge">
          <KeyRound size={16} color="var(--color-accent)" />
          <span>Password Recovery</span>
        </div>

        <h1 className="auth-title">
          {step === 3 ? "Password Reset Complete" : "Reset Your Password"}
        </h1>

        <p className="auth-subtitle">
          {step === 1 && "Identify your Appie account to receive a secure password recovery code"}
          {step === 2 && `Enter the 6-digit code sent to ${maskedTarget} and create a new password`}
          {step === 3 && "Your credentials have been updated securely"}
        </p>
      </div>

      {errorMessage && (
        <div className="alert-box alert-error" role="alert">
          <AlertCircle size={18} className="alert-icon" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && step !== 3 && (
        <div className="alert-box alert-success" role="alert">
          <CheckCircle2 size={18} className="alert-icon" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* STEP 1: Account Identification & Recovery Method */}
      {step === 1 && (
        <form onSubmit={handleRequestCode}>
          <div className="form-group">
            <label htmlFor="recovery-id" className="form-label">
              Registered Email or Username
            </label>
            <div className="input-wrapper">
              <span className="input-leading-icon"><Mail size={18} /></span>
              <input
                id="recovery-id"
                type="text"
                className="form-input"
                placeholder="patient@appie.health or dr_sharma"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Recovery Method Component */}
          <div style={{ margin: "1.5rem 0" }}>
            <label className="form-label" style={{ marginBottom: "0.5rem", display: "block" }}>
              Send Recovery Code Via
            </label>
            <div className="radio-group-grid">
              <label className={`radio-pill-label ${recoveryMethod === "email" ? "active" : ""}`}>
                <input
                  type="radio"
                  name="recoveryMethod"
                  checked={recoveryMethod === "email"}
                  onChange={() => setRecoveryMethod("email")}
                  style={{ display: "none" }}
                />
                <Mail size={16} />
                <span>Email Address</span>
              </label>

              <label className={`radio-pill-label ${recoveryMethod === "sms" ? "active" : ""}`}>
                <input
                  type="radio"
                  name="recoveryMethod"
                  checked={recoveryMethod === "sms"}
                  onChange={() => setRecoveryMethod("sms")}
                  style={{ display: "none" }}
                />
                <Smartphone size={16} />
                <span>SMS Mobile</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            id="btn-send-recovery-code"
            disabled={isLoading}
            style={{ minHeight: "48px" }}
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Sending recovery code...</span>
              </>
            ) : (
              <>
                <span>Send Recovery Code</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
      )}

      {/* STEP 2: Verification Code Component & New Password Form */}
      {step === 2 && (
        <form onSubmit={handleResetPassword}>
          {/* Verification Code Component */}
          <div className="form-group">
            <label htmlFor="recovery-code" className="form-label">
              6-Digit Recovery Code
            </label>
            <div className="input-wrapper">
              <span className="input-leading-icon"><KeyRound size={18} /></span>
              <input
                id="recovery-code"
                type="text"
                maxLength={6}
                className="form-input"
                placeholder="Enter 6-digit code (Demo: 123456)"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ""))}
                required
                disabled={isLoading}
              />
            </div>
            <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
              Universal demo testing code: <strong>123456</strong>
            </span>
          </div>

          {/* New Password Form */}
          <div className="form-group" style={{ marginTop: "1rem" }}>
            <label htmlFor="new-password" className="form-label">
              New Password
            </label>
            <div className="input-wrapper">
              <span className="input-leading-icon"><Lock size={18} /></span>
              <input
                id="new-password"
                type={showPassword ? "text" : "password"}
                className="form-input"
                placeholder="Create new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={isLoading}
              />
              <button
                type="button"
                className="input-trailing-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Password strength indicators */}
            {newPassword.length > 0 && (
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
                    {hasMinLength ? <Check size={12} /> : <X size={12} />} 8+ chars
                  </span>
                  <span style={{ color: hasUppercase ? "var(--color-success)" : "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                    {hasUppercase ? <Check size={12} /> : <X size={12} />} Uppercase
                  </span>
                  <span style={{ color: hasLowercase ? "var(--color-success)" : "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                    {hasLowercase ? <Check size={12} /> : <X size={12} />} Lowercase
                  </span>
                  <span style={{ color: hasNumber && hasSpecial ? "var(--color-success)" : "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                    {hasNumber && hasSpecial ? <Check size={12} /> : <X size={12} />} Number & symbol
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirm-new-password" className="form-label">
              Confirm New Password
            </label>
            <div className="input-wrapper">
              <span className="input-leading-icon"><Lock size={18} /></span>
              <input
                id="confirm-new-password"
                type={showPassword ? "text" : "password"}
                className="form-input"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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

          <div style={{ display: "flex", gap: "1rem", marginTop: "1.75rem" }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setStep(1)}
              style={{ flex: 1 }}
            >
              Back
            </button>
            <button
              type="submit"
              className="btn-primary"
              id="btn-reset-password-action"
              disabled={isLoading}
              style={{ flex: 2 }}
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Updating password...</span>
                </>
              ) : (
                <span>Set New Password</span>
              )}
            </button>
          </div>
        </form>
      )}

      {/* STEP 3: Password Reset Status Component */}
      {step === 3 && (
        <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              backgroundColor: "rgba(34, 197, 94, 0.15)",
              color: "var(--color-success)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.5rem",
              border: "2px solid var(--color-success)",
            }}
          >
            <Check size={36} strokeWidth={2.5} />
          </div>

          <h2 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: "0.5rem" }}>
            Password Reset Successful
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginBottom: "2rem" }}>
            Your account credentials have been updated securely. You can now use your new password to sign in.
          </p>

          <Link href="/login" className="btn-primary" style={{ textDecoration: "none" }}>
            <span>Proceed to Login</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      )}
    </div>
  );
}

