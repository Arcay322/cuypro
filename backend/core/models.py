from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    # Add any additional fields for your user model here
    pass

class Line(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

class Location(models.Model):
    LOCATION_TYPES = (
        ('Poza', 'Poza'),
        ('Jaula', 'Jaula'),
    )
    name = models.CharField(max_length=100, unique=True)
    type = models.CharField(max_length=10, choices=LOCATION_TYPES)
    capacity = models.IntegerField()
    last_cleaned_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.name} ({self.type})"

class Animal(models.Model):
    SEX_CHOICES = (
        ('M', 'Male'),
        ('F', 'Female'),
    )
    STATUS_CHOICES = (
        ('Active', 'Active'),
        ('In Quarantine', 'In Quarantine'),
        ('Sick', 'Sick'),
        ('Pregnant', 'Pregnant'),
        ('Retired', 'Retired'),
        ('Sold', 'Sold'),
        ('Deceased', 'Deceased'),
    )

    unique_tag = models.CharField(max_length=100, unique=True)
    birth_date = models.DateField()
    sex = models.CharField(max_length=1, choices=SEX_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Active')
    line = models.ForeignKey(Line, on_delete=models.SET_NULL, null=True, blank=True)
    sire = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='children_sire')
    dam = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='children_dam')
    location = models.ForeignKey(Location, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.unique_tag

class WeightLog(models.Model):
    animal = models.ForeignKey(Animal, on_delete=models.CASCADE)
    log_date = models.DateField()
    weight_kg = models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self):
        return f"{self.animal.unique_tag} - {self.log_date} - {self.weight_kg} kg"

class ReproductionEvent(models.Model):
    female = models.ForeignKey(Animal, on_delete=models.CASCADE, related_name='reproduction_events_female')
    male = models.ForeignKey(Animal, on_delete=models.SET_NULL, null=True, blank=True, related_name='reproduction_events_male')
    mating_date = models.DateField()
    expected_birth_date = models.DateField(null=True, blank=True)
    actual_birth_date = models.DateField(null=True, blank=True)
    live_births = models.IntegerField(null=True, blank=True)
    dead_births = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return f"Reproduction Event - Female: {self.female.unique_tag} - Mating: {self.mating_date}"

class HealthLog(models.Model):
    animal = models.ForeignKey(Animal, on_delete=models.CASCADE)
    log_date = models.DateField()
    diagnosis = models.TextField()
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Health Log for {self.animal.unique_tag} on {self.log_date}"

class Medication(models.Model):
    name = models.CharField(max_length=100, unique=True)
    withdrawal_period_days = models.IntegerField(help_text="Days until animal can be consumed after last treatment")

    def __str__(self):
        return self.name

class Treatment(models.Model):
    health_log = models.ForeignKey(HealthLog, on_delete=models.CASCADE)
    medication = models.ForeignKey(Medication, on_delete=models.SET_NULL, null=True, blank=True)
    dosage = models.CharField(max_length=100)
    withdrawal_end_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"Treatment for {self.health_log.animal.unique_tag} with {self.medication.name if self.medication else 'N/A'}"

class FinancialTransaction(models.Model):
    TRANSACTION_TYPES = (
        ('Costo', 'Costo'),
        ('Ingreso', 'Ingreso'),
    )
    transaction_date = models.DateField()
    type = models.CharField(max_length=10, choices=TRANSACTION_TYPES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True, null=True)
    related_entity_id = models.IntegerField(null=True, blank=True, help_text="ID of related entity like Animal, Location, etc.")

    def __str__(self):
        return f"{self.type} - {self.transaction_date} - {self.amount}"