"""Idempotent Stripe catalog setup for WAX//001.
Creates Products + Prices (lookup_keys) and sets a head-office tax address.
Run: python setup_stripe.py
"""
import os
from pathlib import Path
from dotenv import load_dotenv
import stripe

import catalog as cat

load_dotenv(Path(__file__).parent / ".env")
stripe.api_key = os.environ["STRIPE_SECRET_KEY"]


def ensure_tax_settings():
    try:
        s = stripe.tax.Settings.retrieve()
        if getattr(s, "head_office", None) and getattr(s.head_office, "address", None):
            return
        stripe.tax.Settings.modify(
            head_office={"address": {"country": "FR", "line1": "1 Rue de Rivoli",
                                     "city": "Paris", "postal_code": "75001"}},
            defaults={"tax_behavior": "exclusive"},
        )
        print("Tax head-office set (FR)")
    except Exception as e:
        print(f"[warn] tax settings: {e}")


def get_or_create_product(pid, name, tax_code="txcd_99999999"):
    for p in stripe.Product.list(active=True, limit=100).auto_paging_iter():
        if p.to_dict().get("metadata", {}).get("emergent_product_id") == pid:
            return p
    return stripe.Product.create(
        name=name, tax_code=tax_code,
        metadata={"managed_by": "emergent", "emergent_product_id": pid},
    )


def ensure_price(product, lookup_key, amount_cents, currency="eur"):
    existing = stripe.Price.list(lookup_keys=[lookup_key], active=True, limit=1).data
    if existing and existing[0].unit_amount == amount_cents and existing[0].currency == currency:
        print(f"  price ok: {lookup_key} ({amount_cents})")
        return existing[0]
    if existing:
        stripe.Price.modify(existing[0].id, active=False)
    price = stripe.Price.create(
        product=product.id, unit_amount=amount_cents, currency=currency,
        lookup_key=lookup_key, transfer_lookup_key=True,
    )
    print(f"  price created: {lookup_key} ({amount_cents})")
    return price


def main():
    ensure_tax_settings()

    # Main jean: one Stripe product, one price per wash
    jean = get_or_create_product(cat.MAIN_PRODUCT["id"], cat.MAIN_PRODUCT["name"])
    print(f"Product: {jean.name}")
    for w in cat.MAIN_PRODUCT["washes"]:
        ensure_price(jean, w["lookup_key"], int(w["price"] * 100))

    # Grid products: product + single price each
    for p in cat.GRID_PRODUCTS:
        prod = get_or_create_product(p["id"], p["name"])
        print(f"Product: {prod.name}")
        ensure_price(prod, p["lookup_key"], int(p["price"] * 100))

    print("Done.")


if __name__ == "__main__":
    main()
