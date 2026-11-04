import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import { getCurrentUser } from "@/lib/auth-service";
import ProfileOverviewView from "./ProfileOverviewView";

export const metadata = {
  title: "User Profile - Appie Healthcare",
  description: "Manage your personal information, contact records, and account profile.",
};

export default async function ProfileOverviewPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <>
      <Navbar />
      <main className="main-wrapper">
        <ProfileOverviewView user={user} />
      </main>
    </>
  );
}

