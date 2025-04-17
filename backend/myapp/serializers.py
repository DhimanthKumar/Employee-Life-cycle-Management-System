from rest_framework import serializers
from .models import CustomUser, Role, Employee, Department,CheckIn, TaskAssignment, Team

class CustomUserSerializer(serializers.ModelSerializer):
    role = serializers.SlugRelatedField(
        queryset=Role.objects.all(),
        slug_field="role_name",
        required=True,
        source="employee.role",
    )
    department = serializers.SlugRelatedField(
        queryset=Department.objects.all(),
        slug_field="name",
        required=True,
        source="employee.department",
    )
    manager = serializers.SlugRelatedField(
        queryset=Employee.objects.all(),
        slug_field="user__username",
        required=False,  # Allow manager to be optional for top-level users
        source="employee.manager",
    )

    class Meta:
        model = CustomUser
        fields = ["id", "username", "email", "phone", "password", "date_of_joining", "role", "department", "manager"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        # Existing creation logic
        employee_data = validated_data.pop("employee")
        role = employee_data["role"]
        department = employee_data["department"]
        manager = employee_data.get("manager", None)

        password = validated_data.pop("password")
        user = CustomUser.objects.create_user(password=password, **validated_data)

        # Create Employee record
        Employee.objects.create(user=user, role=role, department=department, manager=manager)

        return user

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if hasattr(instance, 'employee'):
            if instance.employee.role:
                representation["role"] = instance.employee.role.role_name
            if instance.employee.department:
                representation["department"] = instance.employee.department.name
            if instance.employee.manager and instance.employee.manager.user:
                representation["manager"] = instance.employee.manager.user.username
        return representation

    # Case-insensitive username validation
    def validate_username(self, value):
        """
        Ensures that the username is unique (case-insensitive).
        """
        if CustomUser.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError("A user with this username already exists.")
        return value

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'
class EmployeeSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer(read_only=True)
    role_name = serializers.SerializerMethodField()
    department_name = serializers.SerializerMethodField()
    manager_name = serializers.SerializerMethodField()
    authority_level=serializers.SerializerMethodField()
    class Meta:
        model = Employee
        fields = ['id', 'user', 'role_name', 'department_name', 'manager_name','authority_level']

    def get_role_name(self, obj):
        return obj.role.role_name if obj.role else None
    def get_authority_level(self,obj):
        return obj.role.authority_level if obj.role else None
    def get_department_name(self, obj):
        return obj.department.name if obj.department else None

    def get_manager_name(self, obj):
        return obj.manager.user.username if obj.manager and obj.manager.user else None
class CheckInSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()  # shows username instead of user id

    class Meta:
        model = CheckIn
        fields = ['id', 'user', 'check_in_time', 'check_out_time', 'status' , 'date']



class TeamNameSerializer(serializers.ModelSerializer):
    """
    Serializer for Team model that returns all team data including leader information.
    """
    team_leader_name = serializers.CharField(source='team_leader.user.username', read_only=True)
    team_leader_authority = serializers.IntegerField(source='team_leader.role.authority_level', read_only=True)
    member_count = serializers.SerializerMethodField()

    class Meta:
        model = Team
        fields = [
            'id',
            'name',
            'description',
            'team_leader_name',
            'team_leader_authority',
            'member_count',
            'created_at'
        ]

    def get_member_count(self, obj):
        return obj.members.count()

from .models import TaskAssignment

class TaskSerializer(serializers.ModelSerializer):
    """
    Serializer for TaskAssignment model that returns all task details.
    """
    assigned_to_username = serializers.CharField(source='assigned_to.user.username', read_only=True)
    team_name = serializers.CharField(source='team.name', read_only=True)

    class Meta:
        model = TaskAssignment
        fields = [
            'id',
            'title',
            'description',
            'due_date',
            'completed',
            'progress',
            'priority',
            'status',
            'assigned_to_username',
            'team_name',
            'assigned_at'
        ]

class EmployeeSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')
    email = serializers.CharField(source='user.email')
    role_name = serializers.CharField(source='role.role_name')
    authority_level = serializers.IntegerField(source='role.authority_level')
    
    class Meta:
        model = Employee
        fields = ['id', 'username', 'email', 'role_name', 'authority_level', 'department']

class TeamCreateSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100)
    description = serializers.CharField(required=False, allow_blank=True)
    team_leader_id = serializers.IntegerField()
    member_ids = serializers.ListField(
        child=serializers.IntegerField(),
        required=False,
        default=[]
    )
    
    def validate_name(self, value):
        if Team.objects.filter(name=value).exists():
            raise serializers.ValidationError("A team with this name already exists.")
        return value