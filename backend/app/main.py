from fastapi import FastAPI, WebSocket, Depends
from .routers import auth, messages, files
from .websocket_manager import manager
from app.auth_utils import get_current_user
from app.routers import users

app = FastAPI()
app.include_router(auth.router)
app.include_router(messages.router)
app.include_router(files.router)
app.include_router(users.router)

@app.get("/")
def root():
    return {"message": "Backend is running 🚀"}

@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: int):
    # В production перевірка токена в query params або header потрібна
    await manager.connect(user_id, websocket)
    try:
        while True:
            data = await websocket.receive_json()
            # обробка: наприклад, прямі повідомлення (forward) або typing events
            # data = {'type': 'message', 'to': receiver_id, 'content': '...'}
            if data.get("type") == "message":
                to = data["to"]
                await manager.send_personal_message(to, data)
    except Exception:
        manager.disconnect(user_id)