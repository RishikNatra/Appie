"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ShieldAlert,
  Smartphone,
  Mail,
  KeyRound,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Clock,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";

export default function TwoFactorForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const identifier = searchParams.get("identifier") || "doctor@appie.health";
  const role = searchParams.get("role") || "health_professional";

  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Authentication Method Component
  const [authMethod, setAuthMethod] = useState<"email" | "sms" | "authenticator">("email");
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [backupCode, setBackupCode] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [cooldown, setCooldown] = useState(45);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleDigitChange = (index: number, val: string) => {
    const cleanVal = val.replace(/[^0-9]/g, "").slice(-1);
    const newDigits = [...digits];
    newDigits[index] = cleanVal;
    setDigits(newDigits);

    if (cleanVal && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const code = digits.join("");

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (code.length !== 6) {
      setErrorMessage("Please enter all 6 digits of the 2FA authentication code.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier,
          code,
          method: authMethod,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "2FA code verification failed.");
        setIsLoading(false);
        return;
      }

      setSuccessMessage("Identity verified! Redirecting to your healthcare dashboard...");
      setTimeout(() => {
        router.push(data.redirectTo || (role === "health_professional" ? "/professional/home" : "/patient/home"));
        router.refresh();
      }, 700);
    } catch {
      setErrorMessage("Network error during two-factor verification.");
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || isResending) return;
    setIsResending(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/auth/resend-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier,
          type: "two_factor",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || "Failed to resend code.");
      } else {
        setSuccessMessage("A fresh 2FA code has been dispatched to your device.");
        setCooldown(60);
      }
    } catch {
      setErrorMessage("Unable to resend 2FA code right now.");
    } finally {
      setIsResending(false);
    }
  };

  const handleBackupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (backupCode.trim().length >= 8) {
      setSuccessMessage("Backup code accepted. Access granted.");
      setTimeout(() => {
        router.push(role === "health_professional" ? "/professional/home" : "/patient/home");
        router.refresh();
      }, 700);
    } else {
      setErrorMessage("Invalid 8-character backup recovery code.");
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
          <ShieldAlert size={16} color="var(--color-accent)" />
          <span>Two-Factor Authentication</span>
        </div>

        <h1 className="auth-title">Verify Your Identity</h1>
        <p className="auth-subtitle">
          Your account is protected by two-factor security. Select your verification method and enter the 6-digit code.
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

      {/* Authentication Method Component */}
      <div style={{ marginBottom: "1.5rem" }}>
        <label className="form-label" style={{ marginBottom: "0.5rem", display: "block" }}>
          Authentication Method
        </label>
        <div className="radio-group-grid">
          <label className={`radio-pill-label ${authMethod === "email" ? "active" : ""}`}>
            <input
              type="radio"
              name="authMethod"
              checked={authMethod === "email"}
              onChange={() => setAuthMethod("email")}
              style={{ display: "none" }}
            />
            <Mail size={16} />
            <span>Email Code</span>
          </label>

          <label className={`radio-pill-label ${authMethod === "sms" ? "active" : ""}`}>
            <input
              type="radio"
              name="authMethod"
              checked={authMethod === "sms"}
              onChange={() => setAuthMethod("sms")}
              style={{ display: "none" }}
            />
            <Smartphone size={16} />
            <span>SMS OTP</span>
          </label>

          <label className={`radio-pill-label ${authMethod === "authenticator" ? "active" : ""}`}>
            <input
              type="radio"
              name="authMethod"
              checked={authMethod === "authenticator"}
              onChange={() => setAuthMethod("authenticator")}
              style={{ display: "none" }}
            />
            <KeyRound size={16} />
            <span>Authenticator App</span>
          </label>
        </div>
      </div>

      <form onSubmit={handleVerify}>
        {/* Verification Code Component */}
        <div className="form-group" style={{ margin: "1.5rem 0" }}>
          <label className="form-label" style={{ textAlign: "center", display: "block" }}>
            Enter 6-Digit 2FA Code
          </label>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "0.6rem",
              marginTop: "0.75rem",
            }}
          >
            {digits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  inputRefs.current[idx] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                style={{
                  width: "48px",
                  height: "56px",
                  textAlign: "center",
                  fontSize: "1.5rem",
                  fontWeight: 800,
                  borderRadius: "12px",
                  border: "1.5px solid var(--border-medium)",
                  backgroundColor: "var(--bg-input)",
                  color: "var(--text-primary)",
                  outline: "none",
                  transition: "all 250ms ease-in-out",
                }}
                className="form-input"
                disabled={isLoading}
              />
            ))}
          </div>

          <div
            style={{
              textAlign: "center",
              marginTop: "0.75rem",
              fontSize: "0.82rem",
              color: "var(--text-muted)",
            }}
          >
            Universal Demo Test Code: <span style={{ color: "var(--color-accent)", fontWeight: 700 }}>123456</span>
          </div>
        </div>

        {/* Verification Action Component */}
        <button
          type="submit"
          className="btn-primary"
          id="btn-2fa-verify"
          disabled={isLoading || code.length !== 6}
          style={{ minHeight: "48px" }}
        >
          {isLoading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Validating 2FA token...</span>
            </>
          ) : (
            <>
              <span>Verify & Access Account</span>
              <ArrowRight size={18} />
            </>
          )}
        </button>

        {/* Code Resend Component */}
        <div
          style={{
            marginTop: "1.5rem",
            display: "flex",
            justifyContent: "center",
            fontSize: "0.88rem",
          }}
        >
          {cooldown > 0 ? (
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--text-muted)" }}>
              <Clock size={16} />
              <span>Resend available in <strong>{cooldown}s</strong></span>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              style={{
                background: "none",
                border: "none",
                color: "var(--color-accent)",
                fontWeight: 700,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              {isResending ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
              <span>Resend 2FA Code</span>
            </button>
          )}
        </div>

        {/* Recovery Option Component */}
        <div
          style={{
            marginTop: "1.25rem",
            paddingTop: "1.25rem",
            borderTop: "1px solid var(--border-subtle)",
            textAlign: "center",
          }}
        >
          <button
            type="button"
            onClick={() => setShowBackupModal(!showBackupModal)}
            className="form-link"
            style={{ fontSize: "0.85rem", color: "var(--text-secondary)", minHeight: "auto" }}
          >
            Lost your device? Use backup recovery code
          </button>
        </div>
      </form>

      {/* Backup Code Modal / Inset Form */}
      {showBackupModal && (
        <form
          onSubmit={handleBackupSubmit}
          style={{
            marginTop: "1.25rem",
            padding: "1.25rem",
            borderRadius: "14px",
            backgroundColor: "var(--bg-surface)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <label className="form-label">Emergency Backup Recovery Code</label>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.75rem" }}>
            Enter your emergency 8-character alphanumeric recovery key (e.g. APPIE-9841)
          </p>
          <input
            type="text"
            className="form-input no-icon"
            placeholder="e.g. APPIE-9841"
            value={backupCode}
            onChange={(e) => setBackupCode(e.target.value)}
            style={{ marginBottom: "1rem" }}
          />
          <button type="submit" className="btn-secondary" style={{ width: "100%", minHeight: "44px" }}>
            Submit Recovery Code
          </button>
        </form>
      )}
    </div>
  );
}

