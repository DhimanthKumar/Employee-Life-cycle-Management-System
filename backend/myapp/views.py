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
from rest_framework.permissions import IsAuthenticated,BasePermission
from .models import CustomUser
from .serializers import CustomUserSerializer
from rest_framework import generics, status
from rest_framework.status import HTTP_400_BAD_REQUEST
from django.http import HttpResponse

def home_view(request):
    return render(request, 'test.html')
