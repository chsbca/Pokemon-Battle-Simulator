from rest_framework import serializers
from .models import Pokemon, Move, Type, LearnableMoves, ChosenMoves
from app_teampokemon.models import TeamPokemon
from app_teams.models import Team
from app_types.models import TypeEffectiveness
from app_poke_user.serializers import UserBattleSerializer

class TypeEffectivenessBattleSerializer(serializers.ModelSerializer):
    target_type = serializers.CharField(source='target_type.name')  # Get the name of the target type

    class Meta:
        model = TypeEffectiveness
        fields = ['target_type', 'effectiveness']

class TypeBattleSerializer(serializers.ModelSerializer):
    effectiveness_relations = TypeEffectivenessBattleSerializer(many=True, read_only=True)
    affected_by_relations = TypeEffectivenessBattleSerializer(many=True, read_only=True)

    class Meta:
        model = Type
        fields = ['name', 'effectiveness_relations', 'affected_by_relations']

class MoveBattleSerializer(serializers.ModelSerializer):
    move_type = TypeBattleSerializer(read_only=True)
    
    class Meta:
        model = Move
        fields = ['name', 'description', 'power', 'move_type']

class PokemonBattleSerializer(serializers.ModelSerializer):
    types = TypeBattleSerializer(many=True, read_only=True)
    
    class Meta:
        model = Pokemon
        fields = ['name', 'pokedex_number', 'hp', 'attack', 'defense', 'special_attack', 'special_defense', 'speed', 'types']

class ChosenMoveBattleSerializer(serializers.ModelSerializer):
    learnable_move = serializers.SerializerMethodField()
    
    class Meta:
        model = ChosenMoves
        fields = ['learnable_move']
        
    def get_learnable_move(self, obj):
        try:
            move = obj.learnable_move.move
            return MoveBattleSerializer(move).data
        except AttributeError:
            return None


class TeamPokemonBattleSerializer(serializers.ModelSerializer):
    pokemon = PokemonBattleSerializer(read_only=True)
    chosen_moves = ChosenMoveBattleSerializer(many=True, read_only=True)
    
    class Meta:
        model = TeamPokemon
        fields = ['pokemon', 'chosen_moves']

class TeamBattleSerializer(serializers.ModelSerializer):
    pokemons = TeamPokemonBattleSerializer(many=True, read_only=True)
    user = UserBattleSerializer(read_only=True)  # Use the UserBattleSerializer here

    class Meta:
        model = Team
        fields = ['user', 'pokemons']
