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

