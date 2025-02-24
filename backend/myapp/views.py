from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import CustomUser
# Create your views here.
@api_view(['GET'])
def get_data(request):
    data = {
        'message': 'This is a normal JSON response from DRF',
        'status': 'success'
    }
    return Response(data)
@api_view()
@permission_classes([IsAuthenticated])
def checkauthentication(request):
    return Response({"Message" : "Sucessful"})
#Auth token sent as 'Authorization': 'Token `{token}`'
@api_view()
@permission_classes([IsAuthenticated])
def CreateEmployee(request):
    if not request.user.is_staff:
        return Response( {"Message" : "UnAuthorized Access"}) 
@api_view()
@permission_classes([IsAuthenticated])
def UserDetails(request):
    user = request.user
    
    return Response( {"id" : user.id , "name" : user.username , "role" : user.role , "phone" :user.phone ,
                      "email" : user.email , "Staff" : user.is_staff , "Admin" : user.is_superuser}) 