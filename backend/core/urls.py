from django.urls import include, path
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'lines', views.LineViewSet)
router.register(r'locations', views.LocationViewSet)
router.register(r'animals', views.AnimalViewSet)
router.register(r'weightlogs', views.WeightLogViewSet)
router.register(r'reproductionevents', views.ReproductionEventViewSet)
router.register(r'healthlogs', views.HealthLogViewSet)
router.register(r'medications', views.MedicationViewSet)
router.register(r'treatments', views.TreatmentViewSet)

urlpatterns = [
    path('', include(router.urls)),
]