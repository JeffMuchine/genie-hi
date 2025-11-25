from fastapi.testclient import TestClient

def test_add_job_text(authorized_client: TestClient):
    job_data = {"input_data": "Software Engineer\nGoogle\nWe are looking for a software engineer..."}
    
    response = authorized_client.post("/api/v1/jobs/", json=job_data)
    
    assert response.status_code == 201
    data = response.json()
    assert data["job_title"] == "Software Engineer"
    assert data["company_name"] == "Unknown Company" # Parser heuristic for text
    assert "id" in data
    
    # Verify list
    response_list = authorized_client.get("/api/v1/jobs/")
    assert response_list.status_code == 200
    data_list = response_list.json()
    assert len(data_list) > 0
    assert data_list[0]["id"] == data["id"]
    
    # Verify delete
    response_del = authorized_client.delete(f"/api/v1/jobs/{data['id']}")
    assert response_del.status_code == 204
    
    response_list_after = authorized_client.get("/api/v1/jobs/")
    assert len(response_list_after.json()) == 0
