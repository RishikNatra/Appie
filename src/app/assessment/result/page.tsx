import { redirect } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { getCurrentUser } from "@/lib/auth-service";
import { getAssessmentById, getPatientAssessments } from "@/lib/assessment-service";
import AssessmentResultComponent from "@/components/assessment/AssessmentResultComponent";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Clinical Assessment Result - Appie Healthcare",
  description: "View differential diagnosis, triage urgency score, and next-step clinical recommendations.",
};

export default async function AssessmentResultPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?role=patient");
  }

  const { id } = await searchParams;

  let assessment = null;
  if (id) {
    assessment = await getAssessmentById(id);
  }

  if (!assessment) {
    const list = await getPatientAssessments(user.id);
    assessment = list[0] || null;
  }

  if (!assessment) {
    redirect("/patient/home");
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

          <AssessmentResultComponent assessment={assessment} />
        </div>
      </main>
    </>
  );
}

