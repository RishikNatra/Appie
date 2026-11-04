"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, HeartPulse, ShieldCheck, Settings, Award } from "lucide-react";

interface AccountNavBarProps {
  role?: "patient" | "health_professional";
}

export default function AccountNavBar({ role }: AccountNavBarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      label: "User Profile",
      href: "/account/profile",
      icon: User,
      active: pathname.startsWith("/account/profile"),
    },
    {
      label: "Health Profile",
      href: "/account/health-profile",
      icon: HeartPulse,
      active: pathname.startsWith("/account/health-profile"),
    },
    {
      label: "Consent Management",
      href: "/account/consents",
      icon: ShieldCheck,
      active: pathname.startsWith("/account/consents"),
    },
    {
      label: "Account Settings",
      href: "/account/settings",
      icon: Settings,
      active: pathname.startsWith("/account/settings"),
    },
  ];

  if (role === "health_professional") {
    navItems.push({
      label: "Medical Verification",
      href: "/professional/verify-status",
      icon: Award,
      active: pathname.startsWith("/professional/verify-status"),
    });
  }

  return (
    <nav className="account-nav-bar" aria-label="Account System Navigation">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`account-nav-tab ${item.active ? "active" : ""}`}
          >
            <Icon size={18} strokeWidth={2.2} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

