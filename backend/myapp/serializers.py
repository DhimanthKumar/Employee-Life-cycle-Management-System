from rest_framework import serializers
from .models import CustomUser, Role, Employee, Department,CheckIn, TaskAssignment, Team

class CustomUserSerializer(serializers.ModelSerializer):
    """
    Serializer for the CustomUser model.

    This serializer manages user creation and retrieval while handling related Employee, Role, Department, and Manager data.

    Key Features:
    - **Role Handling**: Links a user to a role using `SlugRelatedField`, fetching role names from the Role model.
    - **Department Handling**: Ensures every non-admin user is assigned to a department.
    - **Manager Assignment**: Allows linking to a manager (optional, except for lower-level employees).
    - **Nested Employee Creation**: Automatically creates an associated Employee object when a new user is registered.
    - **Password Handling**: Ensures passwords are write-only for security.

    Fields:
    - `role` (str): The role of the employee (e.g., "manager", "developer").
    - `department` (str): The department where the employee belongs.
    - `manager` (str, optional): The username of the manager supervising this employee.

    Expected Request Data for Creating a User:
    ```json
    {
        "username": "john_doe",
        "email": "john@example.com",
        "password": "securepassword123",
        "phone": "1234567890",
        "date_of_joining": "2024-04-03",
        "role": "employee",
        "department": "Engineering",
        "manager": "jane_manager"
    }
    ```

    Response Example:
    ```json
    {
        "id": 1,
        "username": "john_doe",
        "email": "john@example.com",
        "phone": "1234567890",
        "date_of_joining": "2024-04-03",
        "role": "employee",
        "department": "Engineering",
        "manager": "jane_manager"
    }
    ```

    """

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
        """
        Creates a new CustomUser and an associated Employee record.

        Steps:
        1. Extracts employee-related data (role, department, manager).
        2. Creates the CustomUser object with the provided credentials.
        3. Automatically associates an Employee object with the user.
        4. Returns the newly created user.

        Returns:
            CustomUser: The created user instance.
        """
        employee_data = validated_data.pop("employee")  # Extract employee fields
        role = employee_data["role"]
        department = employee_data["department"]
        manager = employee_data.get("manager", None)  # Manager is optional

        # Create User
        password = validated_data.pop("password")
        user = CustomUser.objects.create_user(password=password, **validated_data)

        # Create Employee entry linked to user
        Employee.objects.create(user=user, role=role, department=department, manager=manager)

        return user

    def to_representation(self, instance):
        """
        Ensures the API response returns role, department, and manager details properly.

        This method customizes the default serialization:
        - Converts role and department from foreign key references to their respective names.
        - Converts manager to their username if assigned.

        Returns:
            dict: The serialized representation of the user.
        """
        representation = super().to_representation(instance)
        representation["role"] = instance.employee.role.role_name if hasattr(instance, "employee") and instance.employee.role else None
        representation["department"] = instance.employee.department.name if hasattr(instance, "employee") and instance.employee.department else None
        representation["manager"] = instance.employee.manager.user.username if hasattr(instance, "employee") and instance.employee.manager and instance.employee.manager.user else None
        return representation
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