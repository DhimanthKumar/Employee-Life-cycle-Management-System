from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from myapp.models import CustomUser,Role,Department,Employee,Team
from myapp.serializers import CustomUserSerializer,DepartmentSerializer,EmployeeSerializer,TeamNameSerializer
from myapp.serializers import CustomUserSerializer,DepartmentSerializer,EmployeeSerializer
from rest_framework import generics, status
from rest_framework.status import HTTP_400_BAD_REQUEST
from .permissions import IsStaffUser
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_teams(request):
    """
    API endpoint to fetch all teams where the requesting user is the team leader.
    Returns complete team data.

    Permissions:
        - Only authenticated staff users (is_staff=True) can access this API.

    Response Example:
    {
        "Teams": [
            {
                "id": 1,
                "name": "Development Team",
                "description": "Responsible for product development",
                "team_leader_name": "john_doe",
                "team_leader_authority": 3,
                "member_count": 5,
                "created_at": "2023-01-15T10:30:00Z"
            },
            ...
        ]
    }
    """
    try:
        # Get the current user's employee profile
        employee = Employee.objects.get(user=request.user)
        if not employee.role:
            return Response(
                {'error': 'Your account does not have a role assigned.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Get all teams where the user is the team leader
        teams = Team.objects.filter(team_leader=employee).prefetch_related('members', 'team_leader__user', 'team_leader__role')

        serializer = TeamNameSerializer(teams, many=True)
        return Response({'Teams': serializer.data})

    except Employee.DoesNotExist:
        return Response(
            {'error': 'Employee profile not found for this user.'},
            status=status.HTTP_404_NOT_FOUND
        )
