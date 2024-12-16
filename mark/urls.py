from django.urls import path
from mark import views

urlpatterns = [
    path('sgo', views.sgo, name='sgo'),
    path('sgo/dnevnik', views.dnevnik, name='dnevnik'),
    path('sgo/otchoti', views.otchoti, name='otchoti'),
    path('sgo/obratnaya', views.obratnaya, name='obratnaya'),
]
