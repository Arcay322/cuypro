from django.urls import path
from .views import ICAReportView, CostPerKgGainedReportView, ProfitAndLossReportView, BatchProfitabilityReportView, GDPReportView, FertilityRateReportView, ParturitionRateReportView, ProlificacyReportView, WPIReportView, WithdrawalAlertsView, IneffectiveTreatmentAlertsView, LowStockAlertsView, ReproductiveRankingReportView, DensityReportView

urlpatterns = [
    path('ica-report/', ICAReportView.as_view(), name='ica-report'),
    path('cost-per-kg-gained-report/', CostPerKgGainedReportView.as_view(), name='cost-per-kg-gained-report'),
    path('profit-and-loss-report/', ProfitAndLossReportView.as_view(), name='profit-and-loss-report'),
    path('batch-profitability-report/', BatchProfitabilityReportView.as_view(), name='batch-profitability-report'),
    path('gdp-report/', GDPReportView.as_view(), name='gdp-report'),
    path('fertility-rate-report/', FertilityRateReportView.as_view(), name='fertility-rate-report'),
    path('parturition-rate-report/', ParturitionRateReportView.as_view(), name='parturition-rate-report'),
    path('prolificacy-report/', ProlificacyReportView.as_view(), name='prolificacy-report'),
    path('wpi-report/', WPIReportView.as_view(), name='wpi-report'),
    path('withdrawal-alerts/', WithdrawalAlertsView.as_view(), name='withdrawal-alerts'),
    path('ineffective-treatment-alerts/', IneffectiveTreatmentAlertsView.as_view(), name='ineffective-treatment-alerts'),
    path('low-stock-alerts/', LowStockAlertsView.as_view(), name='low-stock-alerts'),
    path('reproductive-ranking-report/', ReproductiveRankingReportView.as_view(), name='reproductive-ranking-report'),
    path('density-report/', DensityReportView.as_view(), name='density-report'),
]
