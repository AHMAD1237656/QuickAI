"""
Payment service abstraction.

`PaymentService` is the single place that knows how to start and confirm
a payment. Today it only implements a MOCK flow (no money moves, no
external provider is called). To integrate a real provider later:

  1. Add a real client call inside `create_checkout()` (e.g. create a
     Stripe Checkout Session) and return its redirect URL instead of the
     internal mock checkout reference.
  2. Verify the real payment (e.g. a Stripe webhook) before calling
     `confirm()` - today `confirm()` is called directly by the frontend's
     "Confirm mock payment" button, which is only safe because nothing
     real is being charged.

Nothing else in the app (models, urls, views, frontend) should need to
change to swap providers - only this file.
"""

import uuid

from django.db import transaction as db_transaction

from credits.views import PLANS
from .models import Transaction


class PaymentError(Exception):
    pass


def get_plan(plan_id):
    for plan in PLANS:
        if plan["id"] == plan_id:
            return plan
    return None


def create_checkout(user, plan_id):
    """
    Start a (mock) checkout for the given plan. Returns the created
    Transaction. Free plan has nothing to "pay" for.
    """
    plan = get_plan(plan_id)
    if plan is None:
        raise PaymentError(f"Unknown plan '{plan_id}'.")
    if plan_id == "free":
        raise PaymentError("The Free plan does not require checkout.")

    return Transaction.objects.create(
        user=user,
        plan_id=plan["id"],
        plan_name=plan["name"],
        amount=plan["price"],
        credits_granted=plan["credits"],
        status=Transaction.STATUS_PENDING,
        reference=f"MOCK-{uuid.uuid4().hex[:12].upper()}",
    )


def confirm(user, transaction_id):
    """
    Mark a pending mock transaction as succeeded and apply the plan/credits
    to the user. This is a MOCK confirmation — no real payment provider is
    verified. Replace this with a webhook-driven confirmation when a real
    provider is integrated.
    """
    try:
        txn = Transaction.objects.get(id=transaction_id, user=user)
    except Transaction.DoesNotExist as exc:
        raise PaymentError("Transaction not found.") from exc

    if txn.status != Transaction.STATUS_PENDING:
        raise PaymentError(f"Transaction is already '{txn.status}'.")

    with db_transaction.atomic():
        txn.status = Transaction.STATUS_MOCK_SUCCEEDED
        txn.save(update_fields=["status", "updated_at"])

        user.plan = txn.plan_id
        user.credits += txn.credits_granted
        user.save(update_fields=["plan", "credits"])

    return txn


def cancel(user, transaction_id):
    try:
        txn = Transaction.objects.get(id=transaction_id, user=user)
    except Transaction.DoesNotExist as exc:
        raise PaymentError("Transaction not found.") from exc

    if txn.status == Transaction.STATUS_PENDING:
        txn.status = Transaction.STATUS_CANCELLED
        txn.save(update_fields=["status", "updated_at"])

    return txn
