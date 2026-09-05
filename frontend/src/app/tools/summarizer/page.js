"use client";

import { Suspense } from "react";
import DashboardShell from "@/components/DashboardShell";
import ToolLayout from "@/components/ToolLayout";
import Loading from "@/components/Loading";

const FIELDS = [
  {
    "name": "text",
    "label": "Text to summarize",
    "type": "textarea",
    "placeholder": "Paste your text here...",
    "primary": true
  },
  {
    "name": "length",
    "label": "Summary length",
    "type": "select",
    "options": [
      {
        "value": "short",
        "label": "Short"
      },
      {
        "value": "medium",
        "label": "Medium"
      },
      {
        "value": "detailed",
        "label": "Detailed"
      }
    ]
  }
];

export default function Page() {
  return (
    <DashboardShell title="AI Text Summarizer">
      <Suspense fallback={<Loading text="Loading tool..." />}>
        <ToolLayout
          slug="summarizer"
          title="AI Text Summarizer"
          description="Summarize long text into a short, clear summary."
          fields={FIELDS}
        />
      </Suspense>
    </DashboardShell>
  );
}
