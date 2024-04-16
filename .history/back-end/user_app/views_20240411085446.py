from django.contrib.auth import authenticate
from .models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

class Sign_up(APIView):
    def post(self, request):
        request.data["username"] = request.data["email"]
        user = User.objects.create_user(**request.data)
        token = Token.objects.create(user=user)
        return Response(
            {"user": user.email, "token": token.key}, status=status.HTTP_201_CREATED
        )
        
class Log_in(APIView):
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        user = authenticate(username=email, password=password)
        if user:
            token, created = Token.objects.get_or_create(user=user)
            return Response({"token": token.key, "user": user.email})
        else:
            return Response("No user matching credentials", status=status.HTTP_404_NOT_FOUND)