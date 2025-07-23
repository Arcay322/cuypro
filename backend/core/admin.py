from django.contrib import admin
from .models import Line, Location, Animal, WeightLog, ReproductionEvent

admin.site.register(Line)
admin.site.register(Location)
admin.site.register(Animal)
admin.site.register(WeightLog)
admin.site.register(ReproductionEvent)