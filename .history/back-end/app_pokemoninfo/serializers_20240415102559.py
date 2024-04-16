from rest_framework import serializers
from app_pokemoninfo.models import Pokemon, Type
from app_moves.models import Move

class TypeBattleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Type
        fields = "__all__"

class MoveBattleSerializer(serializers.ModelSerializer):
    type = TypeBattleSerializer(read_only=True)

    class Meta:
        model = Move
        fields = "__all__"


class PokemonBattleSerializer(serializers.ModelSerializer):
    types = TypeBattleSerializer(many=True, read_only=True)
    moves = MoveBattleSerializer(source='learnable_moves', many=True, read_only=True)

    class Meta:
        model = Pokemon
        fields = "__all__"

