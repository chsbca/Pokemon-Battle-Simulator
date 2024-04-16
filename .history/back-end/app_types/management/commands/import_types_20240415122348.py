# # app_types/management/commands/import_types.py
# from django.core.management.base import BaseCommand
# import requests
# from app_types.models import Type, TypeEffectiveness

# class Command(BaseCommand):
#     help = 'Imports Pokémon types from PokeAPI'

#     def handle(self, *args, **options):
#         self.stdout.write("Starting import process...")
#         self.import_types()
#         self.stdout.write("Import completed successfully.")

#     def import_types(self):
#         response = requests.get('https://pokeapi.co/api/v2/type')
#         if response.status_code == 200:
#             types_data = response.json()['results']
#             for type_item in types_data:
#                 type_response = requests.get(type_item['url'])
#                 if type_response.status_code == 200:
#                     type_data = type_response.json()
#                     self.create_type(type_data)

#     def create_type(self, data):
#         type_obj, created = Type.objects.get_or_create(name=data['name'])
#         if created:
#             self.stdout.write(self.style.SUCCESS(f"Successfully created type {data['name']}"))

#         # Handle the relationships
#         for relation in data['damage_relations']['double_damage_to']:
#             target_type, _ = Type.objects.get_or_create(name=relation['name'])
#             TypeEffectiveness.objects.update_or_create(
#                 base_type=type_obj,
#                 target_type=target_type,
#                 defaults={'effectiveness': 'super_effective'}
#             )

#         for relation in data['damage_relations']['no_damage_to']:
#             target_type, _ = Type.objects.get_or_create(name=relation['name'])
#             TypeEffectiveness.objects.update_or_create(
#                 base_type=type_obj,
#                 target_type=target_type,
#                 defaults={'effectiveness': 'not_effective'}
#             )

#         # Add additional handling for other relationships like half_damage_to, etc.

# app_types/management/commands/import_types.py
from django.core.management.base import BaseCommand
import requests
from app_types.models import Type, TypeEffectiveness

class Command(BaseCommand):
    help = 'Imports Pokémon types from PokeAPI'

    def handle(self, *args, **options):
        self.stdout.write("Starting import process...")
        self.import_types()
        self.stdout.write("Import completed successfully.")

    def import_types(self):
        response = requests.get('https://pokeapi.co/api/v2/type')
        if response.status_code == 200:
            types_data = response.json()['results']
            for type_item in types_data:
                type_response = requests.get(type_item['url'])
                if type_response.status_code == 200:
                    type_data = type_response.json()
                    self.create_type(type_data)

    def create_type(self, data):
        type_obj, created = Type.objects.get_or_create(name=data['name'])
        if created:
            self.stdout.write(self.style.SUCCESS(f"Successfully created type {data['name']}"))

        # Handle the relationships for super effective
        self.handle_effectiveness_relation(data['damage_relations']['double_damage_to'], type_obj, 'super_effective')
        # Handle no damage
        self.handle_effectiveness_relation(data['damage_relations']['no_damage_to'], type_obj, 'not_effective')
        # Handle half damage to
        self.handle_effectiveness_relation(data['damage_relations']['half_damage_to'], type_obj, 'less_effective')
        # Handle half damage from
        self.handle_effectiveness_relation(data['damage_relations']['half_damage_from'], type_obj, 'takes_less_damage')
        # Handle double damage from
        self.handle_effectiveness_relation(data['damage_relations']['double_damage_from'], type_obj, 'takes_more_damage')

    def handle_effectiveness_relation(self, relations, base_type, effectiveness):
        for relation in relations:
            target_type, _ = Type.objects.get_or_create(name=relation['name'])
            TypeEffectiveness.objects.update_or_create(
                base_type=base_type,
                target_type=target_type,
                defaults={'effectiveness': effectiveness}
            )
