from django.urls import include, path
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'lines', views.LineViewSet)
router.register(r'locations', views.LocationViewSet)
router.register(r'animals', views.AnimalViewSet)
router.register(r'weightlogs', views.WeightLogViewSet)

urlpatterns = [
    path('', include(router.urls)),
]