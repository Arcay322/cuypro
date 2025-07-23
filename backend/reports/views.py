from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Sum, F
from core.models import Animal, WeightLog, FeedingLog, FinancialTransaction

class ICAReportView(APIView):
    def get(self, request, format=None):
        # This is a simplified example. Real ICA calculation is complex and depends on specific periods and animal groups.
        # It would involve: 
        # 1. Filtering WeightLogs for a specific period to get weight gained.
        # 2. Filtering FeedingLogs for the same period to get feed consumed.
        # 3. Summing up these values and calculating ICA = Feed Consumed / Weight Gained.
        
        # For demonstration, let's return some dummy data or a basic calculation
        total_feed_consumed = FeedingLog.objects.aggregate(Sum('quantity_kg'))['quantity_kg__sum'] or 0
        total_weight_gained = WeightLog.objects.aggregate(Sum('weight_kg'))['weight_kg__sum'] or 0

        ica = total_feed_consumed / total_weight_gained if total_weight_gained > 0 else 0

        return Response({
            'total_feed_consumed_kg': total_feed_consumed,
            'total_weight_gained_kg': total_weight_gained,
            'ica': round(ica, 2)
        }, status=status.HTTP_200_OK)

class CostPerKgGainedReportView(APIView):
    def get(self, request, format=None):
        # This is also a simplified example. Real calculation is complex.
        # It would involve:
        # 1. Calculating total cost of feed from FinancialTransactions (type='Costo', related to feed).
        # 2. Getting total weight gained from WeightLogs.
        # 3. Calculating Cost Per Kg Gained = Total Feed Cost / Total Weight Gained.

        total_feed_cost = FinancialTransaction.objects.filter(type='Costo').aggregate(Sum('amount'))['amount__sum'] or 0
        total_weight_gained = WeightLog.objects.aggregate(Sum('weight_kg'))['weight_kg__sum'] or 0

        cost_per_kg_gained = total_feed_cost / total_weight_gained if total_weight_gained > 0 else 0

        return Response({
            'total_feed_cost': total_feed_cost,
            'total_weight_gained_kg': total_weight_gained,
            'cost_per_kg_gained': round(cost_per_kg_gained, 2)
        }, status=status.HTTP_200_OK)