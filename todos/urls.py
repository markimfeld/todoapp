from django.urls import path

from . import views

urlpatterns = [
    path('', views.index),
    path('delete_one/<int:pk>/', views.delete_one),
    path('change-status/<int:pk>/', views.change_status)
]