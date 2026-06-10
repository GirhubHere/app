"""Backend API tests for Five Agra Select."""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://select-grains.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# -------- health --------
def test_health(session):
    r = session.get(f"{API}/health", timeout=15)
    assert r.status_code == 200
    data = r.json()
    assert data.get("status") == "ok"
    assert "ts" in data


def test_root(session):
    r = session.get(f"{API}/", timeout=15)
    assert r.status_code == 200
    assert r.json().get("status") == "ok"


# -------- POST /api/quote-requests --------
def test_create_quote_request_valid(session):
    payload = {
        "name": "TEST_Alice Buyer",
        "company": "TEST_Agritrade Ltd",
        "email": "test_alice@example.com",
        "phone": "+380501234567",
        "commodity": "corn",
        "volume_tons": "25000",
        "message": "Looking for Q1 supply, CIF Alexandria.",
        "language": "en",
    }
    r = session.post(f"{API}/quote-requests", json=payload, timeout=15)
    assert r.status_code == 201, r.text
    body = r.json()
    assert "id" in body and isinstance(body["id"], str) and len(body["id"]) > 0
    assert body["name"] == payload["name"]
    assert body["email"] == payload["email"]
    assert body["commodity"] == "corn"
    assert body["volume_tons"] == "25000"
    assert "created_at" in body
    # persistence verification
    r2 = session.get(f"{API}/quote-requests", timeout=15)
    assert r2.status_code == 200
    items = r2.json()
    assert any(it.get("id") == body["id"] for it in items), "Created record not found in GET list"


def test_create_quote_request_all_commodities(session):
    commodities = ["wheat", "sunflower", "barley", "rapeseed", "soybean"]
    for c in commodities:
        payload = {
            "name": f"TEST_{c}_user",
            "email": f"test_{c}@example.com",
            "commodity": c,
        }
        r = session.post(f"{API}/quote-requests", json=payload, timeout=15)
        assert r.status_code == 201, f"{c} failed: {r.text}"
        assert r.json()["commodity"] == c


def test_create_quote_invalid_commodity(session):
    payload = {"name": "TEST_x", "email": "test_x@example.com", "commodity": "rice"}
    r = session.post(f"{API}/quote-requests", json=payload, timeout=15)
    assert r.status_code == 400
    assert "commodity" in r.text.lower()


def test_create_quote_missing_name(session):
    payload = {"email": "test@example.com", "commodity": "corn"}
    r = session.post(f"{API}/quote-requests", json=payload, timeout=15)
    assert r.status_code == 422


def test_create_quote_missing_email(session):
    payload = {"name": "TEST_NoEmail", "commodity": "corn"}
    r = session.post(f"{API}/quote-requests", json=payload, timeout=15)
    assert r.status_code == 422


def test_create_quote_invalid_email(session):
    payload = {"name": "TEST_BadEmail", "email": "not-an-email", "commodity": "corn"}
    r = session.post(f"{API}/quote-requests", json=payload, timeout=15)
    assert r.status_code == 422


def test_list_quote_requests_sorted_desc(session):
    r = session.get(f"{API}/quote-requests", timeout=15)
    assert r.status_code == 200
    items = r.json()
    assert isinstance(items, list)
    if len(items) >= 2:
        # ensure no _id leak and created_at present, in descending order
        for it in items:
            assert "_id" not in it
            assert "created_at" in it
        # compare top 2
        assert items[0]["created_at"] >= items[1]["created_at"]
