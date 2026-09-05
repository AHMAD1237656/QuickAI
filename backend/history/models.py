from django.conf import settings
from django.db import models


class HistoryEntry(models.Model):
    """A single record of a successful AI tool generation."""

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="history"
    )
    tool_slug = models.CharField(max_length=100)
    tool_name = models.CharField(max_length=150)
    input_text = models.TextField()
    output_text = models.TextField()
    credits_used = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.username} - {self.tool_name} ({self.created_at:%Y-%m-%d})"
