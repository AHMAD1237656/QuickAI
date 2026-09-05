import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getToolIcon, getCategoryStyle } from "@/lib/toolMeta";

export default function ToolCard({ tool }) {
  const Icon = getToolIcon(tool.slug);
  const style = getCategoryStyle(tool.category);

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group relative flex flex-col gap-4 rounded-2xl border border-paper-200 bg-white p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-signal-300/70 hover:shadow-card-hover"
    >
      <div className="flex items-start justify-between">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${style.chip}`}>
          <Icon className="h-5 w-5" strokeWidth={2} />
        </div>
        <span
          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${style.badge}`}
        >
          {tool.category}
        </span>
      </div>

      <div>
        <h3 className="text-[15px] font-semibold text-ink-950">{tool.name}</h3>
        <p className="mt-1 text-sm leading-relaxed text-ink-600">{tool.description}</p>
      </div>

      <div className="mt-auto flex items-center gap-1.5 pt-1 text-sm font-medium text-signal-700 opacity-100 transition-opacity duration-200 lg:opacity-0 lg:group-hover:opacity-100">
        Open tool
        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}
