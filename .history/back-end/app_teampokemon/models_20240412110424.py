from django.db import models
from app_pokemoninfo.models import Pokemon

class TeamPokemon(models.Model):
    pokemon = models.ForeignKey(Pokemon, on_delete=models.CASCADE)
    team = models.ForeignKey('app_team.Team', on_delete=models.CASCADE, related_name='pokemons')
    nickname = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return f"{self.nickname or self.pokemon.name} in team {self.team.id}"
