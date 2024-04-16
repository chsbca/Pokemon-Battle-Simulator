from django.db import models
from app_types.models import Type
from app_moves.models import Move
# from app_teampokemon.models import TeamPokemon
from django.apps import apps

class Pokemon(models.Model):
    name = models.CharField(max_length=255, unique=True)
    hp = models.IntegerField()
    attack = models.IntegerField()
    defense = models.IntegerField()
    special_attack = models.IntegerField()
    special_defense = models.IntegerField()
    speed = models.IntegerField()
    level = models.IntegerField()
    types = models.ManyToManyField(Type, related_name='pokemons')
    
    def get_teampokemon(self):
        from app_teampokemon.models import TeamPokemon
        return TeamPokemon.objects.filter(pokemon=self)
    
    def __str__(self):
        return self.name

class LearnableMoves(models.Model):
    pokemon = models.ForeignKey(Pokemon, on_delete=models.CASCADE)
    move = models.ForeignKey(Move, on_delete=models.CASCADE)

    class Meta:
        unique_together = (('pokemon', 'move'),)  # Ensures that the combination of pokemon and move is unique

    def __str__(self):
        return f"{self.pokemon.name} can learn {self.move.name}"
    
class ChosenMoves(models.Model):
    team_pokemon = models.ForeignKey(TeamPokemon, on_delete=models.CASCADE, related_name='chosen_moves')
    move = models.ForeignKey(Move, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.move.name} for {self.team_pokemon}"
