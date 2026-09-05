"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ChevronDown,
  History as HistoryIcon,
  Search,
  Trash2,
  Zap,
} from "lucide-react";
import DashboardShell from "@/components/DashboardShell";
import Loading from "@/components/Loading";
import { getHistory, deleteHistoryEntry, clearHistory, ApiError } from "@/lib/api";
import { getToolIcon } from "@/lib/toolMeta";

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [query, setQuery] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    getHistory()
      .then(setHistory)
      .catch(() => setError("Could not load your history."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return history;
    const q = query.toLowerCase();
    return history.filter(
      (item) =>
        item.tool_name.toLowerCase().includes(q) ||
        item.input_text.toLowerCase().includes(q)
    );
  }, [history, query]);

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteHistoryEntry(id);
      setHistory((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not delete this entry.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleClearAll = async () => {
    setClearing(true);
    try {
      await clearHistory();
      setHistory([]);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not clear your history.");
    } finally {
      setClearing(false);
    }
  };

  return (
    <DashboardShell title="History">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-ink-950">Usage History</h2>
          <p className="mt-1 text-sm text-ink-600">
            A record of everything you&apos;ve generated with QuickAI.
          </p>
        </div>
        {history.length > 0 && (
          <button
            onClick={handleClearAll}
            disabled={clearing}
            className="flex items-center gap-1.5 self-start rounded-lg border border-paper-200 px-3 py-2 text-sm font-medium text-ink-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Trash2 className="h-3.5 w-3.5" />
            {clearing ? "Clearing..." : "Clear all"}
          </button>
        )}
      </div>

      {!loading && history.length > 0 && (
        <div className="relative mb-5 max-w-md">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-600" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search history..."
            className="w-full rounded-xl border border-paper-200 bg-white py-2.5 pl-10 pr-3.5 text-sm text-ink-950 outline-none transition placeholder:text-ink-600/50 focus:border-signal-400 focus:ring-4 focus:ring-signal-100"
          />
        </div>
      )}

      {loading ? (
        <Loading text="Loading your history..." />
      ) : error ? (
        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </div>
      ) : history.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-paper-200 bg-white py-20 text-center">
          <HistoryIcon className="h-8 w-8 text-paper-200" strokeWidth={1.5} />
          <div>
            <p className="text-sm font-medium text-ink-800">No activity yet</p>
            <p className="mt-1 text-sm text-ink-600">
              Try a tool to see your generation history here.
            </p>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-paper-200 bg-white py-16 text-center text-sm text-ink-600">
          No history matches &quot;{query}&quot;.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => {
            const Icon = getToolIcon(item.tool_slug);
            const expanded = expandedId === item.id;
            return (
              <div
                key={item.id}
                className="rounded-2xl border border-paper-200 bg-white p-4 shadow-card transition hover:shadow-card-hover"
              >
                <div className="flex items-center gap-3.5">
                  <button
                    onClick={() => setExpandedId(expanded ? null : item.id)}
                    className="flex min-w-0 flex-1 items-center gap-3.5 text-left"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-paper-100">
                      <Icon className="h-[18px] w-[18px] text-ink-700" strokeWidth={2} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-ink-950">{item.tool_name}</p>
                      <p className="mt-0.5 truncate text-xs text-ink-600">{item.input_text}</p>
                    </div>
                    <div className="hidden shrink-0 items-center gap-1 rounded-full bg-signal-50 px-2.5 py-1 text-xs font-medium text-signal-700 sm:flex">
                      <Zap className="h-3 w-3" strokeWidth={2.5} />
                      {item.credits_used}
                    </div>
                    <span className="hidden shrink-0 text-xs text-ink-600 sm:inline">
                      {new Date(item.created_at).toLocaleString()}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-ink-600 transition-transform ${
                        expanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={deletingId === item.id}
                    className="shrink-0 rounded-lg p-2 text-ink-600 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                    aria-label="Delete entry"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {expanded && (
                  <div className="mt-3 whitespace-pre-wrap rounded-xl bg-paper-50 p-3.5 text-sm leading-relaxed text-ink-800">
                    {item.output_text}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </DashboardShell>
  );
}
