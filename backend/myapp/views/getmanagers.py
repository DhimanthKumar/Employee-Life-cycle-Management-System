from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from myapp.models import CustomUser,Role,Department,Employee
from myapp.serializers import CustomUserSerializer,DepartmentSerializer,EmployeeSerializer
from rest_framework import generics, status
from rest_framework.status import HTTP_400_BAD_REQUEST
from .permissions import IsStaffUser
@api_view(['GET'])
@permission_classes([IsAuthenticated , IsStaffUser])
def get_managers(request):
    """
    API endpoint to fetch all unique managers in the organization.

    A manager is defined as any employee who is assigned as a manager to another employee,
    regardless of whether the manager themselves has a manager, role, or department assigned.

    Permissions:
        - Only authenticated staff users (is_staff=True) can access this API.

    Logic:
        1. Identify all Employee records where 'manager' field is not null.
        2. Collect distinct manager IDs from these records.
        3. Fetch Employee records corresponding to those manager IDs.
        4. Serialize and return the list of managers.

    Response Example:
    {
        "Managers": [
            {
                "id": 5,
                "user": {
                    "id": 7,
                    "username": "manager_1",
                    ...
                },
                "role_name": "Team Lead",
                "department_name": "Engineering"
            },
            ...
        ]
    }
    """
    # Get IDs of all managers (used as manager by someone)
    manager_ids = Employee.objects.filter(
        manager__isnull=False
    ).values_list('manager', flat=True).distinct()

    # Fetch those managers, even if they themselves have manager/role/department null
    managers = Employee.objects.filter(id__in=manager_ids)

    serializer = EmployeeSerializer(managers, many=True)
    return Response({ 'Managers': serializer.data})