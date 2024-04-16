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
        
class