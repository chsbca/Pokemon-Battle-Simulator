from django.db import models
from django.contrib.auth.models import AbstractUser
from .managers import PokeUserManager  # Ensure this points to your custom manager

class Poke_user(AbstractUser):
    username = None
    email = models.EmailField(
        verbose_name='email address',
        max_length=255,
        unique=True,
    )
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = PokeUserManager()

    def __str__(self):
        return self.email
