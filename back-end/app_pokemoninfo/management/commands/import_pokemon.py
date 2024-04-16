# from django.core.management.base import BaseCommand
# import requests
# from app_pokemoninfo.models import Pokemon

# class Command(BaseCommand):
#     help = 'Imports Pokémon and moves from PokeAPI'

#     def handle(self, *args, **options):
#         self.stdout.write("Starting import process...")
#         self.import_pokemon()
#         self.stdout.write("Import completed successfully.")

#     def import_pokemon(self):
#         response = requests.get('https://pokeapi.co/api/v2/pokemon?limit=1025')
#         if response.status_code == 200:
#             pokemons = response.json()['results']
#             for item in pokemons:
#                 pokemon_response = requests.get(item['url'])
#                 if pokemon_response.status_code == 200:
#                     pokemon_data = pokemon_response.json()
#                     self.create_pokemon(pokemon_data, level=50)

#     def create_pokemon(self, data, level):
#         level = 50
#         stats = {
#             stat['stat']['name']: self.calculate_stat(
#                 base_stat=stat['base_stat'],
#                 level=level,
#                 is_hp=stat['stat']['name'] == 'hp',
#                 is_shedinja=data['name'].lower() == 'shedinja'
#             ) for stat in data['stats']
#         }
        
#         _, created = Pokemon.objects.update_or_create(
#             name=data['name'],
#             defaults={
#                 'hp': stats['hp'],
#                 'attack': stats['attack'],
#                 'defense': stats['defense'],
#                 'special_attack': stats['special-attack'],
#                 'special_defense': stats['special-defense'],
#                 'speed': stats['speed'],
#                 'evasion': 0,  # Assuming you have a way to calculate or default this value
#                 'level': level
#             }
#         )
#         if created:
#             self.stdout.write(self.style.SUCCESS(f'Successfully created {data["name"]}'))
#         else:
#             self.stdout.write(self.style.WARNING(f'Updated existing {data["name"]}'))

#     def calculate_stat(self, base_stat, level, is_hp=False, is_shedinja=False):
#         if is_shedinja and is_hp:
#             return 1
#         if is_hp:
#             return ((2 * base_stat) * level // 100) + level + 10
#         else:
#             return ((2 * base_stat) * level // 100) + 5

from django.core.management.base import BaseCommand
import requests
from app_pokemoninfo.models import Pokemon
from requests.exceptions import RequestException

class Command(BaseCommand):
    help = 'Imports Pokémon from PokeAPI'

    def handle(self, *args, **options):
        self.stdout.write("Starting import process...")
        self.import_pokemon()
        self.stdout.write("Import completed successfully.")

    def import_pokemon(self):
        try:
            with requests.Session() as session:
                response = session.get('https://pokeapi.co/api/v2/pokemon?limit=1025')
                response.raise_for_status()  # This will raise an exception for HTTP errors
                pokemons = response.json()['results']

                for item in pokemons:
                    try:
                        pokemon_response = session.get(item['url'])
                        pokemon_response.raise_for_status()
                        pokemon_data = pokemon_response.json()
                        self.create_pokemon(pokemon_data)
                    except RequestException as e:
                        self.stdout.write(self.style.ERROR(f'Failed to fetch data for {item["name"]}: {e}'))
        except RequestException as e:
            self.stdout.write(self.style.ERROR(f'Failed to fetch initial Pokémon list: {e}'))

    def create_pokemon(self, data):
        level = 50
        pokedex_number = data['id']  # Assuming 'id' from the API response is the Pokédex number
        stats = {
            stat['stat']['name']: self.calculate_stat(
                base_stat=stat['base_stat'],
                level=level,
                is_hp=stat['stat']['name'] == 'hp',
                is_shedinja=data['name'].lower() == 'shedinja'
            ) for stat in data['stats']
        }

        _, created = Pokemon.objects.update_or_create(
            pokedex_number=pokedex_number,
            defaults={
                'name': data['name'],
                'hp': stats['hp'],
                'attack': stats['attack'],
                'defense': stats['defense'],
                'special_attack': stats['special-attack'],
                'special_defense': stats['special-defense'],
                'speed': stats['speed'],
                'level': level
            }
        )
        if created:
            self.stdout.write(self.style.SUCCESS(f"Successfully created {data['name']} (#{pokedex_number})"))
        else:
            self.stdout.write(self.style.WARNING(f"Updated existing {data['name']} (#{pokedex_number})"))

    def calculate_stat(self, base_stat, level, is_hp=False, is_shedinja=False):
        if is_shedinja and is_hp:
            return 1
        if is_hp:
            return ((2 * base_stat + 100) * level) // 100 + 10
        else:
            return ((2 * base_stat + 5) * level) // 100 + 5
