from fastapi import FastAPI

from app.api.routes import router

app = FastAPI(
    title="Personal Book Library API",
    version="0.1.0",
    description="Backend API for the Personal Book Library project.",
)

app.include_router(router)


@app.get("/", tags=["root"])
def read_root() -> dict[str, str]:
    return {"message": "Personal Book Library API"}
