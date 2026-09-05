from rest_framework import serializers

from .models import HistoryEntry


class HistoryEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = HistoryEntry
        fields = [
            "id",
            "tool_slug",
            "tool_name",
            "input_text",
            "output_text",
            "credits_used",
            "created_at",
        ]
