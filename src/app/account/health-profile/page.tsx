import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import { getCurrentUser } from "@/lib/auth-service";
import HealthProfileOverviewView from "./HealthProfileOverviewView";

export const metadata = {
  title: "Health Profile Overview - Appie Healthcare",
  description: "View your personal clinical indicators, allergies, and chronic medical history on Appie.",
};

export default async function HealthProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <>
      <Navbar />
      <main className="main-wrapper">
        <HealthProfileOverviewView user={user} />
      </main>
    </>
  );
}

