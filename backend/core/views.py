from rest_framework import viewsets
from .models import User, Line, Location, Animal, WeightLog, ReproductionEvent, HealthLog, Medication, Treatment, FinancialTransaction
from .serializers import UserSerializer, LineSerializer, LocationSerializer, AnimalSerializer, WeightLogSerializer, ReproductionEventSerializer, HealthLogSerializer, MedicationSerializer, TreatmentSerializer, FinancialTransactionSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class LineViewSet(viewsets.ModelViewSet):
    queryset = Line.objects.all()
    serializer_class = LineSerializer

class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer

class AnimalViewSet(viewsets.ModelViewSet):
    queryset = Animal.objects.all()
    serializer_class = AnimalSerializer

class WeightLogViewSet(viewsets.ModelViewSet):
    queryset = WeightLog.objects.all()
    serializer_class = WeightLogSerializer

class ReproductionEventViewSet(viewsets.ModelViewSet):
    queryset = ReproductionEvent.objects.all()
    serializer_class = ReproductionEventSerializer

class HealthLogViewSet(viewsets.ModelViewSet):
    queryset = HealthLog.objects.all()
    serializer_class = HealthLogSerializer

class MedicationViewSet(viewsets.ModelViewSet):
    queryset = Medication.objects.all()
    serializer_class = MedicationSerializer

class TreatmentViewSet(viewsets.ModelViewSet):
    queryset = Treatment.objects.all()
    serializer_class = TreatmentSerializer

class FinancialTransactionViewSet(viewsets.ModelViewSet):
    queryset = FinancialTransaction.objects.all()
    serializer_class = FinancialTransactionSerializer