"use client";

import { useState } from "react";
import { PaymentTransaction, ServiceType } from "@/lib/types";
import {
  CreditCard,
  FileText,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  Filter,
} from "lucide-react";

interface TransactionHistoryComponentProps {
  transactions: PaymentTransaction[];
  onViewInvoice: (transaction: PaymentTransaction) => void;
}

export default function TransactionHistoryComponent({
  transactions,
  onViewInvoice,
}: TransactionHistoryComponentProps) {
  const [filter, setFilter] = useState<ServiceType | "all">("all");

  const filtered = transactions.filter((t) => {
    if (filter === "all") return true;
    return t.serviceType === filter;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* Service Type Filter Chips */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "0.5rem" }}>
        {[
          { id: "all", label: "All Payments" },
          { id: "consultation", label: "Doctor Consultations" },
          { id: "medicine_order", label: "Pharmacy Orders" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilter(tab.id as any)}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              border: "none",
              fontSize: "0.85rem",
              fontWeight: filter === tab.id ? 700 : 500,
              background: filter === tab.id ? "rgba(255, 178, 0, 0.15)" : "transparent",
              color: filter === tab.id ? "var(--color-accent)" : "var(--text-secondary)",
              cursor: "pointer",
              minHeight: "44px",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div
          className="dashboard-card"
          style={{ textAlign: "center", padding: "3rem 1.5rem", color: "var(--text-secondary)" }}
        >
          <CreditCard size={36} color="var(--text-muted)" style={{ margin: "0 auto 0.75rem" }} />
          <h4 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.25rem" }}>
            No transactions found
          </h4>
          <p style={{ fontSize: "0.85rem" }}>
            Receipts and payment records for your services will appear here.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          {filtered.map((txn) => (
            <div
              key={txn.id}
              className="dashboard-card"
              style={{
                padding: "1.25rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "1rem",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ fontFamily: "monospace", fontWeight: 800, color: "var(--color-accent)", fontSize: "0.95rem" }}>
                    {txn.transactionCode}
                  </span>
                  <span
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: "10px",
                      background: txn.status === "success" ? "var(--color-success-bg)" : "rgba(255, 178, 0, 0.15)",
                      color: txn.status === "success" ? "var(--color-success)" : "var(--color-accent)",
                    }}
                  >
                    {txn.status.toUpperCase()}
                  </span>
                  <span
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: "10px",
                      background: "rgba(29, 52, 138, 0.15)",
                      color: "var(--color-primary)",
                      textTransform: "capitalize",
                    }}
                  >
                    {txn.serviceType.replace("_", " ")}
                  </span>
                </div>

                <h4 style={{ fontSize: "1.05rem", fontWeight: 700 }}>{txn.referenceTitle}</h4>

                <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                  <span>Date: {new Date(txn.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                  <span>Method: {txn.paymentMethod.toUpperCase()}</span>
                  <span>Ref: {txn.paymentGatewayRef}</span>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--color-accent)" }}>
                    ₹{txn.amount.toFixed(2)}
                  </div>
                  <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                    Includes ₹{txn.taxAmount.toFixed(2)} GST
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => onViewInvoice(txn)}
                  className="btn-secondary"
                  style={{ minHeight: "44px", fontSize: "0.82rem", padding: "0 0.85rem" }}
                >
                  <FileText size={15} />
                  <span>Invoice</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

