"use client";

import { useState } from "react";
import { MedicationItem } from "@/lib/types";
import {
  X,
  Pill,
  ShieldAlert,
  Info,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Package,
  Plus,
  Minus,
  ShoppingCart,
} from "lucide-react";

interface MedicationDetailModalProps {
  medication: MedicationItem | null;
  onClose: () => void;
  onAddToCart: (medication: MedicationItem, quantity: number) => void;
}

export default function MedicationDetailModal({
  medication,
  onClose,
  onAddToCart,
}: MedicationDetailModalProps) {
  const [quantity, setQuantity] = useState(1);

  if (!medication) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999,
        background: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <div
        className="dashboard-card"
        style={{
          width: "100%",
          maxWidth: "640px",
          maxHeight: "90vh",
          overflowY: "auto",
          padding: "2rem",
          position: "relative",
          animation: "fadeIn 250ms ease",
        }}
      >
        <button
          type="button"
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1.25rem",
            right: "1.25rem",
            background: "transparent",
            border: "none",
            color: "var(--text-secondary)",
            cursor: "pointer",
            minHeight: "44px",
            minWidth: "44px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-label="Close"
        >
          <X size={22} />
        </button>

        {/* Medication Overview Component */}
        <div style={{ marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
            <span
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: "10px",
                background: medication.prescriptionRequired ? "var(--color-error-bg)" : "var(--color-success-bg)",
                color: medication.prescriptionRequired ? "var(--color-error)" : "var(--color-success)",
              }}
            >
              {medication.prescriptionRequired ? "Prescription (Rx) Required" : "Over-The-Counter (OTC)"}
            </span>
            <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
              {medication.dosageForm} • {medication.strength}
            </span>
          </div>

          <h2 style={{ fontSize: "1.45rem", fontWeight: 800, marginBottom: "0.2rem" }}>
            {medication.name}
          </h2>
          <p style={{ color: "var(--color-accent)", fontWeight: 600, fontSize: "0.92rem" }}>
            Salt Composition: {medication.genericName}
          </p>
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
            Manufactured by {medication.manufacturer} • {medication.packSize}
          </p>
        </div>

        {/* Price & Availability Component */}
        <div
          style={{
            background: "var(--bg-surface)",
            borderRadius: "10px",
            padding: "1rem",
            marginBottom: "1.5rem",
            border: "1px solid var(--border-subtle)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", display: "block" }}>
              MRP (inclusive of taxes)
            </span>
            <span style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--color-accent)" }}>
              ₹{Number(medication.price || 0).toFixed(2)}
            </span>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block" }}>
              Per {medication.packSize}
            </span>
          </div>

          <div style={{ textAlign: "right" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "0.82rem",
                fontWeight: 700,
                color: medication.inStock ? "var(--color-success)" : "var(--color-error)",
              }}
            >
              <CheckCircle2 size={16} /> {medication.inStock ? "In Stock for Fast Delivery" : "Temporarily Out of Stock"}
            </span>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block" }}>
              Express 24-hr Pharmacy Dispatch
            </span>
          </div>
        </div>

        {/* Usage Information Component */}
        <div style={{ border: "1px solid var(--border-subtle)", borderRadius: "10px", padding: "1rem", marginBottom: "1rem" }}>
          <h4 style={{ fontSize: "0.88rem", fontWeight: 700, marginBottom: "0.4rem", display: "flex", alignItems: "center", gap: "6px" }}>
            <Info size={16} color="var(--color-accent)" /> Usage & Directions
          </h4>
          <p style={{ fontSize: "0.85rem", lineHeight: 1.5, color: "var(--text-secondary)" }}>
            {medication.usageInstructions}
          </p>
        </div>

        {/* Safety & Warning Component */}
        <div
          style={{
            background: "rgba(239, 68, 68, 0.08)",
            border: "1px solid var(--color-error)",
            borderRadius: "10px",
            padding: "1rem",
            marginBottom: "1rem",
          }}
        >
          <h4 style={{ fontSize: "0.88rem", fontWeight: 700, marginBottom: "0.4rem", display: "flex", alignItems: "center", gap: "6px", color: "var(--color-error)" }}>
            <AlertTriangle size={16} /> Safety & Clinical Warnings
          </h4>
          <p style={{ fontSize: "0.82rem", lineHeight: 1.5, color: "var(--text-primary)" }}>
            {medication.safetyWarnings}
          </p>
          {medication.sideEffects.length > 0 && (
            <div style={{ marginTop: "0.5rem", fontSize: "0.78rem", color: "var(--text-secondary)" }}>
              <strong>Possible Side Effects:</strong> {medication.sideEffects.join(", ")}
            </div>
          )}
        </div>

        {/* Medication Selection Component (Quantity & Add to Cart) */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "1.5rem",
            paddingTop: "1.25rem",
            borderTop: "1px solid var(--border-subtle)",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          {/* Quantity Selector */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>Qty:</span>
            <div style={{ display: "inline-flex", alignItems: "center", border: "1px solid var(--border-subtle)", borderRadius: "8px" }}>
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{
                  background: "transparent",
                  border: "none",
                  padding: "0.5rem",
                  cursor: "pointer",
                  color: "var(--text-primary)",
                  minHeight: "44px",
                  minWidth: "44px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                aria-label="Decrease quantity"
              >
                <Minus size={16} />
              </button>
              <span style={{ padding: "0 0.75rem", fontWeight: 700, fontSize: "0.95rem" }}>{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                style={{
                  background: "transparent",
                  border: "none",
                  padding: "0.5rem",
                  cursor: "pointer",
                  color: "var(--text-primary)",
                  minHeight: "44px",
                  minWidth: "44px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                aria-label="Increase quantity"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              style={{ minHeight: "48px", padding: "0 1.25rem" }}
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onAddToCart(medication, quantity);
                onClose();
              }}
              className="btn-primary"
              style={{ minHeight: "48px", padding: "0 1.5rem" }}
            >
              <ShoppingCart size={17} />
              <span>Add to Cart (₹{(Number(medication.price || 0) * quantity).toFixed(2)})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

