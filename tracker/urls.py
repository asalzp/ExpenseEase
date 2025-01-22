from django.urls import path
from .views import ExpenseList

urlpatterns = [
path('expenses/', ExpenseList.as_view(), name='expense-list'),]
