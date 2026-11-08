"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PrescriptionRecord } from "@/lib/types";
import PrescriptionListComponent from "@/components/prescription/PrescriptionListComponent";
import PrescriptionViewerModal from "@/components/prescription/PrescriptionViewerModal";
import DoctorIssuePrescriptionModal from "@/components/prescription/DoctorIssuePrescriptionModal";
import { Activity, Settings } from "lucide-react";
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
      {/* Persistent Top Navigation Bar */}
      <header className="app-header" style={{ position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          {/* 1. Appie logo and text */}
          <Link href={userRole === "health_professional" ? "/professional/home" : "/patient/home"} className="brand-logo-wrap" title="Appie Healthcare Dashboard">
            <div className="brand-icon-box">
              <Activity size={22} strokeWidth={2.5} />
            </div>
            <div>
              <span className="brand-name">Appie</span>
            </div>
            {userRole === "health_professional" && (
              <span className="brand-badge" style={{ marginLeft: "0.25rem" }}>
                Doctor
              </span>
            )}
          </Link>

          {/* 2-7. Patient Persistent Nav items */}
          {userRole === "patient" && (
            <nav style={{ display: "flex", alignItems: "center", gap: "0.25rem", flexWrap: "wrap" }}>
              <Link href="/assessment" className="form-link" style={{ minHeight: "40px", padding: "0 0.75rem", fontSize: "0.88rem", fontWeight: 600 }}>
                Health Assessment
              </Link>
              <Link href="/medications" className="form-link" style={{ minHeight: "40px", padding: "0 0.75rem", fontSize: "0.88rem", fontWeight: 600 }}>
                e-Pharmacy
              </Link>
              <Link href="/orders" className="form-link" style={{ minHeight: "40px", padding: "0 0.75rem", fontSize: "0.88rem", fontWeight: 600 }}>
                Orders
              </Link>
              <Link href="/prescriptions" className="form-link" style={{ minHeight: "40px", padding: "0 0.75rem", fontSize: "0.88rem", fontWeight: 700, color: "var(--color-accent)" }}>
                e-Prescriptions
              </Link>
              <Link href="/records" className="form-link" style={{ minHeight: "40px", padding: "0 0.75rem", fontSize: "0.88rem", fontWeight: 600 }}>
                Records
              </Link>
              <Link href="/account/profile" className="form-link" style={{ minHeight: "40px", padding: "0 0.75rem", fontSize: "0.88rem", fontWeight: 600 }}>
                Profile
              </Link>
            </nav>
          )}

          {userRole === "health_professional" && (
            <nav style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <Link href="/professional/home" className="form-link" style={{ minHeight: "40px", padding: "0 0.65rem", fontSize: "0.88rem" }}>
                Appointments
              </Link>
              <Link href="/prescriptions" className="form-link" style={{ minHeight: "40px", padding: "0 0.65rem", fontSize: "0.88rem", fontWeight: 700, color: "var(--color-accent)" }}>
                Issue Prescriptions
              </Link>
            </nav>
          )}
        </div>

        {/* 8. Settings icon at extreme right */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
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

      <main className="main-wrapper" style={{ maxWidth: "1100px", width: "100%", padding: "1.5rem 1rem 5rem" }}>
        <PrescriptionListComponent
          prescriptions={prescriptions}
          role={userRole}
          onSelectPrescription={(p: PrescriptionRecord) => setSelectedPrescription(p)}
          onCreateNew={() => setShowIssueModal(true)}
        />

        {selectedPrescription && (
          <PrescriptionViewerModal
            prescription={selectedPrescription}
            onClose={() => setSelectedPrescription(null)}
          />
        )}

        {showIssueModal && (
          <DoctorIssuePrescriptionModal
            patientId="patient-demo-user"
            patientName="Aditya Verma"
            onClose={() => setShowIssueModal(false)}
            onSuccess={(newRx) => {
              setShowIssueModal(false);
              fetchPrescriptions();
            }}
          />
        )}
      </main>
    </>
  );
}
