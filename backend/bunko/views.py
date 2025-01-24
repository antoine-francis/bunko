import logging
from datetime import datetime

from django.db import IntegrityError
from django.shortcuts import render, get_object_or_404
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from users.models import Subscription
from .models import Text, Series, Like, Bookmark, Genre
from .serializers import TextSerializer, CommentSerializer, SeriesSerializer, LikeSerializer, \
	UserBookmarkSerializer, \
	NewCommentSerializer, NewTextSerializer, TextEditSerializer, TextDescriptionSerializer, TextsByTagSerializer

logger = logging.getLogger(__name__)

def home(request):
	context = {
		'texts': Text.objects.all()
	}
	return render(request, 'bunko/home.html', context)


@api_view()
def get_texts(request):
	if request.method == 'GET':
		logger.info(f"START GET get_texts() for user {request.user.id}")
		data = Text.objects.filter(
			author_id__in=Subscription.objects.filter(follower=request.user.id).values('following'),
			is_draft=False
		)
		serializer = TextSerializer(data, context={'request': request}, many=True)
		response = Response(serializer.data)
		logger.info(f"END GET get_texts() for user {request.user.id}")
		return response


@api_view(['GET', 'PUT', 'DELETE'])
def text(request, text_hash):
	logger.info(f"START GET text() for user {request.user.id}")
	if request.method == 'GET':
		try:
			data = Text.objects.get(hash=text_hash)
			serializer = TextSerializer(data)
			response = Response(serializer.data, status=status.HTTP_200_OK)
		except Text.DoesNotExist:
			response = Response({"detail": f'No text with an id of {text_hash} was found.'}, status=status.HTTP_404_NOT_FOUND)
		logger.info(f"END GET text() for user {request.user.id}")
		return response
	elif request.method == 'PUT':
		logger.info(f"START PUT text() for user {request.user.id}")
		try:
			data = request.data
			author_data = data.get('author')
			if request.user.username != author_data.get('username'):
				message = f'User {request.user.username} is not allowed to modify text {data.id}'
				response = Response({"error": message}, status=status.HTTP_403_FORBIDDEN)
			else:
				if data.get('series'):
					series = data.get('series')
					series_id = series.get('id')
					series_title = series.get('title')
					series_synopsis = series.get('synopsis')
					if series_id == 0:
						logger.info(f"Creating new series '{series_title}' for user {request.user.id}")
						new_series = Series.objects.create(title=series_title, synopsis=series_synopsis)
						data['series'] = new_series.id
					else:
						logger.info(f"Assigning '{data.get('title')}' to series '{series_title}' for user {request.user.id}")
						data['series'] = series_id
						Series.objects.filter(pk=series_id).update(synopsis=series_synopsis)
				else:
					data['series'] = None
					data['series_entry'] = None
				serializer = TextEditSerializer(data=data, context={'request': request}, partial=True)
				if serializer.is_valid():
					updated_text = serializer.save()
					text_data = TextSerializer(updated_text).data
					response = Response(data=text_data, status=status.HTTP_200_OK)
				else:
					logger.error("error in PUT text() for user " + request.user.username + " : " + str(serializer.errors))
					response = Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
		except IntegrityError as e:
			message = "error in PUT text() for user " + request.user.id + " : " + str(e)
			logger.error(message)
			response = Response({"error": f'Something went wrong : {message}'},
							status=status.HTTP_417_EXPECTATION_FAILED)
		logger.info(f"END PUT text() for user {request.user.id}")
		return response
	elif request.method == 'DELETE':
		logger.info(f"START DELETE text() for user {request.user.id}")
		try:
			data = request.data
			author_data = data.get('author')
			if request.user.username != author_data.get('username'):
				message = f'User {request.user.id} is not allowed to modify text {data.id}'
				response = Response({"error": message},
								status=status.HTTP_403_FORBIDDEN)
			else:
				text_hash = data.get('hash')
				Text.objects.get(hash=text_hash).delete()
				response = Response(status=status.HTTP_200_OK)
		except IntegrityError:
			message = f"error in DELETE text() for user {request.user.id} : Something went wrong while deleting text {text_hash}"
			logger.error(message)
			response = Response(
				{"error": message},
				status=status.HTTP_417_EXPECTATION_FAILED)
		logger.info(f"END DELETE text() for user {request.user.id}")
		return response



@api_view(['POST'])
def create_text(request):
	logger.info(f"START POST create_text() for user {request.user.id}")
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
			response = Response(data=text_data, status=status.HTTP_200_OK)
		else:
			logger.error(serializer.errors)
			response = Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
	except IntegrityError:
		response = Response({"error": f'Something went wrong while saving text for user {request.user.id}.'},
						status=status.HTTP_417_EXPECTATION_FAILED)
	logger.info(f"END POST create_text() for user {request.user.id}")
	return response


@api_view(['GET'])
def get_texts_by_tag(request, tag):
	if request.method == 'GET':
		logger.info(f"START GET get_texts_by_tag() for user {request.user.id}")
		data = Text.objects.filter(genres__tag=tag)
		serializer = TextDescriptionSerializer(data, context={'request': request}, many=True)
		if serializer.is_valid():
			response = Response(data=serializer.data, status=status.HTTP_200_OK)
		else:
			response = Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)
		logger.info(f"END GET get_texts_by_tag() for user {request.user.id}")
		return response


@api_view(['GET'])
def get_tags(request):
	if request.method == 'GET':
		logger.info(f"START GET get_tags() for user {request.user.id}")
		data = Genre.objects.filter(text_genres__isnull=False, text_genres__is_draft=False).distinct()
		serializer = TextsByTagSerializer(data, context={'request': request}, many=True)
		logger.info(f"END GET get_tags() for user {request.user.id}")
		return Response(data=serializer.data, status=status.HTTP_200_OK)


# Comments

@api_view(['POST'])
def comment(request):
	if request.method == 'POST':
		logger.info(f"START POST comment() for user {request.user.id}")
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
			response = Response(data=data, status=status.HTTP_200_OK)
		else:
			logger.error(serializer.errors)
			response = Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
		logger.info(f"END POST comment() for user {request.user.id}")
		return response;


@api_view(['DELETE'])
def delete_comment(request):
	if request.method == 'DELETE':
		logger.info(f"START DELETE comment() for user {request.user.id}")
		data = request.data
		data['author'] = request.user.id
		serializer = CommentSerializer(data=data, context={'request': request})
		if serializer.is_valid():
			serializer.save()
			response = Response(status=status.HTTP_201_CREATED)
		else:
			response = Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
		logger.info(f"END DELETE comment() for user {request.user.id}")
		return response


@api_view(['GET'])
def get_series_by_user(request, username):
	if request.method == 'GET':
		logger.info(f"START GET get_series_by_user() for user {request.user.id}")
		data = Series.objects.filter(text__author__username=username)
		serializer = SeriesSerializer(data, context={'request': request}, many=True)
		logger.info(f"END GET get_series_by_user() for user {request.user.id}")
		return Response(serializer.data, status=status.HTTP_200_OK)


@api_view()
def get_series(request, pk):
	if request.method == 'GET':
		logger.info(f"START GET get_series() for user {request.user.id}")
		try:
			data = get_object_or_404(Series, id=pk)
			if not data.text.filter(author=request.user).exists():
				data = data.text.filter(is_draft=False)
			serializer = SeriesSerializer(data)
			response = Response(serializer.data, status=status.HTTP_200_OK)

		except Series.DoesNotExist:
			response = Response({"detail": f'No series with an id of {pk} was found.'}, status=status.HTTP_404_NOT_FOUND)
		logger.info(f"END GET get_series() for user {request.user.id}")
		return response


@api_view(['POST'])
def like_text(request, pk):
	logger.info(f"START POST like_text() for user {request.user.id}")
	try:
		liked_text = Text.objects.filter(id=pk).first()
		like = Like.objects.filter(user=request.user, text=liked_text)
		if like:
			response = Response({"error": "This text has already been liked"}, status=status.HTTP_417_EXPECTATION_FAILED)
		else:
			new_like = Like.objects.create(user=request.user, text=liked_text)
			response = Response(status=status.HTTP_200_OK, data=LikeSerializer(new_like).data)
	except IntegrityError:
		response = Response({"error": "Something happened, try again later"}, status=status.HTTP_417_EXPECTATION_FAILED)
	logger.info(f"END POST like_text() for user {request.user.id}")
	return response


@api_view(['POST'])
def unlike_text(request, pk):
	logger.info(f"START POST unlike_text() for user {request.user.id}")
	try:
		unliked_text = Text.objects.filter(id=pk).first()
		like = Like.objects.get(user=request.user, text=unliked_text)
		if not like:
			response = Response({"error": "No like from user " + request.user.id + "for text " + text.id},
							status=status.HTTP_404_NOT_FOUND)
		else:
			like.delete()
			response = Response(status=status.HTTP_200_OK, data=request.user.username)
	except IntegrityError:
		response = Response({"error": "Something happened, try again later"}, status=status.HTTP_417_EXPECTATION_FAILED)
	logger.info(f"END POST unlike_text() for user {request.user.id}")
	return response


@api_view(['POST'])
def bookmark_text(request, pk):
	logger.info(f"START POST bookmark_text() for user {request.user.id}")
	try:
		text = Text.objects.filter(id=pk).first()
		bookmark = Bookmark.objects.filter(user=request.user, text=text)
		if bookmark:
			response = Response({"error": "This text has already been bookmarked"},
							status=status.HTTP_417_EXPECTATION_FAILED)
		else:
			new_bookmark = Bookmark.objects.create(user=request.user, text=text)
			response = Response(status=status.HTTP_200_OK, data=UserBookmarkSerializer(new_bookmark).data)
	except IntegrityError:
		response = Response({"error": "Something happened, try again later"}, status=status.HTTP_417_EXPECTATION_FAILED)
	logger.info(f"END POST bookmark_text() for user {request.user.id}")
	return response


@api_view(['POST'])
def unbookmark_text(request, pk):
	logger.info(f"START POST unbookmark_text() for user {request.user.id}")
	try:
		bookmarked_text = Text.objects.filter(id=pk).first()
		bookmark = Bookmark.objects.get(user=request.user, text=bookmarked_text)
		if not bookmark:
			response = Response({"error": "No bookmark from user " + request.user.id + "for text " + bookmarked_text.id},
							status=status.HTTP_404_NOT_FOUND)
		else:
			bookmark.delete()
			response = Response(status=status.HTTP_200_OK, data=request.user.username)
	except IntegrityError:
		response = Response({"error": "Something happened, try again later"}, status=status.HTTP_417_EXPECTATION_FAILED)
	logger.info(f"END POST unbookmark_text() for user {request.user.id}")
	return response
