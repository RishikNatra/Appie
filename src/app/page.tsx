import { redirect } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { getCurrentUser } from "@/lib/auth-service";
import { User, Stethoscope, ArrowRight, ShieldCheck, HeartHandshake } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // If user is already logged in, redirect them directly to their role dashboard
  const user = await getCurrentUser();
  if (user) {
    if (user.role === "patient") {
      redirect("/patient/home");
    } else if (user.role === "health_professional") {
      redirect("/professional/home");
    }
  }

  return (
    <>
      <Navbar />

      <main className="main-wrapper">
        <section className="landing-hero">
          <div className="landing-subheading">Digital Healthcare System</div>
          <h1 className="landing-title">Choose your account type</h1>
        </section>

        <section className="role-grid" aria-label="Account Type Selection">
          {/* Option 1: Patient */}
          <Link
            href="/login?role=patient"
            className="role-card"
            id="role-card-patient"
            aria-label="Continue as Patient"
          >
            <div className="role-icon-container">
              <User size={34} strokeWidth={2} />
            </div>

            <span className="role-tag">Individuals & Families</span>

            <h2 className="role-card-title">Patient</h2>

            <p className="role-card-desc">
              Get routine, minor health concerns assessed digitally, consult verified medical professionals,
              and receive prescribed medications at your doorstep.
            </p>

            <div className="role-action-link">
              <span>Enter Patient Portal</span>
              <ArrowRight size={18} strokeWidth={2.5} />
            </div>
          </Link>

          {/* Option 2: Health Professional */}
          <Link
            href="/login?role=health_professional"
            className="role-card"
            id="role-card-professional"
            aria-label="Continue as Health Professional"
          >
            <div className="role-icon-container">
              <Stethoscope size={34} strokeWidth={2} />
            </div>

            <span className="role-tag">Doctors & Clinicians</span>

            <h2 className="role-card-title">Health Professional</h2>

            <p className="role-card-desc">
              Access digital patient assessments, review symptom records, conduct appointments, and issue
              verified e-prescriptions securely.
            </p>

            <div className="role-action-link">
              <span>Enter Professional Portal</span>
              <ArrowRight size={18} strokeWidth={2.5} />
            </div>
          </Link>
        </section>

      </main>
    </>
  );
}
