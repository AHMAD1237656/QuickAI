"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Zap, ArrowRight, AlertCircle } from "lucide-react";
import { registerUser, loginUser, ApiError } from "@/lib/api";
import AuthVisual from "@/components/AuthVisual";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) =>
    setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await registerUser(form);
      // Automatically log in right after successful registration.
      await loginUser({ username: form.username, password: form.password });
      router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Unable to create your account. Please try again."
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
            Start creating smarter with AI.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-ink-600">
            Join QuickAI and get 10 free credits to try every tool — no card
            required.
          </p>
        </div>

        <p className="relative z-10 text-xs text-ink-600">
          © {new Date().getFullYear()} QuickAI. All rights reserved.
        </p>
      </div>

      {/* Right — form */}
      <div className="flex items-center justify-center bg-paper-50 px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-6 lg:hidden">
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
            Create your account
          </h1>
          <p className="mt-1.5 text-sm text-ink-600">
            Get 10 free credits when you sign up.
          </p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-800">
                  First name
                </label>
                <input
                  type="text"
                  value={form.first_name}
                  onChange={handleChange("first_name")}
                  className="w-full rounded-xl border border-paper-200 bg-white px-3.5 py-2.5 text-sm text-ink-950 outline-none transition focus:border-signal-400 focus:ring-4 focus:ring-signal-100"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-800">
                  Last name
                </label>
                <input
                  type="text"
                  value={form.last_name}
                  onChange={handleChange("last_name")}
                  className="w-full rounded-xl border border-paper-200 bg-white px-3.5 py-2.5 text-sm text-ink-950 outline-none transition focus:border-signal-400 focus:ring-4 focus:ring-signal-100"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-800">
                Username
              </label>
              <input
                type="text"
                required
                value={form.username}
                onChange={handleChange("username")}
                className="w-full rounded-xl border border-paper-200 bg-white px-3.5 py-2.5 text-sm text-ink-950 outline-none transition focus:border-signal-400 focus:ring-4 focus:ring-signal-100"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-800">
                Email
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={handleChange("email")}
                className="w-full rounded-xl border border-paper-200 bg-white px-3.5 py-2.5 text-sm text-ink-950 outline-none transition focus:border-signal-400 focus:ring-4 focus:ring-signal-100"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-800">
                Password
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={form.password}
                onChange={handleChange("password")}
                className="w-full rounded-xl border border-paper-200 bg-white px-3.5 py-2.5 text-sm text-ink-950 outline-none transition focus:border-signal-400 focus:ring-4 focus:ring-signal-100"
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
              {loading ? "Creating account..." : "Create account"}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-600">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-signal-700 hover:text-signal-800">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
