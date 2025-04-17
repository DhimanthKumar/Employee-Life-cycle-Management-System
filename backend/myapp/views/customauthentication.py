from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token
from rest_framework import status
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from myapp.models import CustomUser

class CustomObtainAuthToken(APIView):
    """
    Custom token authentication view to handle case-insensitive username lookup.
    """
    def post(self, request, *args, **kwargs):
        # Extract username and password from request data
        username = request.data.get('username')
        password = request.data.get('password')

        # Case-insensitive username lookup
        try:
            user = CustomUser.objects.get(username__iexact=username)
        except CustomUser.DoesNotExist:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

        # Authenticate the user using the password
        user = authenticate(request, username=user.username, password=password)

        if user is not None and user.is_active:
            # Generate token for authenticated user
            token, created = Token.objects.get_or_create(user=user)
            return Response({"token": token.key})

        return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)
