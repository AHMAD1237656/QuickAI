"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/api";
import Loading from "./Loading";

/**
 * Wrap any page that requires a logged-in user with this component.
 * Redirects unauthenticated visitors to /login.
 */
export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
    } else {
      setChecked(true);
    }
  }, [router]);

  if (!checked) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loading text="Checking your session..." />
      </div>
    );
  }

  return children;
}
