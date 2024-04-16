from rest_framework import serializers
from app_teams.models import Team
from app_poke_user.serializers import UserBattleSerializer  # Assuming you have this from earlier steps
from app_pokemoninfo.serializers import PokemonBattleSerializer

class TeamPokemonBattleSerializer(serializers.ModelSerializer):
    pokemon = PokemonBattleSerializer(read_only=True)

    class Meta:
        model = TeamPokemon
        fields = "__all__"

class TeamBattleSerializer(serializers.ModelSerializer):
    user = UserBattleSerializer(read_only=True)
    pokemons = TeamPokemonBattleSerializer(many=True, source='team_pokemons', read_only=True)

    class Meta:
        model = Team
        fields = "__all__"
