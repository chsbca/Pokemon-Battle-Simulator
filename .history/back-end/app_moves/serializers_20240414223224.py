from rest_framework import serializers
from .models import Move
from app_pokemoninfo.models import LearnableMoves

class MoveSerializer(serializers.ModelSerializer):
    type = serializers.CharField(source='move_type.name')
    
    class Meta:
        model = Move
        fields = ['id', 'name', 'description', 'power', 'move_type']

class LearnableMovesSerializer(serializers.ModelSerializer):
    move = MoveSerializer(read_only=True)
    move_id = serializers.IntegerField(source='move.id', read_only=True)

    class Meta:
        model = LearnableMoves
        fields = ['id', 'move', 'move_id']