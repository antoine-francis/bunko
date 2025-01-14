from django.contrib.auth.models import User
from django.utils import timezone
from rest_framework import serializers

from .models import Text, Comment, Like, Genre, Bookmark, Series, Favorite


class AuthorSerializer(serializers.ModelSerializer):
	class Meta:
		model = User
		fields = ['first_name', 'last_name', 'username']


class ReplySerializer(serializers.ModelSerializer):
	author = AuthorSerializer()

	class Meta:
		model = Comment
		fields = ['id', 'content', 'creation_date', 'modification_date', 'author']


class CommentSerializer(serializers.ModelSerializer):
	author = AuthorSerializer()
	replies = serializers.SerializerMethodField()
	text = serializers.SerializerMethodField()

	class Meta:
		model = Comment
		fields = ['id', 'content', 'creation_date', 'replies', 'modification_date', 'text', 'author']

	def get_replies(self, obj):
		return ReplySerializer(Comment.objects.filter(parent=obj), many=True).data

	def get_text(self, obj):
		return obj.text.hash


class NewCommentSerializer(serializers.ModelSerializer):
	author = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
	text = serializers.PrimaryKeyRelatedField(queryset=Text.objects.all())
	parent = serializers.PrimaryKeyRelatedField(queryset=Comment.objects.all(), allow_null=True)

	class Meta:
		model = Comment
		fields = ['author', 'text', 'content', 'parent']


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
		fields = ['title', 'author', 'series', 'series_entry', 'is_draft', 'creation_date', 'modification_date',
				  'publication_date', 'content', 'hash']

	def get_author(self, obj):
		return AuthorSerializer(obj.author).data


class SeriesReadSerializer(serializers.ModelSerializer):
	entries = serializers.SerializerMethodField()

	class Meta:
		model = Series
		fields = ['title', 'picture', 'entries', 'id']

	def get_entries(self, obj):
		return MinimalTextSerializer(Text.objects.filter(series=obj), many=True).data


class SeriesCreateSerializer(serializers.ModelSerializer):

	class Meta:
		model = Series
		fields = ['title']



class BookmarkSerializer(serializers.ModelSerializer):
	text = MinimalTextSerializer()

	class Meta:
		model = Bookmark
		fields = ['text', 'user', 'bookmark_date']


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


class NewTextSerializer(serializers.ModelSerializer):
	author = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
	series = serializers.PrimaryKeyRelatedField(queryset=Series.objects.all(), allow_null=True)
	genres = GenreTagSerializer(many=True, allow_null=True)

	class Meta:
		model = Text
		fields = ['content', 'author', 'series', 'series_entry', 'genres', 'title']

	def create(self, validated_data):
		genres_data = validated_data.pop('genres', [])
		text = Text.objects.create(**validated_data)
		genres = []
		for g in genres_data:
			genre_tag = g.pop('tag')
			genre, created = Genre.objects.get_or_create(tag=genre_tag)
			genres.append(genre)
		text.genres.add(*genres)
		return text


class TextEditSerializer(serializers.ModelSerializer):
	author = AuthorSerializer(read_only=True)
	series = SeriesReadSerializer()
	genres = GenreTagSerializer(many=True, allow_null=True)

	class Meta:
		model = Text
		fields = ['content', 'author', 'series', 'series_entry', 'genres', 'title', 'hash', 'is_draft']

	def create(self, validated_data):
		genres_data = validated_data.pop('genres', [])
		text = Text.objects.get(hash=validated_data.get('hash'))
		if text.publication_date is None and not validated_data.get('is_draft'):
			validated_data['publication_date'] = timezone.now()

		for attr, value in validated_data.items():
			setattr(text, attr, value)

		genres = []
		for g in genres_data:
			genre_tag = g.pop('tag')
			genre, created = Genre.objects.get_or_create(tag=genre_tag)
			genres.append(genre)
		text.genres.add(*genres)
		text.save()
		return text


class TextSerializer(serializers.ModelSerializer):
	comments = serializers.SerializerMethodField()
	likes = serializers.SerializerMethodField()
	genres = GenreTagSerializer(many=True)
	author = AuthorSerializer()
	series = SeriesReadSerializer(allow_null=True)
	bookmarked_by = serializers.SerializerMethodField()
	favorited_by = serializers.SerializerMethodField()

	class Meta:
		model = Text
		fields = ['title', 'content', 'author', 'is_draft', 'comments', 'likes', 'bookmarked_by', 'favorited_by', 'hash',
				  'series', 'series_entry', 'synopsis', 'genres', 'id', 'creation_date', 'modification_date', 'publication_date']

	def get_likes(self, obj):
		return LikeSerializer(Like.objects.filter(text=obj), many=True).data

	def get_bookmarked_by(self, obj):
		return UserBookmarkSerializer(Bookmark.objects.filter(text=obj), many=True).data

	def get_favorited_by(self, obj):
		return FavoriteSerializer(Favorite.objects.filter(text=obj), many=True).data

	def get_comments(self, obj):
		return CommentSerializer(Comment.objects.filter(text=obj, parent__isnull=True), many=True).data


class GenreSerializer(serializers.ModelSerializer):
	texts = TextSerializer(many=True)
	text_count = serializers.IntegerField(
		source="genre",
		read_only=True
	)

	class Meta:
		model = Genre
		fields = ['tag', 'text_count']
