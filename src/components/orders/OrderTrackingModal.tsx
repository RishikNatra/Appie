"use client";

import { useState } from "react";
import { PharmacyOrder, OrderStatus } from "@/lib/types";
import {
  X,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Package,
  ShieldCheck,
  Phone,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";

interface OrderTrackingModalProps {
  order: PharmacyOrder | null;
  onClose: () => void;
  onOrderUpdated?: () => void;
}

export default function OrderTrackingModal({
  order,
  onClose,
  onOrderUpdated,
}: OrderTrackingModalProps) {
  const [currentOrder, setCurrentOrder] = useState<PharmacyOrder | null>(order);
  const [isAdvancing, setIsAdvancing] = useState(false);

  if (!currentOrder) return null;

  const nextStageMap: Record<OrderStatus, OrderStatus | null> = {
    placed: "pharmacist_verified",
    pharmacist_verified: "packed",
    packed: "dispatched",
    dispatched: "out_for_delivery",
    out_for_delivery: "delivered",
    delivered: null,
    cancelled: null,
  };

  const nextStatus = nextStageMap[currentOrder.orderStatus];

  const handleSimulateAdvance = async () => {
    if (!nextStatus) return;
    setIsAdvancing(true);
    try {
      const res = await fetch(`/api/orders/${currentOrder.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "advance", status: nextStatus }),
      });
      const data = await res.json();
      if (res.ok && data.order) {
        setCurrentOrder(data.order);
        if (onOrderUpdated) onOrderUpdated();
      }
    } catch (err) {
      console.warn("Failed to advance stage:", err);
    } finally {
      setIsAdvancing(false);
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

        {/* Modal Header */}
        <div style={{ marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--color-accent)", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.25rem" }}>
            <Truck size={16} /> Live Medicine Delivery Tracking
          </div>
          <h2 style={{ fontSize: "1.35rem", fontWeight: 800 }}>
            Order {currentOrder.orderCode}
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
            Express delivery via {currentOrder.courierPartner} • Tracking AWB: <strong>{currentOrder.trackingNumber}</strong>
          </p>
        </div>

        {/* ETA & Status Banner */}
        <div
          style={{
            background: "var(--bg-surface)",
            padding: "1rem 1.25rem",
            borderRadius: "10px",
            border: "1px solid var(--border-subtle)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "0.75rem",
            marginBottom: "1.5rem",
          }}
        >
          <div>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block" }}>
              Estimated Delivery
            </span>
            <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--color-accent)" }}>
              {new Date(currentOrder.estimatedDelivery).toLocaleDateString("en-IN", {
                weekday: "short",
                day: "numeric",
                month: "short",
              })} (Within 24 Hours)
            </span>
          </div>

          <div>
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                padding: "3px 10px",
                borderRadius: "12px",
                background: currentOrder.orderStatus === "delivered" ? "var(--color-success-bg)" : "rgba(255, 178, 0, 0.15)",
                color: currentOrder.orderStatus === "delivered" ? "var(--color-success)" : "var(--color-accent)",
                textTransform: "capitalize",
              }}
            >
              {currentOrder.orderStatus.replace(/_/g, " ")}
            </span>
          </div>
        </div>

        {/* Live Map Tracking Simulation */}
        <div style={{ marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.6rem" }}>
            <h4 style={{ fontSize: "0.95rem", fontWeight: 700 }}>Live Transit Map & Courier Beacon</h4>
            <span style={{ fontSize: "0.75rem", color: "var(--color-success)", fontWeight: 600 }}>● Live Telemetry (GPS Active)</span>
          </div>

          <div
            style={{
              width: "100%",
              height: "190px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #091014 0%, #111a22 100%)",
              border: "1.5px solid var(--border-medium)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <svg width="100%" height="100%" viewBox="0 0 600 190" preserveAspectRatio="none">
              <path d="M 40 95 L 180 95 L 180 40 L 400 40 L 400 140 L 560 140" fill="none" stroke="#1e293b" strokeWidth="10" strokeLinecap="round" />
              <path d="M 40 95 L 180 95 L 180 40 L 320 40" fill="none" stroke="#00e5a3" strokeWidth="4" strokeLinecap="round" strokeDasharray="6 4" />
              
              {/* Origin */}
              <circle cx="40" cy="95" r="9" fill="#00e5a3" />
              <text x="40" y="125" fill="#00e5a3" fontSize="10" fontWeight="700" textAnchor="middle">Indiranagar Pharmacy</text>

              {/* Courier Rider */}
              <circle cx="320" cy="40" r="14" fill="#ffe600" opacity="0.3" className="animate-ping" />
              <circle cx="320" cy="40" r="7" fill="#ffe600" />
              <text x="320" y="24" fill="#ffe600" fontSize="11" fontWeight="700" textAnchor="middle">🛵 Courier Fleet</text>

              {/* Destination */}
              <circle cx="560" cy="140" r="9" fill="#ef4444" />
              <text x="560" y="170" fill="#ef4444" fontSize="10" fontWeight="700" textAnchor="middle">Your Address</text>
            </svg>

            <div style={{ position: "absolute", bottom: "10px", left: "12px", background: "rgba(0,0,0,0.75)", padding: "4px 8px", borderRadius: "6px", fontSize: "0.72rem", color: "#f4f4f5" }}>
              Carrier: {currentOrder.courierPartner || "Express Healthcare Logistics"} • Contact: +91 97410 99882
            </div>
          </div>
        </div>

        {/* Live Step Tracker Timeline */}
        <div style={{ marginBottom: "1.75rem" }}>
          <h4 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "1rem" }}>
            Delivery Milestones
          </h4>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", position: "relative", paddingLeft: "1.5rem" }}>
            {/* Timeline vertical guide bar */}
            <div
              style={{
                position: "absolute",
                top: "12px",
                bottom: "12px",
                left: "7px",
                width: "2px",
                background: "var(--border-subtle)",
              }}
            />

            {currentOrder.trackingTimeline.map((step, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "1rem",
                  position: "relative",
                }}
              >
                {/* Node icon */}
                <div
                  style={{
                    position: "absolute",
                    left: "-1.5rem",
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    background: step.isCompleted ? "var(--color-success)" : step.isCurrent ? "var(--color-accent)" : "var(--bg-card)",
                    border: "2px solid var(--border-medium)",
                    boxShadow: step.isCurrent ? "0 0 10px var(--color-accent)" : "none",
                    marginTop: "2px",
                  }}
                />

                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <strong style={{ fontSize: "0.88rem", color: step.isCompleted || step.isCurrent ? "var(--text-primary)" : "var(--text-muted)" }}>
                      {step.title}
                    </strong>
                    {step.timestamp && (
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                        {step.timestamp}
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                    {step.description} {step.location && `• ${step.location}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Address & Items Summary */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "1rem",
            marginBottom: "1.5rem",
          }}
        >
          <div style={{ border: "1px solid var(--border-subtle)", borderRadius: "10px", padding: "1rem" }}>
            <h5 style={{ fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.4rem", display: "flex", alignItems: "center", gap: "6px" }}>
              <MapPin size={15} color="var(--color-accent)" /> Delivery Address
            </h5>
            <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>
              <div><strong>{currentOrder.deliveryAddress.fullName}</strong></div>
              <div>{currentOrder.deliveryAddress.addressLine1}</div>
              {currentOrder.deliveryAddress.addressLine2 && <div>{currentOrder.deliveryAddress.addressLine2}</div>}
              <div>{currentOrder.deliveryAddress.city}, {currentOrder.deliveryAddress.state} - {currentOrder.deliveryAddress.pincode}</div>
              <div>Phone: {currentOrder.deliveryAddress.phone}</div>
            </div>
          </div>

          <div style={{ border: "1px solid var(--border-subtle)", borderRadius: "10px", padding: "1rem" }}>
            <h5 style={{ fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.4rem", display: "flex", alignItems: "center", gap: "6px" }}>
              <Package size={15} color="var(--color-accent)" /> Package Summary ({currentOrder.items.length} items)
            </h5>
            <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              {currentOrder.items.map((it, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>{it.quantity}x {it.medicineName}</span>
                  <span>₹{it.totalPrice.toFixed(2)}</span>
                </div>
              ))}
              <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "0.3rem", marginTop: "0.2rem", display: "flex", justifyContent: "space-between", fontWeight: 700 }}>
                <span>Paid via {currentOrder.paymentMethod.toUpperCase()}</span>
                <span style={{ color: "var(--color-accent)" }}>₹{currentOrder.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions & Simulation Trigger */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
          {nextStatus && (
            <button
              type="button"
              onClick={handleSimulateAdvance}
              disabled={isAdvancing}
              className="btn-secondary"
              style={{ minHeight: "44px", fontSize: "0.82rem", padding: "0 0.85rem" }}
              title="Advances package delivery stage for demo testing"
            >
              <RotateCcw size={14} />
              <span>Simulate Next Stage ({nextStatus.replace(/_/g, " ")})</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="btn-primary"
            style={{ minHeight: "48px", padding: "0 1.5rem", marginLeft: "auto" }}
          >
            Close Tracker
          </button>
        </div>
      </div>
    </div>
  );
}

