"""
QuickAI AI Microservice

A small, focused FastAPI service responsible only for talking to an AI
provider. The Django backend calls this service over HTTP; it never
handles users, credits, or history directly.
"""

from dotenv import load_dotenv

load_dotenv()  # Load ai-service/.env before anything reads os.environ

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import ai_tools

app = FastAPI(
    title="QuickAI AI Service",
    description="Internal microservice that powers all QuickAI AI tools.",
    version="1.0.0",
)

# This service is only ever called server-to-server by the Django backend,
# but permissive local CORS is kept for convenience during development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ai_tools.router)


@app.get("/")
def root():
    return {"service": "QuickAI AI Service", "status": "running"}


@app.get("/health")
def health():
    return {"status": "ok"}
