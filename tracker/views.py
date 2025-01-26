from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Expense
from .serializers import ExpenseSerializer
from django.contrib.auth.models import User

class ExpenseList(APIView):
    def get(self, request):
        expenses = Expense.objects.all()
        serializer = ExpenseSerializer(expenses, many=True)
        return Response(serializer.data)

    def post(self, request):

        data = request.data.copy()
        
        # Convert user ID into a User instance
        user_id = data.get('user')
        try:
            user = User.objects.get(id=user_id)
            data['user'] = user.id
        except User.DoesNotExist:
            return Response({'error': 'Invalid user ID'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = ExpenseSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        