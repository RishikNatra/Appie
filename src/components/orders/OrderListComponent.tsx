"use client";

import { useState } from "react";
import { PharmacyOrder, OrderStatus } from "@/lib/types";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  AlertTriangle,
  XCircle,
  FileCheck,
} from "lucide-react";

interface OrderListComponentProps {
  orders: PharmacyOrder[];
  onTrackOrder: (order: PharmacyOrder) => void;
  onRefresh: () => void;
}

export default function OrderListComponent({
  orders,
  onTrackOrder,
  onRefresh,
}: OrderListComponentProps) {
  const [activeTab, setActiveTab] = useState<"active" | "history">("active");

  const activeOrders = orders.filter((o) =>
    ["placed", "pharmacist_verified", "packed", "dispatched", "out_for_delivery"].includes(o.orderStatus)
  );
  const historyOrders = orders.filter((o) =>
    ["delivered", "cancelled"].includes(o.orderStatus)
  );

  const displayedOrders = activeTab === "active" ? activeOrders : historyOrders;

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to cancel this pharmacy order?")) return;
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "cancel", reason: "User requested cancellation" }),
      });
      if (res.ok) onRefresh();
    } catch (err) {
      alert("Failed to cancel order");
    }
  };

  const getStatusChip = (status: OrderStatus) => {
    switch (status) {
      case "placed":
        return { label: "Order Placed", bg: "rgba(255, 178, 0, 0.15)", color: "var(--color-accent)" };
      case "pharmacist_verified":
        return { label: "Pharmacist Verified", bg: "var(--color-success-bg)", color: "var(--color-success)" };
      case "packed":
        return { label: "Packed & Sealed", bg: "rgba(29, 52, 138, 0.2)", color: "var(--color-primary)" };
      case "dispatched":
      case "out_for_delivery":
        return { label: "In Transit / Out for Delivery", bg: "rgba(255, 178, 0, 0.15)", color: "var(--color-accent)" };
      case "delivered":
        return { label: "Delivered", bg: "var(--color-success-bg)", color: "var(--color-success)" };
      case "cancelled":
        return { label: "Cancelled", bg: "var(--color-error-bg)", color: "var(--color-error)" };
      default:
        return { label: status, bg: "var(--bg-surface)", color: "var(--text-secondary)" };
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* Tab Switcher */}
      <div style={{ display: "flex", gap: "0.5rem", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "0.5rem" }}>
        <button
          type="button"
          onClick={() => setActiveTab("active")}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "8px",
            border: "none",
            fontSize: "0.88rem",
            fontWeight: activeTab === "active" ? 700 : 500,
            background: activeTab === "active" ? "rgba(255, 178, 0, 0.15)" : "transparent",
            color: activeTab === "active" ? "var(--color-accent)" : "var(--text-secondary)",
            cursor: "pointer",
            minHeight: "44px",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <Truck size={16} />
          <span>Active Deliveries ({activeOrders.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("history")}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "8px",
            border: "none",
            fontSize: "0.88rem",
            fontWeight: activeTab === "history" ? 700 : 500,
            background: activeTab === "history" ? "rgba(255, 178, 0, 0.15)" : "transparent",
            color: activeTab === "history" ? "var(--color-accent)" : "var(--text-secondary)",
            cursor: "pointer",
            minHeight: "44px",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <Package size={16} />
          <span>Delivered & Past ({historyOrders.length})</span>
        </button>
      </div>

      {displayedOrders.length === 0 ? (
        <div
          className="dashboard-card"
          style={{ textAlign: "center", padding: "3rem 1.5rem", color: "var(--text-secondary)" }}
        >
          <Package size={40} color="var(--text-muted)" style={{ margin: "0 auto 0.75rem" }} />
          <h4 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.25rem" }}>
            No {activeTab === "active" ? "active orders" : "past orders"} found
          </h4>
          <p style={{ fontSize: "0.85rem" }}>
            {activeTab === "active"
              ? "You do not have any ongoing medicine shipments."
              : "Completed and cancelled pharmacy orders will appear here."}
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {displayedOrders.map((ord) => {
            const statusInfo = getStatusChip(ord.orderStatus);
            return (
              <div
                key={ord.id}
                className="dashboard-card"
                style={{
                  padding: "1.5rem",
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "1.25rem",
                }}
              >
                <div style={{ flex: "1 1 340px", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 800, fontSize: "1.05rem", color: "var(--color-accent)", fontFamily: "monospace" }}>
                      {ord.orderCode}
                    </span>
                    <span
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: "10px",
                        background: statusInfo.bg,
                        color: statusInfo.color,
                      }}
                    >
                      {statusInfo.label}
                    </span>
                    {ord.prescriptionCode && (
                      <span
                        style={{
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: "10px",
                          background: "rgba(29, 52, 138, 0.15)",
                          color: "var(--color-primary)",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "3px",
                        }}
                      >
                        <FileCheck size={12} /> {ord.prescriptionCode}
                      </span>
                    )}
                  </div>

                  <div style={{ fontSize: "0.88rem", fontWeight: 600 }}>
                    {ord.items.map((it) => `${it.quantity}x ${it.medicineName}`).join(", ")}
                  </div>

                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                    <span>Placed on: {new Date(ord.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                    <span>Total: <strong>₹{ord.totalAmount.toFixed(2)}</strong></span>
                    <span>Paid via {ord.paymentMethod.toUpperCase()}</span>
                  </div>

                  <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>
                    <MapPin size={12} style={{ display: "inline", verticalAlign: "middle" }} /> Deliver to: {ord.deliveryAddress.fullName}, {ord.deliveryAddress.city} - {ord.deliveryAddress.pincode}
                  </div>
                </div>

                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <button
                    type="button"
                    onClick={() => onTrackOrder(ord)}
                    className="btn-primary"
                    style={{ minHeight: "44px", fontSize: "0.85rem", padding: "0 1.25rem" }}
                  >
                    <Truck size={16} />
                    <span>Track Order</span>
                  </button>

                  {ord.orderStatus === "placed" && (
                    <button
                      type="button"
                      onClick={() => handleCancelOrder(ord.id)}
                      style={{
                        background: "transparent",
                        border: "1px solid var(--color-error)",
                        color: "var(--color-error)",
                        borderRadius: "8px",
                        padding: "0 0.85rem",
                        fontSize: "0.82rem",
                        minHeight: "44px",
                        cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

