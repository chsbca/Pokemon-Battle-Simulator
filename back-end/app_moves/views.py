from rest_framework import viewsets
from .models import Move
from .serializers import MoveSerializer

class MoveViewSet(viewsets.ReadOnlyModelViewSet):  # Use ReadOnlyModelViewSet if you only need read access
    queryset = Move.objects.all()
    serializer_class = MoveSerializer
