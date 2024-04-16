from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Poke_user
from app_teams.models import Team

@receiver(post_save, sender=Poke_user)
def create_user_team(sender, instance, created, **kwargs):
    if created:
        Team.objects.create(user=instance)
