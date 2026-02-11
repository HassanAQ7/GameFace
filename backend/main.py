from fastapi import FastAPI
from src.routes.recommendations import recommendations_router
app = FastAPI(
    name="GameFace",
    version="v1",
    description="backend for GameFace project"
)
app.include_router(recommendations_router, prefix=f"/api/v1/recommendations", tags=["recommendations"])
