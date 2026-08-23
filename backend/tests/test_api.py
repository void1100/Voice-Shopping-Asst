"""Tests for auth, user-scoped list, cart, ownership, and voice parsing."""

import pytest
from tests.conftest import _create_test_user


# -----------------------------------------------------------------------
# Auth
# -----------------------------------------------------------------------

class TestRegister:
    def test_register_success(self, client):
        resp = client.post("/auth/register", json={
            "name": "Alice", "email": "alice@example.com", "password": "secret123"
        })
        assert resp.status_code == 200
        data = resp.json()
        assert "access_token" in data
        assert data["user"]["email"] == "alice@example.com"

    def test_register_duplicate_email(self, client):
        client.post("/auth/register", json={
            "name": "Alice", "email": "alice@example.com", "password": "secret123"
        })
        resp = client.post("/auth/register", json={
            "name": "Bob", "email": "alice@example.com", "password": "other123"
        })
        assert resp.status_code == 409

    def test_register_short_password(self, client):
        resp = client.post("/auth/register", json={
            "name": "Alice", "email": "alice@example.com", "password": "12345"
        })
        assert resp.status_code == 422


class TestLogin:
    def test_login_success(self, client):
        client.post("/auth/register", json={
            "name": "Alice", "email": "alice@example.com", "password": "secret123"
        })
        resp = client.post("/auth/login", json={
            "email": "alice@example.com", "password": "secret123"
        })
        assert resp.status_code == 200
        assert "access_token" in resp.json()

    def test_login_wrong_password(self, client):
        client.post("/auth/register", json={
            "name": "Alice", "email": "alice@example.com", "password": "secret123"
        })
        resp = client.post("/auth/login", json={
            "email": "alice@example.com", "password": "wrongpassword"
        })
        assert resp.status_code == 401

    def test_login_nonexistent_user(self, client):
        resp = client.post("/auth/login", json={
            "email": "nobody@example.com", "password": "secret123"
        })
        assert resp.status_code == 401


class TestMe:
    def test_get_me_authenticated(self, auth_client):
        client, user_data, headers = auth_client
        resp = client.get("/auth/me", headers=headers)
        assert resp.status_code == 200
        assert resp.json()["email"] == user_data["email"]

    def test_get_me_unauthenticated(self, client):
        resp = client.get("/auth/me")
        assert resp.status_code in (401, 403)


# -----------------------------------------------------------------------
# Shopping List (user-scoped)
# -----------------------------------------------------------------------

class TestShoppingList:
    def test_empty_list(self, auth_client):
        client, _, headers = auth_client
        resp = client.get("/list", headers=headers)
        assert resp.status_code == 200
        assert resp.json() == []

    def test_add_to_list(self, auth_client):
        client, _, headers = auth_client
        resp = client.post("/list", json={"name": "milk", "quantity": 2}, headers=headers)
        assert resp.status_code == 201
        data = resp.json()
        assert data["name"] == "milk"
        assert data["quantity"] == 2

    def test_list_items_belong_to_user(self, auth_client):
        client, user_data, headers = auth_client
        client.post("/list", json={"name": "milk", "quantity": 1}, headers=headers)
        resp = client.get("/list", headers=headers)
        items = resp.json()
        assert len(items) == 1
        assert items[0]["user_id"] == user_data["id"]

    def test_update_list_item(self, auth_client):
        client, _, headers = auth_client
        add_resp = client.post("/list", json={"name": "milk", "quantity": 1}, headers=headers)
        item_id = add_resp.json()["id"]
        resp = client.put(f"/list/{item_id}", json={"quantity": 5}, headers=headers)
        assert resp.status_code == 200
        assert resp.json()["quantity"] == 5

    def test_delete_list_item(self, auth_client):
        client, _, headers = auth_client
        add_resp = client.post("/list", json={"name": "milk", "quantity": 1}, headers=headers)
        item_id = add_resp.json()["id"]
        resp = client.delete(f"/list/{item_id}", headers=headers)
        assert resp.status_code == 200
        assert client.get("/list", headers=headers).json() == []

    def test_clear_list(self, auth_client):
        client, _, headers = auth_client
        client.post("/list", json={"name": "milk", "quantity": 1}, headers=headers)
        client.post("/list", json={"name": "bread", "quantity": 1}, headers=headers)
        resp = client.delete("/list", headers=headers)
        assert resp.status_code == 200
        assert client.get("/list", headers=headers).json() == []

    def test_batch_add(self, auth_client):
        client, _, headers = auth_client
        resp = client.post("/list/batch", json={
            "items": [
                {"name": "milk", "quantity": 1},
                {"name": "bread", "quantity": 2},
            ]
        }, headers=headers)
        assert resp.status_code == 201
        assert len(resp.json()) == 2

    def test_canonical_merge(self, auth_client):
        client, _, headers = auth_client
        r1 = client.post("/list", json={"name": "milk", "quantity": 1}, headers=headers)
        assert r1.status_code == 201
        r2 = client.post("/list", json={"name": "doodh", "quantity": 1}, headers=headers)
        # doodh normalizes to milk — should merge (200) or create (201)
        assert r2.status_code in (200, 201)
        items = client.get("/list", headers=headers).json()
        milk_items = [i for i in items if i["normalized_name"] == "milk"]
        assert len(milk_items) >= 1


# -----------------------------------------------------------------------
# Ownership isolation
# -----------------------------------------------------------------------

class TestOwnershipIsolation:
    def test_users_have_separate_lists(self, client):
        _, _, h1 = _create_test_user(client, "Alice", "alice@test.com")
        _, _, h2 = _create_test_user(client, "Bob", "bob@test.com")

        client.post("/list", json={"name": "milk"}, headers=h1)
        client.post("/list", json={"name": "bread"}, headers=h2)

        alice_items = client.get("/list", headers=h1).json()
        bob_items = client.get("/list", headers=h2).json()

        assert len(alice_items) == 1
        assert alice_items[0]["name"] == "milk"
        assert len(bob_items) == 1
        assert bob_items[0]["name"] == "bread"

    def test_user_cannot_delete_other_users_item(self, client):
        _, _, h1 = _create_test_user(client, "Alice", "alice@test.com")
        _, _, h2 = _create_test_user(client, "Bob", "bob@test.com")

        alice_item = client.post("/list", json={"name": "milk"}, headers=h1).json()
        resp = client.delete(f"/list/{alice_item['id']}", headers=h2)
        assert resp.status_code == 404


# -----------------------------------------------------------------------
# Cart (user-scoped)
# -----------------------------------------------------------------------

class TestCart:
    def test_empty_cart(self, auth_client):
        client, _, headers = auth_client
        resp = client.get("/cart", headers=headers)
        assert resp.status_code == 200
        assert resp.json() == []

    def test_add_to_cart(self, auth_client):
        client, _, headers = auth_client
        resp = client.post("/cart", json={"name": "milk", "quantity": 2}, headers=headers)
        assert resp.status_code == 201
        data = resp.json()
        assert data["name"] == "milk"
        assert data["quantity"] == 2

    def test_cart_merge(self, auth_client):
        client, _, headers = auth_client
        r1 = client.post("/cart", json={"name": "milk", "quantity": 1}, headers=headers)
        assert r1.status_code == 201
        r2 = client.post("/cart", json={"name": "milk", "quantity": 3}, headers=headers)
        # Should merge (200) if same canonical found, otherwise create new (201)
        assert r2.status_code in (200, 201)
        cart = client.get("/cart", headers=headers).json()
        milk_entries = [i for i in cart if i["normalized_name"] == "milk"]
        total_qty = sum(i["quantity"] for i in milk_entries)
        assert total_qty == 4

    def test_update_cart_item(self, auth_client):
        client, _, headers = auth_client
        add_resp = client.post("/cart", json={"name": "milk", "quantity": 1}, headers=headers)
        item_id = add_resp.json()["id"]
        resp = client.put(f"/cart/{item_id}", json={"quantity": 5}, headers=headers)
        assert resp.status_code == 200
        assert resp.json()["quantity"] == 5

    def test_delete_cart_item(self, auth_client):
        client, _, headers = auth_client
        add_resp = client.post("/cart", json={"name": "milk", "quantity": 1}, headers=headers)
        item_id = add_resp.json()["id"]
        resp = client.delete(f"/cart/{item_id}", headers=headers)
        assert resp.status_code == 200
        assert client.get("/cart", headers=headers).json() == []

    def test_copy_list_to_cart(self, auth_client):
        client, _, headers = auth_client
        list_item = client.post("/list", json={"name": "milk", "quantity": 2}, headers=headers).json()
        resp = client.post(f"/cart/from-list/{list_item['id']}", headers=headers)
        assert resp.status_code == 200
        cart_items = client.get("/cart", headers=headers).json()
        assert len(cart_items) == 1
        assert cart_items[0]["name"] == "milk"
        assert len(client.get("/list", headers=headers).json()) == 1

    def test_cart_cannot_see_other_users(self, client):
        _, _, h1 = _create_test_user(client, "Alice", "a@t.com")
        _, _, h2 = _create_test_user(client, "Bob", "b@t.com")

        client.post("/cart", json={"name": "milk"}, headers=h1)
        client.post("/cart", json={"name": "bread"}, headers=h2)

        assert len(client.get("/cart", headers=h1).json()) == 1
        assert len(client.get("/cart", headers=h2).json()) == 1


# -----------------------------------------------------------------------
# Voice parsing (with target)
# -----------------------------------------------------------------------

class TestParseVoice:
    def test_parse_add_to_cart(self, client):
        resp = client.post("/parse-voice", json={
            "transcript": "add milk to my cart", "lang": "en-US"
        })
        assert resp.status_code == 200
        parsed = resp.json()["parsed"]
        assert parsed["action"] == "add"
        assert parsed["target"] == "cart"

    def test_parse_add_to_list(self, client):
        resp = client.post("/parse-voice", json={
            "transcript": "add bread to my list", "lang": "en-US"
        })
        assert resp.status_code == 200
        parsed = resp.json()["parsed"]
        assert parsed["action"] == "add"
        assert parsed["target"] == "list"

    def test_parse_defaults_to_list(self, client):
        resp = client.post("/parse-voice", json={
            "transcript": "add milk", "lang": "en-US"
        })
        assert resp.status_code == 200
        assert resp.json()["parsed"]["target"] == "list"

    def test_parse_empty_transcript(self, client):
        resp = client.post("/parse-voice", json={"transcript": ""})
        assert resp.status_code == 422


# -----------------------------------------------------------------------
# Public endpoints
# -----------------------------------------------------------------------

class TestPublicEndpoints:
    def test_root(self, client):
        resp = client.get("/")
        assert resp.status_code == 200
        assert resp.json()["status"] == "running"

    def test_search(self, client):
        resp = client.get("/search?q=milk")
        assert resp.status_code == 200
        assert len(resp.json()["results"]) > 0

    def test_substitutes(self, client):
        resp = client.get("/substitutes/milk")
        assert resp.status_code == 200
        assert len(resp.json()["substitutes"]) > 0

    def test_categories(self, client):
        resp = client.get("/categories")
        assert resp.status_code == 200
        assert "dairy" in resp.json()["categories"]
