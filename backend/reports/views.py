from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Sum, F, Count, Avg
from core.models import Animal, WeightLog, FeedingLog, FinancialTransaction, ReproductionEvent
from datetime import datetime, timedelta

class ICAReportView(APIView):
    def get(self, request, format=None):
        start_date_str = request.query_params.get('start_date')
        end_date_str = request.query_params.get('end_date')

        weight_logs = WeightLog.objects.all()
        feeding_logs = FeedingLog.objects.all()

        if start_date_str and end_date_str:
            try:
                start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
                end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()
                weight_logs = weight_logs.filter(log_date__range=[start_date, end_date])
                feeding_logs = feeding_logs.filter(log_date__range=[start_date, end_date])
            except ValueError:
                return Response({'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=status.HTTP_400_BAD_REQUEST)

        total_feed_consumed = feeding_logs.aggregate(Sum('quantity_kg'))['quantity_kg__sum'] or 0
        total_weight_gained = weight_logs.aggregate(Sum('weight_kg'))['weight_kg__sum'] or 0

        ica = total_feed_consumed / total_weight_gained if total_weight_gained > 0 else 0

        return Response({
            'total_feed_consumed_kg': total_feed_consumed,
            'total_weight_gained_kg': total_weight_gained,
            'ica': round(ica, 2)
        }, status=status.HTTP_200_OK)

class CostPerKgGainedReportView(APIView):
    def get(self, request, format=None):
        start_date_str = request.query_params.get('start_date')
        end_date_str = request.query_params.get('end_date')

        financial_transactions = FinancialTransaction.objects.all()
        weight_logs = WeightLog.objects.all()

        if start_date_str and end_date_str:
            try:
                start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
                end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()
                financial_transactions = financial_transactions.filter(transaction_date__range=[start_date, end_date])
                weight_logs = weight_logs.filter(log_date__range=[start_date, end_date])
            except ValueError:
                return Response({'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=status.HTTP_400_BAD_REQUEST)

        total_feed_cost = financial_transactions.filter(type='Costo').aggregate(Sum('amount'))['amount__sum'] or 0
        total_weight_gained = weight_logs.aggregate(Sum('weight_kg'))['weight_kg__sum'] or 0

        cost_per_kg_gained = total_feed_cost / total_weight_gained if total_weight_gained > 0 else 0

        return Response({
            'total_feed_cost': total_feed_cost,
            'total_weight_gained_kg': total_weight_gained,
            'cost_per_kg_gained': round(cost_per_kg_gained, 2)
        }, status=status.HTTP_200_OK)

class ProfitAndLossReportView(APIView):
    def get(self, request, format=None):
        # Simplified P&L for demonstration
        total_income = FinancialTransaction.objects.filter(type='Ingreso').aggregate(Sum('amount'))['amount__sum'] or 0
        total_cost = FinancialTransaction.objects.filter(type='Costo').aggregate(Sum('amount'))['amount__sum'] or 0
        
        profit_loss = total_income - total_cost

        return Response({
            'total_income': total_income,
            'total_cost': total_cost,
            'profit_loss': profit_loss
        }, status=status.HTTP_200_OK)

class BatchProfitabilityReportView(APIView):
    def get(self, request, format=None):
        # This is a placeholder. Real batch profitability would require:
        # 1. Defining what constitutes a 'batch' (e.g., animals born in a certain period, or from a specific reproduction event).
        # 2. Aggregating costs and incomes related to that specific batch.
        
        # For demonstration, let's return some dummy data.
        return Response({
            'message': 'Batch profitability report is a complex feature and requires more detailed batch definition.',
            'example_batch_id': 1,
            'example_profit': 150.75
        }, status=status.HTTP_200_OK)

class GDPReportView(APIView):
    def get(self, request, format=None):
        animal_id = request.query_params.get('animal_id')
        start_date_str = request.query_params.get('start_date')
        end_date_str = request.query_params.get('end_date')

        if not animal_id:
            return Response({'error': 'animal_id is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            animal = Animal.objects.get(id=animal_id)
        except Animal.DoesNotExist:
            return Response({'error': 'Animal not found.'}, status=status.HTTP_404_NOT_FOUND)

        weight_logs = WeightLog.objects.filter(animal=animal).order_by('log_date')

        if start_date_str and end_date_str:
            try:
                start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
                end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()
                weight_logs = weight_logs.filter(log_date__range=[start_date, end_date])
            except ValueError:
                return Response({'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=status.HTTP_400_BAD_REQUEST)

        if not weight_logs.exists() or weight_logs.count() < 2:
            return Response({'error': 'Not enough weight logs for GDP calculation in the given period.'}, status=status.HTTP_400_BAD_REQUEST)

        initial_weight = weight_logs.first().weight_kg
        final_weight = weight_logs.last().weight_kg
        
        # Calculate days between first and last log
        num_days = (weight_logs.last().log_date - weight_logs.first().log_date).days

        gdp = (final_weight - initial_weight) / num_days if num_days > 0 else 0

        return Response({
            'animal_id': animal_id,
            'animal_tag': animal.unique_tag,
            'initial_weight_kg': initial_weight,
            'final_weight_kg': final_weight,
            'num_days': num_days,
            'gdp': round(gdp, 2)
        }, status=status.HTTP_200_OK)

class FertilityRateReportView(APIView):
    def get(self, request, format=None):
        # Total females put to breeding
        total_females_breeding = Animal.objects.filter(sex='F', status='Pregnant').count() # Simplified
        
        # Total females that became pregnant
        total_females_pregnant = ReproductionEvent.objects.filter(actual_birth_date__isnull=False).values('female').distinct().count()

        fertility_rate = (total_females_pregnant / total_females_breeding) * 100 if total_females_breeding > 0 else 0

        return Response({
            'total_females_breeding': total_females_breeding,
            'total_females_pregnant': total_females_pregnant,
            'fertility_rate': round(fertility_rate, 2)
        }, status=status.HTTP_200_OK)

class ParturitionRateReportView(APIView):
    def get(self, request, format=None):
        # Total females that gave birth
        total_females_gave_birth = ReproductionEvent.objects.filter(actual_birth_date__isnull=False).values('female').distinct().count()
        
        # Total females that were pregnant (simplified, could be more complex)
        total_females_pregnant = Animal.objects.filter(sex='F', status='Pregnant').count()

        parturition_rate = (total_females_gave_birth / total_females_pregnant) * 100 if total_females_pregnant > 0 else 0

        return Response({
            'total_females_gave_birth': total_females_gave_birth,
            'total_females_pregnant': total_females_pregnant,
            'parturition_rate': round(parturition_rate, 2)
        }, status=status.HTTP_200_OK)

class ProlificacyReportView(APIView):
    def get(self, request, format=None):
        # Total live births
        total_live_births = ReproductionEvent.objects.aggregate(Sum('live_births'))['live_births__sum'] or 0
        
        # Total reproduction events with actual birth date
        total_reproduction_events_with_birth = ReproductionEvent.objects.filter(actual_birth_date__isnull=False).count()

        prolificacy = total_live_births / total_reproduction_events_with_birth if total_reproduction_events_with_birth > 0 else 0

        return Response({
            'total_live_births': total_live_births,
            'total_reproduction_events_with_birth': total_reproduction_events_with_birth,
            'prolificacy': round(prolificacy, 2)
        }, status=status.HTTP_200_OK)

class WPIReportView(APIView):
    def get(self, request, format=None):
        # Weaning Productive Index (WPI) is complex and requires more data (e.g., number of weaned animals).
        # For now, a placeholder.
        return Response({
            'message': 'WPI calculation is complex and requires more data.',
            'wpi': 0.0
        }, status=status.HTTP_200_OK)
