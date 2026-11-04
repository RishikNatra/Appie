"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PrescriptionRecord } from "@/lib/types";
import AppieSystemNav from "@/components/AppieSystemNav";
import PrescriptionListComponent from "@/components/prescription/PrescriptionListComponent";
import PrescriptionViewerModal from "@/components/prescription/PrescriptionViewerModal";
import DoctorIssuePrescriptionModal from "@/components/prescription/DoctorIssuePrescriptionModal";
import NotificationBell from "@/components/notifications/NotificationBell";
import ThemeToggle from "@/components/ThemeToggle";
import SignOutButton from "@/components/SignOutButton";
import { Activity } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PrescriptionsPage() {
  const router = useRouter();
  const [userRole, setUserRole] = useState<"patient" | "health_professional">("patient");
  const [prescriptions, setPrescriptions] = useState<PrescriptionRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [selectedPrescription, setSelectedPrescription] = useState<PrescriptionRecord | null>(null);
  const [showIssueModal, setShowIssueModal] = useState(false);

  const fetchPrescriptions = () => {
    setLoading(true);
    fetch("/api/prescriptions")
      .then((res) => res.json())
      .then((data) => {
        if (data.prescriptions) setPrescriptions(data.prescriptions);
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

    fetchPrescriptions();
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
          <span className="brand-badge">E-Prescription System</span>
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

          {loading ? (
            <p style={{ textAlign: "center", padding: "2rem", color: "var(--text-secondary)" }}>
              Loading digital prescriptions...
            </p>
          ) : (
            <PrescriptionListComponent
              prescriptions={prescriptions}
              role={userRole}
              onSelectPrescription={(rx) => setSelectedPrescription(rx)}
              onCreateNew={() => setShowIssueModal(true)}
            />
          )}

          {/* Prescription Viewer Modal */}
          {selectedPrescription && (
            <PrescriptionViewerModal
              prescription={selectedPrescription}
              onClose={() => setSelectedPrescription(null)}
              onTransferToCart={() => {
                router.push("/medications");
              }}
            />
          )}

          {/* Clinician Issue E-Rx Modal */}
          {showIssueModal && (
            <DoctorIssuePrescriptionModal
              patientId="patient-demo-user"
              patientName="Aditya Verma"
              onClose={() => setShowIssueModal(false)}
              onSuccess={(newRx) => {
                setShowIssueModal(false);
                setSelectedPrescription(newRx);
                fetchPrescriptions();
              }}
            />
          )}
        </div>
      </main>
    </>
  );
}

