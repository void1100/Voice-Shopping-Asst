from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import get_db, init_db
from schemas import VoiceCommandRequest
from products import (
    get_substitutes, get_seasonal_items,
    get_smart_suggestions, search_products, CATEGORY_EMOJIS,
)

from routes.auth_routes import router as auth_router
from routes.list_routes import router as list_router
from routes.cart_routes import router as cart_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(lifespan=lifespan, title="Voice Shopping Assistant API")

# CORS — restrict in production
import os
FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Auth + List + Cart routes ---
app.include_router(auth_router)
app.include_router(list_router)
app.include_router(cart_router)


# --- Public / product-related endpoints (no auth required) ---

@app.get("/")
def root():
    return {"message": "Voice Shopping Assistant API", "status": "running"}


@app.get("/suggestions")
def get_suggestions(db: Session = Depends(get_db)):
    from database import ShoppingListItem
    recent_items = db.query(ShoppingListItem.normalized_name).all()
    recent_names = [item[0] for item in recent_items]
    suggestions = get_smart_suggestions(recent_names)
    seasonal = get_seasonal_items()
    return {"success": True, "suggestions": suggestions, "seasonal": seasonal}


@app.get("/search")
def search_items(
    q: str,
    price_min: float = None,
    price_max: float = None,
    category: str = None,
):
    if not q.strip():
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail="Search query is required")
    results = search_products(q, price_min=price_min, price_max=price_max, category=category)
    for r in results:
        r["emoji"] = CATEGORY_EMOJIS.get(r["category"], "📦")
    return {"success": True, "results": results, "count": len(results)}


@app.get("/substitutes/{item_name}")
def get_item_substitutes(item_name: str):
    substitutes = get_substitutes(item_name)
    if not substitutes:
        return {"success": True, "substitutes": [], "message": f"No substitutes found for {item_name}"}
    return {"success": True, "substitutes": substitutes}


@app.get("/categories")
def get_categories():
    return {"success": True, "categories": CATEGORY_EMOJIS}


CATEGORY_KEY_MAP = {
    "dairy & eggs": "dairy",
    "fruits & vegetables": "produce",
    "grains & cereals": "grains",
    "beverages": "beverages",
    "snacks": "snacks",
    "cooking essentials": "cooking",
    "household": "household",
    "meat & fish": "meat",
}


@app.get("/products")
def get_products(category: str = None, price_min: float = None, price_max: float = None):
    """Return products from the database, optionally filtered by category/price."""
    from products import PRODUCT_DATABASE

    # Normalize category key
    cat_key = None
    if category:
        cat_lower = category.lower().strip()
        cat_key = CATEGORY_KEY_MAP.get(cat_lower, cat_lower)

    results = []
    for name, info in PRODUCT_DATABASE.items():
        if cat_key and info["category"] != cat_key:
            continue
        price = info.get("price", 0)
        if price_min is not None and price < price_min:
            continue
        if price_max is not None and price > price_max:
            continue
        results.append({
            "name": name,
            "category": info["category"],
            "price": price,
            "tags": info.get("tags", []),
            "substitutes": info["substitutes"],
            "emoji": CATEGORY_EMOJIS.get(info["category"], "📦"),
        })
    return {"success": True, "products": results, "count": len(results), "category": cat_key or "all"}


@app.post("/parse-voice")
async def parse_voice(req: VoiceCommandRequest):
    from semantic_nlp import parse_voice_command
    result = await parse_voice_command(req.transcript)
    return {"success": True, "parsed": result}
