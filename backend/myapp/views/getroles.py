from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from myapp.models import CustomUser,Role
from myapp.serializers import CustomUserSerializer
from rest_framework import generics, status
from rest_framework.status import HTTP_400_BAD_REQUEST

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def roles_below_user(request):
    """
    API View to fetch all Roles having lower authority_level 
    than the currently logged-in user's Role.

    Conditions:
    - User must be authenticated.
    - User must have an associated Employee profile with a Role assigned.

    Functionality:
    - Retrieves the authority_level of the current user's role.
    - Filters and fetches all Roles where authority_level is less than user's authority_level.
    - Returns a list of those roles with their id, role_name, and authority_level.

    Response Format:
    {
        "roles": [
            {
                "id": int,
                "role_name": str,
                "authority_level": int
            },
            ...
        ]
    }
    """
    user = request.user

    if hasattr(user, 'employee') and user.employee.role:
        user_authority = user.employee.role.authority_level
        roles = Role.objects.filter(authority_level__lt=user_authority).values('id', 'role_name', 'authority_level')
        return Response({'roles': list(roles)})

    return Response({'roles': []})