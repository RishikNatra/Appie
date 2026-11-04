import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import VerifyRegistrationForm from "./VerifyRegistrationForm";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Verify Registration - Appie Healthcare",
  description: "Verify your email or mobile contact code to activate your Appie healthcare account.",
};

export default function VerifyRegistrationPage() {
  return (
    <>
      <Navbar />
      <main className="main-wrapper">
        <Suspense
          fallback={
            <div className="auth-card" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "350px" }}>
              <Loader2 size={32} className="animate-spin" color="var(--color-accent)" />
            </div>
          }
        >
          <VerifyRegistrationForm />
        </Suspense>
      </main>
    </>
  );
}

