from rest_framework.permissions import IsAuthenticated,BasePermission

class IsStaffUser(BasePermission):
    def has_permission(self, request, view):
        print(request.user.is_staff)
        return request.user and request.user.is_staff