from django.contrib.auth import authenticate, login, logout
from django.shortcuts import render, redirect
from django.contrib import messages
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .forms import UserRegisterForm, UserUpdateForm, ProfileUpdateForm
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User

from .models import Profile, Subscription, Collective
from .serializers import ProfileSerializer, SubscriptionFollowersSerializer, SubscriptionFollowingSerializer, \
	CollectiveDetailedSerializer, UserSerializer


@api_view(['POST'])
@permission_classes([AllowAny])
def bunko_login(request):
	username = request.data.get('username')
	password = request.data.get('password')
	print(f"User {username} is logging in")
	if not username or not password:
		print(f"Empty fields provided")
		return Response({"detail": "Email and password are required"}, status=status.HTTP_400_BAD_REQUEST)

	user = authenticate(request, username=username, password=password)
	print(user)

	if user is not None:
		login(request, user)  # This will log the user in by creating a session
		print(f"User {username} is logged in")
		return Response(data=UserSerializer(user, context={'request': request}).data, status=status.HTTP_200_OK)

	print(f"Invalid credentials")
	return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['DELETE'])
def bunko_logout(request):
	print(f"User {request.user.id} is logging out")
	logout(request)
	print(f"User {request.user.id} is logged out")
	return Response({"detail": "User is logged out"}, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_user_data(request):
	data = User.objects.filter(id=request.user.id).first()
	print(data)
	if data:
		serializer = UserSerializer(data, context={'request': request})
		# TODO : Use the profile model instead and add settings/preferences to it
		# serializer = ProfileSettingsSerializer(data, context={'request': request})
		return Response(serializer.data, status=status.HTTP_200_OK)
	else:
		return Response(status=status.HTTP_401_UNAUTHORIZED)


def inscription(request):
	if request.method == 'POST':
		formulaire = UserRegisterForm(request.POST)
		if formulaire.is_valid():
			formulaire.save()
			username = formulaire.cleaned_data.get('username')
			messages.success(request, f'Votre compte a été créé. Vous pouvez maintenant vous connecter!')
			return redirect('connexion')
	else:
		formulaire = UserRegisterForm()
	return render(request, 'users/inscription.html', {'formulaire': formulaire})


@api_view(['GET'])
def get_profile(request, username):
	if request.method == 'GET':
		data = Profile.objects.get(user__username=username)
		serializer = ProfileSerializer(data, context={'request': request})
		return Response(serializer.data)


@api_view(['GET'])
def get_followers(request, username):
	if request.method == 'GET':
		try:
			user = User.objects.get(username=username)
		except User.DoesNotExist:
			return Response({"error": "User not found with username: " + username}, status=status.HTTP_404_NOT_FOUND)
		except User.MultipleObjectsReturned:
			return Response({"error": "Multiple users found with the following username: " + username}, status=status.HTTP_400_BAD_REQUEST)

		data = Subscription.objects.filter(following=user)

		serializer = SubscriptionFollowersSerializer(data, many=True)
		return Response(serializer.data)


@api_view(['GET'])
def get_following(request, username):
	if request.method == 'GET':
		try:
			user = User.objects.get(username=username)
		except User.DoesNotExist:
			return Response({"error": "User not found with username: " + username}, status=status.HTTP_404_NOT_FOUND)
		except User.MultipleObjectsReturned:
			return Response({"error": "Multiple users found with the following username: " + username}, status=status.HTTP_400_BAD_REQUEST)

		data = Subscription.objects.filter(follower=user)

		serializer = SubscriptionFollowingSerializer(data, many=True)
		return Response(serializer.data)


@api_view(['GET'])
def get_collective(request, pk):
	if request.method == 'GET':
		try:
			collective = Collective.objects.get(id=pk)
		except Collective.DoesNotExist:
			return Response({"error": "Collective not found with id: " + id}, status=status.HTTP_404_NOT_FOUND)
		except Collective.MultipleObjectsReturned:
			return Response({"error": "Multiple collectives found with the following id: " + id}, status=status.HTTP_400_BAD_REQUEST)

		serializer = CollectiveDetailedSerializer(collective)
		return Response(serializer.data)