from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from . import services
from .models import Transaction
from .serializers import (
    TransactionSerializer,
    CheckoutRequestSerializer,
    TransactionActionSerializer,
)


class CheckoutView(APIView):
    """
    POST /api/payments/checkout/  { "plan_id": "starter" }

    Starts a MOCK checkout and returns a pending Transaction. No money
    moves and no external payment provider is called.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = CheckoutRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            txn = services.create_checkout(request.user, serializer.validated_data["plan_id"])
        except services.PaymentError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

        return Response(TransactionSerializer(txn).data, status=status.HTTP_201_CREATED)


class ConfirmView(APIView):
    """
    POST /api/payments/confirm/  { "transaction_id": 1 }

    MOCK confirmation only — simulates a successful payment so the local
    demo/dev flow can be exercised without a real payment provider.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = TransactionActionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            txn = services.confirm(request.user, serializer.validated_data["transaction_id"])
        except services.PaymentError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

        return Response(TransactionSerializer(txn).data, status=status.HTTP_200_OK)


class CancelView(APIView):
    """POST /api/payments/cancel/  { "transaction_id": 1 }"""

    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = TransactionActionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            txn = services.cancel(request.user, serializer.validated_data["transaction_id"])
        except services.PaymentError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

        return Response(TransactionSerializer(txn).data, status=status.HTTP_200_OK)


class TransactionListView(APIView):
    """GET /api/payments/transactions/ — the current user's own transaction history."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        txns = Transaction.objects.filter(user=request.user)
        return Response(TransactionSerializer(txns, many=True).data)
