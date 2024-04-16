from rest_framework import serializers
from .models import Move

class MoveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Move
        fields = ['id', 'name', 'description']  # Include 'id' in the fields
