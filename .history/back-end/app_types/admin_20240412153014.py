from django.contrib import admin
from .models import Type, TypeEffectiveness

admin.site.register([Type, TypeEffectiveness])