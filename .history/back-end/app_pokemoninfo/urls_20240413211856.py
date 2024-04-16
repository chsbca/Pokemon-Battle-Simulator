from django.urls import path
from .views import pokemon_list, UserTeamView

urlpatterns = [
    path('pokemon/', pokemon_list, name='pokemon-list'),
    path('user_team/', UserTeamView.as_view(), name='user-team'),
    path('user_team/<int:pokemon_id>/', UserTeamView.as_view(), name='user-team-modify'),
]
