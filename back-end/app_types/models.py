# app_types/models.py
from django.db import models

class Type(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

class TypeEffectiveness(models.Model):
    base_type = models.ForeignKey(Type, on_delete=models.CASCADE, related_name="effectiveness_relations")
    target_type = models.ForeignKey(Type, on_delete=models.CASCADE, related_name="affected_by_relations")
    effectiveness = models.CharField(
        max_length=20,
        choices=[
            ('super_effective', 'Does x2.0 Damage'),
            ('less_effective', 'Does x0.5 Damage'),
            ('not_effective', 'Does x0.0 Damage'),
            ('takes_more_damage', 'Takes x2.0 Damage'),
            ('takes_less_damage', 'Takes x0.5 Damage'),
            ('receives_no_damage', 'Takes x0.0 Damage')
        ]
    )

    class Meta:
        unique_together = ('base_type', 'target_type')  # Ensures that each pair is unique

    def __str__(self):
        # Improve string representation to show both sides of the relationship
        return f"{self.base_type.name} vs {self.target_type.name}: {self.effectiveness.replace('_', ' ').capitalize()}"
