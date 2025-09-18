from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from app.db import init_db
from app.routers import auth as auth_router, messages as messages_router, files as files_router


app = FastAPI(title="Connection - Messenger Backend")


# CORS for dev (adjust origins in prod)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def on_startup():
    await init_db()


app.include_router(auth_router.router, prefix="/auth", tags=["auth"])
app.include_router(messages_router.router, prefix="/messages", tags=["messages"])
app.include_router(files_router.router, prefix="/files", tags=["files"])


@app.get("/")
def root():
    return {"message": "Connection backend is running"}
