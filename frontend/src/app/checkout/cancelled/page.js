"use client";

import Link from "next/link";
import { XCircle, ArrowLeft } from "lucide-react";
import DashboardShell from "@/components/DashboardShell";

export default function CheckoutCancelledPage() {
  return (
    <DashboardShell title="Checkout cancelled">
      <div className="mx-auto max-w-md rounded-2xl border border-paper-200 bg-white p-8 text-center shadow-card">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-paper-100">
          <XCircle className="h-7 w-7 text-ink-600" strokeWidth={2} />
        </div>
        <h1 className="mt-4 text-xl font-semibold tracking-tight text-ink-950">
          Checkout cancelled
        </h1>
        <p className="mt-1.5 text-sm text-ink-600">
          No changes were made to your plan or credits.
        </p>
        <Link
          href="/pricing"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-ink-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-ink-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to pricing
        </Link>
      </div>
    </DashboardShell>
  );
}
