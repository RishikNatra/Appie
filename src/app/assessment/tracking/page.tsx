import { redirect } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { getCurrentUser } from "@/lib/auth-service";
import SymptomTrackingComponent from "@/components/assessment/SymptomTrackingComponent";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Symptom Tracking & Progress - Appie Healthcare",
  description: "Monitor active symptoms, log daily progress points, and inspect recovery timelines.",
};

export default async function SymptomTrackingPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?role=patient");
  }

  return (
    <>
      <Navbar />
      <main className="main-wrapper">
        <div style={{ width: "100%", maxWidth: "960px", margin: "0 auto" }}>
          <Link href="/patient/home" className="back-link">
            <ArrowLeft size={18} />
            <span>Back to Dashboard</span>
          </Link>

          <div className="section-header-wrap">
            <h1 className="auth-title" style={{ textAlign: "left" }}>Symptom Overview & Progression Tracking</h1>
            <p className="auth-subtitle" style={{ textAlign: "left" }}>
              Track active symptoms day-by-day, monitor recovery curves, and log clinical observations
            </p>
          </div>

          <SymptomTrackingComponent />
        </div>
      </main>
    </>
  );
}

