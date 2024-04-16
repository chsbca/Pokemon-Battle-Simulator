from django.urls import path
from .views import pokemon_list

urlpatterns = [
    path('api/pokemon/', pokemon_list, name='pokemon-list'),
]
