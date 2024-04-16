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
