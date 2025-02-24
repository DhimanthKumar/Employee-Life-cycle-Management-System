# managers.py
"""
This file implements a custom user manager that extends Django's BaseUserManager.
It contains methods for creating regular users and superusers, ensuring that required fields are provided.
"""

from django.contrib.auth.models import BaseUserManager

class CustomUserManager(BaseUserManager):
    def create_user(self, username, email, password=None, **extra_fields):
        """
        Create and return a regular user with the given username, email, and password.
        """
        if not username:
            raise ValueError("Username is required")
        if not email:
            raise ValueError("Email is required")
        email = self.normalize_email(email)
        extra_fields.setdefault("is_active", True)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password=None, is_staff=True, is_superuser=True, **extra_fields):
        """
        Create and return a superuser with the given credentials.
        """
        extra_fields.setdefault("is_staff", is_staff)
        extra_fields.setdefault("is_superuser", is_superuser)
        extra_fields.setdefault("is_active", True)
        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")
        return self.create_user(username, email, password, **extra_fields)
