from django.urls import path
from .views import ExpenseList
from .views import MyTokenObtainPairView, MyTokenRefreshView

urlpatterns = [
path('expenses/', ExpenseList.as_view(), name='expense-list'),
path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
path('token/refresh/', MyTokenRefreshView.as_view(), name='token_refresh'),

]
