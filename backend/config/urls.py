"""
QuickAI URL Configuration
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/users/", include("users.urls")),
    path("api/tools/", include("tools.urls")),
    path("api/credits/", include("credits.urls")),
    path("api/history/", include("history.urls")),
]
