import httpx
from django.conf import settings
from django.db import transaction
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from history.models import HistoryEntry

from .registry import TOOLS, TOOL_SLUGS, get_tool
from .serializers import GenerateRequestSerializer, ToolSerializer


class ToolListView(APIView):
    """GET /api/tools/ — list all available AI tools."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = ToolSerializer(TOOLS, many=True)
        return Response(serializer.data)


class GenerateView(APIView):
    """
    POST /api/tools/generate/

    Body: { "tool": "summarizer", "prompt": "...", "options": {...} }

    Flow:
      1. Validate the tool exists and the user has enough credits.
      2. Call the FastAPI AI microservice.
      3. On success: deduct 1 credit, save a history entry, return the result.
      4. On failure: do NOT deduct credits, return a clear error.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = GenerateRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        tool_slug = data["tool"]
        if tool_slug not in TOOL_SLUGS:
            return Response(
                {"detail": f"Unknown tool '{tool_slug}'."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = request.user
        cost = settings.AI_GENERATION_COST

        if user.credits < cost:
            return Response(
                {
                    "detail": "Insufficient credits. Please upgrade your plan "
                    "or purchase more credits."
                },
                status=status.HTTP_402_PAYMENT_REQUIRED,
            )

        tool = get_tool(tool_slug)
        payload = {
            "tool": tool_slug,
            "prompt": data["prompt"],
            "options": data.get("options", {}),
        }

        try:
            ai_response = httpx.post(
                f"{settings.AI_SERVICE_URL}/ai/generate",
                json=payload,
                timeout=60,
            )
            ai_response.raise_for_status()
            result_data = ai_response.json()
            result_text = result_data.get("result", "")
        except httpx.HTTPStatusError as exc:
            return Response(
                {"detail": f"AI service error: {exc.response.text}"},
                status=status.HTTP_502_BAD_GATEWAY,
            )
        except httpx.RequestError:
            return Response(
                {
                    "detail": "Could not reach the AI service. Please make sure "
                    "it is running and try again."
                },
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        # Only deduct credits + log history once generation actually succeeded.
        with transaction.atomic():
            user.credits -= cost
            user.save(update_fields=["credits"])

            HistoryEntry.objects.create(
                user=user,
                tool_slug=tool_slug,
                tool_name=tool["name"] if tool else tool_slug,
                input_text=data["prompt"],
                output_text=result_text,
                credits_used=cost,
            )

        return Response(
            {"result": result_text, "credits_remaining": user.credits},
            status=status.HTTP_200_OK,
        )
