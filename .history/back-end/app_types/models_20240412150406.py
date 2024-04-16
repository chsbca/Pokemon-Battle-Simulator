from django.db import models

class Type(models.Model):
    name = models.CharField(max_length=50, unique=True)
    super_effective_against = models.ManyToManyField('self', related_name='weak_against', symmetrical=False, blank=True, null=True)
    not_effective_against = models.ManyToManyField('self', related_name='strong_against', symmetrical=False, blank=True, null=True)

    def __str__(self):
        return self.name
