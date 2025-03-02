from django.contrib.auth.models import User
from django.db.models import Sum
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.contrib.auth.hashers import make_password
from .models import Expense
from .serializers import ExpenseSerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from django.db.models.functions import TruncMonth, TruncWeek, TruncDay
from datetime import timedelta
from datetime import datetime


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

@api_view(['GET'])
def category_breakdown(request, period):
    if period not in ['month', 'week']:
        return Response({"error": "Invalid period. Choose 'month' or 'week'."}, status=400)

    today = datetime.now().date()  # Get today's date
    data = []  # Initialize empty data list

    # Function to get start date for a given period
    def get_start_date(period, current=True):
        if period == 'month':
            if current:
                return today.replace(day=1)  # First day of the current month
            else:
                first_day_current_month = today.replace(day=1)
                return (first_day_current_month - timedelta(days=1)).replace(day=1)  # First day of previous month
        elif period == 'week':
            if current:
                return today - timedelta(days=today.weekday())  # Start of current week (Monday)
            else:
                return today - timedelta(days=today.weekday() + 7)  # Start of previous week

    # 1️⃣ **Check the current period**
    start_date = get_start_date(period, current=True)
    expenses = Expense.objects.filter(date__gte=start_date)

    if not expenses.exists():
        # 2️⃣ **If no data, check the previous period**
        start_date = get_start_date(period, current=False)
        expenses = Expense.objects.filter(date__gte=start_date)

        if not expenses.exists():
            return Response({'category_breakdown': [], 'message': "No expenses found for the current or previous period."})

    # 3️⃣ **Aggregate category totals**
    categories = expenses.values('category').annotate(total=Sum('amount'))

    # 4️⃣ **Prepare the response data**
    data = [{'category': item['category'], 'total': item['total']} for item in categories]

    return Response({'category_breakdown': data, 'start_date': str(start_date)})

@api_view(['GET'])
def spending_trends(request, period):
    if period not in ['month', 'week']:
        return Response({"error": "Invalid period. Choose 'month' or 'week'."}, status=400)

    if period == 'month':
        # Instead of grouping by full month, break down spending into weeks within the month
        trends = Expense.objects.annotate(week=TruncWeek('date')) \
            .values('week') \
            .annotate(total=Sum('amount')) \
            .order_by('week')
    elif period == 'week':
        # Group by day within the selected week
        trends = Expense.objects.annotate(day=TruncDay('date')) \
            .values('day') \
            .annotate(total=Sum('amount')) \
            .order_by('day')

    data = [
        {
            'period': item['week'] if period == 'month' else item['day'],
            'total': item['total']
        }
        for item in trends
    ]
    
    return Response({'trends': data})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def expense_summary(request):
    user = request.user

    # Total amount spent
    total_spent = Expense.objects.filter(user=user).aggregate(Sum('amount'))['amount__sum'] or 0

    # Expense breakdown by category
    category_breakdown = (
        Expense.objects
        .filter(user=user)
        .values('category')
        .annotate(total=Sum('amount'))
        .order_by('-total')
    )

    return Response({
        "total_spent": total_spent,
        "category_breakdown": list(category_breakdown)
    })

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
            print(f"Expense with ID {expense_id} not found.")
            return Response({"error": "Expense not found"}, status=status.HTTP_404_NOT_FOUND)

        print(f"Deleting expense with ID {expense_id}")
        expense.delete()
        print(f"Expense {expense_id} deleted successfully")

        return Response({"message": "Expense deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

# Token Views
class MyTokenObtainPairView(TokenObtainPairView):
    pass  # You can customize if needed

class MyTokenRefreshView(TokenRefreshView):
    pass
