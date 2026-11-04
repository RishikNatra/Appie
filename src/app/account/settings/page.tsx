import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import { getCurrentUser } from "@/lib/auth-service";
import SettingsOverviewView from "./SettingsOverviewView";

export const metadata = {
  title: "Account Settings - Appie Healthcare",
  description: "Configure your account security, notification alerts, and healthcare application preferences.",
};

export default async function SettingsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <>
      <Navbar />
      <main className="main-wrapper">
        <SettingsOverviewView user={user} />
      </main>
    </>
  );
}

