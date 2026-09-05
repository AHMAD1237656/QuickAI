"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Copy,
  Check,
  ArrowRight,
  PenSquare,
  Briefcase,
  Mail,
  Share2,
  GraduationCap,
  Code2,
  BookOpen,
} from "lucide-react";
import DashboardShell from "@/components/DashboardShell";
import { PROMPT_CATEGORIES, PROMPTS } from "@/lib/promptLibrary";
import { getToolIcon } from "@/lib/toolMeta";

const CATEGORY_ICONS = {
  "Blog Writing Prompts": PenSquare,
  "Business Prompts": Briefcase,
  "Email Prompts": Mail,
  "Social Media Prompts": Share2,
  "Study Prompts": GraduationCap,
  "Programming Prompts": Code2,
};

const CATEGORY_CHIP = {
  "Blog Writing Prompts": "bg-signal-50 text-signal-700",
  "Business Prompts": "bg-violet-50 text-violet-700",
  "Email Prompts": "bg-sky-50 text-sky-700",
  "Social Media Prompts": "bg-rose-50 text-rose-700",
  "Study Prompts": "bg-amber-50 text-amber-700",
  "Programming Prompts": "bg-teal-50 text-teal-700",
};

export default function PromptLibraryPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [copiedId, setCopiedId] = useState(null);

  const filtered = useMemo(() => {
    return PROMPTS.filter((p) => {
      const matchesCategory = activeCategory === "All" || p.category === activeCategory;
      const matchesQuery =
        !query.trim() ||
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.text.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query]);

  const handleCopy = async (prompt) => {
    try {
      await navigator.clipboard.writeText(prompt.text);
      setCopiedId(prompt.id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      // clipboard might be unavailable — non-critical
    }
  };

  const handleUseInTool = (prompt) => {
    router.push(`/tools/${prompt.toolSlug}?prompt=${encodeURIComponent(prompt.text)}`);
  };

  return (
    <DashboardShell title="Prompt Library">
      <div className="mb-6 flex items-start gap-3.5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ink-950">
          <BookOpen className="h-5 w-5 text-signal-400" strokeWidth={2} />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink-950">Prompt Library</h1>
          <p className="mt-0.5 text-sm text-ink-600">
            Ready-made prompts you can copy or run directly in the right AI tool.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        {/* Category filter */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          <div className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
            <button
              onClick={() => setActiveCategory("All")}
              className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition lg:w-full ${
                activeCategory === "All"
                  ? "bg-ink-950 text-white"
                  : "bg-white text-ink-700 hover:bg-paper-100"
              } border border-paper-200`}
            >
              All Prompts
            </button>
            {PROMPT_CATEGORIES.map((cat) => {
              const Icon = CATEGORY_ICONS[cat];
              const active = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition lg:w-full ${
                    active
                      ? "border-ink-950 bg-ink-950 text-white"
                      : "border-paper-200 bg-white text-ink-700 hover:bg-paper-100"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" strokeWidth={2} />
                  <span className="whitespace-nowrap">{cat}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Prompt list */}
        <div>
          <div className="relative mb-5 max-w-md">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-600" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search prompts..."
              className="w-full rounded-xl border border-paper-200 bg-white py-2.5 pl-10 pr-3.5 text-sm text-ink-950 outline-none transition placeholder:text-ink-600/50 focus:border-signal-400 focus:ring-4 focus:ring-signal-100"
            />
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-paper-200 bg-white py-16 text-center text-sm text-ink-600">
              No prompts match your search.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((prompt) => {
                const ToolIcon = getToolIcon(prompt.toolSlug);
                const chip = CATEGORY_CHIP[prompt.category] || "bg-paper-100 text-ink-700";
                const copied = copiedId === prompt.id;
                return (
                  <div
                    key={prompt.id}
                    className="flex flex-col rounded-2xl border border-paper-200 bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover"
                  >
                    <span className={`inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${chip}`}>
                      {prompt.category}
                    </span>
                    <h3 className="mt-3 text-[15px] font-semibold text-ink-950">{prompt.title}</h3>
                    <p className="mt-1.5 flex-1 whitespace-pre-wrap text-sm leading-relaxed text-ink-600">
                      {prompt.text}
                    </p>

                    <div className="mt-4 flex items-center gap-2">
                      <button
                        onClick={() => handleCopy(prompt)}
                        className="flex items-center gap-1.5 rounded-lg border border-paper-200 px-3 py-1.5 text-xs font-medium text-ink-700 transition hover:bg-paper-100"
                      >
                        {copied ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-signal-600" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            Copy
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleUseInTool(prompt)}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-ink-950 px-3 py-1.5 text-xs font-semibold text-white tracking-tight transition-all duration-150 hover:bg-ink-900 active:scale-[0.98]"
                      >
                        <ToolIcon className="h-3.5 w-3.5 text-signal-400" />
                        Use in AI Tools
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
