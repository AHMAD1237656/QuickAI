from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    Custom QuickAI user.

    Extends Django's built-in AbstractUser (username, email, password,
    first_name, last_name are already provided) with SaaS-specific fields.
    """

    PLAN_FREE = "free"
    PLAN_STARTER = "starter"
    PLAN_PRO = "pro"

    PLAN_CHOICES = [
        (PLAN_FREE, "Free"),
        (PLAN_STARTER, "Starter"),
        (PLAN_PRO, "Pro"),
    ]

    email = models.EmailField(unique=True)
    credits = models.PositiveIntegerField(default=settings.DEFAULT_SIGNUP_CREDITS)
    plan = models.CharField(max_length=20, choices=PLAN_CHOICES, default=PLAN_FREE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.username
