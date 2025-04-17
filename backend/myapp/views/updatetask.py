from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status as drf_status
from myapp.models import TaskAssignment, Employee
from django.shortcuts import get_object_or_404


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def update_task_assignment(request, task_id):
    """
    PATCH /tasks/<task_id>/update/

    Allows the assigned employee to update their task's progress and status.
    Constraints:
    - Only 'progress' and 'status' fields can be updated.
    - Only the assigned employee can update the task.
    - If task status is 'blocked', it cannot be updated.
    - Users cannot set status to 'blocked'.
    - If status is changed to 'completed', 'completed' is set to True.
    - If status is anything else (except 'blocked'), 'completed' is set to False.
    - If status is 'blocked', 'completed' is not changed.

    Request Body (JSON):
    {
        "progress": 75,
        "status": "in_progress"
    }

    Responses:
    - 200 OK:
        {
            "message": "Task updated successfully.",
            "updated_fields": {
                "progress": 75,
                "status": "in_progress"
            },
            "completed": false
        }

    - 403 Forbidden:
        {"error": "You are not authorized to update this task."}
        {"error": "Blocked tasks cannot be modified."}
        {"error": "You are not allowed to set the status to 'blocked'."}

    - 400 Bad Request:
        {"error": "Progress must be between 0 and 100."}
        {"error": "Invalid status. Choose from: not_started, in_progress, completed, blocked."}
    """
    user = request.user

    try:
        employee = Employee.objects.get(user=user)
    except Employee.DoesNotExist:
        return Response({"error": "Authenticated user is not linked to an employee."}, status=drf_status.HTTP_403_FORBIDDEN)

    task = get_object_or_404(TaskAssignment, id=task_id)

    if task.status == "blocked":
        return Response({"error": "Blocked tasks cannot be modified."}, status=drf_status.HTTP_403_FORBIDDEN)

    if task.assigned_to != employee:
        return Response({"error": "You are not authorized to update this task."}, status=drf_status.HTTP_403_FORBIDDEN)

    progress = request.data.get("progress")
    status_value = request.data.get("status")

    updated_fields = {}

    # Handle status update first (order matters for progress logic)
    if status_value is not None:
        status_value = status_value.lower()

        if status_value == "blocked":
            return Response({"error": "You are not allowed to set the status to 'blocked'."}, status=drf_status.HTTP_403_FORBIDDEN)

        valid_statuses = dict(TaskAssignment.STATUS_CHOICES).keys()
        if status_value not in valid_statuses:
            return Response({"error": f"Invalid status. Choose from: {', '.join(valid_statuses)}."}, status=drf_status.HTTP_400_BAD_REQUEST)

        task.status = status_value
        updated_fields["status"] = status_value

        if status_value == "completed":
            task.completed = True
            task.progress = 100
            updated_fields["progress"] = 100
        else:
            task.completed = False
            if status_value == "not_started":
                task.progress=0
            else:
                task.progress = progress
            updated_fields["progress"] = progress

    # Allow progress update only if status is not being updated
    elif progress is not None:
        try:
            progress = int(progress)
            if 0 <= progress <= 100:
                task.progress = progress
                updated_fields["progress"] = progress
            else:
                return Response({"error": "Progress must be between 0 and 100."}, status=drf_status.HTTP_400_BAD_REQUEST)
        except ValueError:
            return Response({"error": "Invalid progress value."}, status=drf_status.HTTP_400_BAD_REQUEST)

    task.save()

    return Response({
        "message": "Task updated successfully.",
        "updated_fields": updated_fields,
        "completed": task.completed
    }, status=drf_status.HTTP_200_OK)  