"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  DoctorDiscoveryItem,
  ConsultationAppointment,
  PrescriptionRecord,
} from "@/lib/types";
import { DOCTORS_CATALOG } from "@/lib/doctors-catalog";
import AppieSystemNav from "@/components/AppieSystemNav";
import DoctorDiscoveryComponent from "@/components/consultation/DoctorDiscoveryComponent";
import DoctorProfileModal from "@/components/consultation/DoctorProfileModal";
import AppointmentSchedulerModal from "@/components/consultation/AppointmentSchedulerModal";
import AppointmentManagementComponent from "@/components/consultation/AppointmentManagementComponent";
import ConsultationPreparationModal from "@/components/consultation/ConsultationPreparationModal";
import ConsultationSummaryModal from "@/components/consultation/ConsultationSummaryModal";
import PatientReviewModal from "@/components/consultation/PatientReviewModal";
import DoctorIssuePrescriptionModal from "@/components/prescription/DoctorIssuePrescriptionModal";
import PrescriptionViewerModal from "@/components/prescription/PrescriptionViewerModal";
import SignOutButton from "@/components/SignOutButton";
import NotificationBell from "@/components/notifications/NotificationBell";
import { Activity, Calendar, Search, Stethoscope, Settings } from "lucide-react";

export default function ConsultationsPage() {
  const [userRole, setUserRole] = useState<"patient" | "health_professional">("patient");
  const [userName, setUserName] = useState("Aditya Verma");
  const [userId, setUserId] = useState("patient-demo-user");
  const [activeTab, setActiveTab] = useState<"discovery" | "appointments">("discovery");

  // State
  const [appointments, setAppointments] = useState<ConsultationAppointment[]>([]);
  const [loadingAppts, setLoadingAppts] = useState(true);

  // Modals
  const [selectedDoctorProfile, setSelectedDoctorProfile] = useState<DoctorDiscoveryItem | null>(null);
  const [doctorToBook, setDoctorToBook] = useState<DoctorDiscoveryItem | null>(null);
  const [prepAppointment, setPrepAppointment] = useState<ConsultationAppointment | null>(null);
  const [summaryAppointment, setSummaryAppointment] = useState<ConsultationAppointment | null>(null);
  const [rateAppointment, setRateAppointment] = useState<ConsultationAppointment | null>(null);
  const [issueRxAppointment, setIssueRxAppointment] = useState<ConsultationAppointment | null>(null);
  const [viewPrescription, setViewPrescription] = useState<PrescriptionRecord | null>(null);

  const fetchUserAndAppointments = () => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUserRole(data.user.role);
          setUserName(data.user.fullName || data.user.username);
          setUserId(data.user.id);
          if (data.user.role === "health_professional") {
            setActiveTab("appointments");
          }
        }
      })
      .catch((err) => console.warn(err));

    setLoadingAppts(true);
    fetch("/api/consultations/appointments")
      .then((res) => res.json())
      .then((data) => {
        if (data.appointments) setAppointments(data.appointments);
      })
      .catch((err) => console.warn(err))
      .finally(() => setLoadingAppts(false));
  };

  useEffect(() => {
    fetchUserAndAppointments();
  }, []);

  const handleOpenPrescriptionById = async (rxId: string) => {
    try {
      const res = await fetch(`/api/prescriptions/${rxId}`);
      const data = await res.json();
      if (data.prescription) {
        setViewPrescription(data.prescription);
      }
    } catch (err) {
      console.warn("Failed to open prescription:", err);
    }
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
          <span className="brand-badge">
            {userRole === "patient" ? "Patient Consultations" : "Clinician Schedule"}
          </span>
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

          {/* Sub-Tab Navigation */}
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              marginBottom: "1.5rem",
              borderBottom: "1px solid var(--border-subtle)",
              paddingBottom: "0.5rem",
            }}
          >
            {userRole === "patient" && (
              <button
                type="button"
                onClick={() => setActiveTab("discovery")}
                style={{
                  padding: "0.6rem 1.25rem",
                  borderRadius: "8px",
                  fontSize: "0.9rem",
                  fontWeight: activeTab === "discovery" ? 700 : 500,
                  border: "none",
                  background: activeTab === "discovery" ? "rgba(255, 178, 0, 0.15)" : "transparent",
                  color: activeTab === "discovery" ? "var(--color-accent)" : "var(--text-secondary)",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  minHeight: "44px",
                }}
              >
                <Search size={16} />
                <span>Find Doctors & Specialists</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setActiveTab("appointments")}
              style={{
                padding: "0.6rem 1.25rem",
                borderRadius: "8px",
                fontSize: "0.9rem",
                fontWeight: activeTab === "appointments" ? 700 : 500,
                border: "none",
                background: activeTab === "appointments" ? "rgba(255, 178, 0, 0.15)" : "transparent",
                color: activeTab === "appointments" ? "var(--color-accent)" : "var(--text-secondary)",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                minHeight: "44px",
              }}
            >
              <Calendar size={16} />
              <span>
                {userRole === "patient" ? "My Consultations" : "Appointment Schedule"} (
                {appointments.length})
              </span>
            </button>
          </div>

          {/* Main Content Pane */}
          {activeTab === "discovery" && userRole === "patient" ? (
            <DoctorDiscoveryComponent
              initialDoctors={DOCTORS_CATALOG}
              onSelectDoctor={(doc) => setSelectedDoctorProfile(doc)}
              onBookDoctor={(doc) => setDoctorToBook(doc)}
            />
          ) : (
            <AppointmentManagementComponent
              appointments={appointments}
              role={userRole}
              onPrepare={(appt) => setPrepAppointment(appt)}
              onViewSummary={(appt) => setSummaryAppointment(appt)}
              onRateDoctor={(appt) => setRateAppointment(appt)}
              onIssuePrescription={(appt) => setIssueRxAppointment(appt)}
              onRefresh={fetchUserAndAppointments}
            />
          )}

          {/* Doctor Profile Modal */}
          {selectedDoctorProfile && (
            <DoctorProfileModal
              doctor={selectedDoctorProfile}
              onClose={() => setSelectedDoctorProfile(null)}
              onBook={(doc) => setDoctorToBook(doc)}
            />
          )}

          {/* Booking Scheduler Modal */}
          {doctorToBook && (
            <AppointmentSchedulerModal
              doctor={doctorToBook}
              onClose={() => setDoctorToBook(null)}
              onSuccess={(newAppt) => {
                setDoctorToBook(null);
                setActiveTab("appointments");
                fetchUserAndAppointments();
              }}
            />
          )}

          {/* Consultation Preparation & Live Room Modal */}
          {prepAppointment && (
            <ConsultationPreparationModal
              appointment={prepAppointment}
              role={userRole}
              onClose={() => setPrepAppointment(null)}
              onCallEnded={() => {
                setPrepAppointment(null);
                fetchUserAndAppointments();
              }}
            />
          )}

          {/* Consultation Summary Modal */}
          {summaryAppointment && (
            <ConsultationSummaryModal
              appointment={summaryAppointment}
              role={userRole}
              onClose={() => setSummaryAppointment(null)}
              onOpenPrescription={(rxId) => handleOpenPrescriptionById(rxId)}
              onRateDoctor={(appt) => {
                setSummaryAppointment(null);
                setRateAppointment(appt);
              }}
            />
          )}

          {/* Patient Review Modal */}
          {rateAppointment && (
            <PatientReviewModal
              appointment={rateAppointment}
              onClose={() => setRateAppointment(null)}
              onSuccess={() => {
                setRateAppointment(null);
                alert("Thank you! Your feedback has been verified and recorded.");
                fetchUserAndAppointments();
              }}
            />
          )}

          {/* Doctor Issue E-Rx Modal */}
          {issueRxAppointment && (
            <DoctorIssuePrescriptionModal
              patientId={issueRxAppointment.patientId}
              patientName={issueRxAppointment.patientName}
              appointmentId={issueRxAppointment.id}
              onClose={() => setIssueRxAppointment(null)}
              onSuccess={(rx) => {
                setIssueRxAppointment(null);
                setViewPrescription(rx);
                fetchUserAndAppointments();
              }}
            />
          )}

          {/* E-Prescription Viewer Modal */}
          {viewPrescription && (
            <PrescriptionViewerModal
              prescription={viewPrescription}
              onClose={() => setViewPrescription(null)}
            />
          )}
        </div>
      </main>
    </>
  );
}

