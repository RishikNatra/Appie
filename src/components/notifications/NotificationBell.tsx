"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { UserNotification } from "@/lib/types";
import { Bell, Check, ExternalLink, Calendar, Truck, FileCheck, Activity } from "lucide-react";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifs = () => {
    fetch("/api/notifications")
      .then((res) => res.json())
      .then((data) => {
        if (data.notifications) {
          setNotifications(data.notifications.slice(0, 5));
          setUnreadCount(data.unreadCount || 0);
        }
      })
      .catch((err) => console.warn(err));
  };

  useEffect(() => {
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 30000); // 30s background poll
    return () => clearInterval(interval);
  }, []);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAllRead = async () => {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markAll: true }),
    });
    setUnreadCount(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case "consultation":
        return <Calendar size={14} color="var(--color-primary)" />;
      case "order":
        return <Truck size={14} color="var(--color-accent)" />;
      case "prescription":
        return <FileCheck size={14} color="var(--color-success)" />;
      default:
        return <Activity size={14} color="var(--color-accent)" />;
    }
  };

  return (
    <div style={{ position: "relative" }} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "relative",
          background: "transparent",
          border: "1px solid var(--border-subtle)",
          borderRadius: "8px",
          width: "42px",
          height: "42px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--text-primary)",
          cursor: "pointer",
          transition: "all 250ms ease",
        }}
        aria-label="Notifications"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: "-4px",
              right: "-4px",
              background: "var(--color-accent)",
              color: "#000000",
              fontSize: "0.7rem",
              fontWeight: 800,
              width: "18px",
              height: "18px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className="dashboard-card"
          style={{
            position: "absolute",
            top: "50px",
            right: 0,
            width: "340px",
            padding: "1rem",
            zIndex: 1000,
            boxShadow: "var(--shadow-lg)",
            border: "1px solid var(--border-medium)",
            animation: "fadeIn 200ms ease",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
            <strong style={{ fontSize: "0.95rem" }}>Notifications</strong>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: "0.75rem",
                  color: "var(--color-accent)",
                  cursor: "pointer",
                }}
              >
                Mark all read
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", textAlign: "center", padding: "1rem 0" }}>
              No notifications yet.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {notifications.map((n) => (
                <Link
                  key={n.id}
                  href={n.linkUrl || "/notifications"}
                  onClick={() => setIsOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.6rem",
                    padding: "0.6rem",
                    borderRadius: "8px",
                    background: n.isRead ? "transparent" : "rgba(255, 178, 0, 0.08)",
                    border: n.isRead ? "1px solid transparent" : "1px solid var(--border-accent)",
                    textDecoration: "none",
                    color: "inherit",
                    fontSize: "0.8rem",
                  }}
                >
                  <div style={{ marginTop: "2px" }}>{getIconForType(n.type)}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, marginBottom: "2px" }}>{n.title}</div>
                    <div style={{ color: "var(--text-secondary)", fontSize: "0.75rem", lineHeight: 1.3 }}>
                      {n.message}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div style={{ borderTop: "1px solid var(--border-subtle)", marginTop: "0.75rem", paddingTop: "0.6rem", textAlign: "center" }}>
            <Link
              href="/notifications"
              onClick={() => setIsOpen(false)}
              style={{ fontSize: "0.8rem", color: "var(--color-accent)", textDecoration: "none", fontWeight: 700 }}
            >
              View All Notifications →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

