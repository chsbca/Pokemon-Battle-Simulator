from django.urls import path
from .views import pokemon_list, UserTeamView, ChosenMovesView
from . import views

urlpatterns = [
    path('pokemon/', pokemon_list, name='pokemon-list'),
    path('user_team/', UserTeamView.as_view(), name='user-team'),
    path('user_team/<int:pokemon_id>/', UserTeamView.as_view(), name='user-team-modify'),
    path('pokemon/<int:pokedex_number>/moves', views.pokemon_moves, name='pokemon-moves'),
    path('team_pokemon/<int:team_pokemon_id>/chosen_moves/', ChosenMovesView.as_view(), name='chosen-moves'),
]
