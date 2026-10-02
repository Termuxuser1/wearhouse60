#!/usr/bin/env python3
"""
Comprehensive backend API tests for WAX//001 e-commerce platform.
Tests all endpoints including products, checkout, payments, and admin functions.
"""
import requests
import json
from typing import Dict, Any

# Base URL from frontend/.env
BASE_URL = "https://product-landing-copy.preview.emergentagent.com/api"
ADMIN_PASSWORD = "wax001admin"

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    END = '\033[0m'

def print_test(name: str):
    print(f"\n{Colors.BLUE}{'='*80}{Colors.END}")
    print(f"{Colors.BLUE}TEST: {name}{Colors.END}")
    print(f"{Colors.BLUE}{'='*80}{Colors.END}")

def print_pass(msg: str):
    print(f"{Colors.GREEN}✓ PASS: {msg}{Colors.END}")

def print_fail(msg: str):
    print(f"{Colors.RED}✗ FAIL: {msg}{Colors.END}")

def print_info(msg: str):
    print(f"{Colors.YELLOW}ℹ INFO: {msg}{Colors.END}")

# Global variable to store session_id and order_id for later tests
test_session_id = None
test_order_id = None
admin_token = None

def test_1_get_products():
    """Test 1: GET /api/products - verify product structure and availability"""
    print_test("1. GET /api/products")
    
    try:
        response = requests.get(f"{BASE_URL}/products", timeout=10)
        print_info(f"Status Code: {response.status_code}")
        
        if response.status_code != 200:
            print_fail(f"Expected 200, got {response.status_code}")
            print_info(f"Response: {response.text}")
            return False
        
        data = response.json()
        print_info(f"Response keys: {list(data.keys())}")
        
        # Verify structure
        if "currency" not in data:
            print_fail("Missing 'currency' field")
            return False
        if data["currency"] != "eur":
            print_fail(f"Expected currency 'eur', got '{data['currency']}'")
            return False
        print_pass(f"Currency is correct: {data['currency']}")
        
        if "product" not in data:
            print_fail("Missing 'product' field")
            return False
        
        product = data["product"]
        if "washes" not in product:
            print_fail("Missing 'washes' in product")
            return False
        
        print_info(f"Product has {len(product['washes'])} washes")
        
        # Check availability for each wash
        for wash in product["washes"]:
            wash_id = wash.get("id")
            print_info(f"Wash: {wash_id}")
            if "availability" not in wash:
                print_fail(f"Missing 'availability' for wash {wash_id}")
                return False
            
            avail = wash["availability"]
            print_info(f"  Availability: {avail}")
            
            # Verify specific sold-out items as per catalog.py
            if wash_id == "raw-indigo":
                if avail.get("29") != 0:
                    print_fail(f"raw-indigo size 29 should be 0, got {avail.get('29')}")
                    return False
                if avail.get("36") != 0:
                    print_fail(f"raw-indigo size 36 should be 0, got {avail.get('36')}")
                    return False
                print_pass("raw-indigo sizes 29 and 36 are correctly 0")
            
            if wash_id == "washed-black":
                if avail.get("36") != 0:
                    print_fail(f"washed-black size 36 should be 0, got {avail.get('36')}")
                    return False
                print_pass("washed-black size 36 is correctly 0")
            
            if wash_id == "coated-wax":
                if avail.get("29") != 0:
                    print_fail(f"coated-wax size 29 should be 0, got {avail.get('29')}")
                    return False
                print_pass("coated-wax size 29 is correctly 0")
        
        # Check grid products
        if "grid" not in data:
            print_fail("Missing 'grid' field")
            return False
        
        grid = data["grid"]
        print_info(f"Grid has {len(grid)} products")
        
        for item in grid:
            if "availability" not in item:
                print_fail(f"Missing 'availability' for grid item {item.get('id')}")
                return False
        
        print_pass("All grid products have availability")
        print_pass("GET /api/products test passed")
        return True
        
    except Exception as e:
        print_fail(f"Exception: {str(e)}")
        return False

def test_2_checkout_valid():
    """Test 2: POST /api/checkout with valid in-stock item"""
    print_test("2. POST /api/checkout - Valid in-stock item")
    
    global test_session_id, test_order_id
    
    try:
        payload = {
            "items": [
                {
                    "lookup_key": "wax001_raw_indigo",
                    "product_id": "wax-001",
                    "variant_id": "raw-indigo",
                    "size": "30",
                    "quantity": 1
                }
            ],
            "origin_url": "https://example.com"
        }
        
        print_info(f"Payload: {json.dumps(payload, indent=2)}")
        
        response = requests.post(f"{BASE_URL}/checkout", json=payload, timeout=10)
        print_info(f"Status Code: {response.status_code}")
        
        if response.status_code != 200:
            print_fail(f"Expected 200, got {response.status_code}")
            print_info(f"Response: {response.text}")
            return False
        
        data = response.json()
        print_info(f"Response: {json.dumps(data, indent=2)}")
        
        # Verify response structure
        if "checkout_url" not in data:
            print_fail("Missing 'checkout_url' in response")
            return False
        
        if "session_id" not in data:
            print_fail("Missing 'session_id' in response")
            return False
        
        if "order_id" not in data:
            print_fail("Missing 'order_id' in response")
            return False
        
        # Verify checkout_url is a Stripe URL
        if not data["checkout_url"].startswith("https://checkout.stripe.com"):
            print_fail(f"checkout_url doesn't look like a Stripe URL: {data['checkout_url']}")
            return False
        
        print_pass(f"checkout_url is valid Stripe URL: {data['checkout_url'][:50]}...")
        print_pass(f"session_id: {data['session_id']}")
        print_pass(f"order_id: {data['order_id']}")
        
        # Store for later tests
        test_session_id = data["session_id"]
        test_order_id = data["order_id"]
        
        print_pass("POST /api/checkout with valid item passed")
        return True
        
    except Exception as e:
        print_fail(f"Exception: {str(e)}")
        return False

def test_3_checkout_out_of_stock():
    """Test 3: POST /api/checkout with out-of-stock item (expect 409)"""
    print_test("3. POST /api/checkout - Out-of-stock item")
    
    try:
        payload = {
            "items": [
                {
                    "lookup_key": "wax001_raw_indigo",
                    "product_id": "wax-001",
                    "variant_id": "raw-indigo",
                    "size": "29",  # This size is sold out
                    "quantity": 1
                }
            ],
            "origin_url": "https://example.com"
        }
        
        print_info(f"Payload: {json.dumps(payload, indent=2)}")
        
        response = requests.post(f"{BASE_URL}/checkout", json=payload, timeout=10)
        print_info(f"Status Code: {response.status_code}")
        
        if response.status_code != 409:
            print_fail(f"Expected 409 (Conflict), got {response.status_code}")
            print_info(f"Response: {response.text}")
            return False
        
        print_pass("Correctly returned 409 for out-of-stock item")
        print_info(f"Response: {response.text}")
        return True
        
    except Exception as e:
        print_fail(f"Exception: {str(e)}")
        return False

def test_4_checkout_unknown_lookup_key():
    """Test 4: POST /api/checkout with unknown lookup_key (expect 400)"""
    print_test("4. POST /api/checkout - Unknown lookup_key")
    
    try:
        payload = {
            "items": [
                {
                    "lookup_key": "invalid_unknown_key",
                    "product_id": "wax-001",
                    "variant_id": "raw-indigo",
                    "size": "30",
                    "quantity": 1
                }
            ],
            "origin_url": "https://example.com"
        }
        
        print_info(f"Payload: {json.dumps(payload, indent=2)}")
        
        response = requests.post(f"{BASE_URL}/checkout", json=payload, timeout=10)
        print_info(f"Status Code: {response.status_code}")
        
        if response.status_code != 400:
            print_fail(f"Expected 400 (Bad Request), got {response.status_code}")
            print_info(f"Response: {response.text}")
            return False
        
        print_pass("Correctly returned 400 for unknown lookup_key")
        print_info(f"Response: {response.text}")
        return True
        
    except Exception as e:
        print_fail(f"Exception: {str(e)}")
        return False

def test_5_payment_status():
    """Test 5: GET /api/payments/status/{session_id}"""
    print_test("5. GET /api/payments/status/{session_id}")
    
    global test_session_id
    
    if not test_session_id:
        print_fail("No session_id available from previous test")
        return False
    
    try:
        response = requests.get(f"{BASE_URL}/payments/status/{test_session_id}", timeout=10)
        print_info(f"Status Code: {response.status_code}")
        
        if response.status_code != 200:
            print_fail(f"Expected 200, got {response.status_code}")
            print_info(f"Response: {response.text}")
            return False
        
        data = response.json()
        print_info(f"Response: {json.dumps(data, indent=2)}")
        
        # Verify structure
        if "payment_status" not in data:
            print_fail("Missing 'payment_status' in response")
            return False
        
        # Payment should be pending (not completed in test)
        if data["payment_status"] != "pending":
            print_fail(f"Expected payment_status 'pending', got '{data['payment_status']}'")
            return False
        
        print_pass(f"payment_status is correctly 'pending'")
        print_pass("GET /api/payments/status test passed")
        return True
        
    except Exception as e:
        print_fail(f"Exception: {str(e)}")
        return False

def test_6_admin_login():
    """Test 6: POST /api/admin/login - correct and wrong password"""
    print_test("6. POST /api/admin/login")
    
    global admin_token
    
    # Test with correct password
    try:
        payload = {"password": ADMIN_PASSWORD}
        print_info(f"Testing with correct password: {ADMIN_PASSWORD}")
        
        response = requests.post(f"{BASE_URL}/admin/login", json=payload, timeout=10)
        print_info(f"Status Code: {response.status_code}")
        
        if response.status_code != 200:
            print_fail(f"Expected 200, got {response.status_code}")
            print_info(f"Response: {response.text}")
            return False
        
        data = response.json()
        print_info(f"Response: {json.dumps(data, indent=2)}")
        
        if "token" not in data:
            print_fail("Missing 'token' in response")
            return False
        
        admin_token = data["token"]
        print_pass(f"Login successful with correct password, token: {admin_token}")
        
    except Exception as e:
        print_fail(f"Exception with correct password: {str(e)}")
        return False
    
    # Test with wrong password
    try:
        payload = {"password": "wrongpassword123"}
        print_info(f"Testing with wrong password")
        
        response = requests.post(f"{BASE_URL}/admin/login", json=payload, timeout=10)
        print_info(f"Status Code: {response.status_code}")
        
        if response.status_code != 401:
            print_fail(f"Expected 401 (Unauthorized), got {response.status_code}")
            print_info(f"Response: {response.text}")
            return False
        
        print_pass("Correctly returned 401 for wrong password")
        print_pass("POST /api/admin/login test passed")
        return True
        
    except Exception as e:
        print_fail(f"Exception with wrong password: {str(e)}")
        return False

def test_7_admin_orders():
    """Test 7: GET /api/admin/orders - with valid and invalid token"""
    print_test("7. GET /api/admin/orders")
    
    global admin_token, test_order_id
    
    if not admin_token:
        print_fail("No admin token available from previous test")
        return False
    
    # Test with valid token
    try:
        headers = {"X-Admin-Token": admin_token}
        print_info(f"Testing with valid token")
        
        response = requests.get(f"{BASE_URL}/admin/orders", headers=headers, timeout=10)
        print_info(f"Status Code: {response.status_code}")
        
        if response.status_code != 200:
            print_fail(f"Expected 200, got {response.status_code}")
            print_info(f"Response: {response.text}")
            return False
        
        data = response.json()
        print_info(f"Response has {len(data.get('orders', []))} orders")
        
        if "orders" not in data:
            print_fail("Missing 'orders' in response")
            return False
        
        # Verify our test order is in the list
        orders = data["orders"]
        found_order = False
        for order in orders:
            if order.get("order_id") == test_order_id:
                found_order = True
                print_pass(f"Found test order {test_order_id} in orders list")
                print_info(f"Order status: {order.get('status')}, payment_status: {order.get('payment_status')}")
                break
        
        if not found_order:
            print_fail(f"Test order {test_order_id} not found in orders list")
            return False
        
        print_pass("GET /api/admin/orders with valid token passed")
        
    except Exception as e:
        print_fail(f"Exception with valid token: {str(e)}")
        return False
    
    # Test without token
    try:
        print_info(f"Testing without token")
        
        response = requests.get(f"{BASE_URL}/admin/orders", timeout=10)
        print_info(f"Status Code: {response.status_code}")
        
        if response.status_code != 401:
            print_fail(f"Expected 401 (Unauthorized), got {response.status_code}")
            print_info(f"Response: {response.text}")
            return False
        
        print_pass("Correctly returned 401 without token")
        
    except Exception as e:
        print_fail(f"Exception without token: {str(e)}")
        return False
    
    # Test with invalid token
    try:
        headers = {"X-Admin-Token": "invalid_token_123"}
        print_info(f"Testing with invalid token")
        
        response = requests.get(f"{BASE_URL}/admin/orders", headers=headers, timeout=10)
        print_info(f"Status Code: {response.status_code}")
        
        if response.status_code != 401:
            print_fail(f"Expected 401 (Unauthorized), got {response.status_code}")
            print_info(f"Response: {response.text}")
            return False
        
        print_pass("Correctly returned 401 with invalid token")
        print_pass("GET /api/admin/orders test passed")
        return True
        
    except Exception as e:
        print_fail(f"Exception with invalid token: {str(e)}")
        return False

def test_8_admin_inventory():
    """Test 8: GET /api/admin/inventory - with valid token"""
    print_test("8. GET /api/admin/inventory")
    
    global admin_token
    
    if not admin_token:
        print_fail("No admin token available from previous test")
        return False
    
    try:
        headers = {"X-Admin-Token": admin_token}
        print_info(f"Testing with valid token")
        
        response = requests.get(f"{BASE_URL}/admin/inventory", headers=headers, timeout=10)
        print_info(f"Status Code: {response.status_code}")
        
        if response.status_code != 200:
            print_fail(f"Expected 200, got {response.status_code}")
            print_info(f"Response: {response.text}")
            return False
        
        data = response.json()
        
        if "inventory" not in data:
            print_fail("Missing 'inventory' in response")
            return False
        
        inventory = data["inventory"]
        print_info(f"Inventory has {len(inventory)} items")
        
        # Verify structure of inventory items
        if len(inventory) > 0:
            sample = inventory[0]
            required_fields = ["name", "product_id", "variant_id", "size", "qty"]
            for field in required_fields:
                if field not in sample:
                    print_fail(f"Missing '{field}' in inventory item")
                    return False
            
            print_pass(f"Inventory items have all required fields: {required_fields}")
            print_info(f"Sample item: {json.dumps(sample, indent=2)}")
        
        print_pass("GET /api/admin/inventory test passed")
        return True
        
    except Exception as e:
        print_fail(f"Exception: {str(e)}")
        return False

def test_9_update_inventory():
    """Test 9: PUT /api/admin/inventory - update and verify"""
    print_test("9. PUT /api/admin/inventory")
    
    global admin_token
    
    if not admin_token:
        print_fail("No admin token available from previous test")
        return False
    
    try:
        headers = {"X-Admin-Token": admin_token}
        
        # Update washed-black size 30 to qty 3
        payload = {
            "product_id": "wax-001",
            "variant_id": "washed-black",
            "size": "30",
            "qty": 3
        }
        
        print_info(f"Updating inventory: {json.dumps(payload, indent=2)}")
        
        response = requests.put(f"{BASE_URL}/admin/inventory", json=payload, headers=headers, timeout=10)
        print_info(f"Status Code: {response.status_code}")
        
        if response.status_code != 200:
            print_fail(f"Expected 200, got {response.status_code}")
            print_info(f"Response: {response.text}")
            return False
        
        data = response.json()
        print_info(f"Update response: {json.dumps(data, indent=2)}")
        print_pass("Inventory update successful")
        
        # Now verify by getting products
        print_info("Verifying update by fetching products...")
        
        response = requests.get(f"{BASE_URL}/products", timeout=10)
        if response.status_code != 200:
            print_fail(f"Failed to fetch products for verification")
            return False
        
        data = response.json()
        product = data.get("product", {})
        washes = product.get("washes", [])
        
        # Find washed-black wash
        washed_black = None
        for wash in washes:
            if wash.get("id") == "washed-black":
                washed_black = wash
                break
        
        if not washed_black:
            print_fail("Could not find washed-black wash in products")
            return False
        
        availability = washed_black.get("availability", {})
        size_30_qty = availability.get("30")
        
        print_info(f"washed-black size 30 availability: {size_30_qty}")
        
        if size_30_qty != 3:
            print_fail(f"Expected washed-black size 30 to be 3, got {size_30_qty}")
            return False
        
        print_pass("Verified: washed-black size 30 availability is now 3")
        print_pass("PUT /api/admin/inventory test passed")
        return True
        
    except Exception as e:
        print_fail(f"Exception: {str(e)}")
        return False

def main():
    """Run all tests"""
    print(f"\n{Colors.BLUE}{'='*80}{Colors.END}")
    print(f"{Colors.BLUE}WAX//001 Backend API Test Suite{Colors.END}")
    print(f"{Colors.BLUE}Base URL: {BASE_URL}{Colors.END}")
    print(f"{Colors.BLUE}{'='*80}{Colors.END}")
    
    results = {}
    
    # Run all tests in sequence
    results["Test 1: GET /api/products"] = test_1_get_products()
    results["Test 2: POST /api/checkout (valid)"] = test_2_checkout_valid()
    results["Test 3: POST /api/checkout (out-of-stock)"] = test_3_checkout_out_of_stock()
    results["Test 4: POST /api/checkout (unknown lookup_key)"] = test_4_checkout_unknown_lookup_key()
    results["Test 5: GET /api/payments/status"] = test_5_payment_status()
    results["Test 6: POST /api/admin/login"] = test_6_admin_login()
    results["Test 7: GET /api/admin/orders"] = test_7_admin_orders()
    results["Test 8: GET /api/admin/inventory"] = test_8_admin_inventory()
    results["Test 9: PUT /api/admin/inventory"] = test_9_update_inventory()
    
    # Print summary
    print(f"\n{Colors.BLUE}{'='*80}{Colors.END}")
    print(f"{Colors.BLUE}TEST SUMMARY{Colors.END}")
    print(f"{Colors.BLUE}{'='*80}{Colors.END}")
    
    passed = sum(1 for v in results.values() if v)
    total = len(results)
    
    for test_name, result in results.items():
        status = f"{Colors.GREEN}✓ PASS{Colors.END}" if result else f"{Colors.RED}✗ FAIL{Colors.END}"
        print(f"{status} - {test_name}")
    
    print(f"\n{Colors.BLUE}{'='*80}{Colors.END}")
    print(f"{Colors.BLUE}Total: {passed}/{total} tests passed{Colors.END}")
    print(f"{Colors.BLUE}{'='*80}{Colors.END}\n")
    
    return passed == total

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
