from django.db import models
from app_poke_user.models import Poke_user

class Pokemon(models.Model):
    name = models.CharField(max_length=255, unique=True)
    hp = models.IntegerField()
    attack = models.IntegerField()
    defense = models.IntegerField()
    special_attack = models.IntegerField()
    special_defense = models.IntegerField()
    speed = models.IntegerField()
    evasion = models.IntegerField()
    level = models.IntegerField()

class Move(models.Model):
    name = models.CharField(max_length=255, unique=True)

class ChosenMoves(models.Model):
    pokemon = models.ForeignKey(Pokemon, on_delete=models.CASCADE, related_name='chosen_moves')
    move = models.ForeignKey(Move, on_delete=models.CASCADE)
    class Meta:
        unique_together = [['pokemon', 'move']]

class LearnableMoves(models.Model):
    pokemon = models.ForeignKey(Pokemon, on_delete=models.CASCADE, related_name='learnable_moves')
    move = models.ForeignKey(Move, on_delete=models.CASCADE)
    class Meta:
        unique_together = [['pokemon', 'move']]

class Team(models.Model):
    user = models.OneToOneField(Poke_user, on_delete=models.CASCADE, primary_key=True)
    pokemon_1 = models.ForeignKey(Pokemon, on_delete=models.SET_NULL, null=True, related_name='team_pokemon_1')
    pokemon_2 = models.ForeignKey(Pokemon, on_delete=models.SET_NULL, null=True, related_name='team_pokemon_2')
    pokemon_3 = models.ForeignKey(Pokemon, on_delete=models.SET_NULL, null=True, related_name='team_pokemon_3')
    pokemon_4 = models.ForeignKey(Pokemon, on_delete=models.SET_NULL, null=True, related_name='team_pokemon_4')
    pokemon_5 = models.ForeignKey(Pokemon, on_delete=models.SET_NULL, null=True, related_name='team_pokemon_5')
    pokemon_6 = models.ForeignKey(Pokemon, on_delete=models.SET_NULL, null=True, related_name='team_pokemon_6')
