from django.shortcuts import render

# Create your views here.

def sgo(request):
    return render(request, "sgo.html")

def dnevnik(request):
    return render(request, "dnevnik.html")

def otchoti(request):
    return render(request, "otchoti.html")

def obratnaya(request):
    return render(request, "obratnaya.html")
