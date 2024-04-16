from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'display_name')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = UserModel.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            display_name=validated_data.get('display_name', '')
        )
        user.set_password(validated_data['password'])
        user.save()
        return user


