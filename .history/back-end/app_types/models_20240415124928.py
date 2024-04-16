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
            ('super_effective', 'Super Effective'),
            ('less_effective', 'Less Effective'),
            ('not_effective', 'Not Effective'),
            ('takes_more_damage', 'Takes More Damage'),
            ('takes_less_damage', 'Takes Less Damage'),
            ('receives_no_damage', 'Receives No Damage')
        ]
    )

    class Meta:
        unique_together = ('base_type', 'target_type')  # Ensures that each pair is unique

    def __str__(self):
        # Improve string representation to show both sides of the relationship
        return f"{self.base_type.name} vs {self.target_type.name}: {self.effectiveness.replace('_', ' ').capitalize()}"
