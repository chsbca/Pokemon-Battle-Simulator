from django.db import models
from app_poke_user.models import Poke_user

class Team(models.Model):
    user = models.OneToOneField(Poke_user, on_delete=models.CASCADE, related_name='team')

    def __str__(self):
        return f"{self.user.email}'s Team"
