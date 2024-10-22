import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

class ThreatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # When a client connects to the WebSocket
        await self.accept()
        await self.channel_layer.group_add('threat_updates', self.channel_name)  # Adds the WebSocket to a group

    async def disconnect(self, close_code):
        # When a client disconnects
        await self.channel_layer.group_discard('threat_updates', self.channel_name)

    async def receive(self, text_data):
        pass  # You can handle incoming WebSocket messages here if needed

    async def send_threat_update(self, event):
        # Send threat data to the WebSocket
        threat_data = event['threat_data']
        await self.send(text_data=json.dumps({
            'threat_data': threat_data  # Send threat data as JSON to frontend
        }))

def push_threat_update(threat_info):
    """Send a WebSocket message to all clients with new threat data."""
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        'threat_updates',  # The group name (all WebSocket clients in this group will receive the message)
        {
            'type': 'send_threat_update',  # This maps to the 'send_threat_update' method in ThreatConsumer
            'threat_data': threat_info
        }
    )
