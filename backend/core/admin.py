from django.contrib import admin
from .models import Line, Location, Animal, WeightLog, ReproductionEvent, HealthLog, Medication, Treatment, FinancialTransaction, FeedingLog, FeedInventory, FeedRation, RationComponent

admin.site.register(Line)
admin.site.register(Location)
admin.site.register(Animal)
admin.site.register(WeightLog)
admin.site.register(ReproductionEvent)
admin.site.register(HealthLog)
admin.site.register(Medication)
admin.site.register(Treatment)
admin.site.register(FinancialTransaction)
admin.site.register(FeedingLog)
admin.site.register(FeedInventory)
admin.site.register(FeedRation)
admin.site.register(RationComponent)
