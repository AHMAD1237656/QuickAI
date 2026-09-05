"use client";

import { Suspense } from "react";
import DashboardShell from "@/components/DashboardShell";
import ToolLayout from "@/components/ToolLayout";
import Loading from "@/components/Loading";

const FIELDS = [
  {
    "name": "prompt",
    "label": "Your prompt",
    "type": "textarea",
    "placeholder": "e.g. Write a short paragraph about renewable energy...",
    "primary": true
  },
  {
    "name": "tone",
    "label": "Tone",
    "type": "select",
    "options": [
      {
        "value": "neutral",
        "label": "Neutral"
      },
      {
        "value": "friendly",
        "label": "Friendly"
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
    <DashboardShell title="AI Text Generator">
      <Suspense fallback={<Loading text="Loading tool..." />}>
        <ToolLayout
          slug="text-generator"
          title="AI Text Generator"
          description="Generate creative or informative text from any prompt."
          fields={FIELDS}
        />
      </Suspense>
    </DashboardShell>
  );
}
