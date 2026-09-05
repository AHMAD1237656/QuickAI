from django.urls import path

from .views import CreditsView

urlpatterns = [
    path("", CreditsView.as_view(), name="credits"),
]
