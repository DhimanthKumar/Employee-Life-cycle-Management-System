from rest_framework import serializers
from .models import CustomUser
class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields=['id', 'username', 'email', 'password', 'phone', 'role']
        extra_kwargs = {'password': {'write_only': True}}
    def create(self, validated_data):
        user = CustomUser.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            phone=validated_data.get('phone', ''),
            role=validated_data.get('role', 'member')
        )
        user.set_password(validated_data['password'])  # Hash password
        user.save()
        return user
        