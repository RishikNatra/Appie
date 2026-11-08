"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { UserNotification } from "@/lib/types";
import AppieSystemNav from "@/components/AppieSystemNav";
import NotificationCenterComponent from "@/components/notifications/NotificationCenterComponent";
import NotificationBell from "@/components/notifications/NotificationBell";
import SignOutButton from "@/components/SignOutButton";
import { Activity, Settings } from "lucide-react";

export default function NotificationsPage() {
  const [userRole, setUserRole] = useState<"patient" | "health_professional">("patient");
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifs = () => {
    setLoading(true);
    fetch("/api/notifications")
      .then((res) => res.json())
      .then((data) => {
        if (data.notifications) setNotifications(data.notifications);
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

    fetchNotifs();
  }, []);

  const handleMarkRead = async (id: string) => {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notificationId: id }),
    });
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllRead = async () => {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markAll: true }),
    });
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/notifications?id=${id}`, {
      method: "DELETE",
    });
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

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
          <span className="brand-badge">Notification Center</span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <NotificationBell />
          <SignOutButton />
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

      <main className="main-wrapper">
        <div style={{ width: "100%", maxWidth: "960px", margin: "0 auto" }}>
          <AppieSystemNav role={userRole} />

          {loading ? (
            <p style={{ textAlign: "center", padding: "2rem", color: "var(--text-secondary)" }}>
              Loading updates...
            </p>
          ) : (
            <NotificationCenterComponent
              notifications={notifications}
              onMarkRead={handleMarkRead}
              onMarkAllRead={handleMarkAllRead}
              onDelete={handleDelete}
            />
          )}
        </div>
      </main>
    </>
  );
}

