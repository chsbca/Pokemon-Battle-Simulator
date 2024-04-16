# app_moves/management/commands/import_moves.py
from django.core.management.base import BaseCommand
import requests
from app_moves.models import Move
from app_types.models import Type

class Command(BaseCommand):
    help = 'Imports damaging Pokémon moves from PokeAPI'

    def handle(self, *args, **options):
        self.stdout.write("Starting import process...")
        self.import_moves()
        self.stdout.write("Import completed successfully.")

    def import_moves(self):
        response = requests.get('https://pokeapi.co/api/v2/move?limit=1000')
        if response.status_code == 200:
            moves = response.json()['results']
            for move_item in moves:
                move_response = requests.get(move_item['url'])
                if move_response.status_code == 200:
                    move_data = move_response.json()
                    if move_data.get('power') and move_data['power'] is not None:
                        self.create_move(move_data)

    def create_move(self, data):
        move_type, created = Type.objects.get_or_create(name=data['type']['name'])
        description = data['effect_entries'][0]['effect'] if data['effect_entries'] else 'No description available'
        _, created = Move.objects.update_or_create(
            name=data['name'],
            defaults={
                'description': description,
                'power': data['power'],
                'move_type': move_type
            }
        )
        if created:
            self.stdout.write(self.style.SUCCESS(f"Successfully created move {data['name']}"))
        else:
            self.stdout.write(self.style.WARNING(f"Updated existing move {data['name']}"))
