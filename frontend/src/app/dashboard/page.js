"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Zap,
  Sparkles as SparklesIcon,
  Layers,
  Crown,
  ArrowRight,
  History as HistoryIcon,
  PenSquare,
  Mail,
  GraduationCap,
} from "lucide-react";
import DashboardShell from "@/components/DashboardShell";
import Loading from "@/components/Loading";
import { getProfile, getHistory } from "@/lib/api";
import { TOOLS } from "@/lib/tools";
import { getToolIcon } from "@/lib/toolMeta";

const QUICK_ACTIONS = [
  { slug: "text-generator", label: "Generate Text", icon: SparklesIcon },
  { slug: "blog-writer", label: "Write a Blog", icon: PenSquare },
  { slug: "email-writer", label: "Create an Email", icon: Mail },
  { slug: "study-assistant", label: "Study Assistant", icon: GraduationCap },
];

export default function DashboardPage() {
  const [profile, setProfile] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getProfile(), getHistory()])
      .then(([profileData, historyData]) => {
        setProfile(profileData);
        setRecent(historyData.slice(0, 5));
      })
      .catch(() => setError("Could not load your dashboard data."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardShell title="Dashboard">
      {loading ? (
        <Loading text="Loading your dashboard..." />
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : (
        <div className="space-y-8">
          {/* Welcome banner */}
          <div className="relative overflow-hidden rounded-2xl bg-ink-950 px-7 py-9">
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-signal-500/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 right-24 h-48 w-48 rounded-full bg-accent-500/15 blur-3xl" />
            <div className="relative z-10">
              <h2 className="text-2xl font-semibold tracking-tight text-white">
                Welcome back, {profile?.first_name || profile?.username}
              </h2>
              <p className="mt-1.5 text-sm text-ink-600">
                Create, write, and work smarter with AI.
              </p>
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Available credits"
              value={profile?.credits}
              icon={Zap}
              accent="text-signal-600 bg-signal-50"
            />
            <StatCard
              label="Total generations"
              value={recent.length > 0 ? `${recent.length}+` : "0"}
              icon={HistoryIcon}
              accent="text-sky-600 bg-sky-50"
              link="/history"
            />
            <StatCard
              label="AI tools available"
              value={TOOLS.length}
              icon={Layers}
              accent="text-violet-600 bg-violet-50"
              link="/tools"
            />
            <StatCard
              label="Current plan"
              value={capitalize(profile?.plan)}
              icon={Crown}
              accent="text-amber-600 bg-amber-50"
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Quick actions */}
            <div className="lg:col-span-2">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-base font-semibold text-ink-950">Quick actions</h3>
                <Link
                  href="/tools"
                  className="flex items-center gap-1 text-sm font-medium text-signal-700 hover:text-signal-800"
                >
                  View all tools
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {QUICK_ACTIONS.map((action) => {
                  const Icon = action.icon;
                  return (
                    <Link
                      key={action.slug}
                      href={`/tools/${action.slug}`}
                      className="group flex items-center gap-3.5 rounded-2xl border border-paper-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-signal-300/70 hover:shadow-card-hover"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ink-950">
                        <Icon className="h-[18px] w-[18px] text-signal-400" strokeWidth={2} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-ink-950">{action.label}</p>
                        <p className="text-xs text-ink-600">Start now</p>
                      </div>
                      <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-paper-200 transition group-hover:text-signal-600" />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Recent activity */}
            <div>
              <h3 className="mb-3 text-base font-semibold text-ink-950">Recent activity</h3>
              <div className="rounded-2xl border border-paper-200 bg-white p-4">
                {recent.length === 0 ? (
                  <div className="flex flex-col items-center gap-2 py-10 text-center">
                    <SparklesIcon className="h-6 w-6 text-paper-200" strokeWidth={1.5} />
                    <p className="text-sm text-ink-600">
                      No activity yet. Try a tool to get started!
                    </p>
                  </div>
                ) : (
                  <ul className="divide-y divide-paper-100">
                    {recent.map((item) => {
                      const Icon = getToolIcon(item.tool_slug);
                      return (
                        <li key={item.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-paper-100">
                            <Icon className="h-4 w-4 text-ink-700" strokeWidth={2} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-ink-950">{item.tool_name}</p>
                            <p className="mt-0.5 truncate text-xs text-ink-600">
                              {item.input_text}
                            </p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Prompt Library banner */}
          <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-signal-200 bg-signal-50 p-6 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-base font-semibold text-ink-950">Need inspiration?</h3>
              <p className="mt-1 text-sm text-ink-600">
                Browse ready-made prompts and use them directly in any AI tool.
              </p>
            </div>
            <Link
              href="/prompts"
              className="flex shrink-0 items-center gap-2 whitespace-nowrap rounded-xl bg-ink-950 px-5 py-2.5 text-sm font-semibold text-white tracking-tight transition-all duration-150 hover:bg-ink-900 active:scale-[0.98]"
            >
              Browse Prompt Library
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}

function StatCard({ label, value, icon: Icon, accent, link }) {
  const content = (
    <div className="group rounded-2xl border border-paper-200 bg-white p-4 shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover">
      <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${accent}`}>
        <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
      </div>
      <p className="mt-3 text-xs font-medium text-ink-600">{label}</p>
      <p className="mt-0.5 text-2xl font-semibold tracking-tight text-ink-950">
        {value ?? "-"}
      </p>
    </div>
  );
  return link ? <Link href={link}>{content}</Link> : content;
}

function capitalize(str) {
  if (!str) return "-";
  return str.charAt(0).toUpperCase() + str.slice(1);
}
