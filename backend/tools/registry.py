"""
Static registry of the AI tools QuickAI offers.

Each tool has a unique `slug` that is used:
  * in the frontend URL (/tools/<slug>)
  * as the `tool` value sent to the FastAPI AI microservice
  * when saving usage history

Keeping this list in one place avoids duplicating tool metadata across
the codebase.
"""

TOOLS = [
    {
        "slug": "text-generator",
        "name": "AI Text Generator",
        "description": "Generate creative or informative text from any prompt.",
        "category": "Writing",
    },
    {
        "slug": "blog-writer",
        "name": "AI Blog Writer",
        "description": "Generate a structured, ready-to-publish blog post.",
        "category": "Writing",
    },
    {
        "slug": "email-writer",
        "name": "AI Email Writer",
        "description": "Draft professional emails in seconds.",
        "category": "Writing",
    },
    {
        "slug": "summarizer",
        "name": "AI Text Summarizer",
        "description": "Condense long text into a short, clear summary.",
        "category": "Productivity",
    },
    {
        "slug": "grammar-checker",
        "name": "AI Grammar Checker",
        "description": "Fix grammar, spelling and improve writing quality.",
        "category": "Writing",
    },
    {
        "slug": "paraphraser",
        "name": "AI Paraphraser",
        "description": "Rewrite text while preserving its original meaning.",
        "category": "Writing",
    },
    {
        "slug": "caption-generator",
        "name": "Caption Generator",
        "description": "Generate engaging captions for social media posts.",
        "category": "Social Media",
    },
    {
        "slug": "hashtag-generator",
        "name": "Hashtag Generator",
        "description": "Generate relevant, trending hashtags for your content.",
        "category": "Social Media",
    },
    {
        "slug": "resume-assistant",
        "name": "Resume Assistant",
        "description": "Improve resume content and get tailored suggestions.",
        "category": "Career",
    },
    {
        "slug": "study-assistant",
        "name": "Study Assistant",
        "description": "Explain topics, generate notes and summarize study material.",
        "category": "Education",
    },
]

TOOL_SLUGS = {tool["slug"] for tool in TOOLS}


def get_tool(slug):
    for tool in TOOLS:
        if tool["slug"] == slug:
            return tool
    return None
