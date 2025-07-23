from rest_framework import serializers

class ICAReportSerializer(serializers.Serializer):
    total_feed_consumed_kg = serializers.DecimalField(max_digits=10, decimal_places=2)
    total_weight_gained_kg = serializers.DecimalField(max_digits=10, decimal_places=2)
    ica = serializers.DecimalField(max_digits=10, decimal_places=2)

class CostPerKgGainedReportSerializer(serializers.Serializer):
    total_feed_cost = serializers.DecimalField(max_digits=10, decimal_places=2)
    total_weight_gained_kg = serializers.DecimalField(max_digits=10, decimal_places=2)
    cost_per_kg_gained = serializers.DecimalField(max_digits=10, decimal_places=2)

class ProfitAndLossReportSerializer(serializers.Serializer):
    total_income = serializers.DecimalField(max_digits=10, decimal_places=2)
    total_cost = serializers.DecimalField(max_digits=10, decimal_places=2)
    profit_loss = serializers.DecimalField(max_digits=10, decimal_places=2)

class BatchProfitabilityReportSerializer(serializers.Serializer):
    message = serializers.CharField(max_length=255)
    example_batch_id = serializers.IntegerField(required=False)
    example_profit = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)