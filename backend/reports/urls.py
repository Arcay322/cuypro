from django.urls import path
from .views import ICAReportView, CostPerKgGainedReportView, ProfitAndLossReportView, BatchProfitabilityReportView, GDPReportView

urlpatterns = [
    path('ica-report/', ICAReportView.as_view(), name='ica-report'),
    path('cost-per-kg-gained-report/', CostPerKgGainedReportView.as_view(), name='cost-per-kg-gained-report'),
    path('profit-and-loss-report/', ProfitAndLossReportView.as_view(), name='profit-and-loss-report'),
    path('batch-profitability-report/', BatchProfitabilityReportView.as_view(), name='batch-profitability-report'),
    path('gdp-report/', GDPReportView.as_view(), name='gdp-report'),
]
