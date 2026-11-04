import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="main-wrapper">
        <div className="auth-card" style={{ textAlign: "center", padding: "3rem 2rem" }}>
          <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>404 - Page Not Found</h1>
          <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>
            The healthcare screen or resource you are looking for does not exist or has been moved.
          </p>
          <Link href="/" className="btn-primary" style={{ display: "inline-flex", textDecoration: "none" }}>
            Return to Home
          </Link>
        </div>
      </main>
    </>
  );
}

