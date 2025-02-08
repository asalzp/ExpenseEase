from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.contrib.auth.hashers import make_password
from .models import Expense
from .serializers import ExpenseSerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters

# User Registration View
@api_view(['POST'])
def register_user(request):
    """Endpoint for user registration"""
    data = request.data

    # Check if username already exists
    if User.objects.filter(username=data['username']).exists():
        return Response({"error": "Username already taken"}, status=status.HTTP_400_BAD_REQUEST)

    # Create new user
    user = User.objects.create(
        username=data['username'],
        email=data.get('email', ''),  # Email is optional
        password=make_password(data['password'])  # Hash password before storing
    )

    return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)


# Expense Views
class ExpenseList(APIView):
    """Handles listing and creating expenses"""
    permission_classes = [IsAuthenticated] 
    
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    
    # Enable filtering by category and date
    filterset_fields = ['category', 'date']
    
    # Enable sorting by date or amount
    ordering_fields = ['date', 'amount']
    
    def get(self, request):
        expenses = Expense.objects.filter(user=request.user)  # Get only the logged-in user's expenses

        # Get ordering query parameter
        ordering = request.query_params.get('ordering', '')

        # Apply sorting if 'ordering' is provided
        if ordering:
            expenses = expenses.order_by(ordering)
        
        serializer = ExpenseSerializer(expenses, many=True)
        return Response(serializer.data)

    def post(self, request):
        data = request.data.copy()
        data['user'] = request.user.id  # Assign logged-in user

        serializer = ExpenseSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ExpenseDetail(APIView):
    """Handles retrieving, updating, and deleting a single expense"""
    permission_classes = [IsAuthenticated]

    def get_object(self, expense_id, user):
        """Helper method to get an expense object, ensuring it belongs to the logged-in user"""
        try:
            return Expense.objects.get(id=expense_id, user=user)  # Use 'id' here
        except Expense.DoesNotExist:
            return None

    def put(self, request, expense_id):
        """Update an expense"""
        expense = self.get_object(expense_id, request.user)
        print(f"Received PUT request for expense {expense_id}: {request.data}")
        if not expense:
            return Response({"error": "Expense not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = ExpenseSerializer(expense, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, expense_id):
        """Delete an expense"""
        expense = self.get_object(expense_id, request.user)
        if not expense:
            return Response({"error": "Expense not found"}, status=status.HTTP_404_NOT_FOUND)

        expense.delete()
        return Response({"message": "Expense deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


# Token Views
class MyTokenObtainPairView(TokenObtainPairView):
    pass  # You can customize if needed

class MyTokenRefreshView(TokenRefreshView):
    pass
