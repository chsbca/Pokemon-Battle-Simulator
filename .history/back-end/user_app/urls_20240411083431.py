from django.urls import path
from .views import Sign_up

urlpatterns = [
    path('sign_up/', Sign_up.as_view(), name='sign_up')
]