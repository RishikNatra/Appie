"use client";

import { useState } from "react";
import { MedicationCartItem } from "@/lib/types";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  Truck,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

interface MedicationCartComponentProps {
  items: MedicationCartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  freeDeliveryThreshold: number;
  onUpdateQuantity: (cartItemId: string, quantity: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
  onContinueShopping: () => void;
  onProceedToCheckout?: () => void;
}

export default function MedicationCartComponent({
  items,
  subtotal,
  deliveryFee,
  total,
  freeDeliveryThreshold,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onContinueShopping,
  onProceedToCheckout,
}: MedicationCartComponentProps) {
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");

  const hasPrescriptionItems = items.some((item) => item.medication.prescriptionRequired);

  const handlePlaceOrder = () => {
    const generatedId = "ORD-" + Date.now().toString().slice(-6);
    setOrderId(generatedId);
    setOrderPlaced(true);
    onClearCart();
  };

  if (orderPlaced) {
    return (
      <div
        className="dashboard-card"
        style={{
          textAlign: "center",
          padding: "3.5rem 1.5rem",
          maxWidth: "600px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            background: "var(--color-success-bg)",
            color: "var(--color-success)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.25rem",
          }}
        >
          <CheckCircle2 size={36} />
        </div>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "0.5rem" }}>
          Pharmacy Order Placed Successfully!
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", marginBottom: "1rem" }}>
          Order reference: <strong style={{ color: "var(--color-accent)" }}>#{orderId}</strong>
        </p>
        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "2rem", lineHeight: 1.5 }}>
          Your medications are being verified and packed by our licensed pharmacy partner. You will receive an SMS and tracking update upon dispatch.
        </p>

        <button
          type="button"
          onClick={() => {
            setOrderPlaced(false);
            onContinueShopping();
          }}
          className="btn-primary"
          style={{ minHeight: "48px", padding: "0 1.5rem" }}
        >
          Return to Pharmacy Catalog
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div
        className="dashboard-card"
        style={{ textAlign: "center", padding: "3.5rem 1.5rem", maxWidth: "600px", margin: "0 auto" }}
      >
        <ShoppingCart size={48} color="var(--text-muted)" style={{ margin: "0 auto 1rem" }} />
        <h3 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "0.5rem" }}>
          Your Pharmacy Cart is Empty
        </h3>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", marginBottom: "1.5rem" }}>
          Explore our verified medicines catalog or transfer medications directly from your consultation e-prescriptions.
        </p>
        <button
          type="button"
          onClick={onContinueShopping}
          className="btn-primary"
          style={{ minHeight: "48px", padding: "0 1.5rem" }}
        >
          Browse Medication Catalog
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
      {/* Left: Selected Medication List Component */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 800 }}>
            Cart Items ({items.reduce((s, i) => s + i.quantity, 0)})
          </h3>
          <button
            type="button"
            onClick={onClearCart}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--color-error)",
              fontSize: "0.82rem",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <Trash2 size={14} /> Clear Cart
          </button>
        </div>

        {/* Prescription Requirement Component Alert */}
        {hasPrescriptionItems && (
          <div
            style={{
              padding: "1rem",
              borderRadius: "10px",
              background: "rgba(255, 178, 0, 0.12)",
              border: "1px solid var(--border-accent)",
              display: "flex",
              alignItems: "flex-start",
              gap: "10px",
              fontSize: "0.85rem",
            }}
          >
            <FileCheck size={18} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: "2px" }} />
            <div>
              <strong style={{ color: "var(--color-accent)" }}>Prescription Requirement:</strong>
              <p style={{ color: "var(--text-primary)", fontSize: "0.82rem", marginTop: "2px" }}>
                Some items in your cart require a valid prescription. Validated e-prescription from your Appie consultation (#RX-2026-8812A) is linked for clinical dispensing approval.
              </p>
            </div>
          </div>
        )}

        {/* Medication List Items */}
        {items.map((item) => (
          <div
            key={item.id}
            className="dashboard-card"
            style={{
              padding: "1.25rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div style={{ flex: "1 1 240px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.2rem" }}>
                <span
                  style={{
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    padding: "2px 6px",
                    borderRadius: "6px",
                    background: item.medication.prescriptionRequired ? "var(--color-error-bg)" : "var(--color-success-bg)",
                    color: item.medication.prescriptionRequired ? "var(--color-error)" : "var(--color-success)",
                  }}
                >
                  {item.medication.prescriptionRequired ? "Rx Required" : "OTC"}
                </span>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  {item.medication.dosageForm} • {item.medication.strength}
                </span>
              </div>

              <h4 style={{ fontSize: "1.05rem", fontWeight: 700 }}>{item.medication.name}</h4>
              <p style={{ color: "var(--color-accent)", fontSize: "0.8rem", fontWeight: 600 }}>
                {item.medication.genericName}
              </p>
              <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                ₹{item.medication.price.toFixed(2)} per pack
              </p>
            </div>

            {/* Quantity Component */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ display: "inline-flex", alignItems: "center", border: "1px solid var(--border-subtle)", borderRadius: "8px" }}>
                <button
                  type="button"
                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                  style={{
                    background: "transparent",
                    border: "none",
                    padding: "0.4rem",
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
                  <Minus size={15} />
                </button>
                <span style={{ padding: "0 0.75rem", fontWeight: 700, fontSize: "0.95rem" }}>
                  {item.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  style={{
                    background: "transparent",
                    border: "none",
                    padding: "0.4rem",
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
                  <Plus size={15} />
                </button>
              </div>

              <div style={{ textAlign: "right", minWidth: "80px" }}>
                <div style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--color-accent)" }}>
                  ₹{(item.medication.price * item.quantity).toFixed(2)}
                </div>
              </div>

              <button
                type="button"
                onClick={() => onRemoveItem(item.id)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  padding: "0.5rem",
                  minHeight: "44px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                title="Remove item"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Right: Order Summary & Cart Actions Component */}
      <div>
        <div
          className="dashboard-card"
          style={{
            padding: "1.75rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.25rem",
            position: "sticky",
            top: "20px",
          }}
        >
          <h3 style={{ fontSize: "1.2rem", fontWeight: 800 }}>Order Summary</h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.88rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-secondary)" }}>Items Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-secondary)" }}>Express Delivery Fee</span>
              <span>
                {deliveryFee === 0 ? (
                  <strong style={{ color: "var(--color-success)" }}>FREE</strong>
                ) : (
                  `₹${deliveryFee.toFixed(2)}`
                )}
              </span>
            </div>

            {deliveryFee > 0 && (
              <span style={{ fontSize: "0.75rem", color: "var(--color-accent)" }}>
                Add ₹{(freeDeliveryThreshold - subtotal).toFixed(2)} more for FREE delivery!
              </span>
            )}

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-secondary)" }}>Taxes & GST (Included)</span>
              <span>₹0.00</span>
            </div>

            <div
              style={{
                borderTop: "1px solid var(--border-subtle)",
                paddingTop: "0.75rem",
                display: "flex",
                justifyContent: "space-between",
                fontSize: "1.25rem",
                fontWeight: 800,
              }}
            >
              <span>Total Amount</span>
              <span style={{ color: "var(--color-accent)" }}>₹{total.toFixed(2)}</span>
            </div>
          </div>

          <div
            style={{
              background: "var(--bg-surface)",
              borderRadius: "8px",
              padding: "0.75rem 1rem",
              fontSize: "0.8rem",
              color: "var(--text-secondary)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Truck size={16} color="var(--color-accent)" />
            <span>Estimated Delivery: Within 24 Hours in Metro areas</span>
          </div>

          <button
            type="button"
            onClick={onProceedToCheckout || handlePlaceOrder}
            className="btn-primary"
            style={{ minHeight: "48px", width: "100%", fontSize: "0.95rem" }}
          >
            Proceed to Order (₹{total.toFixed(2)})
          </button>

          <button
            type="button"
            onClick={onContinueShopping}
            className="btn-secondary"
            style={{ minHeight: "48px", width: "100%", fontSize: "0.88rem" }}
          >
            Add More Medications
          </button>
        </div>
      </div>
    </div>
  );
}

