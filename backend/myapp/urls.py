# urls.py
"""
This file defines the URL patterns for the API endpoints provided by the application.
The endpoints include test data retrieval, authentication checks, token generation, user profiles, and user registration.
"""

from django.urls import path
from . import views
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    path('home', views.get_data),
    path('auth', views.checkauthentication),
    path('generateToken', obtain_auth_token),
    path('Profile', views.UserDetails),
    path('create', views.RegisterUserView.as_view(), name='create'),
]
