from django.shortcuts import render
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from shoplist.models import ListItem
from shoplist.serializers import ListItemSerializer


def shoplist(request):
    return render(request, 'shoplist.html')


class ListItemAPIModelView(ModelViewSet):
    serializer_class = ListItemSerializer
    queryset = ListItem.objects.all()
    renderer_classes = [JSONRenderer]

    def list(self, request, *args, **kwargs):
        """Модификация list для фильтрации и сортировки.
            Параметр o - порядок сортировки (например o=id или o=-name)
            Остальное фильтрация, например name=Мука"""
        order = request.GET.getlist("o", ["id"])  # поле сортировки
        filter_dict = request.GET.dict()  # QureyDict -> Dict, теперь из него удалим не нужное
        pop_order = filter_dict.pop('o', '')  # удаляем так (а не del), чтобы не выкидывало исключение
        list_name = filter_dict.pop('list_name', '')
        myfilter = {}
        for key in filter_dict.keys():
            myfilter[key + "__icontains"] = filter_dict[key]
        queryset = self.filter_queryset(self.get_queryset().filter(**myfilter)
                                        .order_by(*order)).filter(list_name=list_name)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
