# app_pokemoninfo/management/commands/update_learnable_moves.py
from django.core.management.base import BaseCommand
import requests
from app_pokemoninfo.models import Pokemon, Move, LearnableMoves

class Command(BaseCommand):
    help = 'Updates learnable moves for Pokémon from PokeAPI'

    def handle(self, *args, **options):
        self.stdout.write("Starting the process to update learnable moves...")
        self.update_learnable_moves()
        self.stdout.write("Learnable moves update process completed successfully.")

    def update_learnable_moves(self):
        pokemons = Pokemon.objects.all()
        for pokemon in pokemons:
            response = requests.get(f'https://pokeapi.co/api/v2/pokemon/{pokemon.name.lower()}')
            if response.status_code == 200:
                pokemon_data = response.json()
                self.assign_learnable_moves(pokemon, pokemon_data['moves'])

def assign_learnable_moves(self, pokemon, moves_data):
    for move_info in moves_data:
        move_response = requests.get(move_info['move']['url'])
        if move_response.status_code == 200:
            move_data = move_response.json()
            if move_data['power'] is not None:  # Ensure the move has a power value
                # Safely extract the description if available
                flavor_text_entries = move_data.get('flavor_text_entries', [])
                description = ""
                for entry in flavor_text_entries:
                    if entry['language']['name'] == 'en':
                        description = entry['flavor_text']
                        break

                move, created = Move.objects.get_or_create(
                    name=move_data['name'],
                    defaults={
                        'description': description,
                        'power': move_data['power'],
                        'move_type_id': move_data['type']['name']  # Assumes type data is properly aligned
                    }
                )
                LearnableMoves.objects.get_or_create(pokemon=pokemon, move=move)
                self.stdout.write(self.style.SUCCESS(f'{pokemon.name} can now learn {move.name}'))
