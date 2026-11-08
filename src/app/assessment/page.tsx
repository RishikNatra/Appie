import Navbar from "@/components/Navbar";
import { getCurrentUser } from "@/lib/auth-service";
import HealthAssessmentAndConsultationView from "./HealthAssessmentAndConsultationView";
import { DOCTORS_CATALOG } from "@/lib/doctors-catalog";
import { MEDICATIONS_CATALOG } from "@/lib/medications-catalog";
import { SYMPTOMS_CATALOG } from "@/lib/symptoms-catalog";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Health Assessment & Consultations - Appie Healthcare",
  description: "Assess routine symptoms with clinical AI, receive preliminary triage, and consult verified doctors.",
};

export default async function HealthAssessmentPage() {
  const user = await getCurrentUser();

  return (
    <>
      <Navbar />
      <main className="main-wrapper" style={{ maxWidth: "1150px", width: "100%", padding: "1.5rem 1rem 4rem" }}>
        <HealthAssessmentAndConsultationView
          user={user}
          symptomsCatalog={SYMPTOMS_CATALOG}
          doctorsCatalog={DOCTORS_CATALOG}
          medicationsCatalog={MEDICATIONS_CATALOG}
        />
      </main>
    </>
  );
}
