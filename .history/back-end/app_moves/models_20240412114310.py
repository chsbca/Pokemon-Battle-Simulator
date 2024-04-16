# app_moves/models.py
from django.db import models

class Move(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField()
    power = models.IntegerField()
    pp = models.IntegerField()  # Power points
    move_type = models.ForeignKey('app_types.Type', on_delete=models.SET_NULL, null=False)

    def __str__(self):
        return self.name
