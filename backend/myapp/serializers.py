from rest_framework import serializers
from .models import CustomUser

class CustomUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)  # ✅ Ensure password is provided

    class Meta:
        model = CustomUser
        fields = ["id", "username", "email", "phone", "role", "password", "is_staff", "is_superuser"]
        extra_kwargs = {
            "password": {"write_only": True},  # ✅ Password should not be exposed in responses
        }

    def create(self, validated_data):
        """Create and return a new user"""
        password = validated_data.pop("password", None)  # ✅ Ensure password exists
        user = CustomUser.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=password,  # ✅ Use extracted password
            phone=validated_data.get("phone", ""),
            role=validated_data.get("role", "member"),
            is_staff=validated_data.get("is_staff", False),
            is_superuser=validated_data.get("is_superuser", False),
        )
        return user
