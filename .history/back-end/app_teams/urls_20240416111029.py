from django.urls import path
from .views import UserTeamByEmailView, get_user_team, CynthiaTeamView, cynthia_decision

urlpatterns = [
    path('user_team_by_email/<str:email>/', UserTeamByEmailView.as_view(), name='user-team-by-email'),
    path('user_team/<str:user_email>/', get_user_team, name='user-team-detail'),
    path('cynthia_team/', CynthiaTeamView.as_view(), name='cynthia-team'),
    path('cynthia_decision/', cynthia_decision, name='cynthia_decision'),
]
