"use client";

import { useState } from "react";
import { MedicationItem, MedicationCategory } from "@/lib/types";
import { MEDICATION_CATEGORIES } from "@/lib/medications-catalog";
import {
  Search,
  Filter,
  Pill,
  ShoppingCart,
  Plus,
  Info,
  CheckCircle2,
  AlertCircle,
  FileCheck,
} from "lucide-react";

interface MedicationBrowseComponentProps {
  medications: MedicationItem[];
  cartCount: number;
  onOpenDetail: (medication: MedicationItem) => void;
  onAddToCart: (medication: MedicationItem, quantity: number) => void;
  onViewCart: () => void;
}

export default function MedicationBrowseComponent({
  medications,
  cartCount,
  onOpenDetail,
  onAddToCart,
  onViewCart,
}: MedicationBrowseComponentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [filterType, setFilterType] = useState<"all" | "otc" | "rx">("all");

  const filteredMeds = medications.filter((med) => {
    const matchesSearch =
      !searchQuery ||
      med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.usageInstructions.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (med.brandName && med.brandName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === "all" || med.category === selectedCategory;

    const matchesFilterType =
      filterType === "all" ||
      (filterType === "otc" && !med.prescriptionRequired) ||
      (filterType === "rx" && med.prescriptionRequired);

    return matchesSearch && matchesCategory && matchesFilterType;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Top Banner with Cart Button */}
      <div
        className="dashboard-card"
        style={{
          padding: "1.5rem",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <div>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 800 }}>Appie Digital Pharmacy</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem" }}>
            Authentic OTC medicines, health supplements, and verified e-prescription fulfillment.
          </p>
        </div>

        <button
          type="button"
          onClick={onViewCart}
          className="btn-primary"
          style={{ minHeight: "48px", padding: "0 1.25rem", position: "relative" }}
        >
          <ShoppingCart size={18} />
          <span>View Cart</span>
          {cartCount > 0 && (
            <span
              style={{
                background: "var(--color-accent)",
                color: "#000000",
                fontSize: "0.78rem",
                fontWeight: 800,
                borderRadius: "12px",
                padding: "2px 7px",
                marginLeft: "4px",
              }}
            >
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Search & Filter Component */}
      <div
        className="dashboard-card"
        style={{
          padding: "1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "center" }}>
          {/* Search Bar */}
          <div style={{ flex: "1 1 280px", position: "relative" }}>
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
              placeholder="Search by medicine name, salt (e.g. Paracetamol), or symptom..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: "42px", minHeight: "48px" }}
              aria-label="Search medicine catalog"
            />
          </div>

          {/* Type Toggle (All, OTC, Prescription) */}
          <div style={{ display: "flex", gap: "0.4rem" }}>
            {[
              { id: "all", label: "All Items" },
              { id: "otc", label: "OTC Only" },
              { id: "rx", label: "Prescription (Rx)" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterType(tab.id as any)}
                style={{
                  padding: "0.5rem 0.85rem",
                  borderRadius: "8px",
                  fontSize: "0.82rem",
                  fontWeight: filterType === tab.id ? 700 : 500,
                  border: filterType === tab.id ? "1.5px solid var(--color-accent)" : "1px solid var(--border-subtle)",
                  background: filterType === tab.id ? "rgba(255, 178, 0, 0.12)" : "var(--bg-surface)",
                  color: filterType === tab.id ? "var(--color-accent)" : "var(--text-secondary)",
                  cursor: "pointer",
                  minHeight: "48px",
                  transition: "all 250ms ease",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", overflowX: "auto", paddingBottom: "0.25rem" }}>
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            style={{
              padding: "0.35rem 0.8rem",
              borderRadius: "16px",
              fontSize: "0.8rem",
              fontWeight: selectedCategory === "all" ? 700 : 500,
              border: selectedCategory === "all" ? "1px solid var(--color-primary)" : "1px solid var(--border-subtle)",
              background: selectedCategory === "all" ? "var(--color-primary)" : "var(--bg-surface)",
              color: selectedCategory === "all" ? "#ffffff" : "var(--text-secondary)",
              cursor: "pointer",
              transition: "all 250ms ease",
              minHeight: "36px",
            }}
          >
            All Categories
          </button>
          {MEDICATION_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                padding: "0.35rem 0.8rem",
                borderRadius: "16px",
                fontSize: "0.8rem",
                fontWeight: selectedCategory === cat.id ? 700 : 500,
                border: selectedCategory === cat.id ? "1px solid var(--color-primary)" : "1px solid var(--border-subtle)",
                background: selectedCategory === cat.id ? "var(--color-primary)" : "var(--bg-surface)",
                color: selectedCategory === cat.id ? "#ffffff" : "var(--text-secondary)",
                cursor: "pointer",
                transition: "all 250ms ease",
                minHeight: "36px",
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Medication Result List Component */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>
            Catalog Medicines ({filteredMeds.length})
          </h3>
          <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
            Verified Authentic Pharma Inventory
          </span>
        </div>

        {filteredMeds.length === 0 ? (
          <div
            className="dashboard-card"
            style={{ textAlign: "center", padding: "3rem 1.5rem", color: "var(--text-secondary)" }}
          >
            <p>No medications matched your current search filters.</p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setFilterType("all");
              }}
              className="btn-secondary"
              style={{ minHeight: "44px", marginTop: "0.75rem" }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {filteredMeds.map((med) => (
              /* Medication Summary Card Component */
              <div
                key={med.id}
                className="dashboard-card"
                style={{
                  padding: "1.25rem",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: "1rem",
                  position: "relative",
                  transition: "transform 250ms ease, border-color 250ms ease",
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                    <span
                      style={{
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        padding: "2px 7px",
                        borderRadius: "8px",
                        background: med.prescriptionRequired ? "var(--color-error-bg)" : "var(--color-success-bg)",
                        color: med.prescriptionRequired ? "var(--color-error)" : "var(--color-success)",
                      }}
                    >
                      {med.prescriptionRequired ? "Rx Required" : "OTC"}
                    </span>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      {med.dosageForm}
                    </span>
                  </div>

                  <h4 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "0.2rem" }}>
                    {med.name}
                  </h4>
                  <p style={{ color: "var(--color-accent)", fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.3rem" }}>
                    {med.genericName}
                  </p>
                  <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                    {med.packSize} • {med.manufacturer}
                  </p>
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.75rem" }}>
                    <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--color-accent)" }}>
                      ₹{med.price.toFixed(2)}
                    </div>
                    <span style={{ fontSize: "0.75rem", color: "var(--color-success)", fontWeight: 600 }}>
                      ✓ In Stock
                    </span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                    <button
                      type="button"
                      onClick={() => onOpenDetail(med)}
                      className="btn-secondary"
                      style={{ minHeight: "44px", fontSize: "0.82rem", padding: "0 0.5rem" }}
                    >
                      <Info size={14} />
                      <span>Details</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onAddToCart(med, 1)}
                      className="btn-primary"
                      style={{ minHeight: "44px", fontSize: "0.82rem", padding: "0 0.5rem" }}
                    >
                      <Plus size={15} />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

