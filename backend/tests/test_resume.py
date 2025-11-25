import os
from fastapi.testclient import TestClient

def test_upload_resume(authorized_client: TestClient):
    file_content = b"This is a test resume content."
    files = {"file": ("resume.txt", file_content, "text/plain")}
    
    response = authorized_client.post("/api/v1/resume/upload", files=files)
    
    if response.status_code != 201:
        print(response.json())
    
    assert response.status_code == 201
    data = response.json()
    assert data["filename"] == "resume.txt"
    assert "id" in data
    
    # Verify DB
    response_get = authorized_client.get("/api/v1/resume/")
    assert response_get.status_code == 200
    data_get = response_get.json()
    assert data_get["id"] == data["id"]
    
    # Clean up file
    # In a real test suite we'd use a temp dir fixture for uploads
    # For now we just check if file exists and maybe delete it if we knew the path
    # But we don't easily know the path here without querying DB or returning it.
    # The endpoint doesn't return full path.
