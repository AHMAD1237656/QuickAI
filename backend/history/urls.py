from django.urls import path

from .views import HistoryListView, HistoryDetailView, HistoryClearView

urlpatterns = [
    path("", HistoryListView.as_view(), name="history-list"),
    path("clear/", HistoryClearView.as_view(), name="history-clear"),
    path("<int:pk>/", HistoryDetailView.as_view(), name="history-detail"),
]
