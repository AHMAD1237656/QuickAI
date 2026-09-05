"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Copy, Check, Trash2, Loader2, AlertCircle, Sparkles } from "lucide-react";
import { generateAI, ApiError } from "@/lib/api";
import { getToolIcon } from "@/lib/toolMeta";

/**
 * Generic AI workspace shared by every tool page.
 *
 * `fields` describes the inputs for this tool:
 *   [{ name, label, type: "text" | "textarea" | "select", placeholder,
 *      options?: [{value,label}], primary?: true }]
 *
 * The field marked `primary: true` becomes the `prompt` sent to the
 * backend; every other field is passed along as `options`.
 *
 * If a `?prompt=` query param is present (e.g. arriving from the Prompt
 * Library's "Use in AI Tools" button), it pre-fills the primary field.
 * The page rendering this component must be wrapped in <Suspense> since
 * useSearchParams requires it.
 */
export default function ToolLayout({ slug, title, description, fields }) {
  const Icon = getToolIcon(slug);
  const searchParams = useSearchParams();
  const prefillPrompt = searchParams.get("prompt") || "";

  const primaryField = fields.find((f) => f.primary) || fields[0];

  const initialState = Object.fromEntries(
    fields.map((f) => {
      if (f.name === primaryField.name && prefillPrompt) {
        return [f.name, prefillPrompt];
      }
      return [f.name, f.type === "select" ? f.options[0]?.value ?? "" : ""];
    })
  );

  const [values, setValues] = useState(initialState);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleChange = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleClear = () => {
    setValues(initialState);
    setResult("");
    setError("");
  };

  const handleCopy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard might be unavailable - fail silently, non-critical
    }
  };

  const handleGenerate = async () => {
    setError("");

    const promptValue = values[primaryField.name]?.trim();
    if (!promptValue) {
      setError(`Please fill in "${primaryField.label}" before generating.`);
      return;
    }

    const options = {};
    fields.forEach((f) => {
      if (f.name !== primaryField.name && values[f.name]) {
        options[f.name] = values[f.name];
      }
    });

    setLoading(true);
    setResult("");
    try {
      const data = await generateAI({ tool: slug, prompt: promptValue, options });
      setResult(data.result);
    } catch (err) {
      if (err instanceof ApiError && err.status === 402) {
        setError(
          "Insufficient credits. Please upgrade your plan or purchase more credits."
        );
      } else {
        setError(err.message || "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex items-start gap-3.5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ink-950">
          <Icon className="h-5 w-5 text-signal-400" strokeWidth={2} />
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-ink-950">{title}</h1>
          <p className="mt-0.5 text-sm text-ink-600">{description}</p>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Input panel */}
        <div className="rounded-2xl border border-paper-200 bg-white p-5 shadow-card">
          <div className="space-y-4">
            {fields.map((field) => (
              <div key={field.name}>
                <label className="mb-1.5 block text-sm font-medium text-ink-800">
                  {field.label}
                </label>

                {field.type === "textarea" && (
                  <textarea
                    rows={7}
                    value={values[field.name]}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full resize-none rounded-xl border border-paper-200 bg-paper-50/60 px-3.5 py-2.5 text-sm text-ink-950 outline-none transition placeholder:text-ink-600/50 focus:border-signal-400 focus:bg-white focus:ring-4 focus:ring-signal-100"
                  />
                )}

                {field.type === "text" && (
                  <input
                    type="text"
                    value={values[field.name]}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full rounded-xl border border-paper-200 bg-paper-50/60 px-3.5 py-2.5 text-sm text-ink-950 outline-none transition placeholder:text-ink-600/50 focus:border-signal-400 focus:bg-white focus:ring-4 focus:ring-signal-100"
                  />
                )}

                {field.type === "select" && (
                  <select
                    value={values[field.name]}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    className="w-full rounded-xl border border-paper-200 bg-paper-50/60 px-3.5 py-2.5 text-sm text-ink-950 outline-none transition focus:border-signal-400 focus:bg-white focus:ring-4 focus:ring-signal-100"
                  >
                    {field.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            ))}
          </div>

          {error && (
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="mt-5 flex gap-3">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-ink-950 px-4 py-2.5 text-sm font-semibold text-white tracking-tight transition-all duration-150 hover:bg-ink-900 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 text-signal-400" />
                  Generate
                </>
              )}
            </button>
            <button
              onClick={handleClear}
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl border border-paper-200 px-4 py-2.5 text-sm font-semibold text-ink-700 transition hover:bg-paper-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Trash2 className="h-4 w-4" />
              Clear
            </button>
          </div>
        </div>

        {/* Result panel */}
        <div className="rounded-2xl border border-paper-200 bg-white p-5 shadow-card">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-ink-800">Result</h2>
            {result && (
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 rounded-lg border border-paper-200 px-2.5 py-1 text-xs font-medium text-ink-700 transition hover:bg-paper-100"
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
            )}
          </div>

          {loading && (
            <div className="flex h-56 flex-col items-center justify-center gap-2 rounded-xl bg-paper-50 text-ink-600">
              <Loader2 className="h-5 w-5 animate-spin text-signal-600" />
              <span className="text-sm">Generating your result...</span>
            </div>
          )}

          {!loading && !result && (
            <div className="flex h-56 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-paper-200 text-center text-sm text-ink-600/70">
              <Icon className="h-6 w-6 text-paper-200" strokeWidth={1.5} />
              Your generated result will appear here.
            </div>
          )}

          {!loading && result && (
            <div className="max-h-[440px] overflow-y-auto whitespace-pre-wrap rounded-xl bg-paper-50 p-4 text-sm leading-relaxed text-ink-800 scrollbar-thin">
              {result}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
