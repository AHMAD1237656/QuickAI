from rest_framework import serializers

from .models import Transaction


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = [
            "id",
            "plan_id",
            "plan_name",
            "amount",
            "credits_granted",
            "status",
            "reference",
            "created_at",
        ]


class CheckoutRequestSerializer(serializers.Serializer):
    plan_id = serializers.CharField()


class TransactionActionSerializer(serializers.Serializer):
    transaction_id = serializers.IntegerField()
