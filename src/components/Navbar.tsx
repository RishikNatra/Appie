import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { Activity } from "lucide-react";

export default function Navbar() {
  return (
    <header className="app-header">
      <Link href="/" className="brand-logo-wrap" title="Appie Healthcare">
        <div className="brand-icon-box">
          <Activity size={22} strokeWidth={2.5} />
        </div>
        <div>
          <span className="brand-name">Appie</span>
        </div>
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <ThemeToggle />
      </div>
    </header>
  );
}
