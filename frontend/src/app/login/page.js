"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Zap, ArrowRight, AlertCircle } from "lucide-react";
import { loginUser, ApiError } from "@/lib/api";
import AuthVisual from "@/components/AuthVisual";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await loginUser(form);
      router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Unable to log in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left — brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-ink-950 p-12 lg:flex">
        <AuthVisual />
        <Link href="/" className="relative z-10 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-signal-500">
            <Zap className="h-4 w-4 text-ink-950" strokeWidth={2.5} />
          </div>
          <span className="text-[15px] font-semibold tracking-tight text-white">
            QuickAI
          </span>
        </Link>

        <div className="relative z-10 max-w-md">
          <h2 className="text-4xl font-semibold leading-tight tracking-tightest text-white">
            Your AI workspace for creating more in less time.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-ink-600">
            Ten focused tools, one login. Pick up right where you left off.
          </p>
        </div>

        <p className="relative z-10 text-xs text-ink-600">
          © {new Date().getFullYear()} QuickAI. All rights reserved.
        </p>
      </div>

      {/* Right — form */}
      <div className="flex items-center justify-center bg-paper-50 px-6 py-16">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink-950">
                <Zap className="h-4 w-4 text-signal-400" strokeWidth={2.5} />
              </div>
              <span className="text-[15px] font-semibold tracking-tight text-ink-950">
                QuickAI
              </span>
            </Link>
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-ink-950">
            Welcome back
          </h1>
          <p className="mt-1.5 text-sm text-ink-600">
            Log in to continue to your workspace.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-800">
                Username
              </label>
              <input
                type="text"
                required
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full rounded-xl border border-paper-200 bg-white px-3.5 py-2.5 text-sm text-ink-950 outline-none transition focus:border-signal-400 focus:ring-4 focus:ring-signal-100"
                placeholder="yourusername"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-800">
                Password
              </label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full rounded-xl border border-paper-200 bg-white px-3.5 py-2.5 text-sm text-ink-950 outline-none transition focus:border-signal-400 focus:ring-4 focus:ring-signal-100"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-ink-950 px-4 py-2.5 text-sm font-semibold text-white tracking-tight transition-all duration-150 hover:bg-ink-900 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Log in"}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-600">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold text-signal-700 hover:text-signal-800">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
