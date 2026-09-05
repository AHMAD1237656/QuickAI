"use client";

import { Suspense } from "react";
import DashboardShell from "@/components/DashboardShell";
import ToolLayout from "@/components/ToolLayout";
import Loading from "@/components/Loading";

const FIELDS = [
  {
    "name": "question",
    "label": "Topic or question",
    "type": "textarea",
    "placeholder": "e.g. Explain Newton's second law of motion",
    "primary": true
  },
  {
    "name": "mode",
    "label": "Mode",
    "type": "select",
    "options": [
      {
        "value": "explain",
        "label": "Explain topic"
      },
      {
        "value": "notes",
        "label": "Generate notes"
      },
      {
        "value": "summary",
        "label": "Summarize material"
      },
      {
        "value": "qa",
        "label": "Answer question"
      }
    ]
  }
];

export default function Page() {
  return (
    <DashboardShell title="Study Assistant">
      <Suspense fallback={<Loading text="Loading tool..." />}>
        <ToolLayout
          slug="study-assistant"
          title="Study Assistant"
          description="Explain topics, generate notes, and answer study questions."
          fields={FIELDS}
        />
      </Suspense>
    </DashboardShell>
  );
}
