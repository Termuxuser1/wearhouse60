# WAX//001 — API Contracts & Integration

## Stack
React + FastAPI + MongoDB. Stripe (claimable sandbox, Flow A). Country FR. Tax mode: **calc_only** (Stripe calculates tax at checkout).

## Data (MongoDB)
- `inventory`: `{_id: "productId:variantId:size", product_id, variant_id, size, qty}` (seeded once from catalog.py)
- `orders`: `{order_id, session_id, items[], amount(cents), currency, email, status, payment_status, stock_decremented, created_at}`
- `payment_transactions`: `{session_id, order_id, amount, currency, status, payment_status, created_at}`

## Public endpoints
- `GET /api/products` → `{currency, product{...,washes[{...,availability{size:qty}}]}, grid[{...,availability}]}`
- `POST /api/checkout` → body `{items:[{lookup_key,product_id,variant_id,size,quantity}], origin_url, email?}` → `{checkout_url, session_id, order_id}`. Validates stock, builds Stripe Checkout Session.
- `GET /api/payments/status/{session_id}` → `{session_id,status,payment_status,order_id}` (polled by success page; marks paid + decrements stock idempotently)
- `POST /api/stripe/webhook` → Stripe events (idempotent mark-paid)
- `GET /api/orders/{order_id}` → order detail (success page)

## Admin endpoints (header `X-Admin-Token`)
- `POST /api/admin/login` {password} → {token}
- `GET /api/admin/orders`
- `GET /api/admin/inventory`
- `PUT /api/admin/inventory` {product_id,variant_id,size,qty}

## Stripe (lookup_keys)
wax001_raw_indigo(155) · wax001_washed_black(155) · wax001_coated_wax(175) · wax_trucker_jacket(215) · wax_cutoff_short(95) · copper_rivet_belt(68) · heavyweight_box_tee(52). EUR. Set up via `setup_stripe.py`.

## Frontend integration
- `src/api.js` wraps all calls. `CartContext.checkout()` POSTs cart → redirects to Stripe.
- Cart item shape: `{sku, productId, variantId, variantName, size, qty, price, name, image}`.
- Routes: `/` landing, `/payment/success`, `/payment/cancel`, `/admin`.
- `mock.js` still provides STATIC content (announcements, features, community, nav, hero). Product + grid + stock now come from `GET /api/products` (mock used as fallback before fetch resolves).

## Previously mocked → now real
Product data, stock/availability, cart checkout, orders. Still static/mock: hero & community images (placeholders to be replaced by user), features copy, Instagram handles.

## Test card
4242 4242 4242 4242 · any future expiry · any CVC.
