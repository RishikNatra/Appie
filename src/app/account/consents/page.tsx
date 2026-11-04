import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import { getCurrentUser } from "@/lib/auth-service";
import ConsentManagementView from "./ConsentManagementView";

export const metadata = {
  title: "Consent Management - Appie Healthcare",
  description: "Manage your digital healthcare privacy, telehealth permissions, and pharmacy sharing consents.",
};

export default async function ConsentManagementPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <>
      <Navbar />
      <main className="main-wrapper">
        <ConsentManagementView user={user} />
      </main>
    </>
  );
}

