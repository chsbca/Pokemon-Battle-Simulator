from django.contrib.auth import login, logout, authenticate
from .serializers import PokeUserSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

def create_user_or_return_exception(request):
    data = request.data.copy()
    data['username'] = request.data.get("email")
    # data = {'username':"","email":"", "password":""}
    # attempt to create a user
    new_trainer = Trainer(**data)
    try:
    # Trainer.objects.create_user(username = data.get("username"), email = data.get("email"), password = data.get("password"))
        new_trainer.full_clean()
        new_trainer = Trainer.objects.create_user(**data)
        # if user is created we want to create a token with a one to one relationship to said user
        token = Token.objects.create(user= new_trainer)
    # user email and token key
        login(request, new_trainer)
        return [new_trainer, token]
    except ValidationError as e:
        # print(e.message_dict)
        return e

class Master_trainer(APIView):
    def post(self, request):
        

class Sign_up(APIView):
    def post(self, request):
        serializer = PokeUserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token = Token.objects.create(user=user)
            return Response(
                {"user": user.email, "token": token.key}, 
                status=status.HTTP_201_CREATED
            )
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class Log_in(APIView):
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        
        if not email or not password:
            return Response({"error": "Both email and password are required."}, status=status.HTTP_400_BAD_REQUEST)
    
        user = authenticate(username=email, password=password)
        if user:
            token, created = Token.objects.get_or_create(user=user)
            return Response({"token": token.key, "user": user.email})
        else:
            return Response({"error": "No user matching credentials"}, status=status.HTTP_404_NOT_FOUND)
        # integrate login throttling to prevent brute force attacks for passwords
        
class TokenReq(APIView):
    authentication_classes=[TokenAuthentication]
    permission_classes=[IsAuthenticated]
    
class Log_out(TokenReq):
    def post(self, request):
        request.user.auth_token.delete()
        logout(request)
        return Response(status=status.HTTP_204_NO_CONTENT)