# urls.py
"""
This file defines the URL patterns for the API endpoints provided by the application.
The endpoints include test data retrieval, authentication checks, token generation, user profiles, and user registration.
"""

from django.urls import path
from . import views
from rest_framework.authtoken.views import obtain_auth_token
from myapp.views.createuser import RegisterUserView
from myapp.views.home import get_data
from myapp.views.userdetails import UserDetails
urlpatterns = [
    path('home', get_data),
    path('generateToken', obtain_auth_token),
    path('Profile', UserDetails),
    path('create', RegisterUserView.as_view(), name='create'),
]
