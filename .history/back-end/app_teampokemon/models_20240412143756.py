from django.db import models
from django.apps import apps

class TeamPokemon(models.Model):
    # Delayed import to avoid circular dependency
    pokemon = models.ForeignKey('app_pokemoninfo.Pokemon', on_delete=models.CASCADE)
    team = models.ForeignKey('app_teams.Team', on_delete=models.CASCADE, related_name='pokemons')

    def __str__(self):
        return f"{self.pokemon.name} in team {self.team.id}"
