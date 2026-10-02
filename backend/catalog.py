"""WEARHOUSE 60 — real single-product catalog; EUR prices include tax."""

CURRENCY = "eur"
MAIN_PRODUCT = {
    "id": "wearhouse60-jean",
    "name": "60 WAXED JEAN",
    "subtitle": "Denim ciré · 14 oz · Revers camo",
    "compareAtPrice": 110,
    "description": (
        "Du poids, du relief, du caractère. Un denim épais de 14 oz (environ 475 g/m²), "
        "100 % coton, avec une finition cirée aux reflets irréguliers. "
        "Une coupe ample, un noir marbré et un revers camo qui change tout."
    ),
    "washes": [{
        "id": "black-camo", "name": "Noir ciré / Camo", "hex": "#242820",
        "price": 99.99, "lookup_key": "wearhouse60_black_camo",
        "image": "/images/jean-flat.webp", "hover": "/images/jean-front.webp",
    }],
    "gallery": [
        {"src": "/images/jean-flat.webp", "alt": "60 WAXED JEAN — vue entière à plat, revers camo", "label": "À plat"},
        {"src": "/images/jean-front.webp", "alt": "Jean noir ciré porté de face, coupe ample et revers camo", "label": "De face"},
        {"src": "/images/jean-back.webp", "alt": "Jean noir ciré porté de dos", "label": "De dos"},
        {"src": "/images/detail-camo.webp", "alt": "Détail du revers intérieur camouflage", "label": "Le camo"},
    ],
    "sizes": ["1", "2", "3"],
}
GRID_PRODUCTS = []
INITIAL_STOCK = {"1": 17, "2": 17, "3": 16}


def all_variants():
    for wash in MAIN_PRODUCT["washes"]:
        yield {
            "lookup_key": wash["lookup_key"], "product_id": MAIN_PRODUCT["id"],
            "variant_id": wash["id"], "variant_name": wash["name"],
            "price": wash["price"], "name": MAIN_PRODUCT["name"],
            "image": wash["image"], "sizes": MAIN_PRODUCT["sizes"],
        }


def sku_index():
    return {variant["lookup_key"]: variant for variant in all_variants()}


def inventory_seed():
    return [
        {"_id": f"{MAIN_PRODUCT['id']}:black-camo:{size}",
         "product_id": MAIN_PRODUCT["id"], "variant_id": "black-camo",
         "size": size, "qty": qty}
        for size, qty in INITIAL_STOCK.items()
    ]