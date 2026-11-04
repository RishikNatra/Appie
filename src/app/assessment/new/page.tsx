import { redirect } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { getCurrentUser } from "@/lib/auth-service";
import SymptomEntryComponent from "@/components/assessment/SymptomEntryComponent";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "New Symptom Assessment - Appie Healthcare",
  description: "Enter your health symptoms for immediate clinical evaluation and guidance.",
};

export default async function NewAssessmentPage() {
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
            <h1 className="auth-title" style={{ textAlign: "left" }}>Symptom Entry & Clinical Assessment</h1>
            <p className="auth-subtitle" style={{ textAlign: "left" }}>
              Select symptoms, specify duration and severity to receive an initial clinical triage evaluation
            </p>
          </div>

          <SymptomEntryComponent standalone={true} />
        </div>
      </main>
    </>
  );
}

