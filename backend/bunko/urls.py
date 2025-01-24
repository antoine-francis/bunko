from django.urls import path
from .views import (comment, get_texts, get_texts_by_user, get_series, get_series_by_user, like_text,
					unlike_text, unbookmark_text, bookmark_text, create_text, text, get_texts_by_tag, get_tags)

urlpatterns = [
	# api views

	# text list
	path('texts', get_texts),
	path('texts/<username>', get_texts_by_user),
	path('tag/<tag>', get_texts_by_tag),
	path('tags', get_tags),

	# single text
	path('new_text', create_text),
	path('text/<text_hash>', text),

	# text action
	path('like/<int:pk>', like_text),
	path('unlike/<int:pk>', unlike_text),
	path('bookmark/<int:pk>', bookmark_text),
	path('unbookmark/<int:pk>', unbookmark_text),

	# series
	path('series/<username>', get_series_by_user),
	path('series_id/<int:pk>', get_series),

	# comments
	path('comment/', comment, name="comment"),
]
