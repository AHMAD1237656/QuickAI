"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, ArrowRight } from "lucide-react";
import DashboardShell from "@/components/DashboardShell";
import Loading from "@/components/Loading";

function SuccessContent() {
  const params = useSearchParams();
  const plan = params.get("plan");

  return (
    <DashboardShell title="Payment complete">
      <div className="mx-auto max-w-md rounded-2xl border border-signal-200 bg-white p-8 text-center shadow-card">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-signal-50">
          <CheckCircle2 className="h-7 w-7 text-signal-600" strokeWidth={2} />
        </div>
        <h1 className="mt-4 text-xl font-semibold tracking-tight text-ink-950">
          You&apos;re all set!
        </h1>
        <p className="mt-1.5 text-sm text-ink-600">
          {plan ? (
            <>Your account has been switched to the <span className="font-medium capitalize">{plan}</span> plan.</>
          ) : (
            "Your plan has been updated."
          )}
        </p>
        <p className="mt-3 text-xs text-ink-600/70">
          This was a demo checkout — no real payment was processed.
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-ink-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-ink-900"
        >
          Go to dashboard
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </DashboardShell>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<Loading text="Loading..." />}>
      <SuccessContent />
    </Suspense>
  );
}
