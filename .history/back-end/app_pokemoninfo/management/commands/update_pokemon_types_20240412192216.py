# app_pokemoninfo/management/commands/update_pokemon_types.py
from django.core.management.base import BaseCommand
import requests
from app_pokemoninfo.models import Pokemon, Type

class Command(BaseCommand):
    help = 'Updates Pokémon types from PokeAPI'

    def handle(self, *args, **options):
        self.stdout.write("Starting the update process for Pokémon types...")
        self.update_pokemon_types()
        self.stdout.write("Type update process completed successfully.")

    def update_pokemon_types(self):
        pokemons = Pokemon.objects.all()
        for pokemon in pokemons:
            response = requests.get(f'https://pokeapi.co/api/v2/pokemon/{pokemon.name.lower()}')
            if response.status_code == 200:
                pokemon_data = response.json()
                self.set_pokemon_types(pokemon, pokemon_data['types'])

    def set_pokemon_types(self, pokemon, types_data):
        pokemon.types.clear()  # Clear existing types to avoid duplication
        for type_info in types_data:
            type_name = type_info['type']['name']
            type_obj, created = Type.objects.get_or_create(name=type_name)
            pokemon.types.add(type_obj)
        pokemon.save()
        self.stdout.write(self.style.SUCCESS(f'Updated types for {pokemon.name}'))
