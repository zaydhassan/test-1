from django.urls import path
from .views import fetch_threat_data,display_threat_data
from .views_2 import fetch_and_store_threat_data,display_threats
from .views_3 import *

urlpatterns = [
    path('fetch_top5_threats/', fetch_threat_data, name='fetch_threat_data'),
    path('display_top5_threats/', display_threat_data, name='display_threat_data'),
    path('fetch/',fetch_and_store_threat_data),
    path('display/',display_threats),
    path('a/<str:start_date>/<str:end_date>/',threat_data_view),
]