import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth-service";
import Navbar from "@/components/Navbar";
import PharmacistDashboardClient from "./PharmacistDashboardClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Pharmacy Dashboard - Appie Healthcare",
  description: "Fulfill verified digital prescriptions and manage medicine delivery orders.",
};

export default async function PharmacistHomePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?role=pharmacist");
  }

  if (user.role !== "pharmacist") {
    redirect("/patient/home");
  }

  return (
    <>
      <Navbar />
      <main className="main-wrapper" style={{ maxWidth: "1100px", width: "100%", padding: "1.5rem 1rem 5rem" }}>
        <PharmacistDashboardClient user={user} />
      </main>
    </>
  );
}
