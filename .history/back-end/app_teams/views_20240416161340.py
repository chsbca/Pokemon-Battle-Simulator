from django.http import JsonResponse
from django.contrib.auth import get_user_model
from django.conf import settings
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from app_poke_user.models import Poke_user
from app_teams.models import Team
from app_teampokemon.models import TeamPokemon
from app_pokemoninfo.serializers import TeamBattleSerializer
from .openai_utils import initialize_openai
import json
import openai
import logging
import os



logger = logging.getLogger(__name__)

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

class CynthiaTeamView(APIView):
    """
    View to get Cynthia's Pokémon team without requiring authentication.
    """

    def get(self, request):
        try:
            # Assuming 'cynthia@champion.com' is the email used for Cynthia's user account
            user = Poke_user.objects.get(email='cynthia@champion.com')
            team = Team.objects.get(user=user)
            serializer = TeamBattleSerializer(team)
            return Response(serializer.data)
        except Poke_user.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)
        except Team.DoesNotExist:
            return Response({'error': 'Team not found'}, status=404)

class BattleCommentaryAPI(APIView):
   def post(self, request, *args, **kwargs):
        print("Received data:", request.data)
        battle_details = request.data
        prompt = create_prompt(battle_details)

        try:
            openai.api_key = settings.OPENAI_API_KEY
            # openai.api_key = os.getenv('OPENAI_API_KEY')
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",  # Update to the newer model
                messages=[{"role": "system", "content": prompt}]
            )
            commentary = response.choices[0].message['content'].strip()
            return Response({"commentary": commentary}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

def create_prompt(battle_details):
    return f"{battle_details['attacker']} uses {battle_details['move']}! It deals {battle_details['damage']} damage and is {battle_details['effectiveness']}! I want you to take the prompt prior and give me commentary making it like you're a hyped up commentator!"
