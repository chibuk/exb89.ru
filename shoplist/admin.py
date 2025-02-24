from django.contrib import admin
from .models import ListItem

# Register your models here.
# admin.site.register(ListItem)

class ListItemAdmin(admin.ModelAdmin):
    list_display = ('name', 'list_name', 'isdone', 'created', 'modified',)  # Поля для отображения в списке
    search_fields = ('name', 'list_name',)  # Поля для поиска

admin.site.register(ListItem, ListItemAdmin)

