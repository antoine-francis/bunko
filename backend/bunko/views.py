import logging

from django.db import IntegrityError
from django.shortcuts import render, get_object_or_404
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from users.models import Subscription
from .models import Text, Series, Like, Save, Genre, Comment, CommentLike, Bookmark
from .serializers import TextSerializer, CommentSerializer, SeriesSerializer, LikeSerializer, \
	UserSavedTextSerializer, \
	NewCommentSerializer, NewTextSerializer, TextEditSerializer, TextDescriptionSerializer, TextsByTagSerializer, \
	CommentLikeSerializer, SetBookmarkSerializer

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
		feed_data = Text.objects.exclude(
			bookmarked_text__id__in=Bookmark.objects.filter(user=request.user.id)).filter(
				author_id__in=Subscription.objects.filter(follower=request.user.id).values('following'),
				is_draft=False
			)
		feed_serializer = TextSerializer(feed_data, context={'request': request}, many=True)
		bookmarks = Bookmark.objects.filter(
			user_id=request.user.id,
			position__gt=-1
		).prefetch_related('text').order_by('-bookmark_date')[:5]
		bookmarked_texts = [bookmark.text for bookmark in bookmarks]
		bookmarks_serializer = TextSerializer(bookmarked_texts, context={'request': request}, many=True)
		response_data = {'feed': feed_serializer.data, 'bookmarks': bookmarks_serializer.data}
		response = Response(data=response_data)
		return response


@api_view(['GET', 'PUT', 'DELETE'])
def text(request, text_hash):
	logger.info(f"START GET text() for user {request.user.id}")
	if request.method == 'GET':
		try:
			data = Text.objects.get(hash=text_hash)
			serializer = TextSerializer(data, context={'request': request})
			response = Response(serializer.data, status=status.HTTP_200_OK)
		except Text.DoesNotExist:
			response = Response(
				{"detail": f'No text with an id of {text_hash} was found.'},
				status=status.HTTP_404_NOT_FOUND
			)
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
						logger.info(
							f"Assigning '{data.get('title')}' to series '{series_title}' for user {request.user.id}")
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
					logger.error(
						"error in PUT text() for user " + request.user.username + " : " + str(serializer.errors))
					response = Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
		except IntegrityError as e:
			message = "error in PUT text() for user " + request.user.id + " : " + str(e)
			logger.error(message)
			response = Response(
				{"error": f'Something went wrong : {message}'},
				status=status.HTTP_417_EXPECTATION_FAILED
			)
		logger.info(f"END PUT text() for user {request.user.id}")
		return response
	elif request.method == 'DELETE':
		logger.info(f"START DELETE text() for user {request.user.id}")
		try:
			data = request.data
			author_data = data.get('author')
			if request.user.username != author_data.get('username'):
				message = f'User {request.user.id} is not allowed to modify text {data.id}'
				response = Response({"error": message}, status=status.HTTP_403_FORBIDDEN)
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
			'series_entry': data.get('series_entry'),
			'synopsis': data.get('synopsis')
		}
		if data.get('series'):
			series = data.get('series')
			series_id = series.get('id')
			series_title = series.get('title')
			series_synopsis = series.get('synopsis')
			if series_id == 0:
				logger.info(f"Creating new series '{series_title}' for user {request.user.id}")
				new_series = Series.objects.create(title=series_title, synopsis=series_synopsis)
				new_text['series'] = new_series.id
			else:
				logger.info(f"Assigning '{data.get('title')}' to series '{series_title}' for user {request.user.id}")
				Series.objects.filter(pk=series_id).update(synopsis=series_synopsis)
				new_text['series'] = series_id
		else:
			new_text['series'] = None
			new_text['series_entry'] = None
		serializer = NewTextSerializer(data=new_text, context={'request': request})
		if serializer.is_valid():
			saved_text = serializer.save()
			text_data = TextSerializer(saved_text).data
			response = Response(data=text_data, status=status.HTTP_200_OK)
		else:
			logger.error(serializer.errors)
			response = Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
	except IntegrityError:
		response = Response(
			{"error": f'Something went wrong while saving text for user {request.user.id}.'},
			status=status.HTTP_417_EXPECTATION_FAILED
		)
	logger.info(f"END POST create_text() for user {request.user.id}")
	return response


@api_view(['GET'])
def get_texts_by_tag(request, tag):
	if request.method == 'GET':
		logger.info(f"START GET get_texts_by_tag() for user {request.user.id}")
		data = Text.objects.filter(genres__tag=tag)
		serializer = TextDescriptionSerializer(data, context={'request': request}, many=True)
		if serializer:
			response = Response(data=serializer.data, status=status.HTTP_200_OK)
		else:
			logger.error(serializer.errors)
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


@api_view(['GET'])
def search_tags(request):
	if request.method == 'GET':
		logger.info(f"START GET search_tags() for user {request.user.id}")
		query = request.GET.get('tag_query')
		data = Genre.objects.filter(
			tag__contains=query,
			text_genres__isnull=False,
			text_genres__is_draft=False
		).distinct()
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
		return response


@api_view(['DELETE'])
def delete_comment(request):
	if request.method == 'DELETE':
		data = request.data
		comment_id = data.get('id')
		logger.info(f"START delete_comment({comment_id}) for user {request.user.id}")
		try:
			if request.user.username != data.get('username'):
				message = f'User {request.user.username} is not allowed to delete comment {comment_id}'
				response = Response({"error": message}, status=status.HTTP_403_FORBIDDEN)
			else:
				Comment.objects.get(id=comment_id).delete()
				response = Response(status=status.HTTP_200_OK, data=request.user.username)
		except IntegrityError:
			response = Response(
				{"error": "Something happened, try again later"},
				status=status.HTTP_417_EXPECTATION_FAILED
			)
		logger.info(f"END DELETE delete_comment({comment_id}) for user {request.user.id}")
		return response


@api_view(['GET'])
def get_series_by_user(request, username):
	if request.method == 'GET':
		logger.info(f"START GET get_series_by_user() for user {request.user.id}")
		data = Series.objects.filter(text__author__username=username)
		serializer = SeriesSerializer(data, context={'request': request}, many=True)
		logger.info(f"END GET get_series_by_user() for user {request.user.id}")
		return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_popular_series(request):
	logger.info(f"START get_popular_series() for user {request.user.id}")
	series_with_texts = (
		Series.objects
						 .exclude(text__author=request.user)
						 .exclude(text__isnull=True)
						 .exclude(text__is_draft=True)
	)
	serializer = SeriesSerializer(series_with_texts, context={'request': request}, many=True)
	response = Response(serializer.data, status=status.HTTP_200_OK)
	logger.info(f"END get_popular_series() for user {request.user.id}")
	return response


@api_view()
def get_series(request, pk):
	if request.method == 'GET':
		logger.info(f"START GET get_series() for user {request.user.id}")
		try:
			data = get_object_or_404(Series, id=pk)
			print(data)
			if not data.text.filter(author=request.user).exists():
				data = data.text.filter(is_draft=False)
				print(data)
			serializer = SeriesSerializer(data)
			response = Response(serializer.data, status=status.HTTP_200_OK)

		except Series.DoesNotExist:
			response = Response(
				{"detail": f'No series with an id of {pk} was found.'},
				status=status.HTTP_404_NOT_FOUND
			)
		logger.info(f"END GET get_series() for user {request.user.id}")
		return response


@api_view(['POST'])
def like_text(request, pk):
	logger.info(f"START POST like_text() for user {request.user.id}")
	try:
		liked_text = Text.objects.filter(id=pk).first()
		like = Like.objects.filter(user=request.user, text=liked_text)
		if like:
			response = Response(
				{"error": "This text has already been liked"},
				status=status.HTTP_417_EXPECTATION_FAILED
			)
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
			response = Response(
				{"error": "No like from user " + request.user.id + "for text " + text.id},
				status=status.HTTP_404_NOT_FOUND
			)
		else:
			like.delete()
			response = Response(status=status.HTTP_200_OK, data=request.user.username)
	except IntegrityError:
		response = Response({"error": "Something happened, try again later"}, status=status.HTTP_417_EXPECTATION_FAILED)
	logger.info(f"END POST unlike_text() for user {request.user.id}")
	return response


@api_view(['POST'])
def like_comment(request, pk):
	logger.info(f"START POST like_comment() for user {request.user.id}")
	try:
		liked_comment = Comment.objects.filter(id=pk).first()
		like = CommentLike.objects.filter(user=request.user, comment=liked_comment)
		if like:
			response = Response(
				{"error": "This comment has already been liked"},
				status=status.HTTP_417_EXPECTATION_FAILED
			)
		else:
			new_like = CommentLike.objects.create(user=request.user, comment=liked_comment)
			response = Response(status=status.HTTP_200_OK, data=CommentLikeSerializer(new_like).data)
	except IntegrityError:
		response = Response({"error": "Something happened, try again later"}, status=status.HTTP_417_EXPECTATION_FAILED)
	logger.info(f"END POST like_comment() for user {request.user.id}")
	return response


@api_view(['POST'])
def unlike_comment(request, pk):
	logger.info(f"START POST unlike_comment() for user {request.user.id}")
	try:
		unliked_comment = Comment.objects.filter(id=pk).first()
		like = CommentLike.objects.get(user=request.user, comment=unliked_comment)
		if not like:
			response = Response(
				{"error": "No like from user " + request.user.id + "for comment " + comment.id},
				status=status.HTTP_404_NOT_FOUND
			)
		else:
			like.delete()
			response = Response(status=status.HTTP_200_OK, data=request.user.username)
	except IntegrityError:
		response = Response({"error": "Something happened, try again later"}, status=status.HTTP_417_EXPECTATION_FAILED)
	logger.info(f"END POST unlike_comment() for user {request.user.id}")
	return response


@api_view(['POST'])
def save_text(request, pk):
	logger.info(f"START POST save_text() for user {request.user.id}")
	try:
		saved_text = Text.objects.filter(id=pk).first()
		saved_db = Save.objects.filter(user=request.user, text=saved_text)
		if saved_db:
			response = Response(
				{"error": "This text has already been saved"},
				status=status.HTTP_417_EXPECTATION_FAILED
			)
		else:
			new_save = Save.objects.create(user=request.user, text=saved_text)
			response = Response(status=status.HTTP_200_OK, data=UserSavedTextSerializer(new_save).data)
	except IntegrityError:
		response = Response({"error": "Something happened, try again later"}, status=status.HTTP_417_EXPECTATION_FAILED)
	logger.info(f"END POST save_text() for user {request.user.id}")
	return response


@api_view(['POST'])
def unsave_text(request, pk):
	logger.info(f"START POST unsave_text() for user {request.user.id}")
	try:
		saved_text = Text.objects.filter(id=pk).first()
		save_db = Save.objects.get(user=request.user, text=saved_text)
		if not save_db:
			response = Response(
				{"error": "No save from user " + request.user.id + "for text " + saved_text.id},
				status=status.HTTP_404_NOT_FOUND)
		else:
			save_db.delete()
			response = Response(status=status.HTTP_200_OK, data=request.user.username)
	except IntegrityError:
		response = Response({"error": "Something happened, try again later"}, status=status.HTTP_417_EXPECTATION_FAILED)
	logger.info(f"END POST unsave_text() for user {request.user.id}")
	return response


@api_view(['POST'])
def set_text_bookmark(request):
	logger.info(f"START POST text_bookmark() for user {request.user.id}")
	try:
		new_bookmark = {
			'user': request.user.id,
			'text': request.data.get('text_hash'),
			'position': request.data.get('position')
		}
		serializer = SetBookmarkSerializer(data=new_bookmark, context={'request': request})
		if serializer.is_valid():
			serializer.save()
			response = Response(status=status.HTTP_200_OK)
		else:
			response = Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
	except IntegrityError:
		response = Response(
			{"error": "Something happened, try again later"},
			status=status.HTTP_417_EXPECTATION_FAILED
		)
	logger.info(f"END POST text_bookmark() for user {request.user.id}")
	return response
