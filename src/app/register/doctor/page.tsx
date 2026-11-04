import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import DoctorRegisterForm from "./DoctorRegisterForm";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Doctor Registration - Appie Healthcare",
  description: "Register as a licensed medical practitioner on Appie Healthcare Platform.",
};

export default function DoctorRegisterPage() {
  return (
    <>
      <Navbar />
      <main className="main-wrapper" style={{ padding: "2.5rem 1rem 5rem" }}>
        <Suspense
          fallback={
            <div className="auth-card" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "350px" }}>
              <Loader2 size={32} className="animate-spin" color="var(--color-accent)" />
            </div>
          }
        >
          <DoctorRegisterForm />
        </Suspense>
      </main>
    </>
  );
}
