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
from datetime import date
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def blocktasks():
            tasks = TaskAssignment.objects.all()
            # Automatically update status of expired tasks
            for task in tasks:
                task.check_and_block()
