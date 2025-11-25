from fastapi.testclient import TestClient
from app.core.config import settings

def test_login_google_url(client: TestClient):
    response = client.get("/api/v1/auth/login/google")
    assert response.status_code == 200
    data = response.json()
    assert "url" in data
    assert "accounts.google.com" in data["url"]
    assert "client_id" in data["url"]


def test_callback_google_mock(client: TestClient):
    # Ensure we are in a state that triggers the mock (no keys or DEBUG=True)
    # The default config has None for keys, so it should trigger the mock if DEBUG is True
    
    # We pass a dummy code
    response = client.get("/api/v1/auth/callback/google?code=dummy_code")
    
    if settings.GOOGLE_CLIENT_ID and settings.GOOGLE_CLIENT_SECRET:
        # If keys are present, this test might fail or try to hit Google. 
        # For now assuming we are running in an env without real keys.
        pass 
    else:
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert "user" in data
        assert data["user"]["email"] == "mockuser@example.com"
