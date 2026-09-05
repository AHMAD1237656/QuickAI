from django.contrib import admin

from .models import Transaction


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ["user", "plan_name", "amount", "status", "reference", "created_at"]
    list_filter = ["status", "plan_id"]
    search_fields = ["user__username", "reference"]
