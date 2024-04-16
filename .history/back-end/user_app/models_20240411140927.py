from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

# Create your models here.
class Poke_user(AbstractUser):
    username = None
    email = models.EmailField(
        verbose_name='email address',
        max_length=255,
        unique=True,
    )
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []