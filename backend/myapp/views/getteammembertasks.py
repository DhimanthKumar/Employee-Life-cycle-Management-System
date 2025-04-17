from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from myapp.models import Employee, Team, TaskAssignment

from django.db.models import Q

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_team_member_tasks(request, team_id):
    try:
        logged_in_employee = Employee.objects.get(user=request.user)
    except Employee.DoesNotExist:
        return Response({"detail": "You are not registered as an employee."}, status=status.HTTP_403_FORBIDDEN)

    team = get_object_or_404(Team, id=team_id)

    if team.team_leader != logged_in_employee:
        return Response({"detail": "Only the team leader can view team member tasks."}, status=status.HTTP_403_FORBIDDEN)

    participant_ids = list(team.members.values_list('id', flat=True)) + [team.team_leader.id]

    # Fetch tasks only for this team and team members, excluding 'blocked' status
    task_assignments = TaskAssignment.objects.filter(
        assigned_to_id__in=participant_ids,
        team_id=team.id  # Only if TaskAssignment has a ForeignKey to Team
    ).exclude(status='blocked').select_related('assigned_to__user', 'team')

    tasks_data = [
        {
            "id": ta.id,
            "title": ta.title,
            "description": ta.description,
            "due_date": ta.due_date,
            "completed": ta.completed,
            "progress": ta.progress,
            "priority": ta.priority,
            "status": ta.status,
            "team_name": ta.team.name,
            "assigned_at": ta.assigned_at.isoformat(),
            "assigned_to": {
                "id": ta.assigned_to.id,
                "username": ta.assigned_to.user.username,
                "email": ta.assigned_to.user.email
            }
        }
        for ta in task_assignments
    ]

    return Response({
        "team_id": team.id,
        "team_name": team.name,
        "tasks": tasks_data
    }, status=status.HTTP_200_OK)
