from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from myapp.models import CustomUser
from myapp.serializers import CustomUserSerializer
from rest_framework import generics, status
from rest_framework.status import HTTP_400_BAD_REQUEST
@permission_classes([IsAuthenticated])
class RegisterUserView(generics.GenericAPIView):
    """
    API endpoint for user registration.
    
    This view handles the creation of new users, including basic validation, 
    authorization checks for staff/superuser creation, and serialization of user data.

    Key Features:
    - **Authorization Check**: Prevents non-superusers from creating staff or superuser accounts.
    - **Field Validation**: Ensures all required fields (`username`, `email`, `password`, `phone`, `role`, `date_of_joining`) are provided.
    - **Serialization**: Uses `CustomUserSerializer` to validate and save user data.
    - **Error Handling**:
        - Returns `403 FORBIDDEN` if an unauthorized user attempts to create a staff/superuser.
        - Returns `400 BAD REQUEST` if required fields are missing or if serialization fails.
        - Returns `201 CREATED` with user details if registration is successful.

    Methods:
    - `post(request, *args, **kwargs)`: Handles user registration through HTTP POST.

    Expected Request Data:
    ```json
    {
    "username": "john_doe12",
    "email": "john.doe@example12.com",
    "password": "SecurePass123!",
    "phone": "1234567890",
    "role": "employee",
    "date_of_joining": "2024-01-15",
	"department" : "sales",
	"manager" : "lalit",
    "is_staff": false,
    "is_superuser": false
}

    ```

    Responses:
    - **201 Created**: 
      ```json
      {
          "message": "User created successfully",
          "user": { ...user_data... }
      }
      ```
    - **400 Bad Request** (Missing Fields):
      ```json
      {
          "error": "Missing required fields: email, role"
      }
      ```
    - **403 Forbidden** (Unauthorized Staff Creation):
      ```json
      {
          "error": "Not Authorized"
      }
      ```
    """

    serializer_class = CustomUserSerializer

    def post(self, request, *args, **kwargs):
        # Check authorization for creating staff/superuser
        if (
            ("is_staff" in request.data and request.data["is_staff"]) or
            ("is_superuser" in request.data and request.data["is_superuser"])
        ) and (not request.user.is_superuser or not request.user.is_staff):
            return Response({"error": "Not Authorized"}, status=status.HTTP_403_FORBIDDEN)

        # Validate required fields
        required_fields = ["username", "email", "password", "phone", "role", "date_of_joining"]
        missing_fields = [field for field in required_fields if field not in request.data or not request.data[field]]
        
        if missing_fields:
            return Response(
                {"error": f"Missing required fields: {', '.join(missing_fields)}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Serialize and save the user
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(
                {
                    "message": "User created successfully",
                    "user": CustomUserSerializer(user).data,
                },
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
