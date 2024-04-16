from django.db import models
from app_poke_user.models import Poke_user

class Team(models.Model):
    user = models.OneToOneField(Poke_user, on_delete=models.CASCADE, related_name='team')
    pokemon_1 = models.ForeignKey('app_pokemoninfo.Pokemon', on_delete=models.SET_NULL, null=True, blank=True, related_name='+')
    pokemon_2 = models.ForeignKey('app_pokemoninfo.Pokemon', on_delete=models.SET_NULL, null=True, blank=True, related_name='+')
    pokemon_3 = models.ForeignKey('app_pokemoninfo.Pokemon', on_delete=models.SET_NULL, null=True, blank=True, related_name='+')
    pokemon_4 = models.ForeignKey('app_pokemoninfo.Pokemon', on_delete=models.SET_NULL, null=True, blank=True, related_name='+')
    pokemon_5 = models.ForeignKey('app_pokemoninfo.Pokemon', on_delete=models.SET_NULL, null=True, blank=True, related_name='+')
    pokemon_6 = models.ForeignKey('app_pokemoninfo.Pokemon', on_delete=models.SET_NULL, null=True, blank=True, related_name='+')

    def __str__(self):
        return f"{self.user.email}'s Team"
