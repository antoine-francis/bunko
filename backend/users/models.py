from datetime import datetime

from django.core.exceptions import ValidationError
from django.db import models
from django.contrib.auth.models import User
from PIL import Image
from django.utils import timezone


class Subscription(models.Model):
	follower = models.ForeignKey(User, on_delete=models.CASCADE, related_name='subscriptions_following')
	following = models.ForeignKey(User, on_delete=models.CASCADE, related_name='subscriptions_followed')
	follow_date = models.DateTimeField(default=timezone.now)

	def clean(self):
		if not self.follower or not self.following:
			raise ValidationError("Both follower and following fields must be provided")
		if self.following == self.follower:
			raise ValidationError("A user cannot follow themselves")

	def save(self, *args, **kwargs):
		# Call the clean method before saving to enforce the validation
		self.clean()
		super().save(*args, **kwargs)

	def __str__(self):
		d = datetime.now
		return f'{self.following} followed by {self.follower} since {self.follow_date}'


class Profile(models.Model):
	user = models.OneToOneField(User, on_delete=models.CASCADE)
	picture = models.ImageField(default='default-bunko.jpg', upload_to='profile_pics')
	bio = models.CharField(max_length=255, blank=True)
	signup_date = models.DateTimeField(default=timezone.now)

	def __str__(self):
		return f'{self.user.username}'
	
	def save(self, *args, **kwargs):
		super().save(*args, **kwargs)

		if self.picture and not self.picture.name.endswith('default-bunko.jpg'):
			img = Image.open(self.picture.path)
			if img.height > 300 or img.width > 300:
				output_size = (300, 300)
				img.thumbnail(output_size)
				img.convert('RGB').save(self.picture.path)


class Collective(models.Model):
	name = models.CharField(max_length=50)
	description = models.CharField(max_length=255)
	creation_date = models.DateTimeField(default=timezone.now)
	picture = models.ImageField(default='default-bunko.jpg', upload_to='profile_pics')
	creator = models.ForeignKey(User, blank=True, null=True, on_delete=models.SET_NULL, related_name='collective_creator')
	members = models.ManyToManyField(User, through="Membership", related_name="members")

	def __str__(self):
		return f'{self.name}'


class Membership(models.Model):
	user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="member")
	collective = models.ForeignKey(Collective, on_delete=models.CASCADE, related_name="collective")
	join_date = models.DateTimeField(default=timezone.now)
	is_admin = models.BooleanField(default=False)
	is_starred_member = models.BooleanField(default=False)

