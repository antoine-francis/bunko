from django.contrib.auth.models import User
from django.utils import timezone
from rest_framework import serializers

from users.models import Profile
from .models import Text, Comment, Like, Genre, Save, Series, Favorite, CommentLike, Bookmark


class AuthorSerializer(serializers.ModelSerializer):
	picture = serializers.SerializerMethodField()
	class Meta:
		model = User
		fields = ['first_name', 'last_name', 'username', 'picture']

	def get_picture(self, obj):
		try:
			profile = Profile.objects.get(user=obj)
			return profile.picture.url  # Assuming 'picture' is an ImageField or FileField
		except Profile.DoesNotExist:
			return None


class ReplySerializer(serializers.ModelSerializer):
	author = AuthorSerializer()

	class Meta:
		model = Comment
		fields = ['id', 'content', 'creation_date', 'modification_date', 'author', 'parent']


class CommentLikeSerializer(serializers.ModelSerializer):
	user = AuthorSerializer()

	class Meta:
		model = CommentLike
		fields = ['user', 'liked_date']


class CommentSerializer(serializers.ModelSerializer):
	author = AuthorSerializer()
	replies = serializers.SerializerMethodField()
	text = serializers.SerializerMethodField()
	likes = serializers.SerializerMethodField()

	class Meta:
		model = Comment
		fields = ['id', 'content', 'creation_date', 'replies', 'modification_date', 'parent', 'likes', 'text', 'author']

	def get_replies(self, obj):
		return CommentSerializer(Comment.objects.filter(parent=obj), many=True).data

	def get_likes(self, obj):
		return CommentLikeSerializer(CommentLike.objects.filter(comment=obj), many=True).data

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


class TextsByTagSerializer(serializers.ModelSerializer):
	texts = serializers.SerializerMethodField()
	class Meta:
		model = Genre
		fields = '__all__'
		# fields = ['tag']

	def get_texts(self, obj):
		return MinimalTextSerializer(Text.objects.filter(genres=obj.id), many=True).data


class SeriesNameSerializer(serializers.ModelSerializer):
	class Meta:
		model = Series
		fields = '__all__'


class MinimalTextSerializer(serializers.ModelSerializer):
	author = AuthorSerializer()

	class Meta:
		model = Text
		fields = ['author', 'title', 'hash']

class TextDescriptionSerializer(serializers.ModelSerializer):
	author = serializers.SerializerMethodField()
	series = SeriesNameSerializer()
	genres = GenreTagSerializer(many=True, allow_null=True)

	class Meta:
		model = Text
		fields = ['title', 'author', 'series', 'series_entry', 'genres', 'synopsis', 'is_draft', 'creation_date', 'modification_date',
				  'publication_date', 'content', 'hash']

	def get_author(self, obj):
		return AuthorSerializer(obj.author).data


class SeriesTitleSerializer(serializers.ModelSerializer):
	class Meta:
		model = Series
		fields = ['title', 'synopsis']


class SeriesSerializer(serializers.ModelSerializer):
	entries = serializers.SerializerMethodField()

	class Meta:
		model = Series
		fields = ['title', 'synopsis', 'entries', 'id']

	def get_entries(self, obj):
		return TextDescriptionSerializer(Text.objects.filter(series=obj), many=True).data


class SeriesCreateSerializer(serializers.ModelSerializer):

	class Meta:
		model = Series
		fields = ['title', 'id', 'entries']


class SavedTextSerializer(serializers.ModelSerializer):
	text = TextDescriptionSerializer()

	class Meta:
		model = Save
		fields = ['text', 'user', 'save_date']


class UserSavedTextSerializer(serializers.ModelSerializer):
	user = AuthorSerializer()

	class Meta:
		model = Save
		fields = ['user', 'save_date']


class FavoriteSerializer(serializers.ModelSerializer):
	user = AuthorSerializer()

	class Meta:
		model = Save
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
	series = serializers.PrimaryKeyRelatedField(queryset=Series.objects.all(), allow_null=True)
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
	series = SeriesSerializer(allow_null=True)
	saved_by = serializers.SerializerMethodField()
	favorited_by = serializers.SerializerMethodField()
	bookmark_position = serializers.SerializerMethodField(allow_null=True)

	class Meta:
		model = Text
		fields = ['title', 'content', 'author', 'is_draft', 'comments', 'likes', 'saved_by', 'favorited_by', 'hash', 'bookmark_position',
				  'series', 'series_entry', 'synopsis', 'genres', 'id', 'creation_date', 'modification_date', 'publication_date']

	def get_likes(self, obj):
		return LikeSerializer(Like.objects.filter(text=obj), many=True).data

	def get_saved_by(self, obj):
		return UserSavedTextSerializer(Save.objects.filter(text=obj), many=True).data

	def get_favorited_by(self, obj):
		return FavoriteSerializer(Favorite.objects.filter(text=obj), many=True).data

	def get_comments(self, obj):
		return CommentSerializer(Comment.objects.filter(text=obj, parent__isnull=True), many=True).data

	def get_bookmark_position(self, obj):
		bookmark = Bookmark.objects.filter(text=obj, user=self.context.get('request').user)
		if bookmark:
			return bookmark.position
		else:
			return None


class SetBookmarkSerializer(serializers.ModelSerializer):
	user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), write_only=True)
	text = serializers.SlugRelatedField(queryset=Text.objects.all(), slug_field='hash', write_only=True)
	position = serializers.IntegerField(write_only=True)

	class Meta:
		model = Bookmark
		fields = ['user', 'text', 'position']

	def create(self, validated_data):
		bookmark_db = Bookmark.objects.filter(user=validated_data.get('user'), text=validated_data.get('text'))
		if bookmark_db:
			bookmark_db.update(position=validated_data.get('position'))
			return bookmark_db
		else:
			return Bookmark.objects.create(
				user=validated_data.get('user'),
				text=validated_data.get('text'),
				position=validated_data.get('position')
			)


class GenreSerializer(serializers.ModelSerializer):
	texts = TextSerializer(many=True)
	text_count = serializers.IntegerField(
		source="genre",
		read_only=True
	)

	class Meta:
		model = Genre
		fields = ['tag', 'text_count']
