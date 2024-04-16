from django.urls import path
from .views import Sign_up, Log_in, Log_out #Info

urlpatterns = [
    path('sign_up/', Sign_up.as_view(), name='sign_up'),
    path("login/", Log_in.as_view(), name="login"),
    path("logout/", Log_out.as_view(), name="logout"),
    # path("", Info.as_view(), name="info")
    path()
]