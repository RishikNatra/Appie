"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MedicationItem, MedicationCartItem } from "@/lib/types";
import { MEDICATIONS_CATALOG } from "@/lib/medications-catalog";
import MedicationBrowseComponent from "@/components/medication/MedicationBrowseComponent";
import MedicationCartComponent from "@/components/medication/MedicationCartComponent";
import MedicationDetailModal from "@/components/medication/MedicationDetailModal";
import OrderCheckoutModal from "@/components/orders/OrderCheckoutModal";
import Navbar from "@/components/Navbar";
import { Activity, ShoppingCart, Pill, Settings } from "lucide-react";

export default function MedicationsPage() {
  const router = useRouter();
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
    } catch {
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
    } catch {
      alert("Failed to update cart");
    }
  };

  const handleRemoveItem = async (cartItemId: string) => {
    try {
      const res = await fetch(`/api/medications/cart?cartItemId=${cartItemId}`, {
        method: "DELETE",
      });
      if (res.ok) fetchCart();
    } catch {
      alert("Failed to remove item");
    }
  };

  const handleClearCart = async () => {
    try {
      const res = await fetch("/api/medications/cart?clear=all", {
        method: "DELETE",
      });
      if (res.ok) fetchCart();
    } catch {
      alert("Failed to clear cart");
    }
  };

  const cartCount = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);

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
            <Link href="/medications" className="form-link" style={{ minHeight: "40px", padding: "0 0.75rem", fontSize: "0.88rem", fontWeight: 700, color: "var(--color-accent)" }}>
              e-Pharmacy
            </Link>
            <Link href="/orders" className="form-link" style={{ minHeight: "40px", padding: "0 0.75rem", fontSize: "0.88rem", fontWeight: 600 }}>
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

        {/* 8. Settings icon at extreme top-right */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <button
            type="button"
            onClick={() => setActiveTab("cart")}
            aria-label="Medication Cart"
            style={{
              padding: "0.45rem 0.85rem",
              borderRadius: "10px",
              border: "1px solid var(--border-subtle)",
              background: "var(--bg-card)",
              color: "var(--text-primary)",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.45rem",
              cursor: "pointer",
              fontSize: "0.85rem",
              fontWeight: 700,
            }}
          >
            <ShoppingCart size={17} />
            <span>Cart ({cartCount})</span>
          </button>

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
        {/* Tab switch between Catalog & Cart */}
        {activeTab === "cart" && (
          <div style={{ marginBottom: "1rem" }}>
            <button
              type="button"
              onClick={() => setActiveTab("browse")}
              className="btn-secondary"
              style={{ minHeight: "38px", padding: "0 1rem", fontSize: "0.85rem" }}
            >
              ← Back to Catalog
            </button>
          </div>
        )}

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

        {selectedMedication && (
          <MedicationDetailModal
            medication={selectedMedication}
            onClose={() => setSelectedMedication(null)}
            onAddToCart={(med, qty) => {
              handleAddToCart(med, qty);
              setSelectedMedication(null);
            }}
          />
        )}

        {showCheckoutModal && (
          <OrderCheckoutModal
            subtotal={subtotal}
            deliveryFee={deliveryFee}
            itemCount={cartItems.length}
            onClose={() => setShowCheckoutModal(false)}
            onSuccess={() => {
              setShowCheckoutModal(false);
              fetchCart();
              router.push("/orders");
            }}
          />
        )}
      </main>
    </>
  );
}
