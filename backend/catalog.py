"""Single source of truth for the WAX//001 catalog.
Prices are in EUR. `amount` is in cents for Stripe. `lookup_key` ties a variant
to a Stripe Price. Images are placeholder URLs (user will replace later).
"""

CURRENCY = "eur"

# Main hero product with washes (variants)
MAIN_PRODUCT = {
    "id": "wax-001",
    "name": "WAX//001",
    "subtitle": "Hand-Waxed Selvedge Jean",
    "type": "variant",
    "compareAtPrice": 185,
    "rating": 4.9,
    "reviews": 214,
    "description": (
        "Cut from 14.5oz Japanese selvedge denim and finished with a hand-applied "
        "wax coating for a second-skin patina that only gets better with wear. "
        "Built to break in, made to last."
    ),
    "washes": [
        {"id": "raw-indigo", "name": "Raw Indigo", "hex": "#2b3a67", "price": 155,
         "lookup_key": "wax001_raw_indigo",
         "image": "https://images.unsplash.com/photo-1714143136372-ddaf8b606da7?crop=entropy&cs=srgb&fm=jpg&q=85&w=900",
         "hover": "https://images.unsplash.com/photo-1637069585336-827b298fe84a?crop=entropy&cs=srgb&fm=jpg&q=85&w=900"},
        {"id": "washed-black", "name": "Washed Black", "hex": "#1c1c1c", "price": 155,
         "lookup_key": "wax001_washed_black",
         "image": "https://images.unsplash.com/photo-1631112230741-446762ee05ac?crop=entropy&cs=srgb&fm=jpg&q=85&w=900",
         "hover": "https://images.unsplash.com/photo-1640336437301-8368b53861ab?crop=entropy&cs=srgb&fm=jpg&q=85&w=900"},
        {"id": "coated-wax", "name": "Coated Wax", "hex": "#3a3027", "price": 175,
         "lookup_key": "wax001_coated_wax",
         "image": "https://images.unsplash.com/photo-1645859610425-f0f4177df5f0?crop=entropy&cs=srgb&fm=jpg&q=85&w=900",
         "hover": "https://images.unsplash.com/photo-1671624759834-bcf0d3dd2517?crop=entropy&cs=srgb&fm=jpg&q=85&w=900"},
    ],
    "sizes": [28, 29, 30, 31, 32, 33, 34, 36],
}

# Secondary "style it" products (simple, single price)
GRID_PRODUCTS = [
    {"id": "wax-jacket", "name": "WAX//Trucker Jacket", "price": 215, "compareAt": None,
     "lookup_key": "wax_trucker_jacket", "sizes": ["S", "M", "L", "XL"],
     "image": "https://images.unsplash.com/photo-1618695387047-92fcda1b6231",
     "hover": "https://images.unsplash.com/photo-1618695386836-4f5809db074f"},
    {"id": "wax-short", "name": "WAX//001 Cut-Off Short", "price": 95, "compareAt": 115,
     "lookup_key": "wax_cutoff_short", "sizes": ["28", "30", "32", "34"],
     "image": "https://images.unsplash.com/photo-1637069585336-827b298fe84a?crop=entropy&cs=srgb&fm=jpg&q=85&w=900",
     "hover": "https://images.unsplash.com/photo-1714143136372-ddaf8b606da7?crop=entropy&cs=srgb&fm=jpg&q=85&w=900"},
    {"id": "wax-belt", "name": "Copper Rivet Belt", "price": 68, "compareAt": None,
     "lookup_key": "copper_rivet_belt", "sizes": ["OS"],
     "image": "https://images.unsplash.com/photo-1631112230741-446762ee05ac?crop=entropy&cs=srgb&fm=jpg&q=85&w=900",
     "hover": "https://images.unsplash.com/photo-1640336437301-8368b53861ab?crop=entropy&cs=srgb&fm=jpg&q=85&w=900"},
    {"id": "wax-tee", "name": "Heavyweight Box Tee", "price": 52, "compareAt": None,
     "lookup_key": "heavyweight_box_tee", "sizes": ["S", "M", "L", "XL"],
     "image": "https://images.unsplash.com/photo-1617354839314-9476d4ca8a3d",
     "hover": "https://images.unsplash.com/photo-1541099649105-f69ad21f3246"},
]

# Build a flat lookup of all purchasable SKUs -> metadata
def all_variants():
    """Yield (lookup_key, product_id, variant_id, variant_name, price, name, image)."""
    for w in MAIN_PRODUCT["washes"]:
        yield {
            "lookup_key": w["lookup_key"], "product_id": MAIN_PRODUCT["id"],
            "variant_id": w["id"], "variant_name": w["name"], "price": w["price"],
            "name": f"{MAIN_PRODUCT['name']} \u2014 {w['name']}", "image": w["image"],
            "sizes": MAIN_PRODUCT["sizes"],
        }
    for p in GRID_PRODUCTS:
        yield {
            "lookup_key": p["lookup_key"], "product_id": p["id"],
            "variant_id": "", "variant_name": "", "price": p["price"],
            "name": p["name"], "image": p["image"], "sizes": p["sizes"],
        }

def sku_index():
    return {v["lookup_key"]: v for v in all_variants()}

def inventory_seed():
    """Return list of inventory docs. Default qty 10; some jean sizes start sold-out."""
    docs = []
    sold_out = {("raw-indigo", 29), ("raw-indigo", 36), ("washed-black", 36), ("coated-wax", 29)}
    for w in MAIN_PRODUCT["washes"]:
        for s in MAIN_PRODUCT["sizes"]:
            qty = 0 if (w["id"], s) in sold_out else 10
            docs.append({"_id": f"{MAIN_PRODUCT['id']}:{w['id']}:{s}",
                         "product_id": MAIN_PRODUCT["id"], "variant_id": w["id"],
                         "size": str(s), "qty": qty})
    for p in GRID_PRODUCTS:
        for s in p["sizes"]:
            docs.append({"_id": f"{p['id']}::{s}", "product_id": p["id"],
                         "variant_id": "", "size": str(s), "qty": 12})
    return docs
