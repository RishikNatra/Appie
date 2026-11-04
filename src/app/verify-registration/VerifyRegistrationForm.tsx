"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  Mail,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Loader2,
  RefreshCw,
  Clock,
} from "lucide-react";

export default function VerifyRegistrationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const emailParam = searchParams.get("email") || "patient@appie.health";
  const roleParam = searchParams.get("role") || "patient";

  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [cooldown, setCooldown] = useState(60);
  const [isResending, setIsResending] = useState(false);

  // Timer countdown
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

    // Auto advance focus
    if (cleanVal && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, 6);
    if (!pasted) return;

    const newDigits = [...digits];
    for (let i = 0; i < 6; i++) {
      newDigits[i] = pasted[i] || "";
    }
    setDigits(newDigits);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const code = digits.join("");

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (code.length !== 6) {
      setErrorMessage("Please enter all 6 digits of your verification code.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: emailParam,
          code,
          type: "registration",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Verification failed. Please check the code and retry.");
        setIsLoading(false);
        return;
      }

      setSuccessMessage("Account successfully verified! Redirecting to your healthcare portal...");
      setTimeout(() => {
        router.push(data.redirectTo || (roleParam === "health_professional" ? "/professional/verify-status" : "/patient/home"));
        router.refresh();
      }, 700);
    } catch {
      setErrorMessage("Network error during verification. Please try again.");
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
          identifier: emailParam,
          type: "registration",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || "Failed to resend verification code.");
      } else {
        setSuccessMessage(data.message || "A new 6-digit verification code has been dispatched.");
        setCooldown(60);
      }
    } catch {
      setErrorMessage("Unable to resend code right now.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="auth-card" style={{ maxWidth: "520px" }}>
      <div className="auth-header">
        <div className="auth-role-badge">
          <ShieldCheck size={16} color="var(--color-accent)" />
          <span>Account Security Verification</span>
        </div>

        <h1 className="auth-title">Verify Your Contact</h1>

        {/* Verification Status Component */}
        <p className="auth-subtitle">
          We have sent a 6-digit verification code to{" "}
          <strong style={{ color: "var(--text-primary)" }}>{emailParam}</strong>. Please enter the code below to activate your account.
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

      <form onSubmit={handleVerify}>
        {/* Verification Code Component */}
        <div className="form-group" style={{ margin: "2rem 0" }}>
          <label className="form-label" style={{ textAlign: "center", display: "block" }}>
            Enter 6-Digit Verification Code
          </label>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "0.6rem",
              marginTop: "0.75rem",
            }}
            onPaste={handlePaste}
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
                aria-label={`Digit ${idx + 1}`}
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
          id="btn-verify-action"
          disabled={isLoading || code.length !== 6}
          style={{ minHeight: "48px" }}
        >
          {isLoading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Verifying code...</span>
            </>
          ) : (
            <>
              <span>Verify & Continue</span>
              <ArrowRight size={18} />
            </>
          )}
        </button>

        {/* Code Resend Component */}
        <div
          style={{
            marginTop: "1.75rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "0.9rem",
          }}
        >
          {cooldown > 0 ? (
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--text-muted)" }}>
              <Clock size={16} />
              <span>Resend code available in <strong>{cooldown}s</strong></span>
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
                minHeight: "48px",
              }}
            >
              {isResending ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
              <span>Resend Verification Code</span>
            </button>
          )}

          <Link
            href="/login"
            className="form-link"
            style={{ fontSize: "0.85rem", color: "var(--text-secondary)", minHeight: "auto" }}
          >
            Return to Login
          </Link>
        </div>
      </form>
    </div>
  );
}

