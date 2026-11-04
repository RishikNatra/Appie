"use client";

import { PaymentTransaction } from "@/lib/types";
import {
  X,
  Printer,
  ShieldCheck,
  CheckCircle2,
  Building2,
  FileText,
} from "lucide-react";

interface InvoiceReceiptModalProps {
  transaction: PaymentTransaction | null;
  onClose: () => void;
}

export default function InvoiceReceiptModal({
  transaction,
  onClose,
}: InvoiceReceiptModalProps) {
  if (!transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  const gstRate = transaction.serviceType === "consultation" ? 18 : 12;
  const taxableAmount = transaction.amount - transaction.taxAmount;
  const cgst = transaction.taxAmount / 2;
  const sgst = transaction.taxAmount / 2;

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999,
        background: "rgba(0, 0, 0, 0.8)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <div
        className="dashboard-card"
        style={{
          width: "100%",
          maxWidth: "680px",
          maxHeight: "92vh",
          overflowY: "auto",
          padding: "2.25rem",
          position: "relative",
          animation: "fadeIn 250ms ease",
          background: "var(--bg-card)",
          border: "2px solid var(--border-medium)",
        }}
      >
        <button
          type="button"
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1.25rem",
            right: "1.25rem",
            background: "transparent",
            border: "none",
            color: "var(--text-secondary)",
            cursor: "pointer",
            minHeight: "44px",
            minWidth: "44px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-label="Close"
        >
          <X size={22} />
        </button>

        {/* Invoice Header */}
        <div
          style={{
            borderBottom: "2px solid var(--color-primary)",
            paddingBottom: "1.25rem",
            marginBottom: "1.25rem",
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "0.25rem" }}>
              <div
                style={{
                  background: "var(--color-primary)",
                  color: "#ffffff",
                  padding: "4px 8px",
                  borderRadius: "6px",
                  fontWeight: 800,
                  fontSize: "0.95rem",
                }}
              >
                APPIE
              </div>
              <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-secondary)" }}>
                Tax Invoice & Payment Receipt
              </span>
            </div>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 800 }}>Appie Digital Healthcare Pvt Ltd</h2>
            <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
              GSTIN: 29AABCU9603R1ZM • Telemedicine & Digital Pharmacy Services
            </p>
            <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
              Indiranagar, Bengaluru, Karnataka 560038, India
            </p>
          </div>

          <div style={{ textAlign: "right", fontSize: "0.82rem" }}>
            <div style={{ fontWeight: 800, fontSize: "1.1rem", color: "var(--color-accent)", fontFamily: "monospace" }}>
              {transaction.transactionCode}
            </div>
            <div style={{ color: "var(--text-secondary)" }}>
              Date: {new Date(transaction.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            </div>
            <div style={{ color: "var(--color-success)", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "4px", marginTop: "2px" }}>
              <CheckCircle2 size={14} /> Payment Confirmed
            </div>
          </div>
        </div>

        {/* Customer & Gateway Reference */}
        <div
          style={{
            background: "var(--bg-surface)",
            padding: "0.85rem 1rem",
            borderRadius: "10px",
            border: "1px solid var(--border-subtle)",
            marginBottom: "1.25rem",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "0.75rem",
            fontSize: "0.82rem",
          }}
        >
          <div>
            <span style={{ color: "var(--text-muted)", display: "block" }}>Billed To</span>
            <strong>{transaction.userName || "Aditya Verma"}</strong>
          </div>
          <div>
            <span style={{ color: "var(--text-muted)", display: "block" }}>Payment Method</span>
            <strong>{transaction.paymentMethod.toUpperCase()} Instant Transfer</strong>
          </div>
          <div>
            <span style={{ color: "var(--text-muted)", display: "block" }}>Gateway Reference</span>
            <strong style={{ fontFamily: "monospace" }}>{transaction.paymentGatewayRef}</strong>
          </div>
        </div>

        {/* Itemized Table */}
        <div style={{ marginBottom: "1.5rem" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
            <thead>
              <tr style={{ borderBottom: "1.5px solid var(--border-medium)", textAlign: "left", color: "var(--text-muted)" }}>
                <th style={{ padding: "0.6rem 0" }}>Service Description</th>
                <th style={{ padding: "0.6rem 0", textAlign: "right" }}>Taxable (₹)</th>
                <th style={{ padding: "0.6rem 0", textAlign: "right" }}>GST Rate</th>
                <th style={{ padding: "0.6rem 0", textAlign: "right" }}>Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                <td style={{ padding: "0.75rem 0" }}>
                  <strong>{transaction.referenceTitle || `${transaction.serviceType.replace("_", " ")}`}</strong>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    Digital Telehealth / Medication Processing Service
                  </div>
                </td>
                <td style={{ padding: "0.75rem 0", textAlign: "right" }}>
                  ₹{taxableAmount.toFixed(2)}
                </td>
                <td style={{ padding: "0.75rem 0", textAlign: "right" }}>
                  {gstRate}%
                </td>
                <td style={{ padding: "0.75rem 0", textAlign: "right", fontWeight: 700 }}>
                  ₹{transaction.amount.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Tax Breakdown */}
        <div
          style={{
            background: "var(--bg-surface)",
            borderRadius: "10px",
            padding: "1rem",
            marginBottom: "1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.35rem",
            fontSize: "0.82rem",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "var(--text-secondary)" }}>Taxable Value:</span>
            <span>₹{taxableAmount.toFixed(2)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "var(--text-secondary)" }}>Central GST (CGST {gstRate / 2}%):</span>
            <span>₹{cgst.toFixed(2)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "var(--text-secondary)" }}>State GST (SGST {gstRate / 2}%):</span>
            <span>₹{sgst.toFixed(2)}</span>
          </div>
          <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "0.5rem", marginTop: "0.2rem", display: "flex", justifyContent: "space-between", fontSize: "1.15rem", fontWeight: 800 }}>
            <span>Total Paid:</span>
            <span style={{ color: "var(--color-accent)" }}>₹{transaction.amount.toFixed(2)}</span>
          </div>
        </div>

        {/* Footer info & Actions */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
          <button
            type="button"
            onClick={handlePrint}
            className="btn-secondary"
            style={{ minHeight: "44px", fontSize: "0.85rem", padding: "0 1rem" }}
          >
            <Printer size={16} />
            <span>Print Invoice</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="btn-primary"
            style={{ minHeight: "44px", padding: "0 1.25rem", fontSize: "0.85rem" }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

