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
from django.shortcuts import get_object_or_404

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_team_members(request, team_id):
    # Get the employee object of the logged-in user
    try:
        logged_in_employee = Employee.objects.get(user=request.user)
    except Employee.DoesNotExist:
        return Response({"detail": "You are not registered as an employee."}, status=status.HTTP_403_FORBIDDEN)

    # Get the team object
    team = get_object_or_404(Team, id=team_id)

    # Check if logged-in employee is the team leader
    if team.team_leader != logged_in_employee:
        return Response({"detail": "Only the team leader can view team members."}, status=status.HTTP_403_FORBIDDEN)

    # Prepare members data
    members_data = []
    for member in team.members.all():
        members_data.append({
            "id": member.id,
            "username": member.user.username,
            "full_name": member.user.get_full_name(),
            "email": member.user.email,
            "role": member.role.role_name if member.role else None,
            "authority_level": member.role.authority_level if member.role else None,
            "department": member.department.name if member.department else None
        })

    # Leader data
    leader_data = {
        "id": team.team_leader.id,
        "username": team.team_leader.user.username,
        "full_name": team.team_leader.user.get_full_name(),
        "email": team.team_leader.user.email,
        "role": team.team_leader.role.role_name if team.team_leader.role else None,
    }

    return Response({
        "team_id": team.id,
        "team_name": team.name,
        "team_leader": leader_data,
        "members": members_data
    }, status=status.HTTP_200_OK)
