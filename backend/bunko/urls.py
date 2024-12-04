from django.urls import path
from .views import (TextListView, TextDetailView, TextCreateView, TextUpdateView, TextDeleteView,
					comment, get_texts, get_texts_by_user, get_series, get_series_by_user, get_text_by_id)

urlpatterns = [
	path('', TextListView.as_view(), name="bunko-home"),
	# views django (désuettes)
	path('texte/<int:pk>/', TextDetailView.as_view(), name="texte-detail"),
	path('texte/nouveau/', TextCreateView.as_view(), name="texte-creer"),
	path('texte/modifier/<int:pk>/', TextUpdateView.as_view(), name="texte-modifier"),
	path('texte/supprimer/<int:pk>/', TextDeleteView.as_view(), name="texte-supprimer"),
	# api views
	path('texts', get_texts),
	path('text/<int:pk>', get_text_by_id),
	path('texts/<username>', get_texts_by_user),
	path('series/<username>', get_series_by_user),
	path('series_id/<int:pk>', get_series),

	# Commentaires
	path('comment/', comment, name="comment"),
]
