from django.contrib import admin

from .models import HistoryEntry


@admin.register(HistoryEntry)
class HistoryEntryAdmin(admin.ModelAdmin):
    list_display = ["user", "tool_name", "credits_used", "created_at"]
    list_filter = ["tool_slug", "created_at"]
    search_fields = ["user__username", "tool_name"]
