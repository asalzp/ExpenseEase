from django.db import models

# Create your models here.
from django.db import models

class Expense(models.Model):
    category = models.CharField(max_length=50)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField()
    description = models.TextField(blank=True)
