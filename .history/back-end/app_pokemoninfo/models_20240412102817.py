from django.db import models
from app_types.models import Type
from app_moves.models import Move

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
    types = models.ManyToManyField(Type, related_name='pokemons')
    
    def __str__(self):
        return self.name

class Move(models.Model):
    name = models.CharField(max_length=255, unique=True)

class ChosenMoves(models.Model):
    pokemon = models.ForeignKey(Pokemon, on_delete=models.CASCADE, related_name='chosen_moves')
    move = models.ForeignKey(Move, on_delete=models.CASCADE)
    class Meta:
        unique_together = [['pokemon', 'move']]

class LearnableMoves(models.Model):
    pokemon = models.ForeignKey(Pokemon, on_delete=models.CASCADE)
    move = models.ForeignKey(Move, on_delete=models.CASCADE)

    class Meta:
        unique_together = (('pokemon', 'move'),)  # Ensures that the combination of pokemon and move is unique

    def __str__(self):
        return f"{self.pokemon.name} can learn {self.move.name}"
