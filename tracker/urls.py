from django.urls import path
from .views import ExpenseListCreateView, ExpenseDetailView

urlpatterns = [
    path('expenses/', ExpenseListCreateView.as_view(), name='expense-list'),
    path('expenses/<int:pk>/', ExpenseDetailView.as_view(), name='expense-detail'),
]
