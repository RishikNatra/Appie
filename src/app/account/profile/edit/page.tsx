import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import { getCurrentUser } from "@/lib/auth-service";
import EditProfileView from "./EditProfileView";

export const metadata = {
  title: "Edit Profile - Appie Healthcare",
  description: "Update your personal and contact healthcare information.",
};

export default async function EditProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <>
      <Navbar />
      <main className="main-wrapper">
        <EditProfileView user={user} />
      </main>
    </>
  );
}

