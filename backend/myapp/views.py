from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import CustomUser
from .serializers import CustomUserSerializer
from rest_framework import generics
from rest_framework.status import HTTP_400_BAD_REQUEST
from rest_framework import status
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
@permission_classes([IsAuthenticated])
class RegisterUserView(generics.GenericAPIView):
    serializer_class = CustomUserSerializer

    def post(self, request, *args, **kwargs):
        print(request.data)
        if ((request.data["is_staff"] or request.data["is_superuser"]) and not request.user.is_superuser) or not request.user.is_staff:
            return Response({"Error" : "Not Authorized"} ,status=HTTP_400_BAD_REQUEST )
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({"message": "User created successfully", "user": CustomUserSerializer(user).data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)