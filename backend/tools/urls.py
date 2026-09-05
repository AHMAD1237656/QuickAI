from django.urls import path

from .views import ToolListView, GenerateView

urlpatterns = [
    path("", ToolListView.as_view(), name="tool-list"),
    path("generate/", GenerateView.as_view(), name="tool-generate"),
]
