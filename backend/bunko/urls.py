from django.urls import path
from .views import (comment, get_texts, get_series, get_series_by_user, like_text,
					unlike_text, like_comment, unlike_comment, unsave_text, save_text, create_text, text,
					get_texts_by_tag, get_tags,
					search_tags, delete_comment, set_text_bookmark, get_popular_series)

urlpatterns = [
	# api views

	# text list
	path('texts', get_texts),
	path('tag/<tag>', get_texts_by_tag),
	path('tags', get_tags),
	path('search_tags', search_tags),

	# single text
	path('new_text', create_text),
	path('text/<text_hash>', text),
	path('bookmark', set_text_bookmark),

	# text action
	path('like/<int:pk>', like_text),
	path('unlike/<int:pk>', unlike_text),
	path('like_comment/<int:pk>', like_comment),
	path('unlike_comment/<int:pk>', unlike_comment),
	path('save/<int:pk>', save_text),
	path('unsave/<int:pk>', unsave_text),

	# series
	path('series/<username>', get_series_by_user),
	path('popular_series', get_popular_series),
	path('series_id/<int:pk>', get_series),

	# comments
	path('comment', comment, name="comment"),
	path('delete_comment', delete_comment)
]
