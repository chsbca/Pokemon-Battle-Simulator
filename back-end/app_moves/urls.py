from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MoveViewSet

router = DefaultRouter()
router.register(r'', MoveViewSet, basename='move')

urlpatterns = [
    path('', include(router.urls)),
]
