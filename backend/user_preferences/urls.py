""" from django.urls import path
from . import views

urlpatterns = [
	path('user/', views.UserDetail, name='user_detail'),
	path('users/', views.UserList, name='user_list'),
	path('user-preference/', views.UserPreferenceView, name='user_preference'),
]
 """