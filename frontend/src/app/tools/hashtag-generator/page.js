"use client";

import { Suspense } from "react";
import DashboardShell from "@/components/DashboardShell";
import ToolLayout from "@/components/ToolLayout";
import Loading from "@/components/Loading";

const FIELDS = [
  {
    "name": "topic",
    "label": "Post topic or caption",
    "type": "textarea",
    "placeholder": "e.g. Coffee shop grand opening in downtown",
    "primary": true
  },
  {
    "name": "count",
    "label": "Number of hashtags",
    "type": "select",
    "options": [
      {
        "value": "5",
        "label": "5"
      },
      {
        "value": "10",
        "label": "10"
      },
      {
        "value": "15",
        "label": "15"
      }
    ]
  }
];

export default function Page() {
  return (
    <DashboardShell title="Hashtag Generator">
      <Suspense fallback={<Loading text="Loading tool..." />}>
        <ToolLayout
          slug="hashtag-generator"
          title="Hashtag Generator"
          description="Generate relevant hashtags for your content."
          fields={FIELDS}
        />
      </Suspense>
    </DashboardShell>
  );
}
