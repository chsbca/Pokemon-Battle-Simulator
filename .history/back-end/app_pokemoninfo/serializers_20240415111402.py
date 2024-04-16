from rest_framework import serializers
from .models import TeamPokemon, Pokemon, Move, Type, LearnableMoves, ChosenMoves, Team

class TypeBattleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Type
        fields = ['name']

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
    learnable_move = MoveBattleSerializer(read_only=True)
    
    class Meta:
        model = ChosenMoves
        fields = ['learnable_move']

class TeamPokemonBattleSerializer(serializers.ModelSerializer):
    pokemon = PokemonBattleSerializer(read_only=True)
    chosen_moves = ChosenMoveBattleSerializer(many=True, read_only=True)
    
    class Meta:
        model = TeamPokemon
        fields = ['pokemon', 'chosen_moves']

class TeamBattleSerializer(serializers.ModelSerializer):
    pokemons = TeamPokemonBattleSerializer(many=True, read_only=True, source='pokemons')
    
    class Meta:
        model = Team
        fields = ['user', 'pokemons']
