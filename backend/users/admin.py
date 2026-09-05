from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import User


@admin.register(User)
class QuickAIUserAdmin(UserAdmin):
    list_display = ["username", "email", "credits", "plan", "is_staff", "created_at"]
    fieldsets = UserAdmin.fieldsets + (
        ("QuickAI info", {"fields": ("credits", "plan")}),
    )
