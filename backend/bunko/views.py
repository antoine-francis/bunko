from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from rest_framework.authentication import SessionAuthentication, BasicAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework import status

from users.models import Subscription
from .models import Text, Series
from .serializers import TextSerializer, CommentSerializer, SeriesSerializer


def home(request):
	context = {
		'texts': Text.objects.all()
	}
	return render(request, 'bunko/home.html', context)


class TextListView(ListView):
	model = Text
	template_name = 'bunko/home.html'
	context_object_name = 'texts'
	ordering = ['-creation_date']


class TextDetailView(DetailView):
	model = Text


class TextCreateView(LoginRequiredMixin, CreateView):
	model = Text
	fields = ['title', 'content']

	def form_valid(self, form):
		form.instance.author = self.request.user
		return super().form_valid(form)


class TextUpdateView(LoginRequiredMixin, UserPassesTestMixin, UpdateView):
	model = Text
	fields = ['title', 'content']

	def form_valid(self, form):
		form.instance.author = self.request.user
		return super().form_valid(form)

	def test_func(self):
		text = self.get_object()
		return self.request.user == text.author


class TextDeleteView(LoginRequiredMixin, UserPassesTestMixin, DeleteView):
	model = Text
	success_url = '/'

	def test_func(self):
		text = self.get_object()
		return self.request.user == text.author


@api_view()
def get_texts(request):
	print(request.user.id)
	if request.method == 'GET':
		data = Text.objects.filter(
			author_id__in=Subscription.objects.filter(follower=request.user.id).values('following')
		)
		serializer = TextSerializer(data, context={'request': request}, many=True)
		return Response(serializer.data)
	elif request.method == 'POST':
		serializer = TextSerializer(data=request.data, context={'request': request})
		if serializer.is_valid():
			serializer.save()
			return Response(status=status.HTTP_201_CREATED)

		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view()
def get_text_by_id(request, pk):
	if request.method == 'GET':
		try:
			data = Text.objects.get(id=pk)
			serializer = TextSerializer(data)
			return Response(serializer.data, status=status.HTTP_200_OK)

		except Text.DoesNotExist:
			return Response({"detail": f'No text with an id of {pk} was found.'}, status=status.HTTP_404_NOT_FOUND)


@api_view()
def get_texts_by_user(request, username):
	if request.method == 'GET':
		data = Text.objects.filter(author__username=username)
		serializer = TextSerializer(data, context={'request': request}, many=True)
		return Response(serializer.data)
	elif request.method == 'POST':
		serializer = TextSerializer(data=request.data, context={'request': request})
		if serializer.is_valid():
			serializer.save()
			return Response(status=status.HTTP_201_CREATED)

		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Comments

@api_view()
def comment(request):
	if request.method == 'POST':
		data = request.data
		data['author'] = request.user.id
		serializer = CommentSerializer(data=data, context={'request': request})
		if serializer.is_valid():
			serializer.save()
			return Response(status=status.HTTP_201_CREATED)

		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view()
def delete_comment(request):
	if request.method == 'DELETE':
		data = request.data
		data['author'] = request.user.id
		serializer = CommentSerializer(data=data, context={'request': request})
		if serializer.is_valid():
			serializer.save()
			return Response(status=status.HTTP_201_CREATED)

		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view()
def get_series_by_user(request, username):
	if request.method == 'GET':
		data = Series.objects.filter(text__author__username=username)
		print(data)
		serializer = SeriesSerializer(data, context={'request': request}, many=True)
		return Response(serializer.data, status=status.HTTP_200_OK)

@api_view()
def get_series(request, pk):
	if request.method == 'GET':
		try:
			data = Series.objects.get(id=pk)
			serializer = SeriesSerializer(data)
			return Response(serializer.data, status=status.HTTP_200_OK)

		except Series.DoesNotExist:
			return Response({"detail": f'No series with an id of {pk} was found.'}, status=status.HTTP_404_NOT_FOUND)