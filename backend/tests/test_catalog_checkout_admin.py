"""Critical regression tests for catalog, checkout and admin inventory/auth flows."""

import os
import json
import time
import hmac
import hashlib
from urllib.parse import urlparse

import pytest
import requests


BASE_URL = os.environ.get("REACT_APP_BACKEND_URL")
WEBHOOK_SECRET = os.environ.get("STRIPE_WEBHOOK_SECRET")
ADMIN_PASSWORD = os.environ["ADMIN_PASSWORD"]
PRODUCT_ID = "wearhouse60-jean"
VARIANT_ID = "black-camo"
LOOKUP_KEY = "wearhouse60_black_camo"
BASE_STOCK = {"1": 17, "2": 17, "3": 16}


@pytest.fixture(scope="session")
def api_client():
    if not BASE_URL:
        pytest.skip("REACT_APP_BACKEND_URL missing")
    session = requests.Session()
    session.headers.update({"Content-Type": "application/json"})
    return session


@pytest.fixture(scope="session")
def admin_token(api_client):
    res = api_client.post(f"{BASE_URL}/api/admin/login", json={"password": ADMIN_PASSWORD}, timeout=30)
    if res.status_code != 200:
        pytest.skip("Admin login failed; skipping admin-dependent tests")
    return res.json()["token"]


@pytest.fixture(scope="session", autouse=True)
def restore_stock_after_tests(api_client, admin_token):
    yield
    for size, qty in BASE_STOCK.items():
        api_client.put(
            f"{BASE_URL}/api/admin/inventory",
            headers={"X-Admin-Token": admin_token},
            json={"product_id": PRODUCT_ID, "variant_id": VARIANT_ID, "size": size, "qty": qty},
            timeout=30,
        )


# Product catalog and stock persistence checks
def test_get_products_single_product_shape(api_client):
    res = api_client.get(f"{BASE_URL}/api/products", timeout=30)
    assert res.status_code == 200
    data = res.json()
    assert data["currency"] == "eur"
    assert data["grid"] == []
    assert data["product"]["id"] == PRODUCT_ID
    assert data["product"]["name"] == "60 WAXED JEAN"
    assert data["product"]["compareAtPrice"] == 110
    wash = data["product"]["washes"][0]
    assert wash["price"] == 99.99
    assert set(data["product"]["sizes"]) == {"1", "2", "3"}


def test_repeated_products_calls_do_not_reset_admin_stock(api_client, admin_token):
    target = {"1": 9, "2": 8, "3": 7}
    for size, qty in target.items():
        upd = api_client.put(
            f"{BASE_URL}/api/admin/inventory",
            headers={"X-Admin-Token": admin_token},
            json={"product_id": PRODUCT_ID, "variant_id": VARIANT_ID, "size": size, "qty": qty},
            timeout=30,
        )
        assert upd.status_code == 200

    for _ in range(3):
        ok = api_client.get(f"{BASE_URL}/api/products", timeout=30)
        assert ok.status_code == 200

    after = api_client.get(
        f"{BASE_URL}/api/admin/inventory",
        headers={"X-Admin-Token": admin_token},
        timeout=30,
    )
    assert after.status_code == 200
    rows = [r for r in after.json()["inventory"] if r["product_id"] == PRODUCT_ID and r["variant_id"] == VARIANT_ID]
    got = {r["size"]: r["qty"] for r in rows}
    assert got == target


# Checkout validation and stock conflict behavior
def test_checkout_rejects_unknown_sku(api_client):
    payload = {
        "origin_url": BASE_URL,
        "items": [{
            "lookup_key": "bad_key",
            "product_id": PRODUCT_ID,
            "variant_id": VARIANT_ID,
            "size": "1",
            "quantity": 1,
        }],
    }
    res = api_client.post(f"{BASE_URL}/api/checkout", json=payload, timeout=45)
    assert res.status_code == 400
    assert "Unknown product" in res.text


def test_checkout_rejects_wrong_variant_or_product(api_client):
    payload = {
        "origin_url": BASE_URL,
        "items": [{
            "lookup_key": LOOKUP_KEY,
            "product_id": "wrong",
            "variant_id": VARIANT_ID,
            "size": "1",
            "quantity": 1,
        }],
    }
    res = api_client.post(f"{BASE_URL}/api/checkout", json=payload, timeout=45)
    assert res.status_code == 400
    assert "non valide" in res.text


def test_checkout_rejects_bad_size(api_client):
    payload = {
        "origin_url": BASE_URL,
        "items": [{
            "lookup_key": LOOKUP_KEY,
            "product_id": PRODUCT_ID,
            "variant_id": VARIANT_ID,
            "size": "4",
            "quantity": 1,
        }],
    }
    res = api_client.post(f"{BASE_URL}/api/checkout", json=payload, timeout=45)
    assert res.status_code == 400
    assert "non valide" in res.text


def test_checkout_duplicate_rows_aggregate_and_conflict(api_client, admin_token):
    # set low stock to enforce aggregate conflict
    one = api_client.put(
        f"{BASE_URL}/api/admin/inventory",
        headers={"X-Admin-Token": admin_token},
        json={"product_id": PRODUCT_ID, "variant_id": VARIANT_ID, "size": "1", "qty": 1},
        timeout=30,
    )
    assert one.status_code == 200

    payload = {
        "origin_url": BASE_URL,
        "items": [
            {
                "lookup_key": LOOKUP_KEY,
                "product_id": PRODUCT_ID,
                "variant_id": VARIANT_ID,
                "size": "1",
                "quantity": 1,
            },
            {
                "lookup_key": LOOKUP_KEY,
                "product_id": PRODUCT_ID,
                "variant_id": VARIANT_ID,
                "size": "1",
                "quantity": 1,
            },
        ],
    }
    res = api_client.post(f"{BASE_URL}/api/checkout", json=payload, timeout=45)
    assert res.status_code == 409
    assert "Stock insuffisant" in res.text

    # restore this size to baseline now (extra safety besides fixture teardown)
    api_client.put(
        f"{BASE_URL}/api/admin/inventory",
        headers={"X-Admin-Token": admin_token},
        json={"product_id": PRODUCT_ID, "variant_id": VARIANT_ID, "size": "1", "qty": BASE_STOCK["1"]},
        timeout=30,
    )


def test_checkout_creates_stripe_session_for_valid_payload(api_client):
    payload = {
        "origin_url": BASE_URL,
        "items": [{
            "lookup_key": LOOKUP_KEY,
            "product_id": PRODUCT_ID,
            "variant_id": VARIANT_ID,
            "size": "2",
            "quantity": 1,
        }],
    }
    res = api_client.post(f"{BASE_URL}/api/checkout", json=payload, timeout=45)
    assert res.status_code == 200
    body = res.json()
    assert isinstance(body.get("session_id"), str) and body["session_id"].startswith("cs_")
    assert isinstance(body.get("checkout_url"), str)
    host = urlparse(body["checkout_url"]).netloc
    assert "stripe.com" in host

    st = api_client.get(f"{BASE_URL}/api/payments/status/{body['session_id']}", timeout=45)
    assert st.status_code == 200
    status_body = st.json()
    assert status_body["payment_status"] in {"pending", "paid", "failed", "expired"}


def test_paid_webhook_marks_paid_and_decrements_stock_once(api_client, admin_token):
    if not WEBHOOK_SECRET:
        pytest.skip("STRIPE_WEBHOOK_SECRET missing")

    inv_before = api_client.get(
        f"{BASE_URL}/api/admin/inventory",
        headers={"X-Admin-Token": admin_token},
        timeout=30,
    )
    assert inv_before.status_code == 200
    rows_before = [
        r for r in inv_before.json()["inventory"]
        if r["product_id"] == PRODUCT_ID and r["variant_id"] == VARIANT_ID and r["size"] == "3"
    ]
    qty_before = rows_before[0]["qty"]

    payload = {
        "origin_url": BASE_URL,
        "items": [{
            "lookup_key": LOOKUP_KEY,
            "product_id": PRODUCT_ID,
            "variant_id": VARIANT_ID,
            "size": "3",
            "quantity": 1,
        }],
    }
    checkout = api_client.post(f"{BASE_URL}/api/checkout", json=payload, timeout=45)
    assert checkout.status_code == 200
    session_id = checkout.json()["session_id"]

    event = {
        "id": "evt_test_checkout_completed",
        "object": "event",
        "type": "checkout.session.completed",
        "data": {
            "object": {
                "id": session_id,
                "object": "checkout.session",
                "payment_status": "paid",
                "payment_intent": "pi_test_123",
            }
        },
    }
    payload_str = json.dumps(event, separators=(",", ":"))
    timestamp = int(time.time())
    signed_payload = f"{timestamp}.{payload_str}".encode("utf-8")
    signature = hmac.new(WEBHOOK_SECRET.encode("utf-8"), signed_payload, hashlib.sha256).hexdigest()
    sig_header = f"t={timestamp},v1={signature}"

    w1 = api_client.post(
        f"{BASE_URL}/api/stripe/webhook",
        data=payload_str,
        headers={"stripe-signature": sig_header, "Content-Type": "application/json"},
        timeout=45,
    )
    assert w1.status_code == 200

    # replay same event to verify idempotent stock decrement
    w2 = api_client.post(
        f"{BASE_URL}/api/stripe/webhook",
        data=payload_str,
        headers={"stripe-signature": sig_header, "Content-Type": "application/json"},
        timeout=45,
    )
    assert w2.status_code == 200

    st = api_client.get(f"{BASE_URL}/api/payments/status/{session_id}", timeout=45)
    assert st.status_code == 200
    assert st.json()["payment_status"] == "paid"

    inv_after = api_client.get(
        f"{BASE_URL}/api/admin/inventory",
        headers={"X-Admin-Token": admin_token},
        timeout=30,
    )
    assert inv_after.status_code == 200
    rows_after = [
        r for r in inv_after.json()["inventory"]
        if r["product_id"] == PRODUCT_ID and r["variant_id"] == VARIANT_ID and r["size"] == "3"
    ]
    qty_after = rows_after[0]["qty"]
    assert qty_after == qty_before - 1


# Admin auth + inventory endpoint checks
def test_admin_login_rejects_invalid_password(api_client):
    res = api_client.post(f"{BASE_URL}/api/admin/login", json={"password": "wrong"}, timeout=30)
    assert res.status_code == 401


def test_admin_inventory_unauthorized_rejected(api_client):
    res = api_client.get(f"{BASE_URL}/api/admin/inventory", timeout=30)
    assert res.status_code == 401


def test_admin_inventory_has_exact_three_sizes_and_total_50(api_client, admin_token):
    # Ensure canonical stock before this assertion
    for size, qty in BASE_STOCK.items():
        api_client.put(
            f"{BASE_URL}/api/admin/inventory",
            headers={"X-Admin-Token": admin_token},
            json={"product_id": PRODUCT_ID, "variant_id": VARIANT_ID, "size": size, "qty": qty},
            timeout=30,
        )

    res = api_client.get(
        f"{BASE_URL}/api/admin/inventory",
        headers={"X-Admin-Token": admin_token},
        timeout=30,
    )
    assert res.status_code == 200
    rows = [r for r in res.json()["inventory"] if r["product_id"] == PRODUCT_ID and r["variant_id"] == VARIANT_ID]
    assert len(rows) == 3
    assert sorted([r["size"] for r in rows]) == ["1", "2", "3"]
    assert sum(r["qty"] for r in rows) == 50
