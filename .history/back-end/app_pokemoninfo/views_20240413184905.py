from django.http import JsonResponse
from django.core.paginator import Paginator
from .models import Pokemon
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from app_teams.models import Team

def pokemon_list(request):
    pokemon_objects = Pokemon.objects.all().order_by('pokedex_number')
    paginator = Paginator(pokemon_objects, 20)  # Adjust this number based on your needs
    page = paginator.get_page(request.GET.get('page', 1))

    data = {
        'results': [{
            'name': p.name,
            'pokedexNumber': p.pokedex_number,
            'types': [type.name for type in p.types.all()],
            'stats': {
                'hp': p.hp,
                'attack': p.attack,
                'defense': p.defense,
                'special_attack': p.special_attack,
                'special_defense': p.special_defense,
                'speed': p.speed,
            }
        } for p in page.object_list],
        'next': page.next_page_number() if page.has_next() else None,
        'previous': page.previous_page_number() if page.has_previous() else None
    }

    return JsonResponse(data)

# class UserTeamView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         try:
#             user = request.user
#             team = Team.objects.get(user=user)  # Ensure user has one team linked
#             team_pokemons = team.pokemon_set.all()  # Adjust according to your relationship setup

#             results = [{
#                 'name': pokemon.name,
#                 'pokedex_number': pokemon.pokedex_number,
#                 'types': [ptype.name for ptype in pokemon.types.all()],
#                 'stats': {
#                     'hp': pokemon.hp,
#                     'attack': pokemon.attack,
#                     'defense': pokemon.defense,
#                     'special_attack': pokemon.special_attack,
#                     'special_defense': pokemon.special_defense,
#                     'speed': pokemon.speed,
#                 }
#             } for pokemon in team_pokemons]

#             return JsonResponse({'team': results}, safe=False)

#         except Team.DoesNotExist:
#             return JsonResponse({'error': 'No team found for user'}, status=404)

