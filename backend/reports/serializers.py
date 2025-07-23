from rest_framework import serializers

class ICAReportSerializer(serializers.Serializer):
    total_feed_consumed_kg = serializers.DecimalField(max_digits=10, decimal_places=2)
    total_weight_gained_kg = serializers.DecimalField(max_digits=10, decimal_places=2)
    ica = serializers.DecimalField(max_digits=10, decimal_places=2)

class CostPerKgGainedReportSerializer(serializers.Serializer):
    total_feed_cost = serializers.DecimalField(max_digits=10, decimal_places=2)
    total_weight_gained_kg = serializers.DecimalField(max_digits=10, decimal_places=2)
    cost_per_kg_gained = serializers.DecimalField(max_digits=10, decimal_places=2)
