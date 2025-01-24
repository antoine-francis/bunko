from django.core.exceptions import ValidationError
from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User
from django.urls import reverse
from nanoid_field import NanoidField


class Like(models.Model):
	user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user")
	text = models.ForeignKey('Text', on_delete=models.CASCADE, related_name='liked_text')
	liked_date = models.DateTimeField(default=timezone.now)

	def clean(self):
		# Ensure that both user and text are set
		if not self.user:
			raise ValidationError('User must be provided')
		if not self.text:
			raise ValidationError('Text must be provided')

	def save(self, *args, **kwargs):
		# Call the clean method before saving to enforce the validation
		self.clean()
		super().save(*args, **kwargs)

	def __str__(self):
		return f'{self.text} liked by {self.user}'


class Genre(models.Model):
	tag = models.CharField(max_length=60)

	def __str__(self):
		return f'{self.tag}'


class Series(models.Model):
	title = models.CharField(max_length=255)
	synopsis = models.CharField(max_length=255, blank=True, null=True)

	def __str__(self):
		return f'title: {self.title}'


class Text(models.Model):
	title = models.CharField(max_length=255, blank=True, null=True)
	content = models.TextField()
	synopsis = models.CharField(max_length=255, blank=True, null=True)
	is_draft = models.BooleanField(default=True)
	series = models.ForeignKey(Series, blank=True, null=True, on_delete=models.SET_NULL)
	series_entry = models.IntegerField(blank=True, null=True)
	author = models.ForeignKey(User, on_delete=models.CASCADE)
	likes = models.ManyToManyField(User, related_name="likes", through='Like')
	version = models.IntegerField(default=1)
	creation_date = models.DateTimeField(default=timezone.now)
	publication_date = models.DateTimeField(blank=True, null=True)
	modification_date = models.DateTimeField(auto_now=True)
	genres = models.ManyToManyField(Genre, related_name="genres")
	hash = NanoidField(max_length=21, alphabet='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz')

	def __str__(self):
		return (f'title: {self.title}, author: {self.author}, creation: {self.creation_date},'
				f' is_draft: {self.is_draft}, version: {self.version}')

	def get_absolute_url(self):
		return reverse('texte-detail', kwargs={'pk': self.pk})


class Comment(models.Model):
	text = models.ForeignKey(Text, on_delete=models.CASCADE, related_name="comments")
	parent = models.ForeignKey('self', null=True, on_delete=models.CASCADE)
	author = models.ForeignKey(User, on_delete=models.CASCADE)
	content = models.TextField()
	creation_date = models.DateTimeField(default=timezone.now)
	modification_date = models.DateTimeField(auto_now=True)

	def __str__(self):
		return f'{self.author.username} - {self.text.id} - {self.content[:10]}... - {self.creation_date}'


class Bookmark(models.Model):
	text = models.ForeignKey(Text, on_delete=models.CASCADE, related_name="bookmarked_text")
	user = models.ForeignKey(User, on_delete=models.CASCADE)
	bookmark_date = models.DateTimeField(default=timezone.now)


class Favorite(models.Model):
	text = models.ForeignKey(Text, on_delete=models.CASCADE, related_name="favorite_text")
	user = models.ForeignKey(User, on_delete=models.CASCADE)
	favorite_date = models.DateTimeField(default=timezone.now)