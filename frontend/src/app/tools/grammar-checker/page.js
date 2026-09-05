"use client";

import { Suspense } from "react";
import DashboardShell from "@/components/DashboardShell";
import ToolLayout from "@/components/ToolLayout";
import Loading from "@/components/Loading";

const FIELDS = [
  {
    "name": "text",
    "label": "Your text",
    "type": "textarea",
    "placeholder": "Paste text to check for grammar and clarity...",
    "primary": true
  }
];

export default function Page() {
  return (
    <DashboardShell title="AI Grammar Checker">
      <Suspense fallback={<Loading text="Loading tool..." />}>
        <ToolLayout
          slug="grammar-checker"
          title="AI Grammar Checker"
          description="Improve grammar and writing quality."
          fields={FIELDS}
        />
      </Suspense>
    </DashboardShell>
  );
}
