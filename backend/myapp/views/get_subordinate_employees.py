# views.py
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from myapp.models import CustomUser,Role,Department,Employee,Team, TaskAssignment
from myapp.serializers import CustomUserSerializer,DepartmentSerializer,EmployeeSerializer,TeamNameSerializer,TaskSerializer
from myapp.serializers import CustomUserSerializer,DepartmentSerializer,EmployeeSerializer
from rest_framework import generics, status
from rest_framework.status import HTTP_400_BAD_REQUEST
from .permissions import IsStaffUser

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_subordinate_employees(request):
    """
    API endpoint to fetch all employees with authority level lower than the requesting user.
    
    Permissions:
        - Only authenticated users can access this API
    
    Response:
        - List of employees with lower authority level
        - 403 if user doesn't have an employee profile or role
    """
    try:
        # Get the requesting user's employee profile
        requesting_employee = Employee.objects.get(user=request.user)
        
        if not requesting_employee.role:
            return Response(
                {'error': 'You must have an assigned role to view subordinate employees.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Get employees with lower authority level
        subordinates = Employee.objects.filter(
            role__authority_level__lt=requesting_employee.role.authority_level
        ).exclude(id=requesting_employee.id)  # Exclude self
        
        serializer = EmployeeSerializer(subordinates, many=True)
        
        return Response({
            'subordinates': serializer.data,
            'your_authority_level': requesting_employee.role.authority_level
        })
    
    except Employee.DoesNotExist:
        return Response(
            {'error': 'Employee profile not found for this user.'},
            status=status.HTTP_404_NOT_FOUND
        )