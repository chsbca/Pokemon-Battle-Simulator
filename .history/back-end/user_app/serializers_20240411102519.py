from .models import User
from django.contrib.auth
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True,)
    
    
    class Meta:
        model = User
        fields = '__all__'