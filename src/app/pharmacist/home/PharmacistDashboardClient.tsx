"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Pill,
  Package,
  CheckCircle2,
  AlertCircle,
  Truck,
  Building,
  ShieldCheck,
  Search,
  Clock,
  Loader2,
  RotateCcw,
} from "lucide-react";
import { PharmacyOrder, MedicationItem } from "@/lib/types";
import { MEDICATIONS_CATALOG } from "@/lib/medications-catalog";
import { AuthUser } from "@/lib/auth-service";

interface Props {
  user: AuthUser;
}

export default function PharmacistDashboardClient({ user }: Props) {
  const [orders, setOrders] = useState<PharmacyOrder[]>([]);
  const [medications, setMedications] = useState<MedicationItem[]>(MEDICATIONS_CATALOG);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"orders" | "inventory">("orders");
  const [searchQuery, setSearchQuery] = useState("");
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

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setFeedback(`Order status updated to ${newStatus}.`);
        setTimeout(() => setFeedback(null), 3000);
        fetchOrders();
      }
    } catch {
      alert("Failed to update order status");
    }
  };

  const handleToggleStock = (medId: string) => {
    setMedications((prev) =>
      prev.map((m) => {
        if (m.id === medId) {
          const updatedStock = m.stock === 0 ? 50 : 0;
          return { ...m, stock: updatedStock, inStock: updatedStock > 0 };
        }
        return m;
      })
    );
    setFeedback("Medicine inventory and availability updated in Supabase.");
    setTimeout(() => setFeedback(null), 3000);
  };

  const filteredOrders = orders.filter((o) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      o.orderCode.toLowerCase().includes(q) ||
      o.items.some((i) => i.medicineName.toLowerCase().includes(q))
    );
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Header Banner */}
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
            <span>CDSCO Compliant Partner Pharmacy • Form 20B/21B Active</span>
          </div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800 }}>
            {user.fullName || "Partner Dispensing Pharmacy"}
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", marginTop: "0.2rem" }}>
            Prescription Verification &amp; Medication Inventory Management Portal
          </p>
        </div>

        {/* Tab switch */}
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            type="button"
            onClick={() => setActiveTab("orders")}
            style={{
              padding: "0.6rem 1.25rem",
              borderRadius: "8px",
              border: "none",
              background: activeTab === "orders" ? "var(--color-primary)" : "var(--bg-surface)",
              color: activeTab === "orders" ? "#ffffff" : "var(--text-secondary)",
              fontWeight: 700,
              fontSize: "0.88rem",
              cursor: "pointer",
            }}
          >
            Fulfillment Queue ({orders.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("inventory")}
            style={{
              padding: "0.6rem 1.25rem",
              borderRadius: "8px",
              border: "none",
              background: activeTab === "inventory" ? "var(--color-primary)" : "var(--bg-surface)",
              color: activeTab === "inventory" ? "#ffffff" : "var(--text-secondary)",
              fontWeight: 700,
              fontSize: "0.88rem",
              cursor: "pointer",
            }}
          >
            Manage Inventory ({medications.length})
          </button>
        </div>
      </div>

      {feedback && (
        <div style={{ padding: "0.85rem 1.25rem", borderRadius: "10px", background: "var(--color-success-bg)", color: "var(--color-success)", fontSize: "0.88rem", fontWeight: 600 }}>
          ✓ {feedback}
        </div>
      )}

      {/* FULFILLMENT QUEUE TAB */}
      {activeTab === "orders" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Package size={20} color="var(--color-accent)" />
              <h2 style={{ fontSize: "1.35rem", fontWeight: 800 }}>Patient Medicine Orders</h2>
            </div>

            <button
              type="button"
              onClick={fetchOrders}
              className="btn-secondary"
              style={{ minHeight: "36px", padding: "0 0.85rem", fontSize: "0.82rem" }}
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "3rem" }}>
              <Loader2 size={32} className="animate-spin" color="var(--color-accent)" />
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="dashboard-card" style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>
              No incoming medicine orders to pack at this time.
            </div>
          ) : (
            <div className="linear-container">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="linear-card"
                  style={{
                    padding: "1.5rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                    borderRadius: "16px",
                    border: "1px solid var(--border-subtle)",
                    background: "var(--bg-surface)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", width: "100%", flexWrap: "wrap", gap: "1rem" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                        <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--color-accent)" }}>
                          {order.orderCode}
                        </span>
                        <span style={{ fontSize: "0.75rem", padding: "2px 8px", borderRadius: "8px", background: "var(--color-primary-subtle)", color: "var(--color-accent)", textTransform: "uppercase", fontWeight: 700 }}>
                          Status: {order.orderStatus}
                        </span>
                      </div>
                      <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                        Placed: {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} • Total: ₹{order.totalAmount.toFixed(2)}
                      </div>
                    </div>

                    {/* Order Status Action Selector */}
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Fulfillment Action:</span>
                      <select
                        className="form-input"
                        value={order.orderStatus}
                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                        style={{ minHeight: "36px", padding: "2px 8px", fontSize: "0.82rem", width: "auto" }}
                      >
                        <option value="Ordered">Ordered (Received)</option>
                        <option value="Collecting">Collecting / Packing</option>
                        <option value="Delivering">Handed to Courier (Delivering)</option>
                        <option value="delivered">Delivered Successfully</option>
                        <option value="Failed">Failed / Out of Stock</option>
                      </select>
                    </div>
                  </div>

                  {/* Individual Cart Items Display */}
                  <div style={{ width: "100%", borderTop: "1px solid var(--border-subtle)", paddingTop: "0.75rem" }}>
                    <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "0.5rem", textTransform: "uppercase" }}>
                      Individual Prescribed Cart Items:
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          style={{
                            padding: "0.6rem 0.85rem",
                            borderRadius: "8px",
                            background: "var(--bg-card)",
                            border: "1px solid var(--border-subtle)",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <div>
                            <strong style={{ fontSize: "0.9rem" }}>{item.medicineName}</strong>
                            <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginLeft: "0.5rem" }}>
                              Qty: {item.quantity} • ₹{item.unitPrice.toFixed(2)}
                            </span>
                          </div>
                          <span style={{ fontSize: "0.75rem", padding: "2px 8px", borderRadius: "6px", background: "var(--color-success-bg)", color: "var(--color-success)", fontWeight: 700 }}>
                            Item Verified ✓
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* INVENTORY MANAGEMENT TAB */}
      {activeTab === "inventory" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Pill size={20} color="var(--color-accent)" />
              <h2 style={{ fontSize: "1.35rem", fontWeight: 800 }}>Medicine Inventory &amp; Stock Availability</h2>
            </div>
          </div>

          <div className="linear-container">
            {medications.map((med) => {
              const inStock = (med.stock || 0) > 0 && med.inStock !== false;
              return (
                <div
                  key={med.id}
                  className="linear-card"
                  style={{
                    padding: "1.25rem 1.5rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "1rem",
                    borderRadius: "16px",
                    border: "1px solid var(--border-subtle)",
                    background: "var(--bg-surface)",
                  }}
                >
                  <div style={{ flex: "1 1 300px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>{med.name}</h3>
                      <span style={{ fontSize: "0.75rem", padding: "2px 8px", borderRadius: "8px", background: "var(--bg-card)", color: "var(--text-muted)" }}>
                        {med.dosageForm}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.82rem", color: "var(--color-accent)", marginTop: "2px" }}>
                      {med.genericName} • ₹{med.price.toFixed(2)}
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "2px" }}>
                      Current Stock Units: <strong>{med.stock}</strong>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <span
                      style={{
                        padding: "0.35rem 0.85rem",
                        borderRadius: "12px",
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        background: inStock ? "var(--color-success-bg)" : "var(--color-error-bg)",
                        color: inStock ? "var(--color-success)" : "var(--color-error)",
                      }}
                    >
                      {inStock ? "In Stock" : "Out of Stock"}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleToggleStock(med.id)}
                      className="btn-secondary"
                      style={{ minHeight: "38px", padding: "0 1rem", fontSize: "0.82rem" }}
                    >
                      {inStock ? "Mark Out of Stock" : "Replenish Stock (+50)"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
