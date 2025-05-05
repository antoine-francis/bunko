import logging

from django.contrib.auth.models import User
from rest_framework import serializers

from bunko.models import Save, Text, Favorite, Series
from bunko.serializers import SavedTextSerializer, TextDescriptionSerializer, SeriesSerializer
from users.models import Profile, Subscription, Membership, Collective

logger = logging.getLogger(__name__)


class ProfilePictureSerializer(serializers.Serializer):
	picture = serializers.ImageField(required=False)
	class Meta:
		model = Profile
		fields = ['picture']


class UserSerializer(serializers.ModelSerializer):
	picture = serializers.SerializerMethodField()

	class Meta:
		model = User
		fields = ['first_name', 'last_name', 'username', 'email', 'picture']

	def get_picture(self, obj):
		try:
			profile = Profile.objects.get(user=obj)
			return profile.picture.url  # Assuming 'picture' is an ImageField or FileField
		except Profile.DoesNotExist:
			return None


class ReducedProfileSerializer(serializers.ModelSerializer):
	user = UserSerializer()

	class Meta:
		model = Profile
		fields = ["user"]


class CollectiveSerializer(serializers.ModelSerializer):
	members = serializers.SerializerMethodField()

	class Meta:
		model = Collective
		fields = ["id", "name", "picture", "description", "creation_date", "members"]

	def get_members(self, obj):
		return UserMembershipSerializer(Membership.objects.filter(collective=obj), many=True).data


class MembershipSerializer(serializers.ModelSerializer):
	collective = CollectiveSerializer()

	class Meta:
		model = Membership
		fields = ["join_date", "is_admin", "is_starred_member", "collective"]


class ProfileSerializer(serializers.ModelSerializer):
	followers = serializers.SerializerMethodField()
	following = serializers.SerializerMethodField()
	saves = serializers.SerializerMethodField()
	series = serializers.SerializerMethodField()
	user = UserSerializer()
	collectives = serializers.SerializerMethodField()
	texts = serializers.SerializerMethodField()
	favorites = serializers.SerializerMethodField()

	class Meta:
		model = Profile
		fields = ['user', 'picture', 'bio', 'signup_date', 'followers', 'following', 'saves', 'series', 'favorites', 'collectives', 'texts']

	def get_followers(self, obj):
		return SubscriptionFollowersSerializer(Subscription.objects.filter(following=obj.user), many=True).data

	def get_following(self, obj):
		return SubscriptionFollowingSerializer(Subscription.objects.filter(follower=obj.user), many=True).data

	def get_saves(self, obj):
		return SavedTextSerializer(Save.objects.filter(user=obj.user, text__is_draft=False), many=True).data

	def get_series(self, obj):
		return SeriesSerializer(Series.objects.filter(text__author=obj.user).distinct(), many=True).data

	def get_collectives(self, obj):
		return MembershipSerializer(Membership.objects.filter(user=obj.user), many=True).data

	def get_texts(self, obj):
		request = self.context['request']
		if request.user == obj.user:
			return TextDescriptionSerializer(Text.objects.filter(author=obj.user), many=True).data
		else:
			return TextDescriptionSerializer(Text.objects.filter(author=obj.user, is_draft=False), many=True).data

	def get_favorites(self, obj):
		return TextDescriptionSerializer(Favorite.objects.filter(user=obj.user), many=True).data


class UserMembershipSerializer(serializers.ModelSerializer):
	user = UserSerializer()

	class Meta:
		model = Membership
		fields = ["join_date", "is_admin", "is_starred_member", "user"]


class CollectiveDetailedSerializer(serializers.ModelSerializer):
	members = serializers.SerializerMethodField()

	class Meta:
		model = Collective
		fields = ["id", "name", "description", "creation_date", "picture", "creator", "members"]

	def get_members(self, obj):
		return UserMembershipSerializer(Membership.objects.filter(collective=obj), many=True).data


class SubscriptionFollowersSerializer(serializers.ModelSerializer):
	user = UserSerializer(source="follower")

	class Meta:
		model = Subscription
		fields = ['user', 'follow_date']


class SubscriptionFollowingSerializer(serializers.ModelSerializer):
	user = UserSerializer(source="following")

	class Meta:
		model = Subscription
		fields = ['user', 'follow_date']
