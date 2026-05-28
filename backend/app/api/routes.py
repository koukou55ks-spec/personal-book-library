from collections.abc import Sequence
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Book, ReadingStatus
from app.schemas import (
    BookCreate,
    BookResponse,
    BookUpdate,
    DashboardResponse,
    StatusCount,
)

router = APIRouter()


@router.get("/health", tags=["health"])
def health_check() -> dict[str, str]:
    return {"status": "ok"}


@router.get("/books", response_model=list[BookResponse], tags=["books"])
def list_books(
    q: Optional[str] = Query(
        default=None,
        min_length=1,
        description="Search by title or author",
    ),
    status: Optional[ReadingStatus] = Query(
        default=None,
        description="Filter by reading status",
    ),
    db: Session = Depends(get_db),
) -> Sequence[Book]:
    statement = select(Book)

    if q:
        keyword = f"%{q.strip()}%"
        statement = statement.where(
            Book.title.ilike(keyword) | Book.author.ilike(keyword)
        )

    if status is not None:
        statement = statement.where(Book.status == status)

    statement = statement.order_by(Book.created_at.desc(), Book.id.desc())
    return db.scalars(statement).all()


@router.post(
    "/books",
    response_model=BookResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["books"],
)
def create_book(payload: BookCreate, db: Session = Depends(get_db)) -> Book:
    book = Book(**payload.model_dump())
    db.add(book)
    db.commit()
    db.refresh(book)
    return book


@router.put("/books/{book_id}", response_model=BookResponse, tags=["books"])
def update_book(
    book_id: int,
    payload: BookUpdate,
    db: Session = Depends(get_db),
) -> Book:
    book = db.get(Book, book_id)
    if book is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Book not found",
        )

    for field_name, value in payload.model_dump(exclude_unset=True).items():
        setattr(book, field_name, value)

    db.commit()
    db.refresh(book)
    return book


@router.delete("/books/{book_id}", status_code=status.HTTP_204_NO_CONTENT, tags=["books"])
def delete_book(book_id: int, db: Session = Depends(get_db)) -> None:
    book = db.get(Book, book_id)
    if book is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Book not found",
        )

    db.delete(book)
    db.commit()


@router.get("/dashboard", response_model=DashboardResponse, tags=["dashboard"])
def get_dashboard(db: Session = Depends(get_db)) -> DashboardResponse:
    total_books = db.scalar(select(func.count()).select_from(Book)) or 0

    finished_books = db.scalar(
        select(func.count()).select_from(Book).where(Book.status == ReadingStatus.finished)
    ) or 0

    average_rating = db.scalar(select(func.avg(Book.rating)).where(Book.rating.is_not(None)))

    status_rows = db.execute(
        select(Book.status, func.count(Book.id))
        .group_by(Book.status)
        .order_by(Book.status.asc())
    ).all()

    status_counts = [
        StatusCount(status=status, count=count)
        for status, count in status_rows
    ]

    return DashboardResponse(
        total_books=total_books,
        finished_books=finished_books,
        average_rating=float(average_rating) if average_rating is not None else None,
        status_counts=status_counts,
    )
