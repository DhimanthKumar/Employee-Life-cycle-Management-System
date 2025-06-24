from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from myapp.models import CustomUser,Employee,TaskAssignment
from myapp.serializers import CustomUserSerializer
from rest_framework import generics, status
from rest_framework.status import HTTP_400_BAD_REQUEST
# from .oldtaskblocker import blocktasks
@api_view()
@permission_classes([IsAuthenticated])
def UserDetails(request):
    tasks = TaskAssignment.objects.all()
            # Automatically update status of expired tasks
    for task in tasks:
                task.check_and_block()
    user = request.user
    return Response({
    "id": user.employee.id,
    "name": user.username,
    "username": user.username,
    "role": user.employee.role.role_name if hasattr(user, "employee") and user.employee.role else None,
    "department": user.employee.department.name if hasattr(user, "employee") and user.employee.department else None,
    "manager": user.employee.manager.user.username if hasattr(user, "employee") and user.employee.manager else None,
    "phone": user.phone,
    "email": user.email,
    "Staff": user.is_staff,
    "Admin": user.is_superuser,
})