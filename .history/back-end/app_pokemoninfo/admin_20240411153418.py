from django.contrib import admin
from .models import Pokemon, Move, ChosenMoves, LearnableMoves, Team

admin.site.register(Pokemon)
admin.site.register(Move)
admin.site.register(ChosenMoves)
admin.site.register(LearnableMoves)
admin.site.register(Team)
