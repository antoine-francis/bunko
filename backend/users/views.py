import base64

from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.shortcuts import render, redirect
from django.contrib import messages
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .forms import UserRegisterForm
from django.contrib.auth.models import User

from .models import Profile, Subscription, Collective
from .serializers import ProfileSerializer, SubscriptionFollowersSerializer, SubscriptionFollowingSerializer, \
	CollectiveDetailedSerializer, UserSerializer


@api_view(['POST'])
@permission_classes([AllowAny])
def bunko_login(request):
	auth_header = request.headers.get('Authorization')[6:]
	auth_header_bytes = base64.b64decode(auth_header)
	auth_data = auth_header_bytes.decode("utf-8")
	username, password = auth_data.split(":", 1)
	if not username or not password:
		print(f"Empty fields provided")
		return Response({"detail": "Email and password are required"}, status=status.HTTP_400_BAD_REQUEST)

	user = authenticate(request, username=username, password=password)

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
	if data:
		serializer = UserSerializer(data, context={'request': request})
		# TODO : Use the profile model instead and add settings/preferences to it
		# serializer = ProfileSettingsSerializer(data, context={'request': request})
		return Response(serializer.data, status=status.HTTP_200_OK)
	else:
		return Response(status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
@permission_classes([AllowAny])
def bunko_signup(request):
	auth_header = request.headers.get('Authorization')[6:]
	auth_header_bytes = base64.b64decode(auth_header)
	auth_data = auth_header_bytes.decode("utf-8")
	username, email, first_name, last_name, password = auth_data.split(":", 4)
	if User.objects.filter(username=username).exists():
		return Response({"error": "User already exists with username: " + username}, status=status.HTTP_409_CONFLICT)
	if User.objects.filter(email=email).exists():
		return Response({"error": "User already exists with email: " + email}, status=status.HTTP_409_CONFLICT)
	User.objects.create_user(username, email, password, first_name=first_name, last_name=last_name)
	return Response(status=status.HTTP_200_OK)


@api_view(['GET'])
def get_profile(request, username):
	if request.method == 'GET':
		try:
			data = Profile.objects.get(user__username=username)
		except Profile.DoesNotExist:
			return Response({"error": "User not found with username: " + username}, status=status.HTTP_404_NOT_FOUND)
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


@api_view(['POST'])
def subscribe(request, username):
	try:
		user = User.objects.filter(username=username).first()
		subscription = Subscription.objects.filter(follower=request.user, following=user)
		if subscription:
			return Response({"error": "A subscription with those users already exists"}, status=status.HTTP_417_EXPECTATION_FAILED)
		else:
			new_subscription = Subscription.objects.create(follower=request.user, following=user)
			return Response(status=status.HTTP_200_OK, data=SubscriptionFollowersSerializer(new_subscription).data)
	except IntegrityError:
		return Response({"error": "Something happened, try again later"}, status=status.HTTP_417_EXPECTATION_FAILED)


@api_view(['POST'])
def unsubscribe(request, username):
	try:
		user = User.objects.filter(username=username).first()
		subscription = Subscription.objects.get(follower=request.user, following=user)
		if not subscription:
			return Response({"error": "User " + request.user + "doesn't follow " + user}, status=status.HTTP_404_NOT_FOUND)
		else:
			subscription.delete()
			print(request.user.username)
			return Response(status=status.HTTP_200_OK, data=request.user.username)
	except IntegrityError:
		return Response({"error": "Something happened, try again later"}, status=status.HTTP_417_EXPECTATION_FAILED)


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