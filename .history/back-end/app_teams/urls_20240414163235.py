from django.urls import path
from .views import get_user_team_by_email

urlpatterns = [
    path('user_team_by_email/<str:email>/', get_user_team_by_email, name='user-team-by-email'),
]
