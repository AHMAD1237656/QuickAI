"use client";

import { Suspense } from "react";
import DashboardShell from "@/components/DashboardShell";
import ToolLayout from "@/components/ToolLayout";
import Loading from "@/components/Loading";

const FIELDS = [
  {
    "name": "text",
    "label": "Text to paraphrase",
    "type": "textarea",
    "placeholder": "Paste the text you want rewritten...",
    "primary": true
  },
  {
    "name": "style",
    "label": "Style",
    "type": "select",
    "options": [
      {
        "value": "standard",
        "label": "Standard"
      },
      {
        "value": "simple",
        "label": "Simple"
      },
      {
        "value": "formal",
        "label": "Formal"
      },
      {
        "value": "creative",
        "label": "Creative"
      }
    ]
  }
];

export default function Page() {
  return (
    <DashboardShell title="AI Paraphraser">
      <Suspense fallback={<Loading text="Loading tool..." />}>
        <ToolLayout
          slug="paraphraser"
          title="AI Paraphraser"
          description="Rewrite text while keeping the original meaning."
          fields={FIELDS}
        />
      </Suspense>
    </DashboardShell>
  );
}
