# urls.py
"""
This file defines the URL patterns for the API endpoints provided by the application.
The endpoints include test data retrieval, authentication checks, token generation, user profiles, and user registration.
"""

from django.urls import path
from . import views
from rest_framework.authtoken.views import obtain_auth_token
from myapp.views.createuser import RegisterUserView
from myapp.views.home import get_data
from myapp.views.userdetails import UserDetails
from myapp.views.getroles import roles_below_user
from myapp.views.departments import departments
from myapp.views.getmanagers import get_managers
from myapp.views.checkin import usercheckIncheckOut
from myapp.views.get_my_tasks import  get_my_tasks
from myapp.views.get_teams import get_teams
from myapp.views.get_subordinate_employees import get_subordinate_employees
from myapp.views.create_team import create_team
from myapp.views.updatetask import update_task_assignment
from myapp.views.get_teammembers import get_team_members
from myapp.views.getteammembertasks import get_team_member_tasks
from myapp.views.createtask import create_task
from myapp.views.customauthentication import CustomObtainAuthToken

urlpatterns = [
    path('home', get_data),
    path('generateToken', CustomObtainAuthToken.as_view(), name='generate_token'),
    path('Profile', UserDetails),
    path('create', RegisterUserView.as_view(), name='create'),
    path('get_all_roles' , roles_below_user),
    path('departments',departments),
    path('get_managers',get_managers),
    path('user-checkin-checkout/', usercheckIncheckOut.as_view()),
    path('my-team-tasks/', get_my_tasks, name='get_my_tasks'),
    path('get_teams', get_teams, name='get_teams'),
    path('employees/subordinates', get_subordinate_employees, name='get_subordinate_employees'),
    path('teams/create', create_team, name='create_team'),
    path('tasks/<int:task_id>/update' , update_task_assignment , name='update_task_assignment'),
    path('team/<int:team_id>/members', get_team_members, name='get_team_members'),
    path('team/<team_id>/tasks', get_team_member_tasks, name='get_team_members'),
    path('create_task', create_task, name='create_task'),
]
