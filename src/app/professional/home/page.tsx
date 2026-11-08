import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth-service";
import Navbar from "@/components/Navbar";
import DoctorDashboardClient from "./DoctorDashboardClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Doctor Dashboard - Appie Healthcare",
  description: "Manage patient teleconsultations, evaluate symptoms, and issue verified e-prescriptions.",
};

export default async function ProfessionalHomePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?role=health_professional");
  }

  if (user.role !== "health_professional") {
    redirect("/patient/home");
  }

  return (
    <>
      <Navbar />
      <main className="main-wrapper" style={{ maxWidth: "1100px", width: "100%", padding: "1.5rem 1rem 5rem" }}>
        <DoctorDashboardClient user={user} />
      </main>
    </>
  );
}
