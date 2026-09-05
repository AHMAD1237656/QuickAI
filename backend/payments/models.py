"""
Payment-ready architecture (MOCK ONLY).

No real payment provider is integrated. This app exists so that:
  - upgrade attempts are recorded as `Transaction` rows with a clear
    lifecycle (pending -> mock_succeeded / cancelled), and
  - a real provider (Stripe, PayPal, etc.) can be dropped in later by
    replacing PaymentService.confirm() in services.py without touching
    models, URLs, or the frontend checkout flow.

IMPORTANT: `mock_succeeded` transactions are NOT real payments. They exist
only so the demo/dev flow can be exercised end-to-end locally.
"""

from django.conf import settings
from django.db import models


class Transaction(models.Model):
    STATUS_PENDING = "pending"
    STATUS_MOCK_SUCCEEDED = "mock_succeeded"
    STATUS_CANCELLED = "cancelled"

    STATUS_CHOICES = [
        (STATUS_PENDING, "Pending"),
        (STATUS_MOCK_SUCCEEDED, "Mock Succeeded"),
        (STATUS_CANCELLED, "Cancelled"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="transactions"
    )
    plan_id = models.CharField(max_length=20)  # matches credits.views.PLANS ids
    plan_name = models.CharField(max_length=50)
    amount = models.DecimalField(max_digits=8, decimal_places=2)
    credits_granted = models.PositiveIntegerField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING)
    reference = models.CharField(max_length=40, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.username} - {self.plan_name} - {self.status}"
