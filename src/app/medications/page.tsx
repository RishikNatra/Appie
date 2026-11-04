"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MedicationItem, MedicationCartItem } from "@/lib/types";
import { MEDICATIONS_CATALOG } from "@/lib/medications-catalog";
import { useRouter } from "next/navigation";
import AppieSystemNav from "@/components/AppieSystemNav";
import MedicationBrowseComponent from "@/components/medication/MedicationBrowseComponent";
import MedicationCartComponent from "@/components/medication/MedicationCartComponent";
import MedicationDetailModal from "@/components/medication/MedicationDetailModal";
import OrderCheckoutModal from "@/components/orders/OrderCheckoutModal";
import NotificationBell from "@/components/notifications/NotificationBell";
import ThemeToggle from "@/components/ThemeToggle";
import SignOutButton from "@/components/SignOutButton";
import { Activity, ShoppingCart, Pill } from "lucide-react";

export default function MedicationsPage() {
  const router = useRouter();
  const [userRole, setUserRole] = useState<"patient" | "health_professional">("patient");
  const [activeTab, setActiveTab] = useState<"browse" | "cart">("browse");

  // Cart state
  const [cartItems, setCartItems] = useState<MedicationCartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [total, setTotal] = useState(0);
  const [freeThreshold, setFreeThreshold] = useState(499);

  // Detail Modal & Checkout Modal
  const [selectedMedication, setSelectedMedication] = useState<MedicationItem | null>(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  const fetchCart = () => {
    fetch("/api/medications/cart")
      .then((res) => res.json())
      .then((data) => {
        if (data.items) {
          setCartItems(data.items);
          setSubtotal(data.subtotal || 0);
          setDeliveryFee(data.deliveryFee || 0);
          setTotal(data.total || 0);
          setFreeThreshold(data.freeDeliveryThreshold || 499);
        }
      })
      .catch((err) => console.warn(err));
  };

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUserRole(data.user.role);
      })
      .catch((err) => console.warn(err));

    fetchCart();
  }, []);

  const handleAddToCart = async (med: MedicationItem, quantity: number) => {
    try {
      const res = await fetch("/api/medications/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ medicationId: med.id, quantity }),
      });
      if (res.ok) {
        fetchCart();
      }
    } catch (err) {
      alert("Failed to add medication to cart");
    }
  };

  const handleUpdateQuantity = async (cartItemId: string, quantity: number) => {
    try {
      const res = await fetch("/api/medications/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItemId, quantity }),
      });
      if (res.ok) fetchCart();
    } catch (err) {
      alert("Failed to update cart");
    }
  };

  const handleRemoveItem = async (cartItemId: string) => {
    try {
      const res = await fetch(`/api/medications/cart?cartItemId=${cartItemId}`, {
        method: "DELETE",
      });
      if (res.ok) fetchCart();
    } catch (err) {
      alert("Failed to remove item");
    }
  };

  const handleClearCart = async () => {
    try {
      const res = await fetch("/api/medications/cart?clearAll=true", {
        method: "DELETE",
      });
      if (res.ok) fetchCart();
    } catch (err) {
      alert("Failed to clear cart");
    }
  };

  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);

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
          <span className="brand-badge">Pharmacy & Meds</span>
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

          {/* Sub-Tab Navigation */}
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              marginBottom: "1.5rem",
              borderBottom: "1px solid var(--border-subtle)",
              paddingBottom: "0.5rem",
            }}
          >
            <button
              type="button"
              onClick={() => setActiveTab("browse")}
              style={{
                padding: "0.6rem 1.25rem",
                borderRadius: "8px",
                fontSize: "0.9rem",
                fontWeight: activeTab === "browse" ? 700 : 500,
                border: "none",
                background: activeTab === "browse" ? "rgba(255, 178, 0, 0.15)" : "transparent",
                color: activeTab === "browse" ? "var(--color-accent)" : "var(--text-secondary)",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                minHeight: "44px",
              }}
            >
              <Pill size={16} />
              <span>Browse Catalog</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("cart")}
              style={{
                padding: "0.6rem 1.25rem",
                borderRadius: "8px",
                fontSize: "0.9rem",
                fontWeight: activeTab === "cart" ? 700 : 500,
                border: "none",
                background: activeTab === "cart" ? "rgba(255, 178, 0, 0.15)" : "transparent",
                color: activeTab === "cart" ? "var(--color-accent)" : "var(--text-secondary)",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                minHeight: "44px",
              }}
            >
              <ShoppingCart size={16} />
              <span>Pharmacy Cart ({cartCount})</span>
            </button>
          </div>

          {activeTab === "browse" ? (
            <MedicationBrowseComponent
              medications={MEDICATIONS_CATALOG}
              cartCount={cartCount}
              onOpenDetail={(med) => setSelectedMedication(med)}
              onAddToCart={handleAddToCart}
              onViewCart={() => setActiveTab("cart")}
            />
          ) : (
            <MedicationCartComponent
              items={cartItems}
              subtotal={subtotal}
              deliveryFee={deliveryFee}
              total={total}
              freeDeliveryThreshold={freeThreshold}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onClearCart={handleClearCart}
              onContinueShopping={() => setActiveTab("browse")}
              onProceedToCheckout={() => setShowCheckoutModal(true)}
            />
          )}

          {/* Medication Detail Modal */}
          {selectedMedication && (
            <MedicationDetailModal
              medication={selectedMedication}
              onClose={() => setSelectedMedication(null)}
              onAddToCart={(med, q) => handleAddToCart(med, q)}
            />
          )}

          {/* Order Checkout Modal */}
          {showCheckoutModal && (
            <OrderCheckoutModal
              subtotal={subtotal}
              deliveryFee={deliveryFee}
              itemCount={cartCount}
              onClose={() => setShowCheckoutModal(false)}
              onSuccess={(order) => {
                setShowCheckoutModal(false);
                fetchCart();
                router.push("/orders");
              }}
            />
          )}
        </div>
      </main>
    </>
  );
}

