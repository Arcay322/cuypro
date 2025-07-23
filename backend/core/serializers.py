from rest_framework import serializers
from .models import User, Line, Location, Animal, WeightLog, ReproductionEvent, HealthLog, Medication, Treatment, FinancialTransaction, FeedingLog, FeedInventory, FeedRation, RationComponent

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

class FinancialTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = FinancialTransaction
        fields = ('id', 'transaction_date', 'type', 'amount', 'description', 'related_entity_id')

class FeedingLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeedingLog
        fields = ('id', 'location', 'log_date', 'feed_type', 'quantity_kg')

class FeedInventorySerializer(serializers.ModelSerializer):
    class Meta:
        model = FeedInventory
        fields = ('id', 'product_name', 'quantity_kg', 'cost_per_kg', 'supplier', 'entry_date')

class RationComponentSerializer(serializers.ModelSerializer):
    feed_item_name = serializers.ReadOnlyField(source='feed_item.product_name')

    class Meta:
        model = RationComponent
        fields = ('id', 'feed_ration', 'feed_item', 'feed_item_name', 'percentage')

class FeedRationSerializer(serializers.ModelSerializer):
    components = RationComponentSerializer(many=True, read_only=True, source='rationcomponent_set')

    class Meta:
        model = FeedRation
        fields = ('id', 'name', 'description', 'components')