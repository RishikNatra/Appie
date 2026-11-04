"use client";

import { useState } from "react";
import Link from "next/link";
import { UserNotification, NotificationType } from "@/lib/types";
import {
  Bell,
  Calendar,
  Truck,
  FileCheck,
  CreditCard,
  Activity,
  Trash2,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

interface NotificationCenterComponentProps {
  notifications: UserNotification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onDelete: (id: string) => void;
}

export default function NotificationCenterComponent({
  notifications,
  onMarkRead,
  onMarkAllRead,
  onDelete,
}: NotificationCenterComponentProps) {
  const [filter, setFilter] = useState<NotificationType | "all">("all");

  const filtered = notifications.filter((n) => {
    if (filter === "all") return true;
    return n.type === filter;
  });

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case "consultation":
        return <Calendar size={18} color="var(--color-primary)" />;
      case "order":
        return <Truck size={18} color="var(--color-accent)" />;
      case "prescription":
        return <FileCheck size={18} color="var(--color-success)" />;
      case "payment":
        return <CreditCard size={18} color="var(--color-accent)" />;
      default:
        return <Activity size={18} color="var(--color-primary)" />;
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* Header with Mark all read */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
        <div>
          <h2 style={{ fontSize: "1.35rem", fontWeight: 800 }}>Notification Center</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
            Real-time updates regarding your assessments, doctor consults, medicine shipments, and bills.
          </p>
        </div>

        {notifications.some((n) => !n.isRead) && (
          <button
            type="button"
            onClick={onMarkAllRead}
            className="btn-secondary"
            style={{ minHeight: "44px", fontSize: "0.82rem", padding: "0 1rem" }}
          >
            <CheckCircle2 size={16} />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "0.5rem" }}>
        {[
          { id: "all", label: "All Updates" },
          { id: "consultation", label: "Consultations" },
          { id: "order", label: "Medicine Orders" },
          { id: "prescription", label: "E-Prescriptions" },
          { id: "payment", label: "Payments" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilter(tab.id as any)}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              border: "none",
              fontSize: "0.82rem",
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
          <Bell size={36} color="var(--text-muted)" style={{ margin: "0 auto 0.75rem" }} />
          <h4 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.25rem" }}>
            No notifications
          </h4>
          <p style={{ fontSize: "0.85rem" }}>You are completely caught up!</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {filtered.map((n) => (
            <div
              key={n.id}
              className="dashboard-card"
              style={{
                padding: "1.25rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "1rem",
                background: n.isRead ? "var(--bg-card)" : "rgba(255, 178, 0, 0.05)",
                border: n.isRead ? "1px solid var(--border-subtle)" : "1px solid var(--border-accent)",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", flex: "1 1 320px" }}>
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "10px",
                    background: "var(--bg-surface)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {getIcon(n.type)}
                </div>

                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.2rem" }}>
                    <h4 style={{ fontSize: "0.98rem", fontWeight: 700 }}>{n.title}</h4>
                    {!n.isRead && (
                      <span
                        style={{
                          fontSize: "0.68rem",
                          fontWeight: 800,
                          padding: "2px 6px",
                          borderRadius: "6px",
                          background: "var(--color-accent)",
                          color: "#000000",
                        }}
                      >
                        NEW
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>
                    {n.message}
                  </p>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem", display: "block" }}>
                    {new Date(n.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                {n.linkUrl && (
                  <Link
                    href={n.linkUrl}
                    onClick={() => onMarkRead(n.id)}
                    className="btn-primary"
                    style={{ minHeight: "44px", fontSize: "0.82rem", padding: "0 1rem", textDecoration: "none" }}
                  >
                    <span>View Details</span>
                    <ArrowRight size={14} />
                  </Link>
                )}

                <button
                  type="button"
                  onClick={() => onDelete(n.id)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "var(--text-muted)",
                    cursor: "pointer",
                    padding: "0.5rem",
                    minHeight: "44px",
                    minWidth: "44px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  title="Delete notification"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

