import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth-service";
import SignOutButton from "@/components/SignOutButton";
import ThemeToggle from "@/components/ThemeToggle";
import NotificationBell from "@/components/notifications/NotificationBell";
import {
  Truck,
  Activity,
  ShieldCheck,
  Navigation,
  MapPin,
  Clock,
  CheckCircle2,
  PhoneCall,
  PackageCheck,
  Award,
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Delivery Partner Dashboard - Appie Healthcare",
  description: "Pharmaceutical logistics, medicine dispatch, and doorstep delivery.",
};

export default async function DeliveryHomePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?role=delivery_partner");
  }

  return (
    <>
      <header className="app-header">
        <Link href="/delivery/home" className="brand-logo-wrap">
          <div className="brand-icon-box">
            <Activity size={22} strokeWidth={2.5} />
          </div>
          <div>
            <span className="brand-name">Appie</span>
          </div>
          <span className="brand-badge" style={{ backgroundColor: "rgba(29, 52, 138, 0.3)", color: "var(--text-primary)" }}>
            Logistics Fleet
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
              <span>Vehicle RC Verified • KA-05-EP-4912 (Motorcycle)</span>
            </div>
            <h1 style={{ fontSize: "1.85rem", fontWeight: 800, color: "var(--text-primary)" }}>
              {user.fullName || "Delivery Partner"}
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", marginTop: "0.25rem" }}>
              Logged in as <strong style={{ color: "var(--text-primary)" }}>{user.email}</strong> • Operating Zone: Indiranagar, Domlur &amp; Koramangala
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <div className="badge" style={{ backgroundColor: "rgba(34, 197, 94, 0.15)", color: "var(--color-success)", border: "1px solid rgba(34, 197, 94, 0.3)", padding: "0.6rem 1rem", fontSize: "0.9rem" }}>
              ● Online &amp; Receiving Orders
            </div>
          </div>
        </div>

        {/* Operational Statistics */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.25rem", marginBottom: "2.5rem" }}>
          <div style={{ backgroundColor: "var(--bg-card)", padding: "1.5rem", borderRadius: "16px", border: "1px solid var(--border-subtle)" }}>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
              Active Deliveries
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--color-accent)", margin: "0.25rem 0" }}>
              1
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--color-success)" }}>
              In Transit • ETA 12 mins
            </div>
          </div>

          <div style={{ backgroundColor: "var(--bg-card)", padding: "1.5rem", borderRadius: "16px", border: "1px solid var(--border-subtle)" }}>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
              Completed Drops Today
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-primary)", margin: "0.25rem 0" }}>
              9
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              100% on-time record
            </div>
          </div>

          <div style={{ backgroundColor: "var(--bg-card)", padding: "1.5rem", borderRadius: "16px", border: "1px solid var(--border-subtle)" }}>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
              Today&apos;s Earnings
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--color-success)", margin: "0.25rem 0" }}>
              ₹840
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              Instant transfer available
            </div>
          </div>

          <div style={{ backgroundColor: "var(--bg-card)", padding: "1.5rem", borderRadius: "16px", border: "1px solid var(--border-subtle)" }}>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
              Driver Rating
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--color-accent)", margin: "0.25rem 0" }}>
              4.95 ★
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              Based on 142 patient ratings
            </div>
          </div>
        </div>

        {/* Current Active Delivery Card */}
        <div style={{ backgroundColor: "var(--bg-card)", borderRadius: "20px", border: "1px solid var(--border-subtle)", padding: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--text-primary)" }}>
              Current Active Delivery Task
            </h2>
            <span className="badge" style={{ backgroundColor: "rgba(34, 197, 94, 0.15)", color: "var(--color-success)", border: "1px solid rgba(34, 197, 94, 0.3)" }}>
              Order #MED-849102
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "2rem" }}>
            {/* Pickup */}
            <div style={{ padding: "1.5rem", backgroundColor: "var(--bg-surface)", borderRadius: "16px", border: "1px solid var(--border-subtle)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--color-accent)", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase", marginBottom: "0.5rem" }}>
                <MapPin size={16} />
                <span>Pickup From (Partner Pharmacy)</span>
              </div>
              <div style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--text-primary)" }}>
                MedPlus Pharmacy - Indiranagar
              </div>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", marginTop: "0.35rem", lineHeight: 1.5 }}>
                Ground Floor, #12 CMH Road, Near Metro Station, Indiranagar, Bengaluru - 560038
              </p>
              <div style={{ marginTop: "1rem", display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "var(--color-success)", fontSize: "0.82rem", fontWeight: 700 }}>
                <PackageCheck size={16} />
                <span>Package Collected &amp; Sealed (Cold-Chain Verified: 22°C)</span>
              </div>
            </div>

            {/* Dropoff */}
            <div style={{ padding: "1.5rem", backgroundColor: "var(--bg-surface)", borderRadius: "16px", border: "1px solid var(--border-subtle)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--color-primary)", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase", marginBottom: "0.5rem" }}>
                <Navigation size={16} />
                <span>Deliver To (Patient Address)</span>
              </div>
              <div style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--text-primary)" }}>
                Rahul Verma
              </div>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", marginTop: "0.35rem", lineHeight: 1.5 }}>
                Flat 402, Green Valley Apartments, 100 Feet Road, Indiranagar, Bengaluru - 560038
              </p>
              <div style={{ marginTop: "1rem", display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "var(--text-muted)", fontSize: "0.82rem" }}>
                  <Clock size={15} />
                  <span>Estimated Arrival: 12 minutes</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", paddingTop: "1.5rem", borderTop: "1px solid var(--border-subtle)" }}>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button type="button" className="btn-secondary" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                <PhoneCall size={16} />
                <span>Call Patient</span>
              </button>
              <button type="button" className="btn-secondary" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                <Navigation size={16} />
                <span>Open Google Maps</span>
              </button>
            </div>

            <button type="button" className="btn-primary" style={{ minHeight: "48px", padding: "0 2rem", fontSize: "0.95rem" }}>
              Mark as Delivered &amp; Verify OTP
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
