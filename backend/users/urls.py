from django.urls import path

from users.views import get_profile, get_followers, get_following, get_collective, bunko_login, bunko_logout, \
	get_user_data, bunko_signup, unsubscribe, subscribe

urlpatterns = [
	path('profile/<str:username>', get_profile),
	path('followers/<str:username>', get_followers),
	path('following/<str:username>', get_following),
	path('subscribe/<str:username>', subscribe),
	path('unsubscribe/<str:username>', unsubscribe),
	path('collective/<int:pk>', get_collective),
	path('auth/login', bunko_login),
	path('auth/logout', bunko_logout),
	path('user_data', get_user_data),
	path('auth/signup', bunko_signup)
]
