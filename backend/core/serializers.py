from rest_framework import serializers
from .models import User, Line, Location, Animal, WeightLog, ReproductionEvent, HealthLog, Medication, Treatment

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')

class LineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Line
        fields = ('id', 'name', 'description')

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ('id', 'name', 'type', 'capacity', 'last_cleaned_date')

class AnimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Animal
        fields = ('id', 'unique_tag', 'birth_date', 'sex', 'status', 'line', 'sire', 'dam', 'location')

class WeightLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeightLog
        fields = ('id', 'animal', 'log_date', 'weight_kg')

class ReproductionEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReproductionEvent
        fields = ('id', 'female', 'male', 'mating_date', 'expected_birth_date', 'actual_birth_date', 'live_births', 'dead_births')

class HealthLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = HealthLog
        fields = ('id', 'animal', 'log_date', 'diagnosis', 'notes')

class MedicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medication
        fields = ('id', 'name', 'withdrawal_period_days')

class TreatmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Treatment
        fields = ('id', 'health_log', 'medication', 'dosage', 'withdrawal_end_date')