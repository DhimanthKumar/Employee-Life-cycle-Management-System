from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from datetime import datetime
from myapp.models import TaskAssignment, Team, CustomUser, Employee
from myapp.serializers import TaskSerializer

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_task(request):
    """
    API to create a new task. Only authenticated users who are team leaders can assign tasks to their teams.
    """

    data = request.data
    user = request.user  # Authenticated user making the request

    try:
        # Fetch assigned employee and team
        assigned_to_employee = Employee.objects.get(id=data.get('assigned_to'))
        team = Team.objects.get(id=data.get('team'))

        # Fetch the team leader's user object
        team_leader_user = team.team_leader.user

        # Check if the requester is the team leader of the specified team
        if user != team_leader_user:
            return Response(
                {"detail": "You must be the team leader to create a task for this team."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Handle due date if provided
        due_date = None
        due_date_str = data.get('due_date')
        if due_date_str:
            try:
                due_date = datetime.strptime(due_date_str, '%Y-%m-%d').date()
            except ValueError:
                return Response(
                    {"detail": "Invalid due date format. Please use 'YYYY-MM-DD'."},
                    status=status.HTTP_400_BAD_REQUEST
                )

        # Create and save the task
        task = TaskAssignment.objects.create(
            title=data.get('title'),
            description=data.get('description'),
            due_date=due_date,
            priority=data.get('priority', 'Medium'),
            status='Not Started',
            assigned_to=assigned_to_employee,
            team=team,
        )

        # Serialize and return the created task
        serializer = TaskSerializer(task)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    except Employee.DoesNotExist:
        return Response({"detail": "Assigned employee does not exist."}, status=status.HTTP_400_BAD_REQUEST)
    except Team.DoesNotExist:
        return Response({"detail": "Team does not exist."}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"detail": f"An unexpected error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
