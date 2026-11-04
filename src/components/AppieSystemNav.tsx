"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  CalendarCheck2,
  Pill,
  FileCheck,
  ClipboardList,
  User,
  HeartPulse,
  Truck,
  FileText,
  CreditCard,
} from "lucide-react";

interface AppieSystemNavProps {
  role?: "patient" | "health_professional";
}

export default function AppieSystemNav({ role = "patient" }: AppieSystemNavProps) {
  const pathname = usePathname();

  const isPatient = role === "patient";

  const patientTabs = [
    {
      label: "Health Assessment",
      href: "/patient/home",
      icon: Activity,
      active: pathname === "/patient/home" || pathname.startsWith("/assessment"),
    },
    {
      label: "Consultations",
      href: "/consultations",
      icon: CalendarCheck2,
      active: pathname.startsWith("/consultations"),
    },
    {
      label: "Pharmacy & Meds",
      href: "/medications",
      icon: Pill,
      active: pathname.startsWith("/medications"),
    },
    {
      label: "Orders & Delivery",
      href: "/orders",
      icon: Truck,
      active: pathname.startsWith("/orders"),
    },
    {
      label: "E-Prescriptions",
      href: "/prescriptions",
      icon: FileCheck,
      active: pathname.startsWith("/prescriptions"),
    },
    {
      label: "Health Records",
      href: "/records",
      icon: FileText,
      active: pathname.startsWith("/records"),
    },
    {
      label: "Payments",
      href: "/payments",
      icon: CreditCard,
      active: pathname.startsWith("/payments"),
    },
    {
      label: "Health Profile",
      href: "/account/health-profile",
      icon: HeartPulse,
      active: pathname.startsWith("/account/health-profile"),
    },
  ];

  const professionalTabs = [
    {
      label: "Clinician Home",
      href: "/professional/home",
      icon: Activity,
      active: pathname === "/professional/home",
    },
    {
      label: "Consultations & Schedule",
      href: "/consultations",
      icon: CalendarCheck2,
      active: pathname.startsWith("/consultations"),
    },
    {
      label: "Clinical Review Queue",
      href: "/reviews",
      icon: ClipboardList,
      active: pathname.startsWith("/reviews"),
    },
    {
      label: "Issued Prescriptions",
      href: "/prescriptions",
      icon: FileCheck,
      active: pathname.startsWith("/prescriptions"),
    },
    {
      label: "Drug Catalog",
      href: "/medications",
      icon: Pill,
      active: pathname.startsWith("/medications"),
    },
    {
      label: "Invoices & Billing",
      href: "/payments",
      icon: CreditCard,
      active: pathname.startsWith("/payments"),
    },
  ];

  const tabs = isPatient ? patientTabs : professionalTabs;

  return (
    <nav
      className="account-nav-bar"
      aria-label="Appie System Navigation"
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "0.5rem",
        marginBottom: "1.75rem",
        padding: "0.5rem",
        background: "var(--bg-card)",
        borderRadius: "14px",
        border: "1px solid var(--border-subtle)",
      }}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`account-nav-tab ${tab.active ? "active" : ""}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.55rem",
              padding: "0.65rem 1rem",
              borderRadius: "10px",
              fontSize: "0.9rem",
              fontWeight: tab.active ? 700 : 500,
              textDecoration: "none",
              color: tab.active ? "var(--color-accent)" : "var(--text-secondary)",
              background: tab.active ? "rgba(29, 52, 138, 0.25)" : "transparent",
              border: tab.active ? "1px solid var(--color-primary)" : "1px solid transparent",
              transition: "all 250ms ease",
              minHeight: "48px",
            }}
          >
            <Icon size={18} strokeWidth={tab.active ? 2.5 : 2} />
            <span>{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

