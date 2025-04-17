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
    API endpoint to fetch all employees whose role's authority_level > 22.
    Only accessible by authenticated staff users.
    """

    # Filter Employees whose Role's authority_level > 22
    managers = Employee.objects.filter(role__authority_level__gte=22)

    # Serialize and return the filtered employees
    serializer = EmployeeSerializer(managers, many=True, context={"request": request})
    return Response({'Managers': serializer.data})