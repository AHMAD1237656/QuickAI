"use client";

import { Suspense } from "react";
import DashboardShell from "@/components/DashboardShell";
import ToolLayout from "@/components/ToolLayout";
import Loading from "@/components/Loading";

const FIELDS = [
  {
    "name": "topic",
    "label": "Blog topic",
    "type": "textarea",
    "placeholder": "e.g. The future of remote work",
    "primary": true
  },
  {
    "name": "tone",
    "label": "Tone",
    "type": "select",
    "options": [
      {
        "value": "informative",
        "label": "Informative"
      },
      {
        "value": "casual",
        "label": "Casual"
      },
      {
        "value": "professional",
        "label": "Professional"
      }
    ]
  },
  {
    "name": "length",
    "label": "Length",
    "type": "select",
    "options": [
      {
        "value": "short",
        "label": "Short (~300 words)"
      },
      {
        "value": "medium",
        "label": "Medium (~600 words)"
      },
      {
        "value": "long",
        "label": "Long (~1000 words)"
      }
    ]
  }
];

export default function Page() {
  return (
    <DashboardShell title="AI Blog Writer">
      <Suspense fallback={<Loading text="Loading tool..." />}>
        <ToolLayout
          slug="blog-writer"
          title="AI Blog Writer"
          description="Generate a structured blog from a topic, tone, and length."
          fields={FIELDS}
        />
      </Suspense>
    </DashboardShell>
  );
}
