import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import TwoFactorForm from "./TwoFactorForm";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Two-Factor Authentication - Appie Healthcare",
  description: "Secure two-factor verification to access your Appie healthcare account.",
};

export default function TwoFactorPage() {
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
          <TwoFactorForm />
        </Suspense>
      </main>
    </>
  );
}

