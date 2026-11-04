import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth-service";
import SignOutButton from "@/components/SignOutButton";
import ThemeToggle from "@/components/ThemeToggle";
import NotificationBell from "@/components/notifications/NotificationBell";
import {
  Pill,
  Activity,
  Building,
  ShieldCheck,
  Package,
  Truck,
  FileCheck2,
  Clock,
  CheckCircle2,
  Search,
  ExternalLink,
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Pharmacy Dashboard - Appie Healthcare",
  description: "Fulfill verified digital prescriptions and manage medicine delivery orders.",
};

export default async function PharmacistHomePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?role=pharmacist");
  }

  return (
    <>
      <header className="app-header">
        <Link href="/pharmacist/home" className="brand-logo-wrap">
          <div className="brand-icon-box">
            <Activity size={22} strokeWidth={2.5} />
          </div>
          <div>
            <span className="brand-name">Appie</span>
          </div>
          <span className="brand-badge" style={{ backgroundColor: "rgba(255, 178, 0, 0.2)", color: "var(--color-accent)" }}>
            Pharmacy Network
          </span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <NotificationBell />
          <ThemeToggle />
          <SignOutButton />
        </div>
      </header>

      <main className="main-wrapper" style={{ maxWidth: "1150px", width: "100%", padding: "2rem 1.5rem 5rem" }}>
        {/* Welcome Banner */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.25rem", marginBottom: "2rem", padding: "1.75rem 2rem", backgroundColor: "var(--bg-card)", borderRadius: "20px", border: "1px solid var(--border-subtle)" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", fontSize: "0.8rem", fontWeight: 700, color: "var(--color-success)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.4rem" }}>
              <ShieldCheck size={16} />
              <span>Drug License Verified • Form 20B/21B Active</span>
            </div>
            <h1 style={{ fontSize: "1.85rem", fontWeight: 800, color: "var(--text-primary)" }}>
              {user.fullName || "Partner Pharmacy"}
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", marginTop: "0.25rem" }}>
              Logged in as <strong style={{ color: "var(--text-primary)" }}>{user.email}</strong> • Dispensing Zone: Indiranagar &amp; East Bengaluru
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <Link href="/medications" className="btn-secondary" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
              <Pill size={16} />
              <span>Browse Catalog</span>
            </Link>
          </div>
        </div>

        {/* Operational Statistics */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.25rem", marginBottom: "2.5rem" }}>
          <div style={{ backgroundColor: "var(--bg-card)", padding: "1.5rem", borderRadius: "16px", border: "1px solid var(--border-subtle)" }}>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
              Orders to Pack
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--color-accent)", margin: "0.25rem 0" }}>
              4
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--color-success)" }}>
              ● 2 High Priority Prescriptions
            </div>
          </div>

          <div style={{ backgroundColor: "var(--bg-card)", padding: "1.5rem", borderRadius: "16px", border: "1px solid var(--border-subtle)" }}>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
              Courier Handover Ready
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-primary)", margin: "0.25rem 0" }}>
              6
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              Assigned to Swift Couriers
            </div>
          </div>

          <div style={{ backgroundColor: "var(--bg-card)", padding: "1.5rem", borderRadius: "16px", border: "1px solid var(--border-subtle)" }}>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
              Delivered Today
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--color-success)", margin: "0.25rem 0" }}>
              18
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              Avg. transit time: 28 mins
            </div>
          </div>

          <div style={{ backgroundColor: "var(--bg-card)", padding: "1.5rem", borderRadius: "16px", border: "1px solid var(--border-subtle)" }}>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
              Inventory Health
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--color-primary)", margin: "0.25rem 0" }}>
              99.4%
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              All essential OTC &amp; Rx stocked
            </div>
          </div>
        </div>

        {/* Prescription Orders Fulfillment Queue */}
        <div style={{ backgroundColor: "var(--bg-card)", borderRadius: "20px", border: "1px solid var(--border-subtle)", padding: "2rem", marginBottom: "2.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--text-primary)" }}>
                Incoming Prescription Orders Queue
              </h2>
              <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>
                Each order contains a verified digital doctor prescription and tamper-evident packaging QR code.
              </p>
            </div>

            <div style={{ display: "flex", gap: "0.5rem" }}>
              <span className="badge" style={{ backgroundColor: "var(--color-accent-subtle)", color: "var(--color-accent)", border: "1px solid rgba(255,178,0,0.3)" }}>
                Auto-Syncing with Doctors
              </span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {/* Order 1 */}
            <div style={{ padding: "1.5rem", backgroundColor: "var(--bg-surface)", borderRadius: "14px", border: "1px solid var(--border-subtle)", display: "grid", gridTemplateColumns: "1.2fr 1.5fr 1fr", gap: "1.5rem", alignItems: "center" }}>
              <div>
                <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--color-accent)", textTransform: "uppercase" }}>
                  Order #MED-849102
                </span>
                <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary)", marginTop: "0.2rem" }}>
                  Rahul Verma
                </div>
                <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
                  Prescribed by Dr. Ananya Sharma (MD) • eRx #RX-9921
                </div>
              </div>

              <div>
                <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-secondary)" }}>
                  Prescribed Medications:
                </div>
                <div style={{ fontSize: "0.88rem", color: "var(--text-primary)", marginTop: "0.25rem" }}>
                  • Amoxicillin 500mg (10 Tabs)<br />
                  • Paracetamol 650mg (15 Tabs)<br />
                  • Cetirizine 10mg (10 Tabs)
                </div>
              </div>

              <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.5rem" }}>
                <span className="badge" style={{ backgroundColor: "rgba(34, 197, 94, 0.15)", color: "var(--color-success)", border: "1px solid rgba(34, 197, 94, 0.3)" }}>
                  Verified by Doctor
                </span>
                <button type="button" className="btn-primary" style={{ minHeight: "42px", padding: "0 1.25rem", fontSize: "0.85rem" }}>
                  Pack &amp; Print Seal
                </button>
              </div>
            </div>

            {/* Order 2 */}
            <div style={{ padding: "1.5rem", backgroundColor: "var(--bg-surface)", borderRadius: "14px", border: "1px solid var(--border-subtle)", display: "grid", gridTemplateColumns: "1.2fr 1.5fr 1fr", gap: "1.5rem", alignItems: "center" }}>
              <div>
                <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--color-accent)", textTransform: "uppercase" }}>
                  Order #MED-849105
                </span>
                <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary)", marginTop: "0.2rem" }}>
                  Pooja Deshmukh
                </div>
                <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
                  Prescribed by Dr. Rajesh Mehta (DNB) • eRx #RX-9924
                </div>
              </div>

              <div>
                <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-secondary)" }}>
                  Prescribed Medications:
                </div>
                <div style={{ fontSize: "0.88rem", color: "var(--text-primary)", marginTop: "0.25rem" }}>
                  • Pantoprazole 40mg (14 Caps)<br />
                  • Antacid Gel Suspension (200 ml)
                </div>
              </div>

              <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.5rem" }}>
                <span className="badge" style={{ backgroundColor: "rgba(29, 52, 138, 0.2)", color: "var(--color-primary)", border: "1px solid rgba(29, 52, 138, 0.4)" }}>
                  Handover to Courier
                </span>
                <button type="button" className="btn-secondary" style={{ minHeight: "42px", padding: "0 1.25rem", fontSize: "0.85rem" }}>
                  Track Courier Rider
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
