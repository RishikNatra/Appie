import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth-service";
import Navbar from "@/components/Navbar";
import DeliveryDashboardClient from "./DeliveryDashboardClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Delivery Partner Dashboard - Appie Healthcare",
  description: "Pharmaceutical logistics, medicine dispatch, and doorstep delivery.",
};

export default async function DeliveryHomePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?role=delivery_partner");
  }

  if (user.role !== "delivery_partner") {
    redirect("/patient/home");
  }

  return (
    <>
      <Navbar />
      <main className="main-wrapper" style={{ maxWidth: "1100px", width: "100%", padding: "1.5rem 1rem 5rem" }}>
        <DeliveryDashboardClient user={user} />
      </main>
    </>
  );
}
