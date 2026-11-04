import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import { getCurrentUser } from "@/lib/auth-service";
import MedicalStatusVerificationView from "./MedicalStatusVerificationView";

export const metadata = {
  title: "Medical Status Verification - Appie Healthcare",
  description: "Verify your clinical credentials and medical practice license on Appie.",
};

export default async function MedicalStatusVerificationPage() {
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
      <main className="main-wrapper">
        <MedicalStatusVerificationView />
      </main>
    </>
  );
}

