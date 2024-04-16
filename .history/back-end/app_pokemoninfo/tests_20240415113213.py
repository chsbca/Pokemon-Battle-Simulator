from django.test import TestCase
from app_poke_user.models import Poke_user
from app_teams.models import Team
from app_pokemoninfo.models import Pokemon, Type, Move, LearnableMoves, ChosenMoves
from app_teampokemon.models import TeamPokemon
from .serializers import TeamBattleSerializer

class TeamBattleSerializerTest(TestCase):
    def setUp(self):
        # Setup required objects
        user = Poke_user.objects.create(email='test@example.com')
        pokemon_type = Type.objects.create(name='Water')
        pokemon = Pokemon.objects.create(name='Squirtle', pokedex_number=1, hp=100, level=50, attack=50, defense=50, special_attack=50, special_defense=50, speed=50)
        team_pokemon = TeamPokemon.objects.create(pokemon=pokemon, team=team)
        move = Move.objects.create(name='Tackle', power=40, move_type=pokemon_type)
        learnable_move = LearnableMoves.objects.create(pokemon=pokemon, move=move)
        ChosenMoves.objects.create(learnable_move=learnable_move, team_pokemon=team_pokemon)

    def test_serialization(self):
        team = Team.objects.first()
        serializer = TeamBattleSerializer(team)
        
        self.assertEqual(serializer.data['user']['email'], 'test@example.com')
        self.assertEqual(serializer.data['pokemons'][0]['pokemon']['name'], 'Squirtle')
        self.assertIn('Tackle', [move['learnable_move']['name'] for move in serializer.data['pokemons'][0]['chosen_moves']])


