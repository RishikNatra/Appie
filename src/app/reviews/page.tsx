"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppieSystemNav from "@/components/AppieSystemNav";
import ClinicianReviewQueueComponent from "@/components/review/ClinicianReviewQueueComponent";
import DoctorIssuePrescriptionModal from "@/components/prescription/DoctorIssuePrescriptionModal";
import PrescriptionViewerModal from "@/components/prescription/PrescriptionViewerModal";
import NotificationBell from "@/components/notifications/NotificationBell";
import ThemeToggle from "@/components/ThemeToggle";
import SignOutButton from "@/components/SignOutButton";
import { Activity } from "lucide-react";
import { PrescriptionRecord } from "@/lib/types";

export default function ReviewsPage() {
  const [userRole, setUserRole] = useState<"patient" | "health_professional">("health_professional");
  const [issueRxPatientId, setIssueRxPatientId] = useState<string | null>(null);
  const [newIssuedRx, setNewIssuedRx] = useState<PrescriptionRecord | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUserRole(data.user.role);
      })
      .catch((err) => console.warn(err));
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
          <span className="brand-badge">Clinical Review System</span>
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

          <ClinicianReviewQueueComponent
            onIssuePrescriptionForPatient={(pId) => setIssueRxPatientId(pId)}
          />

          {issueRxPatientId && (
            <DoctorIssuePrescriptionModal
              patientId={issueRxPatientId}
              patientName="Aditya Verma"
              onClose={() => setIssueRxPatientId(null)}
              onSuccess={(rx) => {
                setIssueRxPatientId(null);
                setNewIssuedRx(rx);
              }}
            />
          )}

          {newIssuedRx && (
            <PrescriptionViewerModal
              prescription={newIssuedRx}
              onClose={() => setNewIssuedRx(null)}
            />
          )}
        </div>
      </main>
    </>
  );
}

