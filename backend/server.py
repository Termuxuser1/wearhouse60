from fastapi import FastAPI, APIRouter, HTTPException, Request, Header
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import stripe

import catalog as cat

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

stripe.api_key = os.environ["STRIPE_SECRET_KEY"]
STRIPE_WEBHOOK_SECRET = os.environ["STRIPE_WEBHOOK_SECRET"]
ADMIN_PASSWORD = os.environ["ADMIN_PASSWORD"]

app = FastAPI()
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


# ----------------------------- Models -----------------------------
class CartLine(BaseModel):
    lookup_key: str
    product_id: str
    variant_id: str = ""
    size: str
    quantity: int = Field(1, ge=1, le=20)


class CheckoutRequest(BaseModel):
    items: List[CartLine]
    origin_url: str
    email: Optional[str] = None


class AdminLogin(BaseModel):
    password: str


class InventoryUpdate(BaseModel):
    product_id: str
    variant_id: str = ""
    size: str
    qty: int = Field(ge=0)


class InventoryRow(BaseModel):
    product_id: str
    variant_id: str
    size: str
    qty: int
    name: str


class InventoryResponse(BaseModel):
    inventory: List[InventoryRow]


class CatalogResponse(BaseModel):
    currency: str
    product: dict
    grid: List[dict]


# ----------------------------- Helpers -----------------------------
async def ensure_seeded():
    """Seed new catalog entries once, never reset sold or admin-adjusted stock."""
    for doc in cat.inventory_seed():
        key = doc.pop("_id")
        await db.inventory.update_one({"_id": key}, {"$setOnInsert": doc}, upsert=True)


async def get_stock_map():
    docs = await db.inventory.find({"product_id": cat.MAIN_PRODUCT["id"]}, {"_id": 0}).to_list(1000)
    return {inv_id(d["product_id"], d["variant_id"], d["size"]): d["qty"] for d in docs}


def inv_id(product_id, variant_id, size):
    return f"{product_id}:{variant_id}:{size}"


# ----------------------------- Public routes -----------------------------
@api_router.get("/")
async def root():
    return {"message": "WEARHOUSE 60 API"}


@api_router.get("/products", response_model=CatalogResponse)
async def get_products():
    await ensure_seeded()
    stock = await get_stock_map()

    main = {
        "id": cat.MAIN_PRODUCT["id"],
        "name": cat.MAIN_PRODUCT["name"],
        "subtitle": cat.MAIN_PRODUCT["subtitle"],
        "description": cat.MAIN_PRODUCT["description"],
        "compareAtPrice": cat.MAIN_PRODUCT["compareAtPrice"],
        "gallery": cat.MAIN_PRODUCT["gallery"],
        "sizes": cat.MAIN_PRODUCT["sizes"],
        "washes": [],
    }
    for w in cat.MAIN_PRODUCT["washes"]:
        avail = {str(s): stock.get(inv_id(cat.MAIN_PRODUCT["id"], w["id"], s), 0)
                 for s in cat.MAIN_PRODUCT["sizes"]}
        main["washes"].append({**w, "availability": avail})

    grid = []
    for p in cat.GRID_PRODUCTS:
        avail = {str(s): stock.get(inv_id(p["id"], "", s), 0) for s in p["sizes"]}
        grid.append({**p, "availability": avail})

    return {"currency": cat.CURRENCY, "product": main, "grid": grid}


@api_router.post("/checkout")
async def create_checkout(req: CheckoutRequest):
    if not req.items:
        raise HTTPException(400, "Cart is empty")

    await ensure_seeded()
    stock = await get_stock_map()
    index = cat.sku_index()

    line_items = []
    order_items = []
    amount_total = 0
    requested_stock = {}
    for it in req.items:
        meta = index.get(it.lookup_key)
        if not meta:
            raise HTTPException(400, f"Unknown product: {it.lookup_key}")
        if (it.product_id != meta["product_id"] or it.variant_id != meta["variant_id"]
                or it.size not in meta["sizes"]):
            raise HTTPException(400, "Produit ou taille non valide.")
        key = inv_id(it.product_id, it.variant_id, it.size)
        available = stock.get(key, 0)
        requested_stock[key] = requested_stock.get(key, 0) + it.quantity
        if available < requested_stock[key]:
            raise HTTPException(409, f"Stock insuffisant pour la taille {it.size} : {available} disponible(s).")

        prices = stripe.Price.list(lookup_keys=[it.lookup_key], active=True, limit=1).data
        if not prices:
            raise HTTPException(500, f"Price not configured: {it.lookup_key}")
        price = prices[0]
        line_items.append({"price": price.id, "quantity": it.quantity})
        amount_total += (price.unit_amount or 0) * it.quantity
        order_items.append({
            "lookup_key": it.lookup_key, "product_id": it.product_id,
            "variant_id": it.variant_id, "variant_name": meta["variant_name"],
            "size": it.size, "quantity": it.quantity, "name": meta["name"],
            "image": meta["image"], "unit_amount": price.unit_amount,
        })

    order_id = str(uuid.uuid4())
    base = dict(
        line_items=line_items,
        mode="payment",
        success_url=f"{req.origin_url}/payment/success?session_id={{CHECKOUT_SESSION_ID}}",
        cancel_url=f"{req.origin_url}/payment/cancel",
        metadata={"order_id": order_id},
        branding_settings={"display_name": "WEARHOUSE 60", "button_color": "#2b3a26"},
        locale="fr",
        adaptive_pricing={"enabled": False},
    )
    if req.email:
        base["customer_email"] = req.email

    try:
        session = stripe.checkout.Session.create(
            **base, automatic_tax={"enabled": True},
            billing_address_collection="required",
        )
    except stripe.error.StripeError as e:
        logger.error("Stripe checkout unavailable: %s", e)
        raise HTTPException(502, "Le paiement est momentanément indisponible. Réessayez plus tard.")

    now = datetime.now(timezone.utc)
    await db.payment_transactions.insert_one({
        "session_id": session.id, "order_id": order_id,
        "amount": amount_total, "currency": cat.CURRENCY,
        "status": "initiated", "payment_status": "pending",
        "created_at": now, "updated_at": now,
    })
    await db.orders.insert_one({
        "order_id": order_id, "session_id": session.id,
        "items": order_items, "amount": amount_total, "currency": cat.CURRENCY,
        "email": req.email, "status": "pending", "payment_status": "pending",
        "stock_decremented": False, "created_at": now, "updated_at": now,
    })

    return {"checkout_url": session.url, "session_id": session.id, "order_id": order_id}


async def _mark_paid(session_id: str, payment_status: str = "paid", pi: str = None):
    """Idempotently mark order paid and decrement stock once."""
    if payment_status != "paid":
        return
    now = datetime.now(timezone.utc)
    await db.payment_transactions.update_one(
        {"session_id": session_id, "payment_status": {"$ne": "paid"}},
        {"$set": {"status": "completed", "payment_status": payment_status,
                  "stripe_payment_intent_id": pi, "updated_at": now}},
    )
    order = await db.orders.find_one_and_update(
        {"session_id": session_id, "stock_decremented": False},
        {"$set": {"stock_decremented": True}}, projection={"_id": 0},
    )
    if order:
        for it in order["items"]:
            await db.inventory.update_one(
                {"_id": inv_id(it["product_id"], it["variant_id"], it["size"])},
                {"$inc": {"qty": -it["quantity"]}},
            )
        await db.orders.update_one(
            {"session_id": session_id},
            {"$set": {"status": "paid", "payment_status": payment_status,
                      "stock_decremented": True, "updated_at": now}},
        )


@api_router.get("/payments/status/{session_id}")
async def get_status(session_id: str):
    record = await db.payment_transactions.find_one({"session_id": session_id})
    if not record:
        raise HTTPException(404, "Transaction not found")
    if record.get("payment_status") != "paid":
        try:
            s = stripe.checkout.Session.retrieve(session_id)
            if s.payment_status == "paid":
                await _mark_paid(session_id, "paid", s.payment_intent)
                record = await db.payment_transactions.find_one({"session_id": session_id})
        except stripe.error.StripeError as e:
            logger.warning("status retrieve error: %s", e)
    return {"session_id": record["session_id"], "status": record["status"],
            "payment_status": record["payment_status"], "order_id": record.get("order_id")}


@api_router.post("/stripe/webhook")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig = request.headers.get("stripe-signature", "")
    try:
        event = stripe.Webhook.construct_event(payload, sig, STRIPE_WEBHOOK_SECRET)
    except Exception as e:
        raise HTTPException(400, f"Invalid signature: {e}")
    obj, t = event["data"]["object"], event["type"]
    if t == "checkout.session.completed":
        await _mark_paid(obj["id"], obj.get("payment_status", "paid"), obj.get("payment_intent"))
    elif t == "checkout.session.async_payment_succeeded":
        await _mark_paid(obj["id"], "paid", obj.get("payment_intent"))
    elif t in ("checkout.session.async_payment_failed", "checkout.session.expired"):
        st = "failed" if "failed" in t else "expired"
        await db.payment_transactions.update_one({"session_id": obj["id"]},
            {"$set": {"status": st, "payment_status": st, "updated_at": datetime.now(timezone.utc)}})
        await db.orders.update_one({"session_id": obj["id"]},
            {"$set": {"status": st, "payment_status": st, "updated_at": datetime.now(timezone.utc)}})
    return {"status": "ok"}


@api_router.get("/orders/{order_id}")
async def get_order(order_id: str):
    order = await db.orders.find_one({"order_id": order_id}, {"_id": 0})
    if not order:
        raise HTTPException(404, "Order not found")
    return order


# ----------------------------- Admin routes -----------------------------
def _check_admin(token: Optional[str]):
    if token != ADMIN_PASSWORD:
        raise HTTPException(401, "Unauthorized")


@api_router.post("/admin/login")
async def admin_login(body: AdminLogin):
    if body.password != ADMIN_PASSWORD:
        raise HTTPException(401, "Invalid password")
    return {"token": ADMIN_PASSWORD}


@api_router.get("/admin/orders")
async def admin_orders(x_admin_token: Optional[str] = Header(None)):
    _check_admin(x_admin_token)
    orders = await db.orders.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return {"orders": orders}


@api_router.get("/admin/inventory", response_model=InventoryResponse)
async def admin_inventory(x_admin_token: Optional[str] = Header(None)):
    _check_admin(x_admin_token)
    await ensure_seeded()
    docs = await db.inventory.find({"product_id": cat.MAIN_PRODUCT["id"]}, {"_id": 0}).to_list(1000)
    index = cat.sku_index()
    name_by_pv = {}
    for v in index.values():
        name_by_pv[(v["product_id"], v["variant_id"])] = v["name"]
    for d in docs:
        d["name"] = name_by_pv.get((d["product_id"], d["variant_id"]), d["product_id"])
    docs.sort(key=lambda d: (d["product_id"], d["variant_id"], d["size"]))
    return {"inventory": docs}


@api_router.put("/admin/inventory")
async def update_inventory(body: InventoryUpdate, x_admin_token: Optional[str] = Header(None)):
    _check_admin(x_admin_token)
    if not any(v["product_id"] == body.product_id and v["variant_id"] == body.variant_id
               and body.size in v["sizes"] for v in cat.all_variants()):
        raise HTTPException(400, "Produit ou taille non valide.")
    _id = inv_id(body.product_id, body.variant_id, body.size)
    await db.inventory.update_one(
        {"_id": _id},
        {"$set": {"qty": body.qty, "product_id": body.product_id,
                  "variant_id": body.variant_id, "size": body.size}},
        upsert=True,
    )
    return {"ok": True, "_id": _id, "qty": body.qty}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
