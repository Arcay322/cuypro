from rest_framework import viewsets
from .models import User, Line, Location, Animal, WeightLog
from .serializers import UserSerializer, LineSerializer, LocationSerializer, AnimalSerializer, WeightLogSerializer

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
