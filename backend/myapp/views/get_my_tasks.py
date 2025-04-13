from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from myapp.models import CustomUser,Role,Department,Employee,Team, TaskAssignment
from myapp.serializers import CustomUserSerializer,RoleSerializer,DepartmentSerializer,EmployeeSerializer,TeamNameSerializer,TaskSerializer
from myapp.serializers import CustomUserSerializer,DepartmentSerializer,EmployeeSerializer
from rest_framework import generics, status
from rest_framework.status import HTTP_400_BAD_REQUEST
from .permissions import IsStaffUser
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_my_tasks(request):
    """
    API endpoint to fetch all tasks assigned to the current user.

    Permissions:
        - Only authenticated users can access this API.

    Response Example:
    {
        "Tasks": [
            {
                "id": 1,
                "title": "Fix login bug",
                "description": "The login page crashes on mobile",
                "due_date": "2023-12-15",
                "completed": false,
                "progress": 30,
                "priority": "high",
                "status": "in_progress",
                "team_name": "Development Team",
                "assigned_at": "2023-11-20T10:30:00Z"
            },
            ...
        ]
    }
    """
    try:
        # Get the current user's employee profile
        employee = Employee.objects.get(user=request.user)
        
        # Get all tasks assigned directly to this employee
        tasks = TaskAssignment.objects.filter(assigned_to=employee)
        
        serializer = TaskSerializer(tasks, many=True)
        return Response({'Tasks': serializer.data})
    
    except Employee.DoesNotExist:
        return Response(
            {'error': 'Employee profile not found for this user.'},
            status=status.HTTP_404_NOT_FOUND
        )