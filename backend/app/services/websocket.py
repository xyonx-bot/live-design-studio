from typing import Dict, Set
from fastapi import WebSocket
import asyncio
import json


class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, Set[WebSocket]] = {}
    
    async def connect(self, websocket: WebSocket, channel: str = "default"):
        await websocket.accept()
        if channel not in self.active_connections:
            self.active_connections[channel] = set()
        self.active_connections[channel].add(websocket)
    
    def disconnect(self, websocket: WebSocket, channel: str = "default"):
        if channel in self.active_connections:
            self.active_connections[channel].discard(websocket)
            if not self.active_connections[channel]:
                del self.active_connections[channel]
    
    async def send_personal_message(self, message: dict, websocket: WebSocket):
        await websocket.send_json(message)
    
    async def broadcast(self, message: dict, channel: str = "default"):
        if channel in self.active_connections:
            dead = set()
            for connection in self.active_connections[channel]:
                try:
                    await connection.send_json(message)
                except Exception:
                    dead.add(connection)
            for d in dead:
                self.disconnect(d, channel)
    
    async def broadcast_event(self, event_type: str, payload: dict, channel: str = "default"):
        message = {"type": event_type, "payload": payload, "channel": channel}
        await self.broadcast(message, channel)


manager = ConnectionManager()