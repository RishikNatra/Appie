"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  User,
  Stethoscope,
  Pill,
  Truck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Shield,
  Loader2,
  Sparkles,
} from "lucide-react";

type RoleType = "patient" | "health_professional" | "pharmacist" | "delivery_partner";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Role from query (?role=health_professional | pharmacist | delivery_partner | patient)
  const roleParam = searchParams.get("role") as RoleType | null;
  const initialRole: RoleType =
    roleParam === "health_professional" || roleParam === "pharmacist" || roleParam === "delivery_partner"
      ? roleParam
      : "patient";

  const [selectedRole, setSelectedRole] = useState<RoleType>(initialRole);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleRoleChange = (newRole: RoleType) => {
    setSelectedRole(newRole);
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleQuickDemoFill = (role: RoleType) => {
    setSelectedRole(role);
    if (role === "patient") {
      setIdentifier("patient@appie.health");
    } else if (role === "health_professional") {
      setIdentifier("doctor@appie.health");
    } else if (role === "pharmacist") {
      setIdentifier("pharmacist@appie.health");
    } else if (role === "delivery_partner") {
      setIdentifier("delivery@appie.health");
    }
    setPassword("Password123!");
    setErrorMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: selectedRole,
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
        router.push(data.redirectTo || (selectedRole === "patient" ? "/patient/home" : "/professional/home"));
        router.refresh();
      }, 700);
    } catch {
      setErrorMessage("Network error. Please check your connection and try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-card" style={{ maxWidth: "560px", width: "100%" }}>
      <Link href="/" className="back-link" aria-label="Go back to Home">
        <ArrowLeft size={18} />
        <span>Back to Home</span>
      </Link>

      <div className="auth-header">
        <div className="auth-role-badge">
          {selectedRole === "patient" && (
            <>
              <User size={16} color="var(--color-accent)" />
              <span>Patient Portal</span>
            </>
          )}
          {selectedRole === "health_professional" && (
            <>
              <Stethoscope size={16} color="var(--color-accent)" />
              <span>Doctor Portal</span>
            </>
          )}
          {selectedRole === "pharmacist" && (
            <>
              <Pill size={16} color="var(--color-accent)" />
              <span>Pharmacy Network</span>
            </>
          )}
          {selectedRole === "delivery_partner" && (
            <>
              <Truck size={16} color="var(--color-accent)" />
              <span>Delivery Fleet</span>
            </>
          )}
        </div>

        <h1 className="auth-title">Sign In to Appie</h1>
        <p className="auth-subtitle">
          Access your digital assessments, clinical reviews, pharmacy inventory, or delivery routes securely.
        </p>
      </div>

      {/* Role Selection Tabs */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "0.35rem",
          backgroundColor: "var(--bg-surface)",
          padding: "0.35rem",
          borderRadius: "14px",
          border: "1px solid var(--border-subtle)",
          marginBottom: "1.5rem",
        }}
        role="tablist"
      >
        <button
          type="button"
          className={`slot-btn ${selectedRole === "patient" ? "active" : ""}`}
          onClick={() => handleRoleChange("patient")}
          style={{ minHeight: "44px", fontSize: "0.8rem", borderRadius: "10px" }}
        >
          <span>Patient</span>
        </button>

        <button
          type="button"
          className={`slot-btn ${selectedRole === "health_professional" ? "active" : ""}`}
          onClick={() => handleRoleChange("health_professional")}
          style={{ minHeight: "44px", fontSize: "0.8rem", borderRadius: "10px" }}
        >
          <span>Doctor</span>
        </button>

        <button
          type="button"
          className={`slot-btn ${selectedRole === "pharmacist" ? "active" : ""}`}
          onClick={() => handleRoleChange("pharmacist")}
          style={{ minHeight: "44px", fontSize: "0.8rem", borderRadius: "10px" }}
        >
          <span>Pharmacy</span>
        </button>

        <button
          type="button"
          className={`slot-btn ${selectedRole === "delivery_partner" ? "active" : ""}`}
          onClick={() => handleRoleChange("delivery_partner")}
          style={{ minHeight: "44px", fontSize: "0.8rem", borderRadius: "10px" }}
        >
          <span>Delivery</span>
        </button>
      </div>

      {/* Quick Demo Credentials Pill Bar for Testing */}
      <div style={{ marginBottom: "1.25rem", padding: "0.6rem 0.85rem", backgroundColor: "var(--color-primary-subtle)", borderRadius: "10px", border: "1px solid rgba(255, 178, 0, 0.25)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.78rem", color: "var(--color-accent)", fontWeight: 700 }}>
          <Sparkles size={14} />
          <span>Demo 1-Click Fill:</span>
        </div>
        <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => handleQuickDemoFill("patient")}
            style={{ fontSize: "0.74rem", padding: "0.2rem 0.55rem", borderRadius: "6px", background: "var(--bg-card)", border: "1px solid var(--border-medium)", color: "var(--text-primary)", cursor: "pointer" }}
          >
            Patient
          </button>
          <button
            type="button"
            onClick={() => handleQuickDemoFill("health_professional")}
            style={{ fontSize: "0.74rem", padding: "0.2rem 0.55rem", borderRadius: "6px", background: "var(--bg-card)", border: "1px solid var(--border-medium)", color: "var(--text-primary)", cursor: "pointer" }}
          >
            Doctor
          </button>
          <button
            type="button"
            onClick={() => handleQuickDemoFill("pharmacist")}
            style={{ fontSize: "0.74rem", padding: "0.2rem 0.55rem", borderRadius: "6px", background: "var(--bg-card)", border: "1px solid var(--border-medium)", color: "var(--text-primary)", cursor: "pointer" }}
          >
            Pharmacist
          </button>
          <button
            type="button"
            onClick={() => handleQuickDemoFill("delivery_partner")}
            style={{ fontSize: "0.74rem", padding: "0.2rem 0.55rem", borderRadius: "6px", background: "var(--bg-card)", border: "1px solid var(--border-medium)", color: "var(--text-primary)", cursor: "pointer" }}
          >
            Delivery
          </button>
        </div>
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
        <div className="form-group" style={{ marginBottom: "1rem" }}>
          <label className="form-label" htmlFor="login-identifier">
            Email Address or Username
          </label>
          <div style={{ position: "relative" }}>
            <input
              id="login-identifier"
              type="text"
              className="form-input"
              placeholder="e.g. name@appie.health or username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              style={{ paddingLeft: "40px" }}
            />
            <Mail
              size={18}
              style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}
            />
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: "1.25rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
            <label className="form-label" htmlFor="login-password" style={{ marginBottom: 0 }}>
              Password
            </label>
            <Link href="/forgot-password" className="form-link" style={{ fontSize: "0.82rem" }}>
              Forgot password?
            </Link>
          </div>
          <div style={{ position: "relative" }}>
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              className="form-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ paddingLeft: "40px", paddingRight: "40px" }}
            />
            <Lock
              size={18}
              style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}
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

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "0.88rem", color: "var(--text-secondary)" }}>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{ accentColor: "var(--color-accent)", width: "16px", height: "16px" }}
            />
            <span>Remember me</span>
          </label>
        </div>

        <button
          type="submit"
          className="btn-primary"
          style={{ width: "100%", minHeight: "52px", fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem" }}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Authenticating...</span>
            </>
          ) : (
            <span>Sign In</span>
          )}
        </button>
      </form>

      {/* Registration Prompt Link */}
      <div style={{ textAlign: "center", marginTop: "1.75rem", paddingTop: "1.25rem", borderTop: "1px solid var(--border-subtle)" }}>
        <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
          Don&apos;t have an account yet?{" "}
        </span>
        {selectedRole === "patient" ? (
          <Link href="/register?role=patient" className="form-link" style={{ fontWeight: 700, fontSize: "0.9rem" }}>
            Register as Patient
          </Link>
        ) : (
          <Link href="/healthcare-registration" className="form-link" style={{ fontWeight: 700, fontSize: "0.9rem" }}>
            Register as Healthcare Partner
          </Link>
        )}
      </div>
    </div>
  );
}
