"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PharmacyOrder } from "@/lib/types";
import AppieSystemNav from "@/components/AppieSystemNav";
import OrderListComponent from "@/components/orders/OrderListComponent";
import OrderTrackingModal from "@/components/orders/OrderTrackingModal";
import NotificationBell from "@/components/notifications/NotificationBell";
import ThemeToggle from "@/components/ThemeToggle";
import SignOutButton from "@/components/SignOutButton";
import { Activity, Truck, Pill } from "lucide-react";

export default function OrdersPage() {
  const [userRole, setUserRole] = useState<"patient" | "health_professional">("patient");
  const [orders, setOrders] = useState<PharmacyOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [trackingOrder, setTrackingOrder] = useState<PharmacyOrder | null>(null);

  const fetchOrders = () => {
    setLoading(true);
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => {
        if (data.orders) {
          setOrders(data.orders);
        }
      })
      .catch((err) => console.warn(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUserRole(data.user.role);
      })
      .catch((err) => console.warn(err));

    fetchOrders();
  }, []);

  return (
    <>
      <header className="app-header">
        <Link href={userRole === "patient" ? "/patient/home" : "/professional/home"} className="brand-logo-wrap">
          <div className="brand-icon-box">
            <Activity size={22} strokeWidth={2.5} />
          </div>
          <div>
            <span className="brand-name">Appie</span>
          </div>
          <span className="brand-badge">Pharmacy Order System</span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <NotificationBell />
          <ThemeToggle />
          <SignOutButton />
        </div>
      </header>

      <main className="main-wrapper">
        <div style={{ width: "100%", maxWidth: "960px", margin: "0 auto" }}>
          <AppieSystemNav role={userRole} />

          {/* Quick Action Link to Pharmacy */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
            <Link
              href="/medications"
              className="btn-secondary"
              style={{ minHeight: "42px", fontSize: "0.85rem", padding: "0 1rem", textDecoration: "none" }}
            >
              <Pill size={16} />
              <span>Browse Medicines & Refill</span>
            </Link>
          </div>

          {loading ? (
            <p style={{ textAlign: "center", padding: "2rem", color: "var(--text-secondary)" }}>
              Loading pharmacy orders...
            </p>
          ) : (
            <OrderListComponent
              orders={orders}
              onTrackOrder={(ord) => setTrackingOrder(ord)}
              onRefresh={fetchOrders}
            />
          )}

          {/* Tracking Modal */}
          {trackingOrder && (
            <OrderTrackingModal
              order={trackingOrder}
              onClose={() => setTrackingOrder(null)}
              onOrderUpdated={fetchOrders}
            />
          )}
        </div>
      </main>
    </>
  );
}

