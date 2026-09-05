import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import { TOOLS } from "@/lib/tools";
import { getToolIcon, getCategoryStyle } from "@/lib/toolMeta";
import HeroBackground from "@/components/HeroBackground";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <header className="border-b border-paper-200">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink-950">
              <Zap className="h-4 w-4 text-signal-400" strokeWidth={2.5} />
            </div>
            <span className="text-[15px] font-semibold tracking-tight text-ink-950">
              QuickAI
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-ink-700 hover:text-ink-950"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="whitespace-nowrap rounded-lg bg-ink-950 px-3 py-2 text-sm font-semibold text-white tracking-tight transition-all duration-150 hover:bg-ink-900 active:scale-[0.98] sm:px-4"
            >
              <span className="sm:hidden">Get started</span>
              <span className="hidden sm:inline">Get started free</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <HeroBackground />

        <div className="mx-auto max-w-4xl px-6 py-24 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-signal-200 bg-signal-50 px-3 py-1 text-xs font-semibold text-signal-700">
            <Zap className="h-3 w-3" strokeWidth={2.5} />
            10 free credits on signup, no card required
          </span>
          <h1 className="mt-6 text-4xl font-semibold leading-[1.1] tracking-tightest text-ink-950 sm:text-[2.75rem] md:text-6xl">
            One workspace.
            <br />
            <span className="bg-gradient-to-r from-signal-600 to-accent-600 bg-clip-text text-transparent">
              Ten AI tools.
            </span>{" "}
            Zero busywork.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-ink-600">
            QuickAI brings writing, summarizing, social media and study tools
            together in one clean workspace — built for people who move fast.
          </p>
          <div className="mt-9 flex items-center justify-center gap-3">
            <Link
              href="/register"
              className="flex items-center gap-2 rounded-xl bg-ink-950 px-6 py-3 text-sm font-semibold text-white tracking-tight shadow-card-hover transition-all duration-150 hover:bg-ink-900 active:scale-[0.98]"
            >
              Start for free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="#tools"
              className="rounded-xl border border-paper-200 bg-white px-6 py-3 text-sm font-semibold text-ink-800 transition hover:bg-paper-100"
            >
              Explore tools
            </Link>
          </div>
        </div>
      </section>

      {/* Tools grid */}
      <section id="tools" className="mx-auto max-w-6xl px-6 pb-28 scroll-mt-16">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-ink-950">
            Everything you need, in one place
          </h2>
          <p className="mt-2 text-sm text-ink-600">
            Ten focused tools. No context-switching between tabs.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((tool) => {
            const Icon = getToolIcon(tool.slug);
            const style = getCategoryStyle(tool.category);
            return (
              <div
                key={tool.slug}
                className="rounded-2xl border border-paper-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-card-hover"
              >
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${style.chip}`}>
                  <Icon className="h-5 w-5" strokeWidth={2} />
                </div>
                <h3 className="mt-3.5 text-[15px] font-semibold text-ink-950">
                  {tool.name}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-600">
                  {tool.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-paper-200 bg-white py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-ink-950">
              How it works
            </h2>
            <p className="mt-2 text-sm text-ink-600">
              From idea to result in under a minute.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              { step: "01", title: "Create your account", desc: "Sign up in seconds and get 10 free credits automatically." },
              { step: "02", title: "Choose a tool", desc: "Pick from 10 focused AI tools built for writing and productivity." },
              { step: "03", title: "Get your result", desc: "Enter a prompt and get a polished AI-generated result instantly." },
            ].map((item) => (
              <div key={item.step} className="text-center sm:text-left">
                <span className="text-3xl font-semibold tracking-tight text-paper-200">
                  {item.step}
                </span>
                <h3 className="mt-2 text-base font-semibold text-ink-950">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="relative overflow-hidden bg-ink-950 py-20">
        <div className="pointer-events-none absolute -right-20 top-1/2 h-72 w-72 -translate-y-1/2 animate-float-slow rounded-full bg-signal-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 top-1/3 h-56 w-56 animate-float rounded-full bg-accent-500/15 blur-3xl [animation-delay:2s]" />
        <div className="relative mx-auto max-w-2xl px-6 text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Ready to work smarter with AI?
          </h2>
          <p className="mt-2 text-sm text-ink-600">
            Join QuickAI today — 10 free credits, no card required.
          </p>
          <Link
            href="/register"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-signal-500 px-6 py-3 text-sm font-semibold text-ink-950 tracking-tight transition-all duration-150 hover:bg-signal-400 active:scale-[0.98]"
          >
            Get started free
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-paper-200 py-8 text-center text-sm text-ink-600">
        © {new Date().getFullYear()} QuickAI. All rights reserved.
      </footer>
    </div>
  );
}
