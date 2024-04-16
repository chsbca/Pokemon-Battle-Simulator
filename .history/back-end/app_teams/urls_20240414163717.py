from django.urls import path
from .views import UserTeamByEmailView

urlpatterns = [
    path('user_team_by_email/<str:email>/', UserTeamByEmailView.as_view(), name='user-team-by-email'),
]
