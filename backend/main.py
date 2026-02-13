from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.routes.recommendations import recommendations_router

app = FastAPI(
    name="GameFace",
    version="v1",
    description="backend for GameFace project"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(recommendations_router, prefix="/api/v1/recommendations", tags=["recommendations"])
