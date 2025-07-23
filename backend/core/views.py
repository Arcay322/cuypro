from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import User, Line, Location, Animal, WeightLog, ReproductionEvent, HealthLog, Medication, Treatment, FinancialTransaction, FeedingLog, FeedInventory
from .serializers import UserSerializer, LineSerializer, LocationSerializer, AnimalSerializer, WeightLogSerializer, ReproductionEventSerializer, HealthLogSerializer, MedicationSerializer, TreatmentSerializer, FinancialTransactionSerializer, FeedingLogSerializer, FeedInventorySerializer

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

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.status == 'Retired' and request.data.get('status') == 'Sold':
            return Response({'error': 'Cannot sell a retired animal.'}, status=status.HTTP_400_BAD_REQUEST)
        return super().update(request, *args, **kwargs)

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

class FeedingLogViewSet(viewsets.ModelViewSet):
    queryset = FeedingLog.objects.all()
    serializer_class = FeedingLogSerializer

class FeedInventoryViewSet(viewsets.ModelViewSet):
    queryset = FeedInventory.objects.all()
    serializer_class = FeedInventorySerializer
