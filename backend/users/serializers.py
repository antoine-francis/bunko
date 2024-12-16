from django.contrib.auth.models import User
from rest_framework import serializers

from bunko.models import Bookmark, Text, Favorite
from bunko.serializers import BookmarkSerializer, MinimalTextSerializer
from users.models import Profile, Subscription, Membership, Collective


class UserSerializer(serializers.ModelSerializer):
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
	bookmarks = serializers.SerializerMethodField()
	user = UserSerializer()
	collectives = serializers.SerializerMethodField()
	texts = serializers.SerializerMethodField()
	favorites = serializers.SerializerMethodField()

	class Meta:
		model = Profile
		fields = ['user', 'picture', 'bio', 'signup_date', 'followers', 'following', 'bookmarks', 'favorites', 'collectives', 'texts']

	def get_followers(self, obj):
		return SubscriptionFollowersSerializer(Subscription.objects.filter(following=obj.user), many=True).data

	def get_following(self, obj):
		return SubscriptionFollowingSerializer(Subscription.objects.filter(follower=obj.user), many=True).data

	def get_bookmarks(self, obj):
		return BookmarkSerializer(Bookmark.objects.filter(user=obj.user), many=True).data

	def get_collectives(self, obj):
		return MembershipSerializer(Membership.objects.filter(user=obj.user), many=True).data

	def get_texts(self, obj):
		request = self.context['request']
		if request.user == obj.user:
			return MinimalTextSerializer(Text.objects.filter(author=obj.user), many=True).data
		else:
			return MinimalTextSerializer(Text.objects.filter(author=obj.user, is_draft=False), many=True).data

	def get_favorites(self, obj):
		return MinimalTextSerializer(Favorite.objects.filter(user=obj.user), many=True).data


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
