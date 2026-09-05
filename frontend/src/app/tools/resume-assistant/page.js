"use client";

import { Suspense } from "react";
import DashboardShell from "@/components/DashboardShell";
import ToolLayout from "@/components/ToolLayout";
import Loading from "@/components/Loading";

const FIELDS = [
  {
    "name": "content",
    "label": "Resume section / bullet points",
    "type": "textarea",
    "placeholder": "Paste the resume content you'd like improved...",
    "primary": true
  },
  {
    "name": "target_role",
    "label": "Target job role (optional)",
    "type": "text",
    "placeholder": "e.g. Software Engineer"
  }
];

export default function Page() {
  return (
    <DashboardShell title="Resume Assistant">
      <Suspense fallback={<Loading text="Loading tool..." />}>
        <ToolLayout
          slug="resume-assistant"
          title="Resume Assistant"
          description="Improve resume content and get tailored suggestions."
          fields={FIELDS}
        />
      </Suspense>
    </DashboardShell>
  );
}
