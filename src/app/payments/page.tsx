"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PaymentTransaction } from "@/lib/types";
import AppieSystemNav from "@/components/AppieSystemNav";
import TransactionHistoryComponent from "@/components/payments/TransactionHistoryComponent";
import InvoiceReceiptModal from "@/components/payments/InvoiceReceiptModal";
import NotificationBell from "@/components/notifications/NotificationBell";
import ThemeToggle from "@/components/ThemeToggle";
import SignOutButton from "@/components/SignOutButton";
import { Activity, CreditCard, ShieldCheck } from "lucide-react";

export default function PaymentsPage() {
  const [userRole, setUserRole] = useState<"patient" | "health_professional">("patient");
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTxn, setSelectedTxn] = useState<PaymentTransaction | null>(null);

  const fetchTransactions = () => {
    setLoading(true);
    fetch("/api/payments/transactions")
      .then((res) => res.json())
      .then((data) => {
        if (data.transactions) setTransactions(data.transactions);
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

    fetchTransactions();
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
          <span className="brand-badge">Payment & Transactions</span>
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

          {/* Header Banner */}
          <div
            className="dashboard-card"
            style={{
              padding: "1.5rem",
              marginBottom: "1.5rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div>
              <h2 style={{ fontSize: "1.35rem", fontWeight: 800 }}>Payment & Billing System</h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                Official GST tax invoices, refund records, and secure transactions for all consultations and medicines.
              </p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--color-success)", fontSize: "0.85rem", fontWeight: 700 }}>
              <ShieldCheck size={18} />
              <span>PCI-DSS & RBI Compliant Processing</span>
            </div>
          </div>

          {loading ? (
            <p style={{ textAlign: "center", padding: "2rem", color: "var(--text-secondary)" }}>
              Loading transactions...
            </p>
          ) : (
            <TransactionHistoryComponent
              transactions={transactions}
              onViewInvoice={(txn) => setSelectedTxn(txn)}
            />
          )}

          {/* Invoice Modal */}
          {selectedTxn && (
            <InvoiceReceiptModal
              transaction={selectedTxn}
              onClose={() => setSelectedTxn(null)}
            />
          )}
        </div>
      </main>
    </>
  );
}

