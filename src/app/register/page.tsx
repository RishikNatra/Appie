import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import RegisterForm from "./RegisterForm";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Register - Appie Healthcare",
  description: "Create an Appie account as a Patient or Health Professional.",
};

export default function RegisterPage() {
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
          <RegisterForm />
        </Suspense>
      </main>
    </>
  );
}
