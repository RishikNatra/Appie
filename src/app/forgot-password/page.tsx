import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import ForgotPasswordForm from "./ForgotPasswordForm";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Recover Password - Appie Healthcare",
  description: "Reset your Appie account password securely using verified email or SMS recovery.",
};

export default function ForgotPasswordPage() {
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
          <ForgotPasswordForm />
        </Suspense>
      </main>
    </>
  );
}

