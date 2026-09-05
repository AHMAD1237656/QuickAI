"use client";

import { Suspense } from "react";
import DashboardShell from "@/components/DashboardShell";
import ToolLayout from "@/components/ToolLayout";
import Loading from "@/components/Loading";

const FIELDS = [
  {
    "name": "description",
    "label": "Describe your post",
    "type": "textarea",
    "placeholder": "e.g. A photo of a sunset at the beach with friends",
    "primary": true
  },
  {
    "name": "platform",
    "label": "Platform",
    "type": "select",
    "options": [
      {
        "value": "instagram",
        "label": "Instagram"
      },
      {
        "value": "twitter",
        "label": "Twitter / X"
      },
      {
        "value": "linkedin",
        "label": "LinkedIn"
      },
      {
        "value": "facebook",
        "label": "Facebook"
      }
    ]
  }
];

export default function Page() {
  return (
    <DashboardShell title="Social Media Caption Generator">
      <Suspense fallback={<Loading text="Loading tool..." />}>
        <ToolLayout
          slug="caption-generator"
          title="Social Media Caption Generator"
          description="Generate engaging captions for social media."
          fields={FIELDS}
        />
      </Suspense>
    </DashboardShell>
  );
}
