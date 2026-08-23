from datetime import datetime

PRODUCT_DATABASE = {
    # Dairy
    "milk": {"category": "dairy", "price": 65, "tags": ["organic", "fresh", "whole", "toned"], "substitutes": ["almond milk", "soy milk", "oat milk", "coconut milk"], "seasonal": False, "keywords": ["milk", "doodh"]},
    "cheese": {"category": "dairy", "price": 120, "tags": ["cheddar", "mozzarella", "processed"], "substitutes": ["paneer", "tofu"], "seasonal": False, "keywords": ["cheese", "paneer"]},
    "yogurt": {"category": "dairy", "price": 45, "tags": ["greek", "plain", "flavored"], "substitutes": ["curd", "greek yogurt"], "seasonal": False, "keywords": ["yogurt", "curd", "dahi"]},
    "butter": {"category": "dairy", "price": 55, "tags": ["unsalted", "salted", "amul"], "substitutes": ["ghee", "olive oil spread"], "seasonal": False, "keywords": ["butter", "makhan"]},
    "cream": {"category": "dairy", "price": 80, "tags": ["fresh", "cooking", "whipping"], "substitutes": ["coconut cream"], "seasonal": False, "keywords": ["cream", "malai"]},
    "eggs": {"category": "dairy", "price": 90, "tags": ["white", "brown", "organic", "free range"], "substitutes": ["tofu scramble", "banana"], "seasonal": False, "keywords": ["eggs", "anda", "egg"]},

    # Produce
    "apples": {"category": "produce", "price": 180, "tags": ["organic", "green", "red", "fuji", "royal gala"], "substitutes": ["pears", "bananas"], "seasonal": True, "season_months": [9, 10, 11], "keywords": ["apple", "apples", "seb"]},
    "bananas": {"category": "produce", "price": 50, "tags": ["ripe", "raw", "organic"], "substitutes": ["plantains", "mangoes"], "seasonal": False, "keywords": ["banana", "bananas", "kela"]},
    "tomatoes": {"category": "produce", "price": 40, "tags": ["cherry", "roma", "on the vine", "local"], "substitutes": ["canned tomatoes", "tomato paste"], "seasonal": True, "season_months": [5, 6, 7, 8], "keywords": ["tomato", "tomatoes", "tamatar"]},
    "onions": {"category": "produce", "price": 35, "tags": ["red", "white", "spring"], "substitutes": ["shallots", "spring onions"], "seasonal": False, "keywords": ["onion", "onions", "pyaaz"]},
    "potatoes": {"category": "produce", "price": 30, "tags": ["sweet", "baby", "russet"], "substitutes": ["sweet potatoes", "yams"], "seasonal": False, "keywords": ["potato", "potatoes", "aloo"]},
    "carrots": {"category": "produce", "price": 45, "tags": ["organic", "baby", "orange"], "substitutes": ["beetroot"], "seasonal": True, "season_months": [11, 12, 1, 2], "keywords": ["carrot", "carrots", "gajar"]},
    "spinach": {"category": "produce", "price": 35, "tags": ["organic", "baby", "bunch"], "substitutes": ["kale", "lettuce", "methi"], "seasonal": True, "season_months": [10, 11, 12, 1, 2, 3], "keywords": ["spinach", "palak"]},
    "lettuce": {"category": "produce", "price": 60, "tags": ["iceberg", "romaine", "butter"], "substitutes": ["cabbage", "kale"], "seasonal": False, "keywords": ["lettuce", "salad"]},
    "cucumber": {"category": "produce", "price": 30, "tags": ["english", "baby", "organic"], "substitutes": ["zucchini"], "seasonal": True, "season_months": [3, 4, 5, 6], "keywords": ["cucumber", "kheera"]},
    "lemon": {"category": "produce", "price": 20, "tags": ["lime", "organic"], "substitutes": ["lime", "vinegar"], "seasonal": False, "keywords": ["lemon", "lemons", "nimbu"]},
    "garlic": {"category": "produce", "price": 50, "tags": ["fresh", "organic", "black"], "substitutes": ["garlic powder", "ginger"], "seasonal": False, "keywords": ["garlic", "lahsun"]},
    "ginger": {"category": "produce", "price": 60, "tags": ["fresh", "organic"], "substitutes": ["ginger powder"], "seasonal": False, "keywords": ["ginger", "adrak"]},
    "green chili": {"category": "produce", "price": 25, "tags": ["fresh", "organic"], "substitutes": ["jalapeno", "chili flakes"], "seasonal": False, "keywords": ["chili", "chilli", "green chili", "mirch"]},
    "coriander": {"category": "produce", "price": 15, "tags": ["fresh", "organic", "bunch"], "substitutes": ["parsley", "cilantro"], "seasonal": False, "keywords": ["coriander", "dhaniya", "cilantro"]},

    # Grains
    "rice": {"category": "grains", "price": 120, "tags": ["basmati", "sona masoori", "brown", "organic"], "substitutes": ["quinoa", "couscous"], "seasonal": False, "keywords": ["rice", "chawal"]},
    "bread": {"category": "grains", "price": 45, "tags": ["whole wheat", "white", "multigrain", "brown"], "substitutes": ["roti", "tortilla", "pita"], "seasonal": False, "keywords": ["bread", "roti"]},
    "pasta": {"category": "grains", "price": 80, "tags": ["penne", "spaghetti", "whole wheat", "organic"], "substitutes": ["noodles", "vermicelli"], "seasonal": False, "keywords": ["pasta", "noodles"]},
    "oats": {"category": "grains", "price": 150, "tags": ["rolled", "steel cut", "instant", "organic"], "substitutes": ["cereal", "muesli"], "seasonal": False, "keywords": ["oats", "oatmeal"]},
    "flour": {"category": "grains", "price": 60, "tags": ["whole wheat", "all purpose", "maida", "atta"], "substitutes": ["atta", "maida"], "seasonal": False, "keywords": ["flour", "atta", "maida"]},

    # Beverages
    "tea": {"category": "beverages", "price": 100, "tags": ["green", "black", "herbal", "earl grey"], "substitutes": ["green tea", "coffee"], "seasonal": False, "keywords": ["tea", "chai"]},
    "coffee": {"category": "beverages", "price": 250, "tags": ["instant", "ground", "espresso", "arabica"], "substitutes": ["tea", "hot chocolate"], "seasonal": False, "keywords": ["coffee"]},
    "juice": {"category": "beverages", "price": 80, "tags": ["orange", "mango", "mixed", "fresh"], "substitutes": ["smoothie", "water"], "seasonal": False, "keywords": ["juice", "squash"]},
    "water": {"category": "beverages", "price": 20, "tags": ["sparkling", "mineral", "coconut"], "substitutes": ["sparkling water", "coconut water"], "seasonal": False, "keywords": ["water", "paani"]},

    # Snacks
    "chips": {"category": "snacks", "price": 30, "tags": ["salted", "bbq", "cream onion", "masala"], "substitutes": ["popcorn", "nuts"], "seasonal": False, "keywords": ["chips", "crisps"]},
    "biscuits": {"category": "snacks", "price": 25, "tags": ["digestive", "cream", "glucose", "marie"], "substitutes": ["cookies", "crackers"], "seasonal": False, "keywords": ["biscuit", "biscuits", "cookie"]},
    "chocolate": {"category": "snacks", "price": 80, "tags": ["dark", "milk", "white", "truffle"], "substitutes": ["candy", "dates"], "seasonal": False, "keywords": ["chocolate", "choco"]},
    "nuts": {"category": "snacks", "price": 300, "tags": ["almonds", "cashews", "pistachios", "peanuts"], "substitutes": ["seeds", "trail mix"], "seasonal": False, "keywords": ["nuts", "almonds", "cashews", "dry fruits"]},

    # Cooking
    "oil": {"category": "cooking", "price": 150, "tags": ["olive", "sunflower", "mustard", "coconut"], "substitutes": ["olive oil", "ghee", "butter"], "seasonal": False, "keywords": ["oil", "cooking oil"]},
    "salt": {"category": "cooking", "price": 25, "tags": ["iodised", "rock", "sea", "black"], "substitutes": ["rock salt", "sea salt"], "seasonal": False, "keywords": ["salt", "namak"]},
    "sugar": {"category": "cooking", "price": 45, "tags": ["white", "brown", "jaggery", "stevia"], "substitutes": ["honey", "jaggery", "stevia"], "seasonal": False, "keywords": ["sugar", "cheeni"]},
    "spices": {"category": "cooking", "price": 200, "tags": ["turmeric", "cumin", "coriander", "garam masala"], "substitutes": ["masala mix"], "seasonal": False, "keywords": ["spice", "spices", "masala"]},

    # Household
    "soap": {"category": "household", "price": 40, "tags": ["antibacterial", "moisturising", "herbal"], "substitutes": ["body wash", "shower gel"], "seasonal": False, "keywords": ["soap", "hand soap"]},
    "detergent": {"category": "household", "price": 180, "tags": ["powder", "liquid", "machine wash"], "substitutes": ["washing powder"], "seasonal": False, "keywords": ["detergent", "washing powder"]},
    "tissues": {"category": "household", "price": 60, "tags": ["facial", "toilet", "kitchen"], "substitutes": ["napkins", "paper towels"], "seasonal": False, "keywords": ["tissue", "tissues", "napkins"]},

    # Meat
    "chicken": {"category": "meat", "price": 250, "tags": ["boneless", "curry cut", "breast", "thigh"], "substitutes": ["paneer", "tofu", "soya chunks"], "seasonal": False, "keywords": ["chicken", "murgi"]},
    "fish": {"category": "meat", "price": 350, "tags": ["rohu", "pomfret", "surmai", "boneless"], "substitutes": ["paneer", "tofu"], "seasonal": False, "keywords": ["fish", "machli"]},
    "mutton": {"category": "meat", "price": 500, "tags": ["curry cut", "boneless", "goat"], "substitutes": ["chicken", "soya chunks"], "seasonal": False, "keywords": ["mutton", "goat"]},
}

SEASONAL_SUGGESTIONS = {
    1: ["carrots", "spinach", "oranges", "peas"],
    2: ["carrots", "spinach", "mangoes", "peas"],
    3: ["mangoes", "cucumber", "cabbage"],
    4: ["mangoes", "cucumber", "watermelon"],
    5: ["mangoes", "tomatoes", "watermelon", "cucumber"],
    6: ["tomatoes", "watermelon", "corn", "cucumber"],
    7: ["tomatoes", "corn", "green chili"],
    8: ["tomatoes", "corn", "okra"],
    9: ["apples", "grapes", "pomegranate"],
    10: ["apples", "carrots", "beetroot", "spinach"],
    11: ["carrots", "spinach", "beetroot", "oranges"],
    12: ["carrots", "spinach", "oranges", "peas"],
}

CATEGORY_EMOJIS = {
    "dairy": "🥛",
    "produce": "🥬",
    "grains": "🌾",
    "beverages": "🥤",
    "snacks": "🍿",
    "cooking": "🍳",
    "household": "🏠",
    "meat": "🥩",
    "uncategorized": "📦",
}


def categorize_item(item_name):
    name_lower = item_name.lower().strip()
    for product, info in PRODUCT_DATABASE.items():
        if name_lower in info["keywords"] or product in name_lower:
            return info["category"]
    return "uncategorized"


def get_substitutes(item_name):
    name_lower = item_name.lower().strip()
    for product, info in PRODUCT_DATABASE.items():
        if name_lower in info["keywords"] or product in name_lower:
            return info["substitutes"]
    return []


def get_seasonal_items():
    current_month = datetime.now().month
    items = SEASONAL_SUGGESTIONS.get(current_month, [])
    return [{"name": item, "category": categorize_item(item)} for item in items]


def get_smart_suggestions(recent_items):
    suggestions = []
    seen = set()

    for item in recent_items:
        name = item.lower() if isinstance(item, str) else item.get("name", "").lower()
        for product, info in PRODUCT_DATABASE.items():
            if name in info["keywords"] or product in name:
                for sub in info["substitutes"]:
                    if sub not in seen:
                        suggestions.append({
                            "name": sub,
                            "category": categorize_item(sub),
                            "reason": f"Similar to {name}",
                        })
                        seen.add(sub)

    month = datetime.now().month
    for seasonal_name in SEASONAL_SUGGESTIONS.get(month, []):
        if seasonal_name not in seen:
            suggestions.append({
                "name": seasonal_name,
                "category": categorize_item(seasonal_name),
                "reason": "In season now",
            })
            seen.add(seasonal_name)

    return suggestions[:8]


def search_products(query, price_min=None, price_max=None, category=None, tags=None):
    """Search products with optional price range, category, and tag filters."""
    query_lower = query.lower().strip()
    results = []

    for product, info in PRODUCT_DATABASE.items():
        # Text match: product name or any keyword
        text_match = query_lower in product or any(query_lower in kw for kw in info["keywords"])
        if not text_match:
            continue

        # Price filter
        price = info.get("price", 0)
        if price_min is not None and price < price_min:
            continue
        if price_max is not None and price > price_max:
            continue

        # Category filter
        if category and info["category"] != category.lower().strip():
            continue

        # Tag filter (all specified tags must be present)
        if tags:
            product_tags = [t.lower() for t in info.get("tags", [])]
            if not all(any(t in pt for pt in product_tags) for t in tags):
                continue

        results.append({
            "name": product,
            "category": info["category"],
            "price": price,
            "tags": info.get("tags", []),
            "substitutes": info["substitutes"],
        })

    return results


PLURAL_MAP = {
    "tomatoes": "tomato", "potatoes": "potato", "leaves": "leaf",
    "knives": "knife", "wives": "wife", "lives": "life",
    "halves": "half", "wolves": "wolf", "shelves": "shelf",
    "classes": "class", "buses": "bus", "foxes": "fox",
    "branches": "branch", "aches": "ache", "ices": "ice",
}

PLURAL_SUFFIXES = [
    ("ies", "y"), ("ves", "f"), ("ses", "s"), ("zes", "z"),
    ("ches", "ch"), ("shes", "sh"), ("xes", "x"),
    ("oes", "o"), ("sses", "ss"), ("es", ""),
    ("s", ""),
]

ALIAS_MAP = {}
for product, info in PRODUCT_DATABASE.items():
    ALIAS_MAP[product] = product
    for kw in info["keywords"]:
        ALIAS_MAP[kw] = product
    for sub in info["substitutes"]:
        ALIAS_MAP[sub] = sub


def normalize_name(name):
    name = name.lower().strip()
    name = ''.join(c for c in name if c.isalnum() or c.isspace()).strip()

    if name in PLURAL_MAP:
        return PLURAL_MAP[name]

    if name.endswith('s') and not name.endswith('ss'):
        for suffix, replacement in PLURAL_SUFFIXES:
            if name.endswith(suffix):
                base = name[:-len(suffix)] + replacement
                if len(base) >= 3:
                    return base

    return name


def fuzzy_match_item(name):
    normalized = normalize_name(name)
    name_lower = name.lower().strip()

    if name_lower in ALIAS_MAP:
        return ALIAS_MAP[name_lower]

    if normalized in ALIAS_MAP:
        return ALIAS_MAP[normalized]

    for alias, product in ALIAS_MAP.items():
        if normalized == normalize_name(alias):
            return product

    for product, info in PRODUCT_DATABASE.items():
        if name_lower in info["keywords"] or product in name_lower or name_lower in product:
            return product

    return normalized
