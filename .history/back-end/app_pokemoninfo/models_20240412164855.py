from django.db import models
from django.core.exceptions import ValidationError
from app_types.models import Type
from app_moves.models import Move
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
        TeamPokemon = apps.get_model('app_teampokemon', 'TeamPokemon')
        return TeamPokemon.objects.filter(pokemon=self)
    
    def __str__(self):
        return self.name

class LearnableMoves(models.Model):
    pokemon = models.ForeignKey(Pokemon, on_delete=models.CASCADE)
    move = models.ForeignKey(Move, on_delete=models.CASCADE)

    class Meta:
        unique_together = (('pokemon', 'move'),)

    def __str__(self):
        return f"{self.pokemon.name} can learn {self.move.name}"
    
# class ChosenMoves(models.Model):
#     learnable_move = models.ForeignKey(LearnableMoves, on_delete=models.CASCADE, related_name='chosen_moves')
#     team_pokemon = models.ForeignKey('app_teampokemon.TeamPokemon', on_delete=models.CASCADE, related_name='chosen_moves')

#     def __str__(self):
#         return f"{self.learnable_move.move.name} for {self.team_pokemon}"

class ChosenMoves(models.Model):
    learnable_move = models.ForeignKey(LearnableMoves, on_delete=models.CASCADE, related_name='chosen_moves')
    team_pokemon = models.ForeignKey('app_teampokemon.TeamPokemon', on_delete=models.CASCADE, related_name='chosen_moves')

    def clean(self):
        """ Ensure the move is learnable by the Pokémon associated with this TeamPokemon instance. """
        # Check if the team_pokemon's pokemon is the same as the learnable_move's pokemon
        if self.team_pokemon.pokemon != self.learnable_move.pokemon:
            raise ValidationError(f"{self.learnable_move.move.name} is not learnable by {self.team_pokemon.pokemon.name}")

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.learnable_move.move.name} for {self.team_pokemon}"