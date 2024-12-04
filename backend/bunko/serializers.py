from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Text, Comment, Like, Genre, Bookmark, Series, Favorite


class AuthorSerializer(serializers.ModelSerializer):
	class Meta:
		model = User
		fields = ['first_name', 'last_name', 'username']


class CommentSerializer(serializers.ModelSerializer):
	author = AuthorSerializer()

	class Meta:
		model = Comment
		fields = ['id', 'content', 'creation_date', 'parent', 'modification_date', 'author']


class LikeSerializer(serializers.ModelSerializer):
	user = AuthorSerializer()

	class Meta:
		model = Like
		fields = ['user', 'liked_date']


class GenreTagSerializer(serializers.ModelSerializer):
	class Meta:
		model = Genre
		fields = ['tag']


class SeriesNameSerializer(serializers.ModelSerializer):
	class Meta:
		model = Series
		fields = '__all__'

class MinimalTextSerializer(serializers.ModelSerializer):
	author = serializers.SerializerMethodField()
	series = SeriesNameSerializer()

	class Meta:
		model = Text
		fields = ['title', 'author', 'series', 'series_entry']

	def get_author(self, obj):
		return AuthorSerializer(obj.author).data


class SeriesSerializer(serializers.ModelSerializer):
	entries = serializers.SerializerMethodField()

	class Meta:
		model = Series
		fields = ['title', 'picture', 'entries', 'id']

	def get_entries(self, obj):
		return MinimalTextSerializer(Text.objects.filter(series=obj), many=True).data


class BookmarkSerializer(serializers.ModelSerializer):
	text = MinimalTextSerializer()

	class Meta:
		model = Bookmark
		fields = ['text', 'bookmark_date']


class UserBookmarkSerializer(serializers.ModelSerializer):
	user = AuthorSerializer()

	class Meta:
		model = Bookmark
		fields = ['user', 'bookmark_date']


class FavoriteSerializer(serializers.ModelSerializer):
	user = AuthorSerializer()

	class Meta:
		model = Bookmark
		fields = ['user', 'favorite_date']

class TextSerializer(serializers.ModelSerializer):
	comments = CommentSerializer(many=True)
	likes = serializers.SerializerMethodField()
	genres = GenreTagSerializer(many=True)
	author = AuthorSerializer()
	series = SeriesSerializer()
	bookmarked_by = serializers.SerializerMethodField()
	favorited_by = serializers.SerializerMethodField()

	class Meta:
		model = Text
		fields = ['title', 'content', 'author', 'is_draft', 'comments', 'likes', 'bookmarked_by', 'favorited_by',
				  'series', 'series_entry', 'genres', 'id']

	def get_likes(self, obj):
		return LikeSerializer(Like.objects.filter(text=obj), many=True).data

	def get_bookmarked_by(self, obj):
		return UserBookmarkSerializer(Bookmark.objects.filter(text=obj), many=True).data

	def get_favorited_by(self, obj):
		return FavoriteSerializer(Favorite.objects.filter(text=obj), many=True).data


class GenreSerializer(serializers.ModelSerializer):
	texts = TextSerializer(many=True)
	text_count = serializers.IntegerField(
		source="genre",
		read_only=True
	)

	class Meta:
		model = Genre
		fields = ['tag', 'text_count']
