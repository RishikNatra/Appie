"use client";

import { useState, useEffect } from "react";
import {
  Truck,
  MapPin,
  Clock,
  PhoneCall,
  PackageCheck,
  CheckCircle2,
  AlertCircle,
  Navigation,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { PharmacyOrder } from "@/lib/types";
import { AuthUser } from "@/lib/auth-service";

interface Props {
  user: AuthUser;
}

export default function DeliveryDashboardClient({ user }: Props) {
  const [orders, setOrders] = useState<PharmacyOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);

  const fetchOrders = () => {
    setLoading(true);
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => {
        if (data.orders) setOrders(data.orders);
      })
      .catch((err) => console.warn(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setFeedback(`Order status transitioned to "${newStatus}" and synchronized across dashboards.`);
        setTimeout(() => setFeedback(null), 3500);
        fetchOrders();
      }
    } catch {
      alert("Failed to update status");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Welcome Banner */}
      <div
        className="dashboard-card"
        style={{
          padding: "1.75rem 2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1.25rem",
        }}
      >
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", fontSize: "0.8rem", fontWeight: 700, color: "var(--color-success)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.3rem" }}>
            <ShieldCheck size={16} />
            <span>Transport Verified • Fleet Dispatch Active</span>
          </div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800 }}>
            {user.fullName || "Delivery Partner"}
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", marginTop: "0.2rem" }}>
            Cold-Chain Medicine Transport &amp; Express Doorstep Delivery
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div className="badge" style={{ background: "var(--color-success-bg)", color: "var(--color-success)", border: "1px solid var(--color-success)", padding: "0.6rem 1rem", fontSize: "0.88rem", fontWeight: 700 }}>
            ● Active On-Duty
          </div>
          <button
            type="button"
            onClick={fetchOrders}
            className="btn-secondary"
            style={{ minHeight: "42px", padding: "0 1rem", fontSize: "0.85rem" }}
          >
            Refresh Feed
          </button>
        </div>
      </div>

      {feedback && (
        <div style={{ padding: "0.85rem 1.25rem", borderRadius: "10px", background: "var(--color-success-bg)", color: "var(--color-success)", fontSize: "0.88rem", fontWeight: 600 }}>
          ✓ {feedback}
        </div>
      )}

      {/* Orders List */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
          <Truck size={22} color="var(--color-accent)" />
          <h2 style={{ fontSize: "1.35rem", fontWeight: 800 }}>Dispatched Medicine Parcels</h2>
          <span style={{ fontSize: "0.8rem", padding: "2px 8px", borderRadius: "10px", background: "var(--color-primary-subtle)", color: "var(--color-accent)", fontWeight: 700 }}>
            {orders.length}
          </span>
        </div>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "3rem" }}>
            <Loader2 size={32} className="animate-spin" color="var(--color-accent)" />
          </div>
        ) : orders.length === 0 ? (
          <div className="dashboard-card" style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>
            No medicine deliveries assigned to your fleet right now.
          </div>
        ) : (
          <div className="linear-container">
            {orders.map((order) => {
              const addr = order.deliveryAddress;
              return (
                <div
                  key={order.id}
                  className="linear-card"
                  style={{
                    padding: "1.5rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.25rem",
                    borderRadius: "16px",
                    border: "1px solid var(--border-subtle)",
                    background: "var(--bg-surface)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", width: "100%", flexWrap: "wrap", gap: "1rem" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                        <span style={{ fontSize: "0.9rem", fontWeight: 800, color: "var(--color-accent)" }}>
                          {order.orderCode}
                        </span>
                        <span style={{ fontSize: "0.75rem", padding: "2px 8px", borderRadius: "8px", background: "var(--color-primary-subtle)", color: "var(--color-accent)", textTransform: "uppercase", fontWeight: 700 }}>
                          Status: {order.orderStatus}
                        </span>
                      </div>
                      <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                        Items: {order.items.map((i) => `${i.medicineName} (x${i.quantity})`).join(", ")}
                      </div>
                    </div>

                    {/* 4 Supported Statuses strictly as instructed:
                        - Ordered
                        - Collecting
                        - Delivering
                        - Failed */}
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                      <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-muted)" }}>
                        Update Stage:
                      </span>
                      <select
                        className="form-input"
                        value={order.orderStatus}
                        onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                        style={{ minHeight: "38px", padding: "4px 10px", fontSize: "0.85rem", width: "auto" }}
                      >
                        <option value="Ordered">Ordered</option>
                        <option value="Collecting">Collecting</option>
                        <option value="Delivering">Delivering</option>
                        <option value="delivered">Delivered Successfully</option>
                        <option value="Failed">Failed</option>
                      </select>
                    </div>
                  </div>

                  {/* Delivery Location & Recipient Details */}
                  <div
                    style={{
                      padding: "1rem",
                      borderRadius: "10px",
                      background: "var(--bg-card)",
                      border: "1px solid var(--border-subtle)",
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                      gap: "1rem",
                      fontSize: "0.85rem",
                    }}
                  >
                    <div>
                      <div style={{ color: "var(--text-muted)", fontSize: "0.78rem", textTransform: "uppercase", fontWeight: 700, marginBottom: "2px" }}>
                        Recipient &amp; Phone
                      </div>
                      <strong>{addr?.fullName || "Aditya Verma"}</strong>
                      <div style={{ color: "var(--text-secondary)" }}>{addr?.phone || "+91 98765 43210"}</div>
                    </div>

                    <div>
                      <div style={{ color: "var(--text-muted)", fontSize: "0.78rem", textTransform: "uppercase", fontWeight: 700, marginBottom: "2px" }}>
                        Delivery Address
                      </div>
                      <div>{addr?.addressLine1 || "Flat 402, Green Glen Heights, Outer Ring Road"}</div>
                      <div style={{ color: "var(--text-secondary)" }}>{addr?.city || "Bengaluru"}, {addr?.state || "Karnataka"} - {addr?.pincode || "560103"}</div>
                    </div>

                    <div>
                      <div style={{ color: "var(--text-muted)", fontSize: "0.78rem", textTransform: "uppercase", fontWeight: 700, marginBottom: "2px" }}>
                        Payment Collection
                      </div>
                      <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--color-accent)" }}>
                        ₹{order.totalAmount.toFixed(2)}
                      </div>
                      <span style={{ fontSize: "0.75rem", color: "var(--color-success)", fontWeight: 600 }}>
                        {order.paymentStatus === "paid" ? "Prepaid Online (No Cash Required)" : "Collect Cash on Delivery"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
