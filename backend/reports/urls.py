from django.urls import path
from .views import ICAReportView, CostPerKgGainedReportView

urlpatterns = [
    path('ica-report/', ICAReportView.as_view(), name='ica-report'),
    path('cost-per-kg-gained-report/', CostPerKgGainedReportView.as_view(), name='cost-per-kg-gained-report'),
]
