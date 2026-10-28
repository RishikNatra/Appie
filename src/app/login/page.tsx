import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import LoginForm from "./LoginForm";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Log In - Appie Healthcare",
  description: "Sign in to your Appie Patient or Health Professional account.",
};

export default function LoginPage() {
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
          <LoginForm />
        </Suspense>
      </main>
    </>
  );
}
