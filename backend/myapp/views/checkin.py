from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from myapp.models import CustomUser, Role, Employee, CheckIn
from myapp.serializers import CustomUserSerializer, CheckInSerializer
from rest_framework import generics, status
from rest_framework.status import HTTP_400_BAD_REQUEST
from django.utils import timezone
from django.utils.timezone import localtime
def localize(dt):
    if timezone.is_naive(dt):
        dt = timezone.make_aware(dt)
    return timezone.localtime(dt)
@permission_classes([IsAuthenticated])
class usercheckIncheckOut(generics.GenericAPIView):
    serializer_class = CheckInSerializer
    def get(self, request):
        """
        Check if user is already Checked-In today
        """
        user = request.user
        today = timezone.localdate()  # Local Date as per server timezone

        checkin = CheckIn.objects.filter(user=user, date=today).first()

        if checkin:
            return Response({
                "checked_in": True,
                'check_in_time': localize(checkin.check_in_time).strftime("%H:%M:%S"),
            'check_out_time': localize(checkin.check_out_time).strftime("%H:%M:%S") if checkin.check_out_time else None,
            'checked_out' : True if checkin.check_out_time else False,
             }, status=200)
        else:
            return Response({
                "checked_in": False,
                "message": "User has not checked-in today"
            }, status=200)

    def post(self, request):
        user = request.user
        today = timezone.localdate()

        checkin, created = CheckIn.objects.get_or_create(user=user, date=today)

        data = {
            'check_in_time': localize(checkin.check_in_time).strftime("%H:%M:%S"),
            'check_out_time': localize(checkin.check_out_time).strftime("%H:%M:%S") if checkin.check_out_time else None,
            'status': checkin.status,
            'date': checkin.date
        }

        if created:
            return Response({'message': 'Checked in successfully.', **data}, status=status.HTTP_201_CREATED)
        else:
            return Response({'message': 'Already checked in.', **data}, status=status.HTTP_200_OK)

    def put(self, request):
        user = request.user
        today = timezone.localdate()

        checkin = CheckIn.objects.filter(user=user, date=today).first()

        if not checkin:
            return Response({"message": "No Check-In Found to Check-Out"}, status=status.HTTP_400_BAD_REQUEST)

        if checkin.check_out_time:
            return Response({"message": "Already Checked-Out" , "check_out_time" : localize(checkin.check_out_time).strftime("%H:%M:%S")}, status=status.HTTP_200_OK)

        checkin.check_out_time = timezone.now()  # Automatically aware
        checkin.status = 'Checked Out'
        checkin.save()

        data = {
            'check_in_time': localize(checkin.check_in_time).strftime("%H:%M:%S"),
            'check_out_time': localize(checkin.check_out_time).strftime("%H:%M:%S"),
            'status': checkin.status,
            'date': checkin.date
        }

        return Response({"message": "Checked Out Successfully", **data}, status=status.HTTP_200_OK)
