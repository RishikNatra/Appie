"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MedicalRecordItem, CareFollowUpItem } from "@/lib/types";
import AppieSystemNav from "@/components/AppieSystemNav";
import MedicalRecordsTimelineComponent from "@/components/records/MedicalRecordsTimelineComponent";
import CareFollowUpsComponent from "@/components/records/CareFollowUpsComponent";
import RecordUploadModal from "@/components/records/RecordUploadModal";
import NotificationBell from "@/components/notifications/NotificationBell";
import ThemeToggle from "@/components/ThemeToggle";
import SignOutButton from "@/components/SignOutButton";
import { Activity, FileText, CheckCircle2 } from "lucide-react";

export default function RecordsPage() {
  const [userRole, setUserRole] = useState<"patient" | "health_professional">("patient");
  const [activeTab, setActiveTab] = useState<"timeline" | "followups">("timeline");

  // Records state
  const [records, setRecords] = useState<MedicalRecordItem[]>([]);
  const [followUps, setFollowUps] = useState<CareFollowUpItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Upload Modal
  const [showUploadModal, setShowUploadModal] = useState(false);

  const fetchRecordsAndFollowUps = () => {
    setLoading(true);
    Promise.all([
      fetch("/api/records").then((r) => r.json()),
      fetch("/api/records/follow-ups").then((r) => r.json()),
    ])
      .then(([recordsData, followUpsData]) => {
        if (recordsData.records) setRecords(recordsData.records);
        if (followUpsData.followUps) setFollowUps(followUpsData.followUps);
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

    fetchRecordsAndFollowUps();
  }, []);

  const handleDeleteRecord = async (id: string) => {
    if (!confirm("Are you sure you want to remove this record from your vault?")) return;
    try {
      const res = await fetch(`/api/records/${id}`, { method: "DELETE" });
      if (res.ok) fetchRecordsAndFollowUps();
    } catch (err) {
      alert("Failed to delete record");
    }
  };

  const pendingFollowUpsCount = followUps.filter((f) => f.status === "pending").length;

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
          <span className="brand-badge">Records System</span>
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

          {/* Sub-Tabs: Timeline vs Care Follow-Ups */}
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "0.5rem" }}>
            <button
              type="button"
              onClick={() => setActiveTab("timeline")}
              style={{
                padding: "0.6rem 1.25rem",
                borderRadius: "8px",
                fontSize: "0.88rem",
                fontWeight: activeTab === "timeline" ? 700 : 500,
                border: "none",
                background: activeTab === "timeline" ? "rgba(255, 178, 0, 0.15)" : "transparent",
                color: activeTab === "timeline" ? "var(--color-accent)" : "var(--text-secondary)",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                minHeight: "44px",
              }}
            >
              <FileText size={16} />
              <span>Medical Records Timeline ({records.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("followups")}
              style={{
                padding: "0.6rem 1.25rem",
                borderRadius: "8px",
                fontSize: "0.88rem",
                fontWeight: activeTab === "followups" ? 700 : 500,
                border: "none",
                background: activeTab === "followups" ? "rgba(255, 178, 0, 0.15)" : "transparent",
                color: activeTab === "followups" ? "var(--color-accent)" : "var(--text-secondary)",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                minHeight: "44px",
              }}
            >
              <CheckCircle2 size={16} />
              <span>
                Care Follow-Ups ({pendingFollowUpsCount} Pending)
              </span>
            </button>
          </div>

          {loading ? (
            <p style={{ textAlign: "center", padding: "2rem", color: "var(--text-secondary)" }}>
              Loading health records...
            </p>
          ) : activeTab === "timeline" ? (
            <MedicalRecordsTimelineComponent
              records={records}
              onUploadClick={() => setShowUploadModal(true)}
              onDeleteRecord={handleDeleteRecord}
              onRefresh={fetchRecordsAndFollowUps}
            />
          ) : (
            <CareFollowUpsComponent
              followUps={followUps}
              onRefresh={fetchRecordsAndFollowUps}
            />
          )}

          {/* Upload Modal */}
          {showUploadModal && (
            <RecordUploadModal
              onClose={() => setShowUploadModal(false)}
              onSuccess={() => {
                setShowUploadModal(false);
                fetchRecordsAndFollowUps();
              }}
            />
          )}
        </div>
      </main>
    </>
  );
}

