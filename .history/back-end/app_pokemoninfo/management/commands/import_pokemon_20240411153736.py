from django.core.management.base import BaseCommand
import requests
from app_pokemoninfo.models import Pokemon, Move

class Command(BaseCommand):
    help = 'Imports Pokémon and moves from PokeAPI'

    def handle(self, *args, **options):
        self.stdout.write("Starting import process...")
        # Import Pokémon
        self.import_pokemon()
        # Optionally, import moves or any other data you need
        self.stdout.write("Import completed successfully.")

    def import_pokemon(self):
        response = requests.get('https://pokeapi.co/api/v2/pokemon?limit=100')
        if response.status_code == 200:
            pokemons = response.json()['results']
            for item in pokemons:
                pokemon_response = requests.get(item['url'])
                if pokemon_response.status_code == 200:
                    pokemon_data = pokemon_response.json()
                    self.create_pokemon(pokemon_data)

    def create_pokemon(self, data):
        _, created = Pokemon.objects.update_or_create(
            name=data['name'],
            defaults={
                'hp': next(stat['base_stat'] for stat in data['stats'] if stat['stat']['name'] == 'hp'),
                'attack': next(stat['base_stat'] for stat in data['stats'] if stat['stat']['name'] == 'attack'),
                'defense': next(stat['base_stat'] for stat in data['stats'] if stat['stat']['name'] == 'defense'),
                'special_attack': next(stat['base_stat'] for stat in data['stats'] if stat['stat']['name'] == 'special-attack'),
                'special_defense': next(stat['base_stat'] for stat in data['stats'] if stat['stat']['name'] == 'special-defense'),
                'speed': next(stat['base_stat'] for stat in data['stats'] if stat['stat']['name'] == 'speed'),
                'evasion': 0,  # Assuming you have a way to calculate or default this value
                'level': 50  # Assuming default level 50 as specified
            }
        )
        if created:
            self.stdout.write(self.style.SUCCESS(f'Successfully created {data["name"]}'))
        else:
            self.stdout.write(self.style.WARNING(f'Updated existing {data["name"]}'))

