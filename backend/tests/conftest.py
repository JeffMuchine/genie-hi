import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.db.session import Base
from app.api import deps
from main import app
from app.models.user import User
from app.models.job import Resume, Job, Application

# Use in-memory SQLite for tests
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture
def db_session():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture
def client(db_session):
    def override_get_db():
        try:
            yield db_session
        finally:
            pass
    
    app.dependency_overrides[deps.get_db] = override_get_db
    yield TestClient(app)
    app.dependency_overrides.clear()


@pytest.fixture
def test_user(db_session):
    from app.models.user import User
    user = User(id="test-user-id", email="test@example.com", name="Test User")
    db_session.add(user)
    db_session.commit()
    return user


@pytest.fixture
def authorized_client(client, test_user):
    from app.core import security
    access_token = security.create_access_token(subject=test_user.id)
    client.headers = {
        "Authorization": f"Bearer {access_token}"
    }
    return client
