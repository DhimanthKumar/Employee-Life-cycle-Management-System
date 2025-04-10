from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser,Employee,Role,Department,CheckIn
class CustomUserAdmin(UserAdmin):
    list_display = ( "username","email", "get_role")  # ✅ Use a custom method instead of 'role'

    def get_role(self, obj):
        """Fetch role from related Employee model"""
        employee = Employee.objects.filter(user=obj).first()
        return employee.role.role_name if employee and employee.role else "No Role"

    get_role.short_description = "Role"  # Column title in Django admin

admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Employee)
admin.site.register(Role)
admin.site.register(Department)
@admin.register(CheckIn)
class CheckInAdmin(admin.ModelAdmin):
    list_display = ('user', 'date', 'check_in_time', 'check_out_time', 'status')
    list_filter = ('status', 'user' , 'date')
    search_fields = ('user__username',)


