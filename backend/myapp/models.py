# models.py
from django.db import models
from django.contrib.auth.models import AbstractUser
from .managers import CustomUserManager
from django.core.exceptions import ValidationError
from django.utils import timezone
from django.utils.timezone import now

class CustomUser(AbstractUser):
    """
    Custom user model extending Django's AbstractUser.
    Adds phone number and date_of_joining fields.
    Uses CustomUserManager for custom authentication and user creation logic.
    """
    email = models.EmailField(unique=True)  # Ensure email is unique
    phone = models.CharField(max_length=15, blank=True, null=True)
    date_of_joining = models.DateField(null=True, blank=True)

    objects = CustomUserManager()

    USERNAME_FIELD = "username"  # Login with username
    REQUIRED_FIELDS = ["email"]  # email is still required for registration

    def __str__(self):
        return self.username

class Role(models.Model):
    """
    Represents a role within the organization.
    Each role has a unique name and an associated authority level.
    """
    role_name = models.CharField(max_length=50, unique=True)
    authority_level = models.IntegerField()

    def __str__(self):
        return self.role_name

class Department(models.Model):
    """
    Represents a department in the organization.
    Each department has a unique name.
    """
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class Employee(models.Model):
    """
    Represents an employee in the organization.
    Each employee is linked to a user, assigned a role, a department, and may have a manager.
    Custom validation ensures:
        - A manager must have a higher authority level than the employee.
        - Non-admin employees must belong to a department.
    """
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)  
    role = models.ForeignKey(Role, on_delete=models.SET_NULL, null=True, related_name="role")
    manager = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True)
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True)  # Allow blank, enforce in validation

    def clean(self):
        """
        Custom validation:
        1. If a manager is assigned, their authority level must be higher.
        2. If the role is NOT 'admin', the department is required.
        """
        if self.manager:
            if self.role and self.manager.role:
                if self.manager.role.authority_level <= self.role.authority_level:
                    raise ValidationError(
                        {"manager": "Manager's authority level must be higher than the assigned employee's role."}
                    )

        # Ensure department is required unless the role is "admin"
        if self.role and self.role.role_name.lower() != "admin" and self.department is None:
            raise ValidationError({"department": "Department is required for non-admin roles."})

    def save(self, *args, **kwargs):
        """
        Overrides the default save method to perform model validation before saving.
        Calls the `clean` method to enforce business rules.
        """
        self.clean()  # Run the validation before saving
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.username} - {self.department.name if self.department else 'No Department'}"
class Test(models.Model):
    a = models.CharField(max_length=255)

    def __str__(self):
        return self.a
class CheckIn(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    check_in_time = models.DateTimeField(default=timezone.localtime)
    check_out_time = models.DateTimeField(null=True, blank=True)

    date = models.DateField(default=timezone.localdate)  # This will always store local date

    status_choices = [
        ('Checked In', 'Checked In'),
        ('Checked Out', 'Checked Out'),
    ]
    status = models.CharField(max_length=20, choices=status_choices, default='Checked In')

    class Meta:
        unique_together = ('user', 'date')

    def __str__(self):
        return f"{self.user.username} - {self.status} ({self.date})"