from django.db import models

class Move(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField()
    power = models.IntegerField()
    move_type = models.ForeignKey('app_types.Type', on_delete=models.PROTECT)  # Prevent deletion if referenced by any moves.

    def __str__(self):
        return self.name
