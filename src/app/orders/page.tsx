"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { PharmacyOrder, MedicationCartItem } from "@/lib/types";
import OrderTrackingModal from "@/components/orders/OrderTrackingModal";
import OrderCheckoutModal from "@/components/orders/OrderCheckoutModal";
import NotificationBell from "@/components/notifications/NotificationBell";
import {
  Activity,
  Package,
  ShoppingCart,
  Truck,
  Search,
  Filter,
  ArrowUpDown,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Settings,
  MapPin,
  RotateCcw,
} from "lucide-react";

export default function OrdersPage() {
  const [orders, setOrders] = useState<PharmacyOrder[]>([]);
  const [cartItems, setCartItems] = useState<MedicationCartItem[]>([]);
  const [cartSubtotal, setCartSubtotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Horizontal window active section: "cart" | "active" | "history"
  const [activeSection, setActiveSection] = useState<"cart" | "active" | "history">("cart");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Tracking Modal & Checkout Modal
  const [trackingOrder, setTrackingOrder] = useState<PharmacyOrder | null>(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  // Search & Filter & Sort state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date_desc" | "date_asc" | "amount_desc" | "amount_asc">("date_desc");
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [sortModalOpen, setSortModalOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordersRes, cartRes] = await Promise.all([
        fetch("/api/orders").then((r) => r.json()),
        fetch("/api/medications/cart").then((r) => r.json()),
      ]);

      if (ordersRes.orders) setOrders(ordersRes.orders);
      if (cartRes.items) {
        setCartItems(cartRes.items);
        setCartSubtotal(cartRes.subtotal || 0);
      }
    } catch (err) {
      console.warn("Failed to fetch orders data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Current active order: latest non-delivered/non-cancelled order
  const activeOrder = orders.find(
    (o) =>
      o.orderStatus !== "delivered" &&
      o.orderStatus !== "cancelled" &&
      (o.orderStatus as any) !== "Failed"
  ) || (orders.length > 0 ? orders[0] : null);

  // Filtered and Sorted Orders
  const filteredOrders = orders
    .filter((o) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        o.orderCode.toLowerCase().includes(q) ||
        o.items.some((item) => item.medicineName.toLowerCase().includes(q)) ||
        (o.courierPartner && o.courierPartner.toLowerCase().includes(q));

      const matchesStatus =
        statusFilter === "all" ||
        o.orderStatus.toLowerCase() === statusFilter.toLowerCase();

      return matchesQuery && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "date_desc") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === "date_asc") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortBy === "amount_desc") {
        return b.totalAmount - a.totalAmount;
      }
      if (sortBy === "amount_asc") {
        return a.totalAmount - b.totalAmount;
      }
      return 0;
    });

  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes("delivered")) {
      return { bg: "var(--color-success-bg)", text: "var(--color-success)", label: "Delivered" };
    }
    if (s.includes("delivering") || s.includes("out_for_delivery")) {
      return { bg: "rgba(59, 130, 246, 0.15)", text: "var(--color-accent)", label: "Delivering" };
    }
    if (s.includes("collecting") || s.includes("packed") || s.includes("pharmacist")) {
      return { bg: "rgba(245, 158, 11, 0.15)", text: "#f59e0b", label: "Collecting" };
    }
    if (s.includes("failed") || s.includes("cancelled")) {
      return { bg: "var(--color-error-bg)", text: "var(--color-error)", label: "Failed" };
    }
    return { bg: "var(--color-primary-subtle)", text: "var(--color-accent)", label: "Ordered" };
  };

  const scrollToPane = (index: number) => {
    if (scrollRef.current) {
      const paneWidth = scrollRef.current.clientWidth;
      scrollRef.current.scrollTo({
        left: paneWidth * index,
        behavior: "smooth",
      });
      if (index === 0) setActiveSection("cart");
      else if (index === 1) setActiveSection("active");
      else if (index === 2) setActiveSection("history");
    }
  };

  const handleHorizontalScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const idx = Math.round(scrollLeft / clientWidth);
      if (idx === 0) setActiveSection("cart");
      else if (idx === 1) setActiveSection("active");
      else if (idx === 2) setActiveSection("history");
    }
  };

  return (
    <>
      {/* Persistent Top Navigation Bar */}
      <header className="app-header" style={{ position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          {/* 1. Appie logo and text */}
          <Link href="/patient/home" className="brand-logo-wrap" title="Appie Patient Dashboard">
            <div className="brand-icon-box">
              <Activity size={22} strokeWidth={2.5} />
            </div>
            <div>
              <span className="brand-name">Appie</span>
            </div>
          </Link>

          {/* 2-7. Patient Persistent Nav items */}
          <nav style={{ display: "flex", alignItems: "center", gap: "0.25rem", flexWrap: "wrap" }}>
            <Link href="/assessment" className="form-link" style={{ minHeight: "40px", padding: "0 0.75rem", fontSize: "0.88rem", fontWeight: 600 }}>
              Health Assessment
            </Link>
            <Link href="/medications" className="form-link" style={{ minHeight: "40px", padding: "0 0.75rem", fontSize: "0.88rem", fontWeight: 600 }}>
              e-Pharmacy
            </Link>
            <Link href="/orders" className="form-link" style={{ minHeight: "40px", padding: "0 0.75rem", fontSize: "0.88rem", fontWeight: 700, color: "var(--color-accent)" }}>
              Orders
            </Link>
            <Link href="/prescriptions" className="form-link" style={{ minHeight: "40px", padding: "0 0.75rem", fontSize: "0.88rem", fontWeight: 600 }}>
              e-Prescriptions
            </Link>
            <Link href="/records" className="form-link" style={{ minHeight: "40px", padding: "0 0.75rem", fontSize: "0.88rem", fontWeight: 600 }}>
              Records
            </Link>
            <Link href="/account/profile" className="form-link" style={{ minHeight: "40px", padding: "0 0.75rem", fontSize: "0.88rem", fontWeight: 600 }}>
              Profile
            </Link>
          </nav>
        </div>

        {/* 8. Constant Notification & Settings icon at extreme right */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <NotificationBell />
          <Link
            href="/account/settings"
            aria-label="Settings"
            title="Account & System Settings"
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "10px",
              border: "1px solid var(--border-subtle)",
              background: "var(--bg-card)",
              color: "var(--text-primary)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
            }}
          >
            <Settings size={19} />
          </Link>
        </div>
      </header>

      <main className="main-wrapper" style={{ maxWidth: "1150px", width: "100%", padding: "1.5rem 1rem 4rem" }}>
        {/* Title */}
        <div style={{ marginBottom: "1.5rem" }}>
          <h1 style={{ fontSize: "1.85rem", fontWeight: 800 }}>Orders &amp; Deliveries</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", marginTop: "0.25rem" }}>
            Navigate horizontally through your cart, active delivery route, and historical medicine dispatches.
          </p>
        </div>

        {/* Horizontal Navigation Control Pills (Similar to Assessment Page) */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "0.75rem",
            marginBottom: "1.75rem",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "0.35rem",
              borderRadius: "12px",
              background: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
              gap: "0.35rem",
              flexWrap: "wrap",
            }}
            role="tablist"
          >
            <button
              type="button"
              onClick={() => scrollToPane(0)}
              style={{
                padding: "0.6rem 1.25rem",
                borderRadius: "8px",
                border: "none",
                background: activeSection === "cart" ? "var(--color-primary)" : "transparent",
                color: activeSection === "cart" ? "#ffffff" : "var(--text-secondary)",
                fontWeight: 700,
                fontSize: "0.88rem",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                transition: "all 200ms ease",
              }}
            >
              <ShoppingCart size={16} />
              <span>1. Current Cart</span>
              <span
                style={{
                  fontSize: "0.72rem",
                  padding: "1px 6px",
                  borderRadius: "10px",
                  background: activeSection === "cart" ? "rgba(255, 255, 255, 0.25)" : "var(--bg-surface)",
                  color: activeSection === "cart" ? "#ffffff" : "var(--color-accent)",
                }}
              >
                {cartItems.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => scrollToPane(1)}
              style={{
                padding: "0.6rem 1.25rem",
                borderRadius: "8px",
                border: "none",
                background: activeSection === "active" ? "var(--color-primary)" : "transparent",
                color: activeSection === "active" ? "#ffffff" : "var(--text-secondary)",
                fontWeight: 700,
                fontSize: "0.88rem",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                transition: "all 200ms ease",
              }}
            >
              <Truck size={16} />
              <span>2. Active Order Tracking</span>
              {activeOrder && (
                <span
                  style={{
                    fontSize: "0.72rem",
                    padding: "1px 6px",
                    borderRadius: "10px",
                    background: activeSection === "active" ? "rgba(255, 255, 255, 0.25)" : "var(--color-success-bg)",
                    color: activeSection === "active" ? "#ffffff" : "var(--color-success)",
                  }}
                >
                  LIVE
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => scrollToPane(2)}
              style={{
                padding: "0.6rem 1.25rem",
                borderRadius: "8px",
                border: "none",
                background: activeSection === "history" ? "var(--color-primary)" : "transparent",
                color: activeSection === "history" ? "#ffffff" : "var(--text-secondary)",
                fontWeight: 700,
                fontSize: "0.88rem",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                transition: "all 200ms ease",
              }}
            >
              <Package size={16} />
              <span>3. Order History</span>
              <span
                style={{
                  fontSize: "0.72rem",
                  padding: "1px 6px",
                  borderRadius: "10px",
                  background: activeSection === "history" ? "rgba(255, 255, 255, 0.25)" : "var(--bg-surface)",
                  color: activeSection === "history" ? "#ffffff" : "var(--text-muted)",
                }}
              >
                {filteredOrders.length}
              </span>
            </button>
          </div>

          {/* Quick Horizontal Scroll Arrow Controls */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginRight: "0.25rem" }}>
              Slide horizontally:
            </span>
            <button
              type="button"
              onClick={() => {
                const currentIdx = activeSection === "cart" ? 0 : activeSection === "active" ? 1 : 2;
                scrollToPane(Math.max(0, currentIdx - 1));
              }}
              className="btn-secondary"
              aria-label="Previous section"
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "8px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 0,
              }}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => {
                const currentIdx = activeSection === "cart" ? 0 : activeSection === "active" ? 1 : 2;
                scrollToPane(Math.min(2, currentIdx + 1));
              }}
              className="btn-secondary"
              aria-label="Next section"
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "8px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 0,
              }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* ==============================================================
            HORIZONTAL SCROLLING WINDOW CONTAINER
            ============================================================== */}
        <div
          ref={scrollRef}
          onScroll={handleHorizontalScroll}
          style={{
            display: "flex",
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            scrollBehavior: "smooth",
            gap: "2rem",
            paddingBottom: "1.5rem",
            scrollbarWidth: "thin",
          }}
        >
          {/* ============================================================
              PANE 1: CURRENT CART
              ============================================================ */}
          <div
            style={{
              minWidth: "100%",
              width: "100%",
              flexShrink: 0,
              scrollSnapAlign: "start",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <ShoppingCart size={20} color="var(--color-accent)" />
                <h2 style={{ fontSize: "1.3rem", fontWeight: 800 }}>1. Current Cart Items</h2>
                <span style={{ fontSize: "0.8rem", padding: "2px 8px", borderRadius: "10px", background: "var(--color-primary-subtle)", color: "var(--color-accent)", fontWeight: 700 }}>
                  {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
                </span>
              </div>
              <Link href="/medications" className="form-link" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                + Add More Medicines
              </Link>
            </div>

            <div className="dashboard-card" style={{ padding: "1.5rem" }}>
              {cartItems.length === 0 ? (
                <div style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--text-muted)" }}>
                  <ShoppingCart size={36} style={{ margin: "0 auto 0.75rem", opacity: 0.5 }} />
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.25rem", color: "var(--text-primary)" }}>Your cart is empty</h3>
                  <p style={{ fontSize: "0.85rem" }}>Transfer medications from an e-prescription or add OTC items from the catalog.</p>
                  <Link href="/medications" className="btn-secondary" style={{ display: "inline-flex", minHeight: "40px", marginTop: "1rem", textDecoration: "none" }}>
                    Browse Pharmacy Catalog
                  </Link>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        style={{
                          padding: "0.85rem 1rem",
                          borderRadius: "10px",
                          background: "var(--bg-surface)",
                          border: "1px solid var(--border-subtle)",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: "0.75rem",
                        }}
                      >
                        <div>
                          <strong style={{ fontSize: "0.95rem" }}>{item.medication.name}</strong>
                          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                            Qty: {item.quantity} • ₹{item.medication.price.toFixed(2)} each
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                          <span style={{ fontSize: "0.75rem", padding: "2px 8px", borderRadius: "8px", background: "var(--color-success-bg)", color: "var(--color-success)", fontWeight: 600 }}>
                            Ready to Dispense
                          </span>
                          <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--color-accent)" }}>
                            ₹{(item.medication.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                    <div style={{ fontSize: "1.05rem" }}>
                      Subtotal: <strong style={{ color: "var(--color-accent)" }}>₹{cartSubtotal.toFixed(2)}</strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowCheckoutModal(true)}
                      className="btn-primary"
                      style={{ minHeight: "44px", padding: "0 1.5rem", fontSize: "0.9rem" }}
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ============================================================
              PANE 2: ACTIVE ORDER TRACKING & LIVE MAP
              ============================================================ */}
          <div
            style={{
              minWidth: "100%",
              width: "100%",
              flexShrink: 0,
              scrollSnapAlign: "start",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
              <Truck size={20} color="var(--color-accent)" />
              <h2 style={{ fontSize: "1.3rem", fontWeight: 800 }}>2. Current Active Delivery</h2>
            </div>

            <div className="dashboard-card" style={{ padding: "1.75rem" }}>
              {!activeOrder ? (
                <div style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--text-muted)" }}>
                  <Truck size={36} style={{ margin: "0 auto 0.75rem", opacity: 0.5 }} />
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.25rem", color: "var(--text-primary)" }}>No active dispatch</h3>
                  <p style={{ fontSize: "0.85rem" }}>You do not have any orders in active transit right now.</p>
                </div>
              ) : (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "1.25rem" }}>
                    <div>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                        Order Tracking ID: {activeOrder.orderCode}
                      </div>
                      <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--text-primary)", marginTop: "0.2rem" }}>
                        {activeOrder.items.map((i) => i.medicineName).join(", ")}
                      </div>
                      <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
                        Partner Fleet: {activeOrder.courierPartner || "Express Healthcare Logistics"} • Rider: Arun Kumar (+91 97410 99882)
                      </div>
                    </div>

                    {(() => {
                      const badge = getStatusBadge(activeOrder.orderStatus);
                      return (
                        <span
                          style={{
                            padding: "0.45rem 1rem",
                            borderRadius: "20px",
                            fontSize: "0.85rem",
                            fontWeight: 700,
                            background: badge.bg,
                            color: badge.text,
                            border: "1px solid currentColor",
                            textTransform: "uppercase",
                          }}
                        >
                          ● {badge.label}
                        </span>
                      );
                    })()}
                  </div>

                  {/* 4 Supported Status Stages */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(4, 1fr)",
                      gap: "0.75rem",
                      padding: "1rem",
                      borderRadius: "12px",
                      background: "var(--bg-surface)",
                      marginBottom: "1.5rem",
                    }}
                  >
                    {[
                      { step: 1, label: "Ordered", status: "ordered" },
                      { step: 2, label: "Collecting", status: "collecting" },
                      { step: 3, label: "Delivering", status: "delivering" },
                      { step: 4, label: "Delivered", status: "delivered" },
                    ].map((s) => {
                      const curr = activeOrder.orderStatus.toLowerCase();
                      const isDone =
                        s.status === "ordered" ||
                        (s.status === "collecting" && (curr.includes("collecting") || curr.includes("packed") || curr.includes("delivering") || curr.includes("delivered"))) ||
                        (s.status === "delivering" && (curr.includes("delivering") || curr.includes("out_for_delivery") || curr.includes("delivered"))) ||
                        (s.status === "delivered" && curr.includes("delivered"));

                      return (
                        <div key={s.step} style={{ textAlign: "center" }}>
                          <div
                            style={{
                              width: "28px",
                              height: "28px",
                              borderRadius: "50%",
                              margin: "0 auto 0.4rem",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "0.78rem",
                              fontWeight: 800,
                              background: isDone ? "var(--color-accent)" : "var(--border-subtle)",
                              color: isDone ? "#ffffff" : "var(--text-muted)",
                            }}
                          >
                            {isDone ? "✓" : s.step}
                          </div>
                          <span style={{ fontSize: "0.78rem", fontWeight: isDone ? 700 : 500, color: isDone ? "var(--text-primary)" : "var(--text-muted)" }}>
                            {s.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Interactive Live Route Map Canvas Simulation */}
                  <div
                    style={{
                      width: "100%",
                      height: "200px",
                      borderRadius: "12px",
                      background: "linear-gradient(135deg, #091014 0%, #111a22 100%)",
                      border: "1px solid var(--border-subtle)",
                      position: "relative",
                      overflow: "hidden",
                      marginBottom: "1.25rem",
                    }}
                  >
                    <svg width="100%" height="100%" viewBox="0 0 800 200" preserveAspectRatio="none">
                      {/* Grid road paths */}
                      <path d="M 50 100 L 250 100 L 250 50 L 550 50 L 550 150 L 750 150" fill="none" stroke="#1e293b" strokeWidth="12" strokeLinecap="round" />
                      <path d="M 50 100 L 250 100 L 250 50 L 450 50" fill="none" stroke="#00e5a3" strokeWidth="4" strokeLinecap="round" strokeDasharray="6 4" />
                      
                      {/* Pharmacy Origin Pin */}
                      <circle cx="50" cy="100" r="10" fill="#00e5a3" />
                      <text x="50" y="130" fill="#00e5a3" fontSize="11" fontWeight="700" textAnchor="middle">MedPlus Pharmacy</text>

                      {/* Moving Courier Rider Beacon */}
                      <circle cx="450" cy="50" r="14" fill="#ffe600" opacity="0.3" className="animate-ping" />
                      <circle cx="450" cy="50" r="8" fill="#ffe600" />
                      <text x="450" y="32" fill="#ffe600" fontSize="11" fontWeight="700" textAnchor="middle">🛵 Rider (5 mins away)</text>

                      {/* Destination User Pin */}
                      <circle cx="750" cy="150" r="10" fill="#ef4444" />
                      <text x="750" y="180" fill="#ef4444" fontSize="11" fontWeight="700" textAnchor="middle">Your Doorstep</text>
                    </svg>

                    <div style={{ position: "absolute", bottom: "10px", left: "15px", background: "rgba(0,0,0,0.7)", padding: "4px 10px", borderRadius: "6px", fontSize: "0.75rem", color: "#ffffff" }}>
                      Live GPS Tracking Active • Temperature: 4°C (Cold-Chain Verified)
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                      Total Amount: <strong style={{ color: "var(--text-primary)" }}>₹{activeOrder.totalAmount.toFixed(2)}</strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => setTrackingOrder(activeOrder)}
                      className="btn-primary"
                      style={{ minHeight: "40px", padding: "0 1.25rem", fontSize: "0.85rem" }}
                    >
                      Inspect Full Tracking Log
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ============================================================
              PANE 3: LIST OF ALL ORDERS
              ============================================================ */}
          <div
            style={{
              minWidth: "100%",
              width: "100%",
              flexShrink: 0,
              scrollSnapAlign: "start",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
              <Package size={20} color="var(--color-accent)" />
              <h2 style={{ fontSize: "1.3rem", fontWeight: 800 }}>3. Order History Log</h2>
            </div>

            {/* Search Bar with Single Sort Icon & Single Filter Icon beside it */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                flexWrap: "wrap",
                marginBottom: "1.25rem",
              }}
            >
              {/* Search Bar */}
              <div style={{ flex: "1 1 320px", position: "relative" }}>
                <Search
                  size={18}
                  style={{
                    position: "absolute",
                    left: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-muted)",
                  }}
                />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Search orders by tracking code, medication, or courier..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ paddingLeft: "42px", minHeight: "46px" }}
                />
              </div>

              {/* Single Sort Icon Button */}
              <button
                type="button"
                onClick={() => setSortModalOpen(true)}
                aria-label="Sort orders"
                style={{
                  minHeight: "46px",
                  padding: "0 1.1rem",
                  borderRadius: "10px",
                  border: "1px solid var(--border-subtle)",
                  background: "var(--bg-surface)",
                  color: "var(--text-primary)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  cursor: "pointer",
                  fontSize: "0.88rem",
                  fontWeight: 600,
                }}
              >
                <ArrowUpDown size={18} />
                <span>Sort</span>
              </button>

              {/* Single Filter Icon Button */}
              <button
                type="button"
                onClick={() => setFilterModalOpen(true)}
                aria-label="Filter orders"
                style={{
                  minHeight: "46px",
                  padding: "0 1.1rem",
                  borderRadius: "10px",
                  border: statusFilter !== "all" ? "1.5px solid var(--color-accent)" : "1px solid var(--border-subtle)",
                  background: "var(--bg-surface)",
                  color: "var(--text-primary)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  cursor: "pointer",
                  fontSize: "0.88rem",
                  fontWeight: 600,
                }}
              >
                <Filter size={18} />
                <span>Filter</span>
              </button>
            </div>

            {/* Orders Linear List */}
            <div className="linear-container">
              {filteredOrders.length === 0 ? (
                <div className="dashboard-card" style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>
                  No historical orders found matching current criteria.
                </div>
              ) : (
                filteredOrders.map((order) => {
                  const badge = getStatusBadge(order.orderStatus);
                  return (
                    <div
                      key={order.id}
                      className="linear-card"
                      style={{
                        padding: "1.25rem 1.5rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: "1.25rem",
                      }}
                    >
                      <div style={{ flex: "1 1 320px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.3rem" }}>
                          <span
                            style={{
                              fontSize: "0.75rem",
                              fontWeight: 700,
                              padding: "2px 8px",
                              borderRadius: "8px",
                              background: badge.bg,
                              color: badge.text,
                              textTransform: "uppercase",
                            }}
                          >
                            ● {badge.label}
                          </span>
                          <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                            {new Date(order.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>

                        <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>
                          {order.orderCode} • {order.items.map((i) => i.medicineName).join(", ")}
                        </h3>
                        <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
                          Delivery to: {order.deliveryAddress.fullName}, {order.deliveryAddress.city} • Courier: {order.courierPartner || "Standard Transit"}
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: "1.15rem", fontWeight: 800 }}>
                            ₹{order.totalAmount.toFixed(2)}
                          </div>
                          <div style={{ fontSize: "0.75rem", color: "var(--color-success)", fontWeight: 600 }}>
                            Paid via {order.paymentMethod.toUpperCase()}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setTrackingOrder(order)}
                          className="btn-secondary"
                          style={{ minHeight: "40px", padding: "0 1rem", fontSize: "0.85rem" }}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Tracking Details Modal */}
        {trackingOrder && (
          <OrderTrackingModal
            order={trackingOrder}
            onClose={() => setTrackingOrder(null)}
            onOrderUpdated={fetchData}
          />
        )}

        {/* Checkout Modal */}
        {showCheckoutModal && (
          <OrderCheckoutModal
            subtotal={cartSubtotal}
            deliveryFee={49}
            itemCount={cartItems.length}
            onClose={() => setShowCheckoutModal(false)}
            onSuccess={() => {
              setShowCheckoutModal(false);
              fetchData();
              scrollToPane(1);
            }}
          />
        )}

        {/* Filter Modal */}
        {filterModalOpen && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0, 0, 0, 0.65)",
              backdropFilter: "blur(4px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              padding: "1rem",
            }}
          >
            <div className="dashboard-card" style={{ maxWidth: "380px", width: "100%", padding: "1.75rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Filter Orders by Status</h3>
                <button
                  type="button"
                  onClick={() => setFilterModalOpen(false)}
                  style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
                >
                  <X size={20} />
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {[
                  { id: "all", label: "All Statuses" },
                  { id: "ordered", label: "Ordered (Placed)" },
                  { id: "collecting", label: "Collecting / Packing" },
                  { id: "delivering", label: "Delivering / In Transit" },
                  { id: "delivered", label: "Delivered Successfully" },
                  { id: "failed", label: "Failed / Cancelled" },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setStatusFilter(s.id);
                      setFilterModalOpen(false);
                    }}
                    style={{
                      padding: "0.75rem 1rem",
                      borderRadius: "8px",
                      border: statusFilter === s.id ? "1.5px solid var(--color-accent)" : "1px solid var(--border-subtle)",
                      background: statusFilter === s.id ? "var(--color-primary-subtle)" : "var(--bg-surface)",
                      color: "var(--text-primary)",
                      fontSize: "0.88rem",
                      fontWeight: 600,
                      textAlign: "left",
                      cursor: "pointer",
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Sort Modal */}
        {sortModalOpen && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0, 0, 0, 0.65)",
              backdropFilter: "blur(4px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              padding: "1rem",
            }}
          >
            <div className="dashboard-card" style={{ maxWidth: "380px", width: "100%", padding: "1.75rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Sort Orders</h3>
                <button
                  type="button"
                  onClick={() => setSortModalOpen(false)}
                  style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
                >
                  <X size={20} />
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {[
                  { id: "date_desc", label: "Date: Most Recent First" },
                  { id: "date_asc", label: "Date: Oldest First" },
                  { id: "amount_desc", label: "Amount: Highest First" },
                  { id: "amount_asc", label: "Amount: Lowest First" },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setSortBy(s.id as any);
                      setSortModalOpen(false);
                    }}
                    style={{
                      padding: "0.75rem 1rem",
                      borderRadius: "8px",
                      border: sortBy === s.id ? "1.5px solid var(--color-accent)" : "1px solid var(--border-subtle)",
                      background: sortBy === s.id ? "var(--color-primary-subtle)" : "var(--bg-surface)",
                      color: "var(--text-primary)",
                      fontSize: "0.88rem",
                      fontWeight: 600,
                      textAlign: "left",
                      cursor: "pointer",
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
