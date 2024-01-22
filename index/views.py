from django.shortcuts import render


# Create your views here.


def index(request):
    return render(request, 'index.html')


def range(request):
    return render(request, 'range-selector.html')


