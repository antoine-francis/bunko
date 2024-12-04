from django.shortcuts import render, redirect
from django.contrib import messages
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .forms import UserRegisterForm, UserUpdateForm, ProfileUpdateForm
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User

from .models import Profile, Subscription, Collective
from .serializers import ProfileSerializer, SubscriptionFollowersSerializer, SubscriptionFollowingSerializer, \
	CollectiveDetailedSerializer


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

def profile(request, username):
	user = User.objects.filter(username=username).first()
	print("username is : " + user.username)
	context = {
		'textes': user.text_set.all(),
		'utilisateurVisitay': user
	}
	return render(request, 'users/profile.html', context)

@login_required
def profile_edit(request):
	user = request.user
	if request.method == 'POST':
		user_form = UserUpdateForm(request.POST, instance=user)
		profile_form = ProfileUpdateForm(request.POST, request.FILES, instance=user.profile)

		if user_form.is_valid() and profile_form.is_valid():
			user_form.save()
			profile_form.save()
			messages.success(request, f'Vos informations ont été mises à jour.')
			return redirect('profile', username=user.username)
	else:
		user_form = UserUpdateForm(instance=user)
		profile_form = ProfileUpdateForm(instance=user.profile)
	context = {
		'textes': user.text_set.all().order_by('-date_creation'),
		'user_form': user_form,
		'profile_form': profile_form
	}
	return render(request, 'users/profile-edit.html', context)

@api_view()
def get_profile(request, username):
	if request.method == 'GET':
		data = Profile.objects.get(user__username=username)
		serializer = ProfileSerializer(data, context={'request': request})
		return Response(serializer.data)


@api_view()
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


@api_view()
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


@api_view()
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