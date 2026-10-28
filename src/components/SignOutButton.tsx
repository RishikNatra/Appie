"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Loader2 } from "lucide-react";

export default function SignOutButton() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Continue redirecting even if network error
    }
    router.push("/");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="btn-secondary"
      id="sign-out-btn"
      disabled={isLoggingOut}
      title="Sign out of Appie"
    >
      {isLoggingOut ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <LogOut size={16} />
      )}
      <span>Sign Out</span>
    </button>
  );
}
