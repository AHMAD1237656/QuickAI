from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView


class CreditsView(APIView):
    """GET /api/credits/ — the current user's credit balance and plan."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(
            {
                "credits": request.user.credits,
                "plan": request.user.plan,
            }
        )
