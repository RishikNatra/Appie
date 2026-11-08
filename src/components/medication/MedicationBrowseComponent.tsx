"use client";

import { useState } from "react";
import { MedicationItem } from "@/lib/types";
import { MEDICATION_CATEGORIES } from "@/lib/medications-catalog";
import {
  Search,
  Filter,
  ArrowUpDown,
  ShoppingCart,
  Plus,
  Info,
  Clock,
  X,
  ShieldCheck,
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
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [sortModalOpen, setSortModalOpen] = useState(false);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [filterType, setFilterType] = useState<"all" | "otc" | "rx">("all");

  // Sorting
  const [sortBy, setSortBy] = useState<"name" | "price_low" | "price_high">("name");

  // Filter and Sort
  const filteredMeds = medications
    .filter((med) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        med.name.toLowerCase().includes(q) ||
        med.genericName.toLowerCase().includes(q) ||
        med.usageInstructions.toLowerCase().includes(q) ||
        (med.brandName && med.brandName.toLowerCase().includes(q));

      const matchesCategory = selectedCategory === "all" || med.category === selectedCategory;

      const matchesFilterType =
        filterType === "all" ||
        (filterType === "otc" && !med.prescriptionRequired) ||
        (filterType === "rx" && med.prescriptionRequired);

      return matchesSearch && matchesCategory && matchesFilterType;
    })
    .sort((a, b) => {
      if (sortBy === "price_low") return a.price - b.price;
      if (sortBy === "price_high") return b.price - a.price;
      return a.name.localeCompare(b.name);
    });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Top Banner with Large Cart Icon at Top-Right */}
      <div
        className="dashboard-card"
        style={{
          padding: "1.5rem 2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1.25rem",
        }}
      >
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800 }}>Appie Digital e-Pharmacy</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", marginTop: "0.25rem" }}>
            100% authentic pharmaceuticals, cold-chain compliant logistics, and verified prescription dispensation.
          </p>
        </div>

        {/* Large Cart Icon at top-right */}
        <button
          type="button"
          onClick={onViewCart}
          aria-label="View Medication Cart"
          className="btn-primary"
          style={{
            minHeight: "56px",
            padding: "0 1.5rem",
            borderRadius: "14px",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.75rem",
            fontSize: "1rem",
            fontWeight: 700,
          }}
        >
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <ShoppingCart size={26} strokeWidth={2.3} />
            {cartCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-10px",
                  right: "-12px",
                  background: "#ffffff",
                  color: "#000000",
                  fontSize: "0.78rem",
                  fontWeight: 900,
                  borderRadius: "12px",
                  padding: "1px 7px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                }}
              >
                {cartCount}
              </span>
            )}
          </div>
          <span>Medication Cart</span>
        </button>
      </div>

      {/* Search Bar with Single Sorting Icon & Single Filter Icon on the Right */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          flexWrap: "wrap",
        }}
      >
        {/* Neat Search Bar */}
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
            placeholder="Search catalog medicines by brand name, salt (generic), or therapeutic use..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: "42px", minHeight: "48px" }}
            aria-label="Search medicine catalog"
          />
        </div>

        {/* Single Sorting Icon beside Search Bar */}
        <button
          type="button"
          onClick={() => setSortModalOpen(true)}
          aria-label="Sort medications"
          title="Sort catalog"
          style={{
            minHeight: "48px",
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

        {/* Single Filter Icon beside Search Bar */}
        <button
          type="button"
          onClick={() => setFilterModalOpen(true)}
          aria-label="Filter medications"
          title="Filter catalog"
          style={{
            minHeight: "48px",
            padding: "0 1.1rem",
            borderRadius: "10px",
            border: selectedCategory !== "all" || filterType !== "all" ? "1.5px solid var(--color-accent)" : "1px solid var(--border-subtle)",
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

      {/* Active Filter Indicators */}
      {(selectedCategory !== "all" || filterType !== "all" || searchQuery) && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", fontSize: "0.82rem" }}>
          <span style={{ color: "var(--text-muted)" }}>Active Filters:</span>
          {selectedCategory !== "all" && (
            <span style={{ padding: "2px 8px", borderRadius: "12px", background: "var(--color-primary-subtle)", color: "var(--color-accent)" }}>
              Category: {selectedCategory}
            </span>
          )}
          {filterType !== "all" && (
            <span style={{ padding: "2px 8px", borderRadius: "12px", background: "var(--color-primary-subtle)", color: "var(--color-accent)" }}>
              Type: {filterType.toUpperCase()}
            </span>
          )}
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("all");
              setFilterType("all");
              setSearchQuery("");
            }}
            style={{ background: "transparent", border: "none", color: "var(--color-accent)", cursor: "pointer", textDecoration: "underline", marginLeft: "0.25rem" }}
          >
            Clear all
          </button>
        </div>
      )}

      {/* Clean Linear Catalogue Layout */}
      <div className="linear-container">
        {filteredMeds.length === 0 ? (
          <div className="dashboard-card" style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>
            No medications found matching your current search criteria.
          </div>
        ) : (
          filteredMeds.map((med) => {
            // Out of stock condition: e.g. stock === 0 or inStock === false
            const isOutOfStock = med.stock === 0 || med.inStock === false;

            return (
              <div
                key={med.id}
                className="linear-card"
                style={{
                  opacity: isOutOfStock ? 0.65 : 1,
                  filter: isOutOfStock ? "grayscale(0.2)" : "none",
                  padding: "1.25rem 1.5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "1.25rem",
                  borderRadius: "16px",
                  border: "1px solid var(--border-subtle)",
                  background: "var(--bg-surface)",
                  transition: "all 200ms ease",
                }}
              >
                {/* Left Section: Medicine info, pricing, details */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", flex: "1 1 340px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
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
                      {med.prescriptionRequired ? "Rx Prescription Required" : "OTC Product"}
                    </span>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      {med.dosageForm} • {med.packSize}
                    </span>
                  </div>

                  <h3 style={{ fontSize: "1.15rem", fontWeight: 700 }}>{med.name}</h3>
                  <div style={{ fontSize: "0.85rem", color: "var(--color-accent)", fontWeight: 600 }}>
                    {med.genericName}
                  </div>
                  <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>
                    {med.usageInstructions}
                  </p>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                    Manufacturer: {med.manufacturer}
                  </div>
                </div>

                {/* Right Section: Price & Out-of-Stock vs Add to Cart */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    justifyContent: "center",
                    gap: "0.5rem",
                    flexShrink: 0,
                  }}
                >
                  {/* Price */}
                  <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--text-primary)" }}>
                    ₹{med.price.toFixed(2)}
                  </div>

                  {/* Out of Stock Behavior strictly as instructed:
                      - Replace Add to Cart button with availability message in the bottom section
                      - Format: "Available tomorrow at X:00 AM"
                      - NO separate in-stock indication for available medicines */}
                  {isOutOfStock ? (
                    <div
                      style={{
                        padding: "0.5rem 0.9rem",
                        borderRadius: "8px",
                        background: "rgba(239, 68, 68, 0.1)",
                        color: "var(--color-error)",
                        fontSize: "0.82rem",
                        fontWeight: 700,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.4rem",
                      }}
                    >
                      <Clock size={15} />
                      <span>Available tomorrow at 9:00 AM</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onAddToCart(med, 1)}
                      className="btn-primary"
                      style={{
                        minHeight: "42px",
                        padding: "0 1.25rem",
                        fontSize: "0.88rem",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.45rem",
                      }}
                    >
                      <Plus size={16} />
                      <span>Add to Cart</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

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
          <div className="dashboard-card" style={{ maxWidth: "420px", width: "100%", padding: "1.75rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Filter Pharmacy</h3>
              <button
                type="button"
                onClick={() => setFilterModalOpen(false)}
                style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.4rem" }}>
                  Therapeutic Category
                </label>
                <select
                  className="form-input"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  {MEDICATION_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.4rem" }}>
                  Dispensation Type
                </label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  {[
                    { id: "all", label: "All Items" },
                    { id: "otc", label: "OTC Only" },
                    { id: "rx", label: "Prescription (Rx)" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setFilterType(t.id as any)}
                      style={{
                        flex: 1,
                        padding: "0.6rem",
                        borderRadius: "8px",
                        border: filterType === t.id ? "1.5px solid var(--color-accent)" : "1px solid var(--border-subtle)",
                        background: filterType === t.id ? "var(--color-primary-subtle)" : "var(--bg-surface)",
                        color: "var(--text-primary)",
                        fontSize: "0.82rem",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setFilterModalOpen(false)}
                className="btn-primary"
                style={{ minHeight: "44px", marginTop: "0.5rem" }}
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sorting Modal */}
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
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Sort Medications</h3>
              <button
                type="button"
                onClick={() => setSortModalOpen(false)}
                style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {[
                { id: "name", label: "Alphabetical (A - Z)" },
                { id: "price_low", label: "Price (Lowest to Highest)" },
                { id: "price_high", label: "Price (Highest to Lowest)" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setSortBy(opt.id as any);
                    setSortModalOpen(false);
                  }}
                  style={{
                    padding: "0.85rem 1rem",
                    borderRadius: "10px",
                    border: sortBy === opt.id ? "1.5px solid var(--color-accent)" : "1px solid var(--border-subtle)",
                    background: sortBy === opt.id ? "var(--color-primary-subtle)" : "var(--bg-surface)",
                    color: "var(--text-primary)",
                    fontWeight: 600,
                    fontSize: "0.88rem",
                    textAlign: "left",
                    cursor: "pointer",
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
