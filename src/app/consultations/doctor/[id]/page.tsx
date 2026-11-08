import { notFound, redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import { getCurrentUser } from "@/lib/auth-service";
import { getDoctorById, DOCTORS_CATALOG } from "@/lib/doctors-catalog";
import DoctorFullProfileClient from "./DoctorFullProfileClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const doc = getDoctorById(id);
  if (!doc) return { title: "Doctor Profile - Appie" };
  return {
    title: `${doc.prefix} ${doc.fullName} - Appie Healthcare`,
    description: doc.about,
  };
}

export default async function DoctorProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();
  const doctor = getDoctorById(id);

  if (!doctor) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="main-wrapper" style={{ maxWidth: "860px", width: "100%", padding: "2rem 1.25rem 5rem" }}>
        <DoctorFullProfileClient doctor={doctor} user={user} />
      </main>
    </>
  );
}
