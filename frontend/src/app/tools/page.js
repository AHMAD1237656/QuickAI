"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import DashboardShell from "@/components/DashboardShell";
import ToolCard from "@/components/ToolCard";
import { TOOLS } from "@/lib/tools";

const CATEGORIES = ["All Tools", "Writing", "Productivity", "Social Media", "Career", "Education"];

export default function ToolsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All Tools");

  const filtered = useMemo(() => {
    return TOOLS.filter((tool) => {
      const matchesCategory = category === "All Tools" || tool.category === category;
      const matchesQuery =
        !query.trim() ||
        tool.name.toLowerCase().includes(query.toLowerCase()) ||
        tool.description.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  return (
    <DashboardShell title="AI Tools">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold tracking-tight text-ink-950">AI Tools</h2>
        <p className="mt-1 text-sm text-ink-600">
          Everything you need to create, write and work smarter. Each generation costs 1 credit.
        </p>
      </div>

      {/* Search + filters */}
      <div className="mb-6 space-y-4">
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-600" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools..."
            className="w-full rounded-xl border border-paper-200 bg-white py-2.5 pl-10 pr-3.5 text-sm text-ink-950 outline-none transition placeholder:text-ink-600/50 focus:border-signal-400 focus:ring-4 focus:ring-signal-100"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
                category === cat
                  ? "border-ink-950 bg-ink-950 text-white"
                  : "border-paper-200 bg-white text-ink-700 hover:bg-paper-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-paper-200 bg-white py-16 text-center text-sm text-ink-600">
          No tools match &quot;{query}&quot;. Try a different search or category.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
