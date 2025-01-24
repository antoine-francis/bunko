from django.db import models

from bunko import serializers
from bunko.models import Series


class SeriesManager(models.Manager):
    def update_or_create_series(self, series_data):
        series_id = series_data.get('id', None)
        if series_id:
            try:
                series = self.get(id=series_id)
                for attr, value in series_data.items():
                    setattr(series, attr, value)
                series.save()
            except Series.DoesNotExist:
                raise serializers.ValidationError({"series": "Series with this ID does not exist."})
        else:
            series = self.create(**series_data)
        return series