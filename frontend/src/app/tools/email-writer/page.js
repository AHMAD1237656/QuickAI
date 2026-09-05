"use client";

import { Suspense } from "react";
import DashboardShell from "@/components/DashboardShell";
import ToolLayout from "@/components/ToolLayout";
import Loading from "@/components/Loading";

const FIELDS = [
  {
    "name": "purpose",
    "label": "Purpose of the email",
    "type": "textarea",
    "placeholder": "e.g. Follow up on a job application",
    "primary": true
  },
  {
    "name": "recipient",
    "label": "Recipient",
    "type": "text",
    "placeholder": "e.g. Hiring manager"
  },
  {
    "name": "tone",
    "label": "Tone",
    "type": "select",
    "options": [
      {
        "value": "professional",
        "label": "Professional"
      },
      {
        "value": "friendly",
        "label": "Friendly"
      },
      {
        "value": "formal",
        "label": "Formal"
      }
    ]
  }
];

export default function Page() {
  return (
    <DashboardShell title="AI Email Writer">
      <Suspense fallback={<Loading text="Loading tool..." />}>
        <ToolLayout
          slug="email-writer"
          title="AI Email Writer"
          description="Generate professional emails from a purpose, recipient, and tone."
          fields={FIELDS}
        />
      </Suspense>
    </DashboardShell>
  );
}
