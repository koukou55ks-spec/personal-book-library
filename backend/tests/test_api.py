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
