# models.py
from django.db import models
from django.contrib.auth.models import AbstractUser
from .managers import CustomUserManager
from django.core.exceptions import ValidationError
from django.utils import timezone
from django.utils.timezone import now
from django.db.models.signals import post_save
from django.dispatch import receiver

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
    

class Team(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    members = models.ManyToManyField(Employee, related_name="teams")
    team_leader = models.ForeignKey(
        Employee,
        on_delete=models.SET_NULL,
        related_name="leading_teams",
        null=True,
        blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def _str_(self):
        return self.name


@receiver(post_save, sender=Team)
def validate_team_leader_and_members(sender, instance, created, **kwargs):
    if created:  # Validate only after the team has been created
        if instance.team_leader:
            team_leader_role = instance.team_leader.role
            if not team_leader_role:
                raise ValidationError({"team_leader": "Team leader must have an assigned role."})

            # Perform validation on each team member
            for member in instance.members.all():
                member_role = member.role
                if not member_role:
                    raise ValidationError(f"Member {member.user.username} must have an assigned role.")
                
                # Compare authority levels: team leader should have higher authority
                if member_role.authority_level >= team_leader_role.authority_level:
                    raise ValidationError(f"The team leader's authority level must be higher than that of {member.user.username}.")
class TaskAssignment(models.Model):
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]

    STATUS_CHOICES = [
        ('not_started', 'Not Started'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('blocked', 'Blocked'),
    ]

    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name="tasks")
    assigned_to = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="assigned_tasks")
    title = models.CharField(max_length=200)
    description = models.TextField()
    due_date = models.DateField(null=True, blank=True)
    completed = models.BooleanField(default=False)
    assigned_at = models.DateTimeField(auto_now_add=True)

    # New fields
    progress = models.PositiveIntegerField(default=0, help_text="Progress in percentage (0-100)")
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='not_started')

    def str(self):
        return f"{self.title} -> {self.assigned_to.user.username}"