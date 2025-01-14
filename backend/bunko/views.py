from datetime import datetime

from django.db import IntegrityError
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from users.models import Subscription
from .models import Text, Series, Like, Bookmark
from .serializers import TextSerializer, CommentSerializer, SeriesReadSerializer, LikeSerializer, \
	UserBookmarkSerializer, \
	NewCommentSerializer, NewTextSerializer, TextEditSerializer, MinimalTextSerializer


def home(request):
	context = {
		'texts': Text.objects.all()
	}
	return render(request, 'bunko/home.html', context)


@api_view()
def get_texts(request):
	if request.method == 'GET':
		data = Text.objects.filter(
			author_id__in=Subscription.objects.filter(follower=request.user.id).values('following'),
			is_draft=False
		)
		serializer = TextSerializer(data, context={'request': request}, many=True)
		return Response(serializer.data)
	elif request.method == 'POST':
		serializer = TextSerializer(data=request.data, context={'request': request})
		if serializer.is_valid():
			serializer.save()
			return Response(status=status.HTTP_201_CREATED)

		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def text(request, text_hash):
	if request.method == 'GET':
		try:
			data = Text.objects.get(hash=text_hash)
			serializer = TextSerializer(data)
			return Response(serializer.data, status=status.HTTP_200_OK)

		except Text.DoesNotExist:
			return Response({"detail": f'No text with an id of {text_hash} was found.'}, status=status.HTTP_404_NOT_FOUND)
	elif request.method == 'PUT':
		try:
			data = request.data
			author_data = data.get('author')
			if request.user.username != author_data.get('username'):
				return Response({"error": f'User {request.user.username} is not allowed to modify text {data.id}'},
								status=status.HTTP_403_FORBIDDEN)
			series = data.get('series')
			print(series)
			serializer = TextEditSerializer(data=data, context={'request': request}, partial=True)
			if serializer.is_valid():
				serializer.save()
				return Response(data=data, status=status.HTTP_200_OK)
			print(serializer.errors)
			return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
		except IntegrityError as e:
			print(e)
			return Response({"error": f'Something went wrong while saving text for user {request.user.id}.'},
							status=status.HTTP_417_EXPECTATION_FAILED)
	elif request.method == 'DELETE':
		try:
			data = request.data
			author_data = data.get('author')
			if request.user.username != author_data.get('username'):
				return Response({"error": f'User {request.user.username} is not allowed to modify text {data.id}'},
								status=status.HTTP_403_FORBIDDEN)
			text_hash = data.get('hash')
			Text.objects.get(hash=text_hash).delete()
			return Response(status=status.HTTP_200_OK)
		except IntegrityError:
			return Response(
				{"error": f'Something went wrong while deleting text {text_hash} for user {request.user.id}.'},
				status=status.HTTP_417_EXPECTATION_FAILED)
#
# @api_view(['DELETE'])
# def delete_text(request):



@api_view(['POST'])
def create_text(request):
	try:
		data = request.data
		new_text = {
			'author': request.user.id,
			'content': data.get('content'),
			'title': data.get('title'),
			'genres': data.get('genres', []),
			'is_draft': data.get('is_draft'),
			'series': data.get('series'),
			'series_entry': data.get('series_entry'),
			'synopsis': data.get('synopsis')
		}
		serializer = NewTextSerializer(data=new_text, context={'request': request})
		if serializer.is_valid():
			saved_text = serializer.save()
			text_data = TextSerializer(saved_text).data
			return Response(data=text_data, status=status.HTTP_200_OK)
		print(serializer.errors)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
	except IntegrityError:
		return Response({"error": f'Something went wrong while saving text for user {request.user.id}.'},
						status=status.HTTP_417_EXPECTATION_FAILED)


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


@api_view(['GET'])
def get_texts_by_tag(request, tag):
	if request.method == 'GET':
		data = Text.objects.filter(genres__tag=tag)
		print(data)
		serializer = MinimalTextSerializer(data, context={'request': request}, many=True)
		return Response(data=serializer.data, status=status.HTTP_200_OK)


# Comments

@api_view(['POST'])
def comment(request):
	if request.method == 'POST':
		data = request.data
		new_comment = {
			'author': request.user.id,
			'content': data.get('content'),
			'text': data.get('text_id'),
			'parent': data.get('parent', None)
		}
		serializer = NewCommentSerializer(data=new_comment, context={'request': request})
		if serializer.is_valid():
			saved_comment = serializer.save()
			data = CommentSerializer(saved_comment).data
			return Response(data=data, status=status.HTTP_200_OK)
		print(serializer.errors)
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
		serializer = SeriesReadSerializer(data, context={'request': request}, many=True)
		return Response(serializer.data, status=status.HTTP_200_OK)


@api_view()
def get_series(request, pk):
	if request.method == 'GET':
		try:
			data = Series.objects.get(id=pk)
			serializer = SeriesReadSerializer(data)
			return Response(serializer.data, status=status.HTTP_200_OK)

		except Series.DoesNotExist:
			return Response({"detail": f'No series with an id of {pk} was found.'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
def like_text(request, pk):
	try:
		text = Text.objects.filter(id=pk).first()
		like = Like.objects.filter(user=request.user, text=text)
		if like:
			return Response({"error": "This text has already been liked"}, status=status.HTTP_417_EXPECTATION_FAILED)
		else:
			new_like = Like.objects.create(user=request.user, text=text)
			return Response(status=status.HTTP_200_OK, data=LikeSerializer(new_like).data)
	except IntegrityError:
		return Response({"error": "Something happened, try again later"}, status=status.HTTP_417_EXPECTATION_FAILED)


@api_view(['POST'])
def unlike_text(request, pk):
	try:
		text = Text.objects.filter(id=pk).first()
		like = Like.objects.get(user=request.user, text=text)
		if not like:
			return Response({"error": "No like from user " + request.user.id + "for text " + text.id},
							status=status.HTTP_404_NOT_FOUND)
		else:
			like.delete()
			return Response(status=status.HTTP_200_OK, data=request.user.username)
	except IntegrityError:
		return Response({"error": "Something happened, try again later"}, status=status.HTTP_417_EXPECTATION_FAILED)


@api_view(['POST'])
def bookmark_text(request, pk):
	try:
		text = Text.objects.filter(id=pk).first()
		bookmark = Bookmark.objects.filter(user=request.user, text=text)
		if bookmark:
			return Response({"error": "This text has already been bookmarked"},
							status=status.HTTP_417_EXPECTATION_FAILED)
		else:
			new_bookmark = Bookmark.objects.create(user=request.user, text=text)
			return Response(status=status.HTTP_200_OK, data=UserBookmarkSerializer(new_bookmark).data)
	except IntegrityError:
		return Response({"error": "Something happened, try again later"}, status=status.HTTP_417_EXPECTATION_FAILED)


@api_view(['POST'])
def unbookmark_text(request, pk):
	try:
		text = Text.objects.filter(id=pk).first()
		bookmark = Bookmark.objects.get(user=request.user, text=text)
		if not bookmark:
			return Response({"error": "No bookmark from user " + request.user.id + "for text " + text.id},
							status=status.HTTP_404_NOT_FOUND)
		else:
			bookmark.delete()
			return Response(status=status.HTTP_200_OK, data=request.user.username)
	except IntegrityError:
		return Response({"error": "Something happened, try again later"}, status=status.HTTP_417_EXPECTATION_FAILED)
