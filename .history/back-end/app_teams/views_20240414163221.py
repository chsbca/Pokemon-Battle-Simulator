from django.http import JsonResponse
from rest_framework.decorators import api_view
from app_poke_user.models import Poke_user
from .models import Team

@api_view(['GET'])
def get_user_team_by_email(request, email):
    try:
        user = Poke_user.objects.get(email=email)
        team = user.team
        team_pokemons = team.pokemons.all()

        team_data = [{
            'pokemon_name': tp.pokemon.name,
            'types': [type.name for type in tp.pokemon.types.all()]
        } for tp in team_pokemons]

        return JsonResponse(team_data, safe=False)
    except Poke_user.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)
    except Team.DoesNotExist:
        return JsonResponse({'error': 'No team found for this user'}, status=404)
