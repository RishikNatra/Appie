import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import DeliveryPartnerRegisterForm from "./DeliveryPartnerRegisterForm";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Delivery Partner Registration - Appie Healthcare",
  description: "Register as an authorized medicine delivery partner on Appie.",
};

export default function DeliveryPartnerRegisterPage() {
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
          <DeliveryPartnerRegisterForm />
        </Suspense>
      </main>
    </>
  );
}
