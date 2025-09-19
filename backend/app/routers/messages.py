from typing import Dict, List
from fastapi import WebSocket
from fastapi import APIRouter

router = APIRouter(
    prefix="/messages",
    tags=["messages"]
)

@router.get("/")
async def get_messages():
    return {"message": "Here will be messages"}

class ConnectionManager:
    def __init__(self):
        # map user_id -> websocket
        self.active_connections: Dict[int, WebSocket] = {}

    async def connect(self, user_id: int, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[user_id] = websocket

    def disconnect(self, user_id: int):
        if user_id in self.active_connections:
            del self.active_connections[user_id]

    async def send_personal_message(self, user_id: int, message: dict):
        ws = self.active_connections.get(user_id)
        if ws:
            await ws.send_json(message)

manager = ConnectionManager()