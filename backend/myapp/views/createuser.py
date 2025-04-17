from datetime import date
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics, status
from myapp.models import Role
from myapp.serializers import CustomUserSerializer

@permission_classes([IsAuthenticated])
class RegisterUserView(generics.GenericAPIView):
    serializer_class = CustomUserSerializer
    
    def post(self, request, *args, **kwargs):
        data = request.data.copy()
        
        # Remove date_of_joining if present in request
        data.pop('date_of_joining', None)

        # Authorization: Only superusers can create staff/superuser accounts
        if (
            data.get("is_superuser") and not request.user.is_superuser
        ) or (
            data.get("is_staff") and not request.user.is_superuser
        ):
            return Response(
                {"error": "Not Authorized"},
                status=status.HTTP_403_FORBIDDEN
            )

        # Role authority validation (staff but not superuser)
        if request.user.is_staff and not request.user.is_superuser:
            try:
                requested_role = Role.objects.get(role_name=data['role'])
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
            except KeyError:
                return Response(
                    {"error": "Role field is required."},
                    status=status.HTTP_400_BAD_REQUEST
                )

        # Required field validation
        required_fields = ["username", "email", "password", "phone", "role"]
        missing = [field for field in required_fields if not data.get(field)]
        if missing:
            return Response(
                {"error": f"Missing required fields: {', '.join(missing)}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            user = serializer.save(
                is_staff=data.get("is_staff", False),
                is_superuser=data.get("is_superuser", False)
                # date_of_joining will be automatically set by model's auto_now_add
            )
            return Response(
                {
                    "message": "User created successfully",
                    "user": CustomUserSerializer(user).data,
                },
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)