from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
from typing import List
from app import schemas, models, auth
from app.db import AsyncSessionLocal
from sqlalchemy.future import select
from app.websocket_manager import manager


router = APIRouter()


@router.get("/conversations", response_model=List[schemas.UserOut])
async def list_users(current_user=Depends(auth.get_current_user)):
    async with AsyncSessionLocal() as db:
        q = await db.execute(select(models.User).filter(models.User.id != current_user.id))
        users = q.scalars().all()
        return users


@router.get("/{user_id}", response_model=List[schemas.MessageOut])
async def get_conversation(user_id: int, current_user=Depends(auth.get_current_user)):
    async with AsyncSessionLocal() as db:
        q = await db.execute(select(models.Message).filter(
            ((models.Message.sender_id == current_user.id) & (models.Message.receiver_id == user_id)) |
            ((models.Message.sender_id == user_id) & (models.Message.receiver_id == current_user.id))
        ).order_by(models.Message.created_at))
        messages = q.scalars().all()
        return messages


# WebSocket endpoint for realtime
@router.websocket("/ws/{user_id}")
async def ws_endpoint(websocket: WebSocket, user_id: int, token: str):
    # token should be validated; simplified here: decode and get username
    # In production, validate token properly and map username -> user id
    await manager.connect(user_id, websocket)
    try:
        while True:
            data = await websocket.receive_json()
            # Expected: {"type": "message", "to": <id>, "content": "..."}
            if data.get("type") == "message":
                payload = {
                    "type": "message",
                    "from": user_id,
                    "to": data.get("to"),
                    "content": data.get("content"),
                }
                await manager.send_to_user(data.get("to"), payload)
    except WebSocketDisconnect:
        manager.disconnect(user_id)