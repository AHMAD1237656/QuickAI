"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Check, Sparkles } from "lucide-react";
import DashboardShell from "@/components/DashboardShell";
import Loading from "@/components/Loading";
import { getPlans, getProfile } from "@/lib/api";

export default function PricingPage() {
  const router = useRouter();
  const [plans, setPlans] = useState([]);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getPlans(), getProfile()])
      .then(([plansData, profileData]) => {
        setPlans(plansData);
        setCurrentPlan(profileData.plan);
      })
      .catch(() => setError("Could not load pricing plans."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardShell title="Pricing">
      <div className="mb-10 text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-ink-950">
          Simple, transparent pricing
        </h2>
        <p className="mt-1.5 text-sm text-ink-600">
          Choose the plan that fits how much you use QuickAI.
        </p>
      </div>

      {loading ? (
        <Loading text="Loading plans..." />
      ) : error ? (
        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-3">
            {plans.map((plan) => {
              const isCurrent = plan.id === currentPlan;
              const isFeatured = plan.id === "pro";
              return (
                <div
                  key={plan.id}
                  className={`relative flex flex-col rounded-2xl border p-6 transition ${
                    isFeatured
                      ? "border-ink-950 bg-ink-950 text-white shadow-panel"
                      : "border-paper-200 bg-white shadow-card hover:shadow-card-hover"
                  }`}
                >
                  {isFeatured && (
                    <span className="absolute -top-3 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-signal-500 px-3 py-1 text-xs font-semibold text-ink-950">
                      <Sparkles className="h-3 w-3" strokeWidth={2.5} />
                      Most popular
                    </span>
                  )}

                  <h3
                    className={`text-base font-semibold ${
                      isFeatured ? "text-white" : "text-ink-950"
                    }`}
                  >
                    {plan.name}
                  </h3>
                  <p className="mt-3">
                    <span
                      className={`text-3xl font-semibold tracking-tight ${
                        isFeatured ? "text-white" : "text-ink-950"
                      }`}
                    >
                      ${plan.price}
                    </span>
                    <span className={isFeatured ? "text-sm text-ink-600" : "text-sm text-ink-600"}>
                      /month
                    </span>
                  </p>
                  <p className={`mt-1 text-sm ${isFeatured ? "text-ink-600" : "text-ink-600"}`}>
                    {plan.credits} credits included
                  </p>

                  <ul className="mt-6 flex-1 space-y-2.5">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className={`flex items-start gap-2 text-sm ${
                          isFeatured ? "text-ink-600" : "text-ink-700"
                        }`}
                      >
                        <Check
                          className={`mt-0.5 h-4 w-4 shrink-0 ${
                            isFeatured ? "text-signal-400" : "text-signal-600"
                          }`}
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button
                    disabled={isCurrent || plan.id === "free"}
                    onClick={() => router.push(`/checkout?plan=${plan.id}`)}
                    className={`mt-6 w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                      isCurrent || plan.id === "free"
                        ? isFeatured
                          ? "cursor-not-allowed bg-ink-800 text-ink-600"
                          : "cursor-not-allowed bg-paper-100 text-ink-600/60"
                        : isFeatured
                        ? "bg-signal-500 text-ink-950 hover:bg-signal-400"
                        : "bg-ink-950 text-white hover:bg-ink-900"
                    }`}
                  >
                    {isCurrent ? "Current plan" : plan.id === "free" ? "Included" : "Upgrade"}
                  </button>
                </div>
              );
            })}
          </div>

          <p className="mt-8 text-center text-xs text-ink-600">
            Upgrades currently use a demo checkout flow — no real payment
            provider is connected yet, and no money is charged.
          </p>
        </>
      )}
    </DashboardShell>
  );
}
