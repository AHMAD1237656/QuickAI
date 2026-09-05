"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, AlertCircle, Loader2, ArrowLeft } from "lucide-react";
import DashboardShell from "@/components/DashboardShell";
import Loading from "@/components/Loading";
import { getPlans, startCheckout, confirmPayment, cancelPayment, ApiError } from "@/lib/api";

function CheckoutContent() {
  const router = useRouter();
  const params = useSearchParams();
  const planId = params.get("plan");

  const [plan, setPlan] = useState(null);
  const [txn, setTxn] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!planId) {
      setError("No plan selected.");
      setLoading(false);
      return;
    }

    getPlans()
      .then((plans) => {
        const found = plans.find((p) => p.id === planId);
        setPlan(found || null);
        if (!found) {
          setError("Unknown plan.");
          setLoading(false);
          return;
        }
        return startCheckout(planId).then(setTxn);
      })
      .catch((err) => {
        setError(err instanceof ApiError ? err.message : "Could not start checkout.");
      })
      .finally(() => setLoading(false));
  }, [planId]);

  const handleConfirm = async () => {
    if (!txn) return;
    setConfirming(true);
    setError("");
    try {
      await confirmPayment(txn.id);
      router.push(`/checkout/success?plan=${planId}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not confirm payment.");
      setConfirming(false);
    }
  };

  const handleCancel = async () => {
    if (txn) {
      try {
        await cancelPayment(txn.id);
      } catch {
        // best-effort — proceed to the cancel page regardless
      }
    }
    router.push("/checkout/cancelled");
  };

  return (
    <DashboardShell title="Checkout">
      <div className="mx-auto max-w-md">
        {loading ? (
          <Loading text="Preparing checkout..." />
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            <div className="flex items-start gap-2">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              {error}
            </div>
            <button
              onClick={() => router.push("/pricing")}
              className="mt-4 flex items-center gap-1.5 text-sm font-medium text-ink-700 hover:text-ink-950"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to pricing
            </button>
          </div>
        ) : (
          <div className="rounded-2xl border border-paper-200 bg-white p-6 shadow-card">
            <div className="mb-5 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              Demo checkout — no real payment provider is connected yet.
            </div>

            <h1 className="text-xl font-semibold tracking-tight text-ink-950">
              Confirm your upgrade
            </h1>
            <p className="mt-1 text-sm text-ink-600">
              You&apos;re about to switch to the {plan?.name} plan.
            </p>

            <div className="mt-5 space-y-2 rounded-xl bg-paper-50 p-4 text-sm">
              <Row label="Plan" value={plan?.name} />
              <Row label="Price" value={`$${plan?.price}/month`} />
              <Row label="Credits included" value={plan?.credits} />
              {txn && <Row label="Reference" value={txn.reference} />}
            </div>

            {error && (
              <div className="mt-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <div className="mt-6 flex gap-3">
              <button
                onClick={handleConfirm}
                disabled={confirming || !txn}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-ink-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-ink-900 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {confirming ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Confirming...
                  </>
                ) : (
                  "Confirm mock payment"
                )}
              </button>
              <button
                onClick={handleCancel}
                disabled={confirming}
                className="rounded-xl border border-paper-200 px-4 py-2.5 text-sm font-semibold text-ink-700 transition hover:bg-paper-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-ink-600">{label}</span>
      <span className="font-medium text-ink-950">{value ?? "-"}</span>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<Loading text="Loading checkout..." />}>
      <CheckoutContent />
    </Suspense>
  );
}
