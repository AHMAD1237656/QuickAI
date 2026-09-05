from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import HistoryEntry
from .serializers import HistoryEntrySerializer


class HistoryListView(generics.ListAPIView):
    """GET /api/history/ — the authenticated user's own generation history."""

    serializer_class = HistoryEntrySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return HistoryEntry.objects.filter(user=self.request.user)


class HistoryDetailView(APIView):
    """DELETE /api/history/<id>/ — delete a single history entry the user owns."""

    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, pk):
        try:
            entry = HistoryEntry.objects.get(pk=pk, user=request.user)
        except HistoryEntry.DoesNotExist:
            return Response(
                {"detail": "History entry not found."}, status=status.HTTP_404_NOT_FOUND
            )
        entry.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class HistoryClearView(APIView):
    """DELETE /api/history/clear/ — delete all of the user's own history entries."""

    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request):
        HistoryEntry.objects.filter(user=request.user).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
