from django.urls import path,include
from . import views
from rest_framework.authtoken.views import obtain_auth_token
urlpatterns = [
    path('home' ,  views.get_data),
    path('auth',views.checkauthentication),
    path('generateToken' , obtain_auth_token),
    path('Profile',views.UserDetails),
]