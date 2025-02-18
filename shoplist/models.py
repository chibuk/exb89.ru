from django.db import models
from django.urls import reverse


# Create your models here.
class ListItem(models.Model):
    """Элемент списка покупок: наименование, выполнено, удалено, дата_создания, редактирования и удаления"""
    name = models.CharField("Наименование", max_length=128, help_text='Наименование')
    isdone = models.BooleanField("Выполнено", default=False, help_text="Пометка выполнения")
    isdeleted = models.BooleanField("Удалено", default=False, help_text="Пометка удаления")
    created = models.DateTimeField("Создано", auto_now_add=True)
    modified = models.DateTimeField("Последнее изменение", auto_now=True)
    # deleted = models.DateTimeField("Дата удаления", auto_now_add=True) # поле не нужно т.к.,
    # если isdeleted=True, то modified укажет дату удаления. Помеченные на удаление редактировать будет нельзя.
    list_name = models.CharField("Список", max_length=50, default='') # наименование списка, к которому относится элемент

    class Meta:
        verbose_name = "Элемент списка покупок"
        verbose_name_plural = "Элементы списка покупок"

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse('listitem', kwargs={'pk': self.pk})

