# views.py
"""
This file contains the API views for user-related operations.
Endpoints include:
- A test endpoint returning a simple JSON response.
- An authentication check.
- Retrieval of user details.
- User registration via a class-based view (RegisterUserView).
"""

from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import CustomUser
from .serializers import CustomUserSerializer
from rest_framework import generics, status
from rest_framework.status import HTTP_400_BAD_REQUEST

@api_view(['GET'])
def get_data(request):
    data = {
        'message': 'This is a normal JSON response from DRF',
        'status': 'success'
    }
    return Response(data)


@api_view()
@permission_classes([IsAuthenticated])
def UserDetails(request):
    user = request.user
    return Response({
        "id": user.id,
        "name": user.username,
        "role": user.role,
        "phone": user.phone,
        "email": user.email,
        "Staff": user.is_staff,
        "Admin": user.is_superuser
    })

