from django.http import JsonResponse
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from app_poke_user.models import Poke_user
from app_teams.models import Team
from app_teampokemon.models import TeamPokemon
from app_pokemoninfo.serializers import TeamBattleSerializer
from .openai_utils import get_cynthias_move, initialize_openai
import json

initialize_openai()

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

class CynthiaDecisionAPI(APIView):
    permission_classes = [AllowAny]  # Ensure it’s accessible without authentication

    def post(self, request, *args, **kwargs):
        try:
            data = request.data  # Accessing data directly from request.data which is already parsed
            print("Received data for decision:", data)

            # Assuming get_cynthias_move is a function that takes JSON data and returns a decision
            decision = get_cynthias_move(data)
            if decision:
                return Response(decision, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'No decision could be made'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
