# app_types/models.py
from django.db import models

class Type(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

# app_types/models.py
class TypeEffectiveness(models.Model):
    base_type = models.ForeignKey(Type, on_delete=models.CASCADE, related_name="effectiveness_relations")
    target_type = models.ForeignKey(Type, on_delete=models.CASCADE, related_name="affected_by_relations")
    effectiveness = models.CharField(max_length=12, choices=[('super_effective', 'Super Effective'), ('not_effective', 'Not Effective')])

    class Meta:
        unique_together = ('base_type', 'target_type')  # Ensures that each pair is unique

    def __str__(self):
        return f"{self.base_type.name} is {self.effectiveness.replace('_', ' ')} against {self.target_type.name}"
