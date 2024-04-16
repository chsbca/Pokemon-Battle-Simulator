from django.contrib.auth import login, logout, authenticate
from django.core.exceptions import ValidationError
from .models import Poke_user
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
    new_poke_user = Poke_user(**data)
    try:
    # poke_user.objects.create_user(username = data.get("username"), email = data.get("email"), password = data.get("password"))
        new_poke_user.full_clean()
        new_poke_user = Poke_user.objects.create_user(**data)
        # if user is created we want to create a token with a one to one relationship to said user
        token = Token.objects.create(user= new_poke_user)
    # user email and token key
        login(request, new_poke_user)
        return [new_poke_user, token]
    except ValidationError as e:
        # print(e.message_dict)
        return e

class Master_poke_user(APIView):
    def post(self, request):
        creds_or_err = create_user_or_return_exception(request):
        if type(creds_or_err) == list:
            poke_user, token = creds_or_err
            poke_user.is_staff = True
        

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