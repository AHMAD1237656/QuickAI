from django.urls import path

from .views import CheckoutView, ConfirmView, CancelView, TransactionListView

urlpatterns = [
    path("checkout/", CheckoutView.as_view(), name="payments-checkout"),
    path("confirm/", ConfirmView.as_view(), name="payments-confirm"),
    path("cancel/", CancelView.as_view(), name="payments-cancel"),
    path("transactions/", TransactionListView.as_view(), name="payments-transactions"),
]
