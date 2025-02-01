from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from .models import Expense
from .serializers import ExpenseSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.contrib.auth.hashers import make_password

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

    permission_classes = [IsAuthenticated] 
    
    def get(self, request):
        # Filter expenses by the logged-in user
        expenses = Expense.objects.filter(user=request.user)
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
    

# Token Views
class MyTokenObtainPairView(TokenObtainPairView):
    pass  # You can customize if needed

class MyTokenRefreshView(TokenRefreshView):
    pass
