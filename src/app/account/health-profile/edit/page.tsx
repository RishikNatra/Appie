import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import { getCurrentUser } from "@/lib/auth-service";
import EditHealthProfileView from "./EditHealthProfileView";

export const metadata = {
  title: "Edit Health Profile - Appie Healthcare",
  description: "Update your clinical vitals, allergies, routine medications, and surgical history.",
};

export default async function EditHealthProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <>
      <Navbar />
      <main className="main-wrapper">
        <EditHealthProfileView user={user} />
      </main>
    </>
  );
}

