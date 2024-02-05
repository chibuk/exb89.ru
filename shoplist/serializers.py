from rest_framework import serializers
from .models import ListItem


class ListItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ListItem
        exclude = ['isdeleted']

    def validate_name(self, value):
        return value.strip()