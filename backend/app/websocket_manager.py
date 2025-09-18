from typing import Dict
from fastapi import WebSocket


class ConnectionManager:
    def __init__(self):
        # map of user_id -> websocket
        self.active: Dict[int, WebSocket] = {}


async def connect(self, user_id: int, websocket: WebSocket):
    await websocket.accept()
    self.active[user_id] = websocket


def disconnect(self, user_id: int):
    self.active.pop(user_id, None)


async def send_to_user(self, user_id: int, message: dict):
    ws = self.active.get(user_id)
    if ws:
        try:
            await ws.send_json(message)
        except Exception:
            self.disconnect(user_id)


manager = ConnectionManager()
