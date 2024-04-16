from django.http import JsonResponse
from django.core.paginator import Paginator
from .models import Pokemon
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from app_teams.models import Team
from app_teampokemon.models import TeamPokemon
from django.db.models import Q
from rest_framework.response import Response
from rest_framework import status
# import logging
from rest_framework.decorators import api_view
from .models import LearnableMoves, ChosenMoves
from app_moves.serializers import MoveSerializer, LearnableMovesSerializer

# logger = logging.getLogger(__name__)



def pokemon_list(request):
    query = request.GET.get('q', '')
    pokemon_objects = Pokemon.objects.filter(name__icontains=query).order_by('pokedex_number')
    paginator = Paginator(pokemon_objects, 20)
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


class UserTeamView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        try:
            team = Team.objects.get(user=user)  # Fetch the user's team
            team_pokemons = TeamPokemon.objects.filter(team=team)  # Fetch all TeamPokemon instances for the team

            results = [{
                'id': tp.id, 
                'name': tp.pokemon.name,
                'pokedex_number': tp.pokemon.pokedex_number,
                'types': [ptype.name for ptype in tp.pokemon.types.all()],
                'stats': {
                    'hp': tp.pokemon.hp,
                    'attack': tp.pokemon.attack,
                    'defense': tp.pokemon.defense,
                    'special_attack': tp.pokemon.special_attack,
                    'special_defense': tp.pokemon.special_defense,
                    'speed': tp.pokemon.speed,
                }
            } for tp in team_pokemons]  # Serialize the data of each Pokémon in the team

            return JsonResponse({'team': results}, safe=False)
        except Team.DoesNotExist:
            return JsonResponse({'error': 'No team found for this user'}, status=404)
        except TeamPokemon.DoesNotExist:
            return JsonResponse({'error': 'No Pokémon assigned to the team'}, status=404)
        
    def post(self, request):
        # logger.debug(f"Received data: {request.data}")  # Log received data
        pokemon_id = request.data.get('pokemon_id')
        if not pokemon_id:
            return Response({'error': 'Pokemon ID is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            pokemon = Pokemon.objects.get(id=pokemon_id)
            user = request.user
            team, created = Team.objects.get_or_create(user=user)
            TeamPokemon.objects.create(pokemon=pokemon, team=team)
            return Response({'message': f'{pokemon.name} added to your team!'}, status=status.HTTP_201_CREATED)
        except Pokemon.DoesNotExist:
            return Response({'error': 'Pokemon not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    def delete(self, request, pokemon_id):
        user = request.user
        try:
            team = Team.objects.get(user=user)  # Assuming each user has only one team
            team_pokemon = TeamPokemon.objects.filter(team=team, pokemon__pokedex_number=pokemon_id)
            if team_pokemon.exists():
                team_pokemon.delete()
                return Response({'success': 'Pokémon removed from team.'}, status=status.HTTP_204_NO_CONTENT)
            else:
                return Response({'error': 'Pokémon not found in team.'}, status=status.HTTP_404_NOT_FOUND)
        except Team.DoesNotExist:
            return Response({'error': 'Team not found.'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def get_learnable_moves(request, pokemon_id):
    moves = LearnableMoves.objects.filter(pokemon_id=pokemon_id).select_related('move')
    moves_data = [{'name': move.move.name, 'description': move.move.description} for move in moves]
    return Response(moves_data)

# # current working code:
# def pokemon_moves(request, pokedex_number):
#     try:
#         pokemon = Pokemon.objects.get(pokedex_number=pokedex_number)
#         moves = LearnableMoves.objects.filter(pokemon=pokemon)
#         moves_data = [{'id': move.move.id, 'name': move.move.name, 'description': move.move.description} for move in moves]
#         logger.info(moves_data)
#         return JsonResponse(moves_data, safe=False)
#     except Pokemon.DoesNotExist:
#         return JsonResponse({'error': 'Pokemon not found'}, status=404)

def pokemon_moves(request, pokedex_number):
    try:
        pokemon = Pokemon.objects.get(pokedex_number=pokedex_number)
        learnable_moves = LearnableMoves.objects.filter(pokemon=pokemon).select_related('move')
        moves_data = [{'id': move.move.id, 'name': move.move.name, 'description': move.move.description} for move in learnable_moves]
        # logger.debug(f"Learnable moves for Pokemon {pokemon.name} (ID: {pokemon.id}, Pokedex: {pokemon.pokedex_number}): {moves_data}")
        return JsonResponse(moves_data, safe=False)
    except Pokemon.DoesNotExist:
        # logger.error(f"No Pokemon found with Pokedex number: {pokedex_number}")
        return JsonResponse({'error': 'Pokemon not found'}, status=404)



class ChosenMovesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, team_pokemon_id):
        try:
            team_pokemon = TeamPokemon.objects.get(id=team_pokemon_id)
            chosen_moves = ChosenMoves.objects.filter(team_pokemon=team_pokemon)
            moves_data = [{'id': move.id, 'name': move.learnable_move.move.name} for move in chosen_moves]
            return Response(moves_data, status=status.HTTP_200_OK)
        except TeamPokemon.DoesNotExist:
            return Response({'error': 'TeamPokemon not found'}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request, team_pokemon_id):
        move_id = request.data.get('move_id')
        if not move_id:
            return Response({'error': 'Move ID is required'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            team_pokemon = TeamPokemon.objects.get(id=team_pokemon_id)
            learnable_move = LearnableMoves.objects.get(id=move_id, pokemon=team_pokemon.pokemon)
            ChosenMoves.objects.create(team_pokemon=team_pokemon, learnable_move=learnable_move)
            return Response({'message': 'Move added successfully'}, status=status.HTTP_201_CREATED)
        except TeamPokemon.DoesNotExist:
            return Response({'error': 'TeamPokemon not found'}, status=status.HTTP_404_NOT_FOUND)
        except LearnableMoves.DoesNotExist:
            return Response({'error': 'Move not valid for this Pokémon'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class PokemonLearnableMovesView(APIView):
    def get(self, request, pokedex_number):
        try:
            pokemon = Pokemon.objects.get(pokedex_number=pokedex_number)
            learnable_moves = LearnableMoves.objects.filter(pokemon=pokemon)
            serializer = LearnableMovesSerializer(learnable_moves, many=True)
            return Response(serializer.data)
        except Pokemon.DoesNotExist:
            return Response({"error": "Pokemon not found"}, status=status.HTTP_404_NOT_FOUND)