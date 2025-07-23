from django.db import models
from django.contrib.auth.models import AbstractUser
from datetime import timedelta, date

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

    def is_breeding_ready(self):
        # Example logic: Female ready at 3 months and 800g, Male at 4 months and 1kg
        today = date.today()
        age_in_days = (today - self.birth_date).days

        latest_weight = self.weightlog_set.order_by('-log_date').first()
        current_weight_kg = latest_weight.weight_kg if latest_weight else 0

        if self.sex == 'F':
            # Female: 3 months (approx 90 days) and 800g
            return age_in_days >= 90 and current_weight_kg >= 0.8
        elif self.sex == 'M':
            # Male: 4 months (approx 120 days) and 1kg
            return age_in_days >= 120 and current_weight_kg >= 1.0
        return False

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

    def save(self, *args, **kwargs):
        if self.mating_date and not self.expected_birth_date:
            self.expected_birth_date = self.mating_date + timedelta(days=67) # Average gestation period
        super().save(*args, **kwargs)

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

    def save(self, *args, **kwargs):
        if self.medication and self.health_log.log_date:
            self.withdrawal_end_date = self.health_log.log_date + timedelta(days=self.medication.withdrawal_period_days)
        super().save(*args, **kwargs)

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

class FeedingLog(models.Model):
    location = models.ForeignKey(Location, on_delete=models.CASCADE)
    log_date = models.DateField()
    feed_type = models.CharField(max_length=100) # e.g., 'Forraje', 'Concentrado'
    quantity_kg = models.DecimalField(max_digits=5, decimal_places=2)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Update FeedInventory
        try:
            feed_item = FeedInventory.objects.get(product_name=self.feed_type)
            feed_item.quantity_kg -= self.quantity_kg
            feed_item.save()
        except FeedInventory.DoesNotExist:
            # Handle case where feed_type is not in inventory (e.g., log a warning)
            pass

    def __str__(self):
        return f"Feeding at {self.location.name} on {self.log_date} - {self.quantity_kg} kg of {self.feed_type}"

class FeedInventory(models.Model):
    product_name = models.CharField(max_length=100, unique=True)
    quantity_kg = models.DecimalField(max_digits=10, decimal_places=2)
    cost_per_kg = models.DecimalField(max_digits=5, decimal_places=2)
    supplier = models.CharField(max_length=100, blank=True, null=True)
    entry_date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.product_name} - {self.quantity_kg} kg"

class FeedRation(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

class RationComponent(models.Model):
    feed_ration = models.ForeignKey(FeedRation, on_delete=models.CASCADE)
    feed_item = models.ForeignKey(FeedInventory, on_delete=models.CASCADE)
    percentage = models.DecimalField(max_digits=5, decimal_places=2) # Percentage of this item in the ration

    def __str__(self):
        return f"{self.feed_ration.name} - {self.feed_item.product_name} ({self.percentage}%)"