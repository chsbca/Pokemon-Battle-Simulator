from django.contrib import admin
from .models import LearnableMoves, ChosenMoves, Pokemon

admin.site.register([LearnableMoves, ChosenMoves, Pokemon])