from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from myapp.models import CustomUser, Role, Employee
from myapp.serializers import CustomUserSerializer
from rest_framework import generics, status
from rest_framework.status import HTTP_400_BAD_REQUEST
import json
import re

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
import json
import re

@permission_classes([IsAuthenticated])
class RegisterUserView(generics.GenericAPIView):
    serializer_class = CustomUserSerializer

    def clean_json_string(self, json_str):
        """
        Convert malformed JSON string with mixed quotes to valid JSON
        while preserving boolean values (True/False)
        """
        # First try to parse as-is
        try:
            return json.loads(json_str)
        except json.JSONDecodeError:
            pass
            
        # Preserve boolean values before quote replacement
        json_str = re.sub(r':\s*True\b', ': true', json_str)
        json_str = re.sub(r':\s*False\b', ': false', json_str)
        
        # Replace single quotes with double quotes, except around boolean values
        json_str = re.sub(r"(?<!\w)'|'(?!\w)", '"', json_str)
        
        try:
            return json.loads(json_str)
        except json.JSONDecodeError as e:
            raise ValueError(f"Invalid JSON format: {str(e)}")

    def post(self, request, *args, **kwargs):
        try:
            # Get raw request body as string
            raw_data = request.body.decode('utf-8')
            
            # Clean and parse the JSON data
            try:
                processed_data = self.clean_json_string(raw_data)
            except ValueError as e:
                return Response(
                    {"error": str(e)},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Remove date_of_joining at the very start
            if 'date_of_joining' in processed_data:
                del processed_data['date_of_joining']

            # Rest of your existing validation logic...
            # Superuser/Staff creation restriction
            if (
                "is_superuser" in processed_data and processed_data['is_superuser'] and not request.user.is_superuser
            ) or (
                "is_staff" in processed_data and processed_data["is_staff"] and not request.user.is_superuser
            ):
                return Response({"error": "Not Authorized"}, status=status.HTTP_403_FORBIDDEN)

            # Role authority restriction for staff users (but not superuser)
            if request.user.is_staff and not request.user.is_superuser:
                try:
                    requested_role = Role.objects.get(role_name=processed_data['role'])
                    
                    current_user_role = request.user.employee.role
                    if requested_role.authority_level > current_user_role.authority_level:
                        return Response(
                            {"error": "Cannot assign role with higher authority than your own."},
                            status=status.HTTP_403_FORBIDDEN
                        )
                except Role.DoesNotExist:
                    return Response(
                        {"error": "Invalid role provided."},
                        status=status.HTTP_400_BAD_REQUEST
                    )

            # Validate required fields (excluding date_of_joining)
            required_fields = ["username", "email", "password", "phone", "role"]
            missing_fields = [field for field in required_fields if field not in processed_data or not processed_data[field]]
            
            if missing_fields:
                return Response(
                    {"error": f"Missing required fields: {', '.join(missing_fields)}"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            serializer = self.get_serializer(data=processed_data)
            if serializer.is_valid():
                user = serializer.save(
                    is_staff=processed_data.get("is_staff", False),
                    is_superuser=processed_data.get("is_superuser", False),
                    date_of_joining=None  # Explicitly set to None since we removed it
                )
                return Response(
                    {
                        "message": "User created successfully",
                        "user": CustomUserSerializer(user).data,
                    },
                    status=status.HTTP_201_CREATED
                )
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response(
                {"error": f"An error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )