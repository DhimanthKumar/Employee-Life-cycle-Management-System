# serializers.py
"""
This file defines the serializer for the CustomUser model.
It ensures that sensitive information such as passwords is write-only and leverages the custom user manager.
"""

from rest_framework import serializers
from .models import CustomUser

class CustomUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = CustomUser
        fields = ["id", "username", "email", "phone", "role", "password", "is_staff", "is_superuser"]
        extra_kwargs = {
            "password": {"write_only": True},
        }

    def create(self, validated_data):
        """
        Create and return a new user with an encrypted password.
        """
        password = validated_data.pop("password", None)
        user = CustomUser.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=password,
            phone=validated_data.get("phone", ""),
            role=validated_data.get("role", "member"),
            is_staff=validated_data.get("is_staff", False),
            is_superuser=validated_data.get("is_superuser", False),
        )
        return user
