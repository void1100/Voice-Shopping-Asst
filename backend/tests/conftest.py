import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

import database
from auth import create_access_token, hash_password

TEST_ENGINE = create_engine(
    "sqlite://",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestSession = sessionmaker(autocommit=False, autoflush=False, bind=TEST_ENGINE)

database.engine = TEST_ENGINE
database.SessionLocal = TestSession


def _override_get_db():
    db = TestSession()
    try:
        yield db
    finally:
        db.close()


from main import app  # noqa: E402

app.dependency_overrides[database.get_db] = _override_get_db


@pytest.fixture(autouse=True)
def _setup_db():
    database.Base.metadata.create_all(bind=TEST_ENGINE)
    yield
    database.Base.metadata.drop_all(bind=TEST_ENGINE)


@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c


def _create_test_user(client, name="Test User", email="test@example.com", password="password123"):
    """Create user directly in DB and return (token, user_dict, headers)."""
    db = TestSession()
    user = database.User(
        name=name,
        email=email,
        password_hash=hash_password(password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    db.close()

    token = create_access_token({"sub": user.id})
    headers = {"Authorization": f"Bearer {token}"}
    return token, {"id": user.id, "name": user.name, "email": user.email}, headers


@pytest.fixture
def auth_client(client):
    """Return (client, user_data, headers) for an authenticated test user."""
    _, user_data, headers = _create_test_user(client)
    return client, user_data, headers
