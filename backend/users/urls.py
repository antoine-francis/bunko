from django.urls import path

from users.views import get_profile, get_followers, get_following, get_collective, bunko_login, get_user_data

urlpatterns = [
	path('profile/<str:username>', get_profile),
	path('followers/<str:username>', get_followers),
	path('following/<str:username>', get_following),
	path('collective/<int:pk>', get_collective),
	path('auth/login', bunko_login),
	path('user_data', get_user_data)
]
