from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Poke_user


class PokeUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Poke_user
        fields = ('email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = Poke_user.objects.create_user(
            email=validated_data['email']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user


