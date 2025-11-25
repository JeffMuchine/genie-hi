from fastapi.testclient import TestClient

def test_generate_application(authorized_client: TestClient):
    # 1. Upload Resume
    file_content = b"Resume Content: Experienced Python Developer..."
    files = {"file": ("resume.txt", file_content, "text/plain")}
    res_resume = authorized_client.post("/api/v1/resume/upload", files=files)
    resume_id = res_resume.json()["id"]
    
    # 2. Add Job
    job_data = {"input_data": "Python Developer\nTech Co\nLooking for Python expert..."}
    res_job = authorized_client.post("/api/v1/jobs/", json=job_data)
    job_id = res_job.json()["id"]
    
    # 3. Generate Application
    app_data = {"job_id": job_id, "resume_id": resume_id}
    response = authorized_client.post("/api/v1/applications/generate", json=app_data)
    
    assert response.status_code == 200
    data = response.json()
    assert data["job_id"] == job_id
    assert data["resume_id"] == resume_id
    # Check if mock content is returned (since no API key in tests)
    assert data["tailored_resume_sections"] is not None
    assert data["cover_letter_content"] is not None
    assert "mock" in data["cover_letter_content"].lower() or "candidate" in data["cover_letter_content"].lower()
