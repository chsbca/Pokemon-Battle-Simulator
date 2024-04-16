from django.http import JsonResponse
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from app_poke_user.models import Poke_user
from app_teams.models import Team
from app_teampokemon.models import TeamPokemon

class UserTeamByEmailView(APIView):
    def get(self, request, email):
        print("Requested email:", email)  # Debug print
        user = get_object_or_404(Poke_user, email=email)
        try:
            team = Team.objects.get(user=user)
            team_pokemons = TeamPokemon.objects.filter(team=team).select_related('pokemon')
            team_data = [{
                'pokemon_name': tp.pokemon.name,
                'types': [t.name for t in tp.pokemon.types.all()]
            } for tp in team_pokemons]
            return Response(team_data)
        except Team.DoesNotExist:
            return Response({'error': 'No team found for this user'}, status=status.HTTP_404_NOT_FOUND)

def get_user_team(request, user_email):
    User = get_user_model()
    user = get_object_or_404(User, email=user_email)
    team = get_object_or_404(Team, user=user)
    team_pokemons = TeamPokemon.objects.filter(team=team).select_related('pokemon').prefetch_related('chosen_moves__learnable_move__move')

    data = [{
        'pokemon_name': tp.pokemon.name,
        'types': [type.name for type in tp.pokemon.types.all()],
        'stats': {
            'hp': tp.pokemon.hp,
            'attack': tp.pokemon.attack,
            'defense': tp.pokemon.defense,
            'special_attack': tp.pokemon.special_attack,
            'special_defense': tp.pokemon.special_defense,
            'speed': tp.pokemon.speed,
        },
        'moves': [{
            'move_name': move.learnable_move.move.name,
            'description': move.learnable_move.move.description
        } for move in tp.chosen_moves.all()]
    } for tp in team_pokemons]

    return JsonResponse(data, safe=False)