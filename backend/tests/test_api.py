from fastapi.testclient import TestClient


def test_read_root(client: TestClient) -> None:
    response = client.get("/")

    assert response.status_code == 200
    assert response.json() == {"message": "Personal Book Library API"}


def test_health_check(client: TestClient) -> None:
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_list_books_returns_empty_list_initially(client: TestClient) -> None:
    response = client.get("/books")

    assert response.status_code == 200
    assert response.json() == []


def test_create_book(client: TestClient) -> None:
    payload = {
        "title": "Deep Work",
        "author": "Cal Newport",
        "status": "reading",
        "rating": 5,
        "memo": "Read in the morning.",
    }

    response = client.post("/books", json=payload)

    assert response.status_code == 201
    body = response.json()
    assert body["title"] == payload["title"]
    assert body["author"] == payload["author"]
    assert body["status"] == payload["status"]
    assert body["rating"] == payload["rating"]
    assert body["memo"] == payload["memo"]
    assert isinstance(body["id"], int)
    assert body["created_at"]


def test_created_book_is_returned_by_list_books(client: TestClient) -> None:
    client.post(
        "/books",
        json={
            "title": "Atomic Habits",
            "author": "James Clear",
            "status": "unread",
            "rating": 4,
            "memo": "Recommended by a friend.",
        },
    )

    response = client.get("/books")

    assert response.status_code == 200
    body = response.json()
    assert len(body) == 1
    assert body[0]["title"] == "Atomic Habits"


def test_list_books_can_filter_by_search_query(client: TestClient) -> None:
    client.post(
        "/books",
        json={
            "title": "Atomic Habits",
            "author": "James Clear",
            "status": "unread",
            "rating": 4,
            "memo": None,
        },
    )
    client.post(
        "/books",
        json={
            "title": "Deep Work",
            "author": "Cal Newport",
            "status": "reading",
            "rating": 5,
            "memo": None,
        },
    )

    response = client.get("/books", params={"q": "newport"})

    assert response.status_code == 200
    body = response.json()
    assert len(body) == 1
    assert body[0]["title"] == "Deep Work"


def test_list_books_can_filter_by_status(client: TestClient) -> None:
    client.post(
        "/books",
        json={
            "title": "Refactoring",
            "author": "Martin Fowler",
            "status": "finished",
            "rating": 5,
            "memo": None,
        },
    )
    client.post(
        "/books",
        json={
            "title": "Domain-Driven Design",
            "author": "Eric Evans",
            "status": "reading",
            "rating": 4,
            "memo": None,
        },
    )

    response = client.get("/books", params={"status": "finished"})

    assert response.status_code == 200
    body = response.json()
    assert len(body) == 1
    assert body[0]["title"] == "Refactoring"


def test_list_books_can_combine_search_query_and_status(client: TestClient) -> None:
    client.post(
        "/books",
        json={
            "title": "Clean Architecture",
            "author": "Robert C. Martin",
            "status": "finished",
            "rating": 5,
            "memo": None,
        },
    )
    client.post(
        "/books",
        json={
            "title": "Clean Code",
            "author": "Robert C. Martin",
            "status": "reading",
            "rating": 4,
            "memo": None,
        },
    )

    response = client.get("/books", params={"q": "clean", "status": "finished"})

    assert response.status_code == 200
    body = response.json()
    assert len(body) == 1
    assert body[0]["title"] == "Clean Architecture"


def test_update_book(client: TestClient) -> None:
    create_response = client.post(
        "/books",
        json={
            "title": "Clean Code",
            "author": "Robert C. Martin",
            "status": "unread",
            "rating": None,
            "memo": None,
        },
    )
    book_id = create_response.json()["id"]

    response = client.put(
        f"/books/{book_id}",
        json={
            "status": "finished",
            "rating": 5,
            "memo": "Finished and worth reviewing.",
        },
    )

    assert response.status_code == 200
    body = response.json()
    assert body["title"] == "Clean Code"
    assert body["status"] == "finished"
    assert body["rating"] == 5
    assert body["memo"] == "Finished and worth reviewing."


def test_update_missing_book_returns_404(client: TestClient) -> None:
    response = client.put("/books/999", json={"status": "finished"})

    assert response.status_code == 404
    assert response.json() == {"detail": "Book not found"}


def test_delete_book(client: TestClient) -> None:
    create_response = client.post(
        "/books",
        json={
            "title": "The Pragmatic Programmer",
            "author": "David Thomas and Andrew Hunt",
            "status": "reading",
            "rating": 5,
            "memo": "Classic software book.",
        },
    )
    book_id = create_response.json()["id"]

    delete_response = client.delete(f"/books/{book_id}")
    list_response = client.get("/books")

    assert delete_response.status_code == 204
    assert list_response.status_code == 200
    assert list_response.json() == []


def test_delete_missing_book_returns_404(client: TestClient) -> None:
    response = client.delete("/books/999")

    assert response.status_code == 404
    assert response.json() == {"detail": "Book not found"}
