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
router.register(r'financialtransactions', views.FinancialTransactionViewSet)
router.register(r'feedinglogs', views.FeedingLogViewSet)
router.register(r'feedinventory', views.FeedInventoryViewSet)
router.register(r'feedrations', views.FeedRationViewSet)
router.register(r'rationcomponents', views.RationComponentViewSet)

urlpatterns = [
    path('', include(router.urls)),
]