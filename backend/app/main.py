from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.api.routes import router
from app.database import init_db


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncGenerator[None, None]:
    init_db()
    yield


app = FastAPI(
    title="Personal Book Library API",
    version="0.1.0",
    description="Backend API for the Personal Book Library project.",
    lifespan=lifespan,
)

app.include_router(router)


@app.get("/", tags=["root"])
def read_root() -> dict[str, str]:
    return {"message": "Personal Book Library API"}
