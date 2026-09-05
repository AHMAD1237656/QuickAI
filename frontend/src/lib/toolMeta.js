/**
 * Visual metadata (icons, category accents) for the tool catalog.
 * Kept separate from lib/tools.js so the tool data contract used by the
 * API layer / tool pages stays untouched.
 */
import {
  Sparkles,
  PenSquare,
  Mail,
  FileText,
  CheckCheck,
  Repeat,
  MessageSquareText,
  Hash,
  Briefcase,
  GraduationCap,
  Zap,
  Share2,
} from "lucide-react";

export const TOOL_ICONS = {
  "text-generator": Sparkles,
  "blog-writer": PenSquare,
  "email-writer": Mail,
  summarizer: FileText,
  "grammar-checker": CheckCheck,
  paraphraser: Repeat,
  "caption-generator": MessageSquareText,
  "hashtag-generator": Hash,
  "resume-assistant": Briefcase,
  "study-assistant": GraduationCap,
};

export const CATEGORY_ICONS = {
  Writing: PenSquare,
  Productivity: Zap,
  "Social Media": Share2,
  Career: Briefcase,
  Education: GraduationCap,
};

// Tailwind class groups per category, used for the small icon chip and badge.
export const CATEGORY_STYLES = {
  Writing: { chip: "bg-signal-50 text-signal-700", badge: "bg-signal-50 text-signal-700 border-signal-200" },
  Productivity: { chip: "bg-amber-50 text-amber-700", badge: "bg-amber-50 text-amber-700 border-amber-200" },
  "Social Media": { chip: "bg-sky-50 text-sky-700", badge: "bg-sky-50 text-sky-700 border-sky-200" },
  Career: { chip: "bg-violet-50 text-violet-700", badge: "bg-violet-50 text-violet-700 border-violet-200" },
  Education: { chip: "bg-rose-50 text-rose-700", badge: "bg-rose-50 text-rose-700 border-rose-200" },
};

export function getToolIcon(slug) {
  return TOOL_ICONS[slug] || Sparkles;
}

export function getCategoryStyle(category) {
  return CATEGORY_STYLES[category] || CATEGORY_STYLES.Writing;
}
