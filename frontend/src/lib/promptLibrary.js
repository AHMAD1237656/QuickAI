/**
 * Ready-made prompts for the Prompt Library.
 * Each prompt links to the AI tool best suited to run it via `toolSlug`,
 * which must match a slug in lib/tools.js.
 */

export const PROMPT_CATEGORIES = [
  "Blog Writing Prompts",
  "Business Prompts",
  "Email Prompts",
  "Social Media Prompts",
  "Study Prompts",
  "Programming Prompts",
];

export const PROMPTS = [
  // Blog Writing Prompts -> blog-writer
  {
    id: "blog-1",
    category: "Blog Writing Prompts",
    title: "Beginner's guide post",
    text: "Write a beginner-friendly blog post explaining the basics of [topic] for someone with no prior experience.",
    toolSlug: "blog-writer",
  },
  {
    id: "blog-2",
    category: "Blog Writing Prompts",
    title: "Listicle format",
    text: "Write a listicle blog post titled '10 tips for [topic]' with a short, practical tip in each section.",
    toolSlug: "blog-writer",
  },
  {
    id: "blog-3",
    category: "Blog Writing Prompts",
    title: "Trend/opinion piece",
    text: "Write an opinion-style blog post about the future of [industry/topic] and where it's heading in the next five years.",
    toolSlug: "blog-writer",
  },
  {
    id: "blog-4",
    category: "Blog Writing Prompts",
    title: "Product comparison",
    text: "Write a blog post comparing [Option A] and [Option B], covering pros, cons, and who each is best suited for.",
    toolSlug: "blog-writer",
  },

  // Business Prompts -> text-generator
  {
    id: "biz-1",
    category: "Business Prompts",
    title: "Business idea pitch",
    text: "Write a concise pitch for a business idea that solves [problem] for [target audience], including the core value proposition.",
    toolSlug: "text-generator",
  },
  {
    id: "biz-2",
    category: "Business Prompts",
    title: "SWOT analysis",
    text: "Generate a SWOT analysis (Strengths, Weaknesses, Opportunities, Threats) for a business in the [industry] space.",
    toolSlug: "text-generator",
  },
  {
    id: "biz-3",
    category: "Business Prompts",
    title: "Meeting agenda",
    text: "Create a clear meeting agenda for a [type of meeting] covering goals, discussion topics, and time allocations.",
    toolSlug: "text-generator",
  },
  {
    id: "biz-4",
    category: "Business Prompts",
    title: "Elevator pitch",
    text: "Write a 30-second elevator pitch for a company that offers [product/service] to [target customer].",
    toolSlug: "text-generator",
  },

  // Email Prompts -> email-writer
  {
    id: "email-1",
    category: "Email Prompts",
    title: "Follow-up after meeting",
    text: "Write a follow-up email after a meeting with a client about [topic], summarizing key points and next steps.",
    toolSlug: "email-writer",
  },
  {
    id: "email-2",
    category: "Email Prompts",
    title: "Job application follow-up",
    text: "Write a polite follow-up email checking on the status of a job application for the [role] position.",
    toolSlug: "email-writer",
  },
  {
    id: "email-3",
    category: "Email Prompts",
    title: "Apology for a delay",
    text: "Write a professional email apologizing for a delay in delivering [project/task] and outlining the new timeline.",
    toolSlug: "email-writer",
  },
  {
    id: "email-4",
    category: "Email Prompts",
    title: "Cold outreach",
    text: "Write a short, friendly cold outreach email introducing [product/service] to a potential customer in [industry].",
    toolSlug: "email-writer",
  },

  // Social Media Prompts -> caption-generator / hashtag-generator
  {
    id: "social-1",
    category: "Social Media Prompts",
    title: "Product launch caption",
    text: "Write an exciting Instagram caption announcing the launch of [product], highlighting its main benefit.",
    toolSlug: "caption-generator",
  },
  {
    id: "social-2",
    category: "Social Media Prompts",
    title: "Behind-the-scenes post",
    text: "Write a casual, relatable caption for a behind-the-scenes photo of [team/process] at work.",
    toolSlug: "caption-generator",
  },
  {
    id: "social-3",
    category: "Social Media Prompts",
    title: "Hashtags for a campaign",
    text: "Generate hashtags for a social media post promoting [event/product] aimed at [target audience].",
    toolSlug: "hashtag-generator",
  },
  {
    id: "social-4",
    category: "Social Media Prompts",
    title: "Motivational quote post",
    text: "Write a short, motivational caption related to [topic] suitable for a Monday morning post.",
    toolSlug: "caption-generator",
  },

  // Study Prompts -> study-assistant
  {
    id: "study-1",
    category: "Study Prompts",
    title: "Explain a concept simply",
    text: "Explain [concept] in simple terms, as if teaching a beginner, and give one real-world example.",
    toolSlug: "study-assistant",
  },
  {
    id: "study-2",
    category: "Study Prompts",
    title: "Generate revision notes",
    text: "Generate organized revision notes summarizing the key points of [topic] for an upcoming exam.",
    toolSlug: "study-assistant",
  },
  {
    id: "study-3",
    category: "Study Prompts",
    title: "Practice questions",
    text: "Create 5 practice questions with answers to test understanding of [topic].",
    toolSlug: "study-assistant",
  },
  {
    id: "study-4",
    category: "Study Prompts",
    title: "Compare two concepts",
    text: "Explain the key differences between [concept A] and [concept B] in a clear, structured way.",
    toolSlug: "study-assistant",
  },

  // Programming Prompts -> text-generator
  {
    id: "code-1",
    category: "Programming Prompts",
    title: "Explain code behavior",
    text: "Explain what the following code does step by step, and point out any potential issues:\n\n[paste code here]",
    toolSlug: "text-generator",
  },
  {
    id: "code-2",
    category: "Programming Prompts",
    title: "Write a function",
    text: "Write a function in [programming language] that [describe the task], with comments explaining each step.",
    toolSlug: "text-generator",
  },
  {
    id: "code-3",
    category: "Programming Prompts",
    title: "Debugging help",
    text: "I'm getting the following error in [programming language]: [paste error]. Explain the likely cause and how to fix it.",
    toolSlug: "text-generator",
  },
  {
    id: "code-4",
    category: "Programming Prompts",
    title: "Code review",
    text: "Review the following code for readability, performance, and best practices, and suggest improvements:\n\n[paste code here]",
    toolSlug: "text-generator",
  },
];

export function getPromptsByCategory(category) {
  if (!category || category === "All") return PROMPTS;
  return PROMPTS.filter((p) => p.category === category);
}
