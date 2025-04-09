from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from myapp.models import CustomUser,Role,Department
from myapp.serializers import CustomUserSerializer,DepartmentSerializer
from rest_framework import generics, status
from rest_framework.status import HTTP_400_BAD_REQUEST

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def departments(request):
    """
    API endpoint to fetch all available departments in the organization.

    Permissions:
        - Only authenticated users can access this API.

    Logic:
        1. Retrieve all Department records from the database.
        2. Serialize the data using DepartmentSerializer.
        3. Return the serialized list of departments.

    Response Example:
    {
        "Departments": [
            {
                "id": 1,
                "name": "Engineering",
                "description": "Handles all product development tasks."
            },
            {
                "id": 2,
                "name": "HR",
                "description": "Manages hiring, payroll, and employee relations."
            },
            ...
        ]
    }
    """
    department = Department.objects.all()
    serializer = DepartmentSerializer(department, many=True)
    return Response({ "Departments":serializer.data})