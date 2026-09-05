/**
 * Static metadata mirroring backend/tools/registry.py.
 * Used for building navigation and tool pages without waiting on an API
 * call, while /api/tools/ remains the source of truth for what's enabled.
 */
export const TOOLS = [
  { slug: "text-generator", name: "AI Text Generator", description: "Generate creative or informative text from any prompt.", category: "Writing" },
  { slug: "blog-writer", name: "AI Blog Writer", description: "Generate a structured, ready-to-publish blog post.", category: "Writing" },
  { slug: "email-writer", name: "AI Email Writer", description: "Draft professional emails in seconds.", category: "Writing" },
  { slug: "summarizer", name: "AI Text Summarizer", description: "Condense long text into a short, clear summary.", category: "Productivity" },
  { slug: "grammar-checker", name: "AI Grammar Checker", description: "Fix grammar, spelling and improve writing quality.", category: "Writing" },
  { slug: "paraphraser", name: "AI Paraphraser", description: "Rewrite text while preserving its original meaning.", category: "Writing" },
  { slug: "caption-generator", name: "Caption Generator", description: "Generate engaging captions for social media posts.", category: "Social Media" },
  { slug: "hashtag-generator", name: "Hashtag Generator", description: "Generate relevant, trending hashtags for your content.", category: "Social Media" },
  { slug: "resume-assistant", name: "Resume Assistant", description: "Improve resume content and get tailored suggestions.", category: "Career" },
  { slug: "study-assistant", name: "Study Assistant", description: "Explain topics, generate notes and summarize study material.", category: "Education" },
];

export function getToolBySlug(slug) {
  return TOOLS.find((t) => t.slug === slug) || null;
}
