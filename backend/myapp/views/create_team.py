# views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from myapp.models import Team, Employee
from myapp.serializers import TeamCreateSerializer
from .permissions import IsStaffUser  # Make sure you have this permission class

@api_view(['POST'])
@permission_classes([IsAuthenticated, IsStaffUser])  # Now allows both admin and staff
def create_team(request):
    """
    API endpoint to create a new team.
    
    Request Body:
    {
        "name": "Team Name",
        "description": "Team description",
        "team_leader_id": 1,  # ID of the employee who will be team leader
        "member_ids": [2, 3, 4]  # List of employee IDs to add as members
    }
    
    Permissions:
        - Authenticated staff users (is_staff=True) can create teams
    
    Validation:
        - Team leader must exist and have a role
        - Requesting user must have higher authority than the team leader
        - All members must exist and have roles
        - Team leader's authority must be higher than all members
        - Team name must be unique
    
    Response:
        - 201 Created: Team created successfully
        - 400 Bad Request: Invalid data or validation failed
        - 403 Forbidden: User doesn't have permission
    """
    serializer = TeamCreateSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Get the requesting user's employee profile
        requesting_employee = Employee.objects.get(user=request.user)
        if not requesting_employee.role:
            return Response(
                {'error': 'You must have an assigned role to create teams.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Get the team leader
        team_leader = get_object_or_404(Employee, id=serializer.validated_data['team_leader_id'])
        
        # Validate requesting user has higher authority than team leader
        if team_leader.role.authority_level >= requesting_employee.role.authority_level:
            return Response(
                {'error': 'You cannot assign a team leader with equal or higher authority than yours.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Validate team leader has a role
        if not team_leader.role:
            return Response(
                {'error': 'Team leader must have an assigned role.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create the team
        team = Team.objects.create(
            name=serializer.validated_data['name'],
            description=serializer.validated_data.get('description', ''),
            team_leader=team_leader
        )
        
        # Add members with validation
        member_ids = serializer.validated_data.get('member_ids', [])
        members = Employee.objects.filter(id__in=member_ids)
        
        # Check all requested members exist
        if len(member_ids) != members.count():
            team.delete()  # Rollback team creation
            return Response(
                {'error': 'One or more member IDs are invalid.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validate each member
        for member in members:
            if not member.role:
                team.delete()
                return Response(
                    {'error': f'Member {member.user.username} must have an assigned role.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            if member.role.authority_level >= team_leader.role.authority_level:
                team.delete()
                return Response(
                    {'error': f'Team leader authority must be higher than {member.user.username}.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        # Add validated members to team
        team.members.set(members)
        
        return Response(
            {
                'success': f'Team {team.name} created successfully.',
                'team_id': team.id,
                'members_count': members.count()
            },
            status=status.HTTP_201_CREATED
        )
    
    except Employee.DoesNotExist:
        return Response(
            {'error': 'Employee profile not found for this user.'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )