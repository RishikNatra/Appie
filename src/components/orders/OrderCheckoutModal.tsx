"use client";

import { useState } from "react";
import { DeliveryAddress, PaymentMethod, PharmacyOrder } from "@/lib/types";
import {
  X,
  MapPin,
  CreditCard,
  ShieldCheck,
  Tag,
  AlertCircle,
  Truck,
  CheckCircle2,
  FileCheck,
} from "lucide-react";

interface OrderCheckoutModalProps {
  subtotal: number;
  deliveryFee: number;
  itemCount: number;
  prescriptionId?: string;
  onClose: () => void;
  onSuccess: (order: PharmacyOrder) => void;
}

export default function OrderCheckoutModal({
  subtotal,
  deliveryFee,
  itemCount,
  prescriptionId,
  onClose,
  onSuccess,
}: OrderCheckoutModalProps) {
  // Address form
  const [fullName, setFullName] = useState("Aditya Verma");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [addressLine1, setAddressLine1] = useState("Flat 402, Green Glen Layout, Bellandur");
  const [addressLine2, setAddressLine2] = useState("Near EcoSpace Tech Park");
  const [city, setCity] = useState("Bengaluru");
  const [state, setState] = useState("Karnataka");
  const [pincode, setPincode] = useState("560103");

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("upi");
  const [upiId, setUpiId] = useState("aditya@okaxis");
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoMessage, setPromoMessage] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const applyPromo = () => {
    if (promoCode.trim().toUpperCase() === "APPIE50") {
      setDiscount(50);
      setPromoApplied(true);
      setPromoMessage("₹50 discount applied successfully!");
    } else {
      setDiscount(0);
      setPromoApplied(false);
      setPromoMessage("Invalid promo code. Try APPIE50.");
    }
  };

  const finalTotal = Math.max(0, subtotal + deliveryFee - discount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !addressLine1 || !city || !state || !pincode) {
      setErrorMsg("Please complete all required address fields.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deliveryAddress: {
            fullName,
            phone,
            addressLine1,
            addressLine2,
            city,
            state,
            pincode,
          },
          prescriptionId,
          paymentMethod,
          promoCode: promoApplied ? promoCode : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to place order");
      }

      onSuccess(data.order);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to process order");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999,
        background: "rgba(0, 0, 0, 0.8)",
        backdropFilter: "blur(6px)",
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
          maxWidth: "680px",
          maxHeight: "92vh",
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

        <h2 style={{ fontSize: "1.35rem", fontWeight: 800, marginBottom: "0.25rem" }}>
          Confirm Pharmacy Order & Checkout
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "1.25rem" }}>
          Ordering {itemCount} medicine items with Express 24-hr Doorstep Delivery
        </p>

        {errorMsg && (
          <div
            style={{
              padding: "0.75rem 1rem",
              borderRadius: "8px",
              background: "var(--color-error-bg)",
              color: "var(--color-error)",
              fontSize: "0.85rem",
              marginBottom: "1rem",
            }}
          >
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {/* Delivery Address Section */}
          <div>
            <h4 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "0.6rem", display: "flex", alignItems: "center", gap: "6px" }}>
              <MapPin size={16} color="var(--color-accent)" /> Delivery Address Details
            </h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
              <div>
                <label style={{ fontSize: "0.78rem", fontWeight: 600 }}>Recipient Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  style={{ minHeight: "44px" }}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.78rem", fontWeight: 600 }}>Contact Phone</label>
                <input
                  type="tel"
                  className="form-input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  style={{ minHeight: "44px" }}
                />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ fontSize: "0.78rem", fontWeight: 600 }}>Street Address / Flat / Floor</label>
                <input
                  type="text"
                  className="form-input"
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  required
                  style={{ minHeight: "44px" }}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.78rem", fontWeight: 600 }}>City</label>
                <input
                  type="text"
                  className="form-input"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  style={{ minHeight: "44px" }}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.78rem", fontWeight: 600 }}>Pincode (6 digits)</label>
                <input
                  type="text"
                  className="form-input"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  pattern="[0-9]{6}"
                  required
                  style={{ minHeight: "44px" }}
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <h4 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "0.6rem", display: "flex", alignItems: "center", gap: "6px" }}>
              <CreditCard size={16} color="var(--color-accent)" /> Select Payment Method
            </h4>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "0.5rem" }}>
              {[
                { id: "upi" as PaymentMethod, label: "UPI Instant (GPay/PhonePe)" },
                { id: "card" as PaymentMethod, label: "Credit / Debit Card" },
                { id: "netbanking" as PaymentMethod, label: "Net Banking" },
                { id: "cod" as PaymentMethod, label: "Cash on Delivery" },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPaymentMethod(m.id)}
                  style={{
                    padding: "0.65rem 0.5rem",
                    borderRadius: "8px",
                    fontSize: "0.8rem",
                    fontWeight: paymentMethod === m.id ? 700 : 500,
                    border: paymentMethod === m.id ? "1.5px solid var(--color-accent)" : "1px solid var(--border-subtle)",
                    background: paymentMethod === m.id ? "rgba(255, 178, 0, 0.12)" : "var(--bg-surface)",
                    color: paymentMethod === m.id ? "var(--color-accent)" : "var(--text-secondary)",
                    cursor: "pointer",
                    minHeight: "48px",
                    textAlign: "center",
                    transition: "all 250ms ease",
                  }}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {paymentMethod === "upi" && (
              <div style={{ marginTop: "0.75rem" }}>
                <label style={{ fontSize: "0.78rem", fontWeight: 600, display: "block", marginBottom: "0.25rem" }}>
                  Virtual Payment Address (UPI ID)
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="username@okhdfcbank"
                  style={{ minHeight: "44px" }}
                />
              </div>
            )}
          </div>

          {/* Promo Code Input */}
          <div>
            <label style={{ fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "0.3rem" }}>
              Have a Promo Code? (Use APPIE50 for ₹50 off)
            </label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                type="text"
                className="form-input"
                placeholder="Enter promo code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                style={{ minHeight: "44px", textTransform: "uppercase" }}
              />
              <button
                type="button"
                onClick={applyPromo}
                className="btn-secondary"
                style={{ minHeight: "44px", padding: "0 1rem", fontSize: "0.85rem" }}
              >
                Apply
              </button>
            </div>
            {promoMessage && (
              <span style={{ fontSize: "0.75rem", color: promoApplied ? "var(--color-success)" : "var(--color-error)", marginTop: "4px", display: "block" }}>
                {promoMessage}
              </span>
            )}
          </div>

          {/* Order Summary Breakdown */}
          <div
            style={{
              background: "var(--bg-surface)",
              borderRadius: "10px",
              padding: "1rem",
              border: "1px solid var(--border-subtle)",
              display: "flex",
              flexDirection: "column",
              gap: "0.35rem",
              fontSize: "0.85rem",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-secondary)" }}>Items Subtotal:</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-secondary)" }}>Express Delivery Fee:</span>
              <span>{deliveryFee === 0 ? <strong style={{ color: "var(--color-success)" }}>FREE</strong> : `₹${deliveryFee.toFixed(2)}`}</span>
            </div>
            {discount > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", color: "var(--color-accent)" }}>
                <span>Promo Discount:</span>
                <span>-₹{discount.toFixed(2)}</span>
              </div>
            )}
            <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "0.5rem", marginTop: "0.25rem", display: "flex", justifyContent: "space-between", fontSize: "1.15rem", fontWeight: 800 }}>
              <span>Total Payable:</span>
              <span style={{ color: "var(--color-accent)" }}>₹{finalTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              style={{ minHeight: "48px", padding: "0 1.25rem" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
              style={{ minHeight: "48px", padding: "0 1.5rem" }}
            >
              {isSubmitting ? "Processing Order..." : `Place Order (₹${finalTotal.toFixed(2)})`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

