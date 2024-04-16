from django.db import models
from app_pokemoninfo.models import Pokemon

class TeamPokemon(models.Model):
    pokemon = models.ForeignKey(Pokemon, on_delete=models.CASCADE)
    team = models.ForeignKey('app_teams.Team', on_delete=models.CASCADE, related_name='pokemons')

    def __str__(self):
        return f"{self.pokemon.name} in team {self.team.id}"
