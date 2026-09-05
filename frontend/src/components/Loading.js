import { Loader2 } from "lucide-react";

export default function Loading({ text = "Loading..." }) {
  return (
    <div className="flex items-center justify-center gap-2.5 py-16 text-ink-600">
      <Loader2 className="h-4 w-4 animate-spin text-signal-600" strokeWidth={2.5} />
      <span className="text-sm font-medium">{text}</span>
    </div>
  );
}
