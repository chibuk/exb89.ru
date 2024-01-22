from django.urls import path
from shoplist import views

urlpatterns = [
    path('', views.shoplist, name='shoplist'),
    path('api/v1/items', views.ListItemAPIModelView.as_view({'post': 'create',
                                                             'get': 'list'}), name='items'),
    path('api/v1/items/<int:pk>', views.ListItemAPIModelView.as_view({'get': 'retrieve',
                                                                     'delete': 'destroy',
                                                                     'patch': 'partial_update'}), name='items'),
]
