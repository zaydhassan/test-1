from django.urls import re_path
from threatapp.consumers import ThreatConsumer

websocket_urlpatterns = [
    re_path('ws/threats/', ThreatConsumer.as_asgi()),
]
