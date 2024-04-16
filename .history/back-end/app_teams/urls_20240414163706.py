from django.urls import path
from .views import UserTeamByEmailView

urlpatterns = [
    path('user_team_by_email/<str:email>/', get_user_team_by_email, name='user-team-by-email'),
]
