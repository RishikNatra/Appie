import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import PharmacistRegisterForm from "./PharmacistRegisterForm";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Pharmacist Registration - Appie Healthcare",
  description: "Register your pharmacy to fulfill and deliver prescription medicines on Appie.",
};

export default function PharmacistRegisterPage() {
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
          <PharmacistRegisterForm />
        </Suspense>
      </main>
    </>
  );
}
