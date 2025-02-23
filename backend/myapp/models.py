from django.db import models
from django.contrib.auth.models import AbstractUser
from .managers import CustomUserManager
class CustomUser(AbstractUser):
    Role_Choices = (
        ('member', 'Team Member'),
        ('leader', 'Team Leader'),
    )
    role = models.CharField(max_length=10, choices=Role_Choices, default='member')
    phone = models.CharField(max_length=15, blank=True, null=True)

    # Fix reverse accessor clashes
    groups = models.ManyToManyField(
        "auth.Group",
        related_name="customuser_set",  # Change the reverse accessor name
        blank=True
    )
    user_permissions = models.ManyToManyField(
        "auth.Permission",
        related_name="customuser_permissions_set",  # Change the reverse accessor name
        blank=True
    )

    objects = CustomUserManager()

    def __str__(self):
        return self.username
class Test(models.Model):
    a=models.CharField(max_length=255)