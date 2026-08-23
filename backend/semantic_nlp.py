import os
import json
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from dotenv import load_dotenv

load_dotenv()

# ---------------------------------------------------------------------------
# Intent templates for TF-IDF fallback
# ---------------------------------------------------------------------------
INTENT_TEMPLATES = {
    "add": [
        "add {item} to my list",
        "i need {item}",
        "i want to buy {item}",
        "get me {item}",
        "put {item} in my cart",
        "can you add {item}",
        "i would like {item}",
        "please add {item}",
        "buy {item}",
        "grab {item}",
        "pick up {item}",
        "add {item}",
        "i want {item}",
        "i need to get {item}",
        "place {item} on my list",
        "add some {item}",
        "bring me {item}",
        "i'm looking for {item}",
        "give me {item}",
        "add {item} also",
        "and {item}",
        "plus {item}",
        "don't forget {item}",
        "remember to buy {item}",
        "i'm out of {item}",
        "we need {item}",
        "get {item} too",
        "add {item} to cart",
        "put {item} on the list",
    ],
    "remove": [
        "remove {item} from my list",
        "delete {item}",
        "take {item} off my list",
        "drop {item}",
        "i don't need {item} anymore",
        "remove {item}",
        "delete {item} from cart",
        "take away {item}",
        "cancel {item}",
        "remove {item} also",
        "get rid of {item}",
        "i changed my mind about {item}",
        "nevermind about {item}",
    ],
    "search": [
        "search for {item}",
        "find {item}",
        "look for {item}",
        "where is {item}",
        "do we have {item}",
        "show me {item}",
        "search {item}",
        "find me {item}",
        "look up {item}",
        "where can i find {item}",
        "is there {item}",
        "check for {item}",
    ],
}

# ---------------------------------------------------------------------------
# Keyword-based intent signals
# ---------------------------------------------------------------------------

REMOVE_SIGNALS = [
    r"\b(?:remove|delete|drop|cancel|get rid of|take (?:off|away)|don'?t need|no more|nevermind|never mind|i changed my mind)\b",
]

ADD_SIGNALS = [
    r"\b(?:add|buy|get|grab|pick up|put|bring|give|need|want|remember|don'?t forget|i'?m out of|we need)\b",
]

SEARCH_SIGNALS = [
    r"\b(?:search|find|look (?:for|up)|where|show me|is there|do we have|check)\b",
]

NEGATION_PHRASES = [
    r"\b(?:not|no longer|nevermind|never mind|i changed my mind)\b",
    r"\b(?:don'?t|do not)\s+(?:need|want|use|buy)\b",
]

# ---------------------------------------------------------------------------
# Price range patterns
# ---------------------------------------------------------------------------

PRICE_PATTERNS = [
    # "under $5", "under 50", "under rs 100", "below 50"
    (r"(?:under|below|less than|cheaper than|max(?:imum)?|up to)\s*(?:rs\.?|₹|\$|dollars?)?\s*(\d+(?:\.\d+)?)",
     "max"),
    # "over $5", "above 50", "more than 100", "at least 20"
    (r"(?:over|above|more than|greater than|min(?:imum)?|at least)\s*(?:rs\.?|₹|\$|dollars?)?\s*(\d+(?:\.\d+)?)",
     "min"),
    # "between 10 and 50", "from 20 to 100", "10-50"
    (r"(?:between|from)\s*(?:rs\.?|₹|\$|dollars?)?\s*(\d+(?:\.\d+)?)\s*(?:and|to|-)\s*(?:rs\.?|₹|\$|dollars?)?\s*(\d+(?:\.\d+)?)",
     "range"),
]

# Common qualifiers/brands/types that can precede an item name
QUALIFIER_PATTERNS = [
    r"\b(organic)\b",
    r"\b(green|black|herbal|earl grey|masala)\b",  # tea types
    r"\b(whole wheat|white|multigrain|brown|sourdough)\b",  # bread types
    r"\b(boneless|curry cut|breast|thigh)\b",  # meat cuts
    r"\b(olive|sunflower|mustard|coconut|canola)\b",  # oil types
    r"\b(rolled|steel cut|instant)\b",  # oat types
    r"\b(rock|sea|iodised|black)\b",  # salt types
    r"\b(cherry|roma|local)\b",  # tomato types
    r"\b(red|white|spring)\b",  # onion types
    r"\b(basmati|sona masoori|brown)\b",  # rice types
    r"\b(penne|spaghetti|fusilli)\b",  # pasta shapes
    r"\b(cheddar|mozzarella|processed)\b",  # cheese types
    r"\b(fresh|baby|raw|ripe)\b",  # general qualifiers
    r"\b(almonds|cashews|pistachios|peanuts)\b",  # nut types
    r"\b(iceberg|romaine)\b",  # lettuce types
]

# Category keywords for category-based search
CATEGORY_KEYWORDS = {
    "dairy": ["dairy", "dairy items", "dairy products", "milk products"],
    "produce": ["produce", "fruits", "vegetables", "fruits and vegetables", "veggies", "fresh produce", "greens"],
    "grains": ["grains", "cereals", "grains and cereals", "bread items", "bakery"],
    "beverages": ["beverages", "drinks", "drinks items", "cold drinks", "hot drinks"],
    "snacks": ["snacks", "snack items", "chips", "biscuits", "cookies", "chocolate"],
    "cooking": ["cooking", "cooking essentials", "masala", "spices", "oil items", "kitchen items"],
    "household": ["household", "household items", "cleaning", "cleaning supplies", "detergent items"],
    "meat": ["meat", "meat and fish", "non veg", "non-veg", "chicken", "fish", "mutton"],
}

NUMBER_WORDS = {
    'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
    'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
    'eleven': 11, 'twelve': 12, 'dozen': 12, 'half': 0.5, 'quarter': 0.25,
    'couple': 2, 'few': 3,
}

QUANTITY_UNITS = [
    'bottles', 'bottle', 'packets', 'packet', 'packs', 'pack',
    'kg', 'kgs', 'kilos', 'kilogram', 'kilograms',
    'grams', 'g', 'litres', 'liters', 'litre', 'liter', 'l',
    'pieces', 'piece', 'pcs', 'dozen', 'dozens',
    'boxes', 'box', 'cans', 'can', 'bags', 'bag',
    'cartons', 'carton', 'pouches', 'pouch', 'tins', 'tin',
    'servings', 'serving', 'ml', 'ounces', 'oz', 'pounds', 'lbs',
]

UNIVERSAL_STOPWORDS = {
    'of', 'the', 'a', 'an', 'some', 'any', 'my', 'me', 'i',
    'to', 'for', 'with', 'and', 'or', 'but', 'in', 'on', 'at',
    'hey', 'yo', 'hi', 'hello', 'um', 'uh', 'like', 'yeah',
    'okay', 'ok', 'so', 'well', 'right', 'just', 'also', 'too',
    'want', 'need', 'would', 'get', 'buy', 'have',
    'can', 'you', 'could', 'please', 'put', 'place', 'bring',
    'give', 'find', 'search', 'look', 'show', 'tell',
    'from', 'list', 'cart', 'kilo', 'half', 'quarter',
    'bottle', 'bottles', 'packet', 'packets', 'pack', 'packs',
    'piece', 'pieces', 'dozen', 'box', 'boxes', 'can', 'cans',
    'bag', 'bags', 'gram', 'grams', 'kg', 'kgs', 'liter', 'liters',
    'litre', 'litres', 'ml', 'oz', 'ounces', 'lbs', 'pounds',
    'add', 'remove', 'delete', 'drop', 'grab', 'pick',
    'take', 'cancel', 'forget', 'buying', 'getting',
    'mujhe', 'chahiye', 'doodh', 'kharid',
    'under', 'below', 'above', 'over', 'less', 'more', 'than',
    'between', 'range', 'rs', 'rupees', 'dollars',
}


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _detect_intent_by_keywords(text):
    """Rule-based intent detection using regex signals."""
    cleaned = text.lower().strip()
    for w in ["um", "uh", "like", "you know", "so", "well", "actually", "basically",
              "right", "yeah", "yep", "okay", "ok", "hmm", "err", "ah"]:
        cleaned = re.sub(rf'\b{re.escape(w)}\b', '', cleaned)
    cleaned = re.sub(r'\s+', ' ', cleaned).strip()

    if not cleaned:
        return None, 0.0, True

    has_remove_signal = any(re.search(p, cleaned) for p in REMOVE_SIGNALS)
    has_negation = any(re.search(p, cleaned) for p in NEGATION_PHRASES)
    if has_remove_signal or has_negation:
        return "remove", 0.95, False

    has_add_signal = any(re.search(p, cleaned) for p in ADD_SIGNALS)
    has_search_signal = any(re.search(p, cleaned) for p in SEARCH_SIGNALS)

    if has_add_signal:
        return "add", 0.90, False
    if has_search_signal:
        return "search", 0.90, False

    words = cleaned.split()
    if len(words) <= 3:
        return "add", 0.55, True

    return None, 0.0, True


def _tfidf_classify(cleaned_text):
    """TF-IDF cosine similarity classification as fallback."""
    vectorizer = TfidfVectorizer(analyzer='char_wb', ngram_range=(2, 4), max_features=5000)
    all_docs = []
    all_labels = []
    for intent, templates in INTENT_TEMPLATES.items():
        for t in templates:
            all_docs.append(t)
            all_labels.append(intent)
    tfidf_matrix = vectorizer.fit_transform(all_docs)
    input_vec = vectorizer.transform([cleaned_text])
    sims = cosine_similarity(input_vec, tfidf_matrix).flatten()
    best_idx = sims.argmax()
    return all_labels[best_idx], float(sims[best_idx])


def classify_intent(text):
    """Classify user intent with ambiguity detection."""
    intent, confidence, is_ambiguous = _detect_intent_by_keywords(text)

    if intent and confidence >= 0.8:
        return {"intent": intent, "confidence": confidence, "ambiguity": "none"}
    if intent and confidence >= 0.5 and not is_ambiguous:
        return {"intent": intent, "confidence": confidence, "ambiguity": "low"}

    cleaned = text.lower().strip()
    for w in ["um", "uh", "like", "you know", "so", "well", "actually", "basically",
              "right", "yeah", "yep", "okay", "ok", "hmm", "err", "ah"]:
        cleaned = re.sub(rf'\b{re.escape(w)}\b', '', cleaned)
    cleaned = re.sub(r'\s+', ' ', cleaned).strip()

    tfidf_intent, tfidf_conf = _tfidf_classify(cleaned)

    if intent and tfidf_intent == intent:
        return {"intent": intent, "confidence": max(confidence, tfidf_conf), "ambiguity": "low"}

    if tfidf_conf >= 0.6:
        return {
            "intent": tfidf_intent,
            "confidence": tfidf_conf,
            "ambiguity": "low" if tfidf_conf >= 0.7 else "high",
        }

    if intent:
        return {"intent": intent, "confidence": confidence, "ambiguity": "high"}

    return {"intent": "add", "confidence": 0.3, "ambiguity": "high"}


def split_items_from_text(text):
    """Split comma/and-separated items from transcript."""
    text = re.sub(r'\s*,\s*', '|||', text)
    text = re.sub(r'\s*;\s*', '|||', text)
    text = re.sub(r'\s+also\s+', '|||', text)
    text = re.sub(r'\s+then\s+', '|||', text)
    text = re.sub(r'\s+plus\s+', '|||', text)
    text = re.sub(r'\s+and\s+', '|||', text)
    parts = text.split('|||')
    return [p.strip() for p in parts if p.strip()]


def extract_quantity(text):
    """Extract quantity from text and return (cleaned_item_name, quantity)."""
    quantity = 1
    clean = text

    num_match = re.search(r'\b(\d+)\b', clean)
    if num_match:
        quantity = int(num_match.group(1))
        clean = clean.replace(num_match.group(0), '', 1).strip()

    for word, num in NUMBER_WORDS.items():
        if re.search(rf'\b{word}\b', clean):
            quantity = num
            clean = re.sub(rf'\b{word}\b', '', clean).strip()
            break

    for unit in QUANTITY_UNITS:
        clean = re.sub(rf'\b{re.escape(unit)}\b', '', clean, flags=re.IGNORECASE).strip()

    clean = re.sub(r'\s+', ' ', clean).strip()
    return clean, quantity


def clean_item_name(name):
    """Strip stopwords and punctuation from an extracted item name."""
    words = name.split()
    cleaned = [w for w in words if w.lower() not in UNIVERSAL_STOPWORDS]
    result = ' '.join(cleaned)
    result = re.sub(r'\s+', ' ', result).strip()
    result = result.strip('.,!?;:')
    return result


def extract_price_range(text):
    """Extract price constraints from text.

    Returns dict: { price_min, price_max } or empty dict.
    Handles: "under $5", "between 10 and 50", "above 20", "below 100 rupees", etc.
    """
    cleaned = text.lower().strip()
    price_filter = {}

    for pattern, mode in PRICE_PATTERNS:
        match = re.search(pattern, cleaned, re.IGNORECASE)
        if match:
            if mode == "max":
                price_filter["price_max"] = float(match.group(1))
            elif mode == "min":
                price_filter["price_min"] = float(match.group(1))
            elif mode == "range":
                price_filter["price_min"] = float(match.group(1))
                price_filter["price_max"] = float(match.group(2))
            break

    # Also handle "under 50" without currency prefix (plain number patterns)
    if not price_filter:
        under_match = re.search(r'\bunder\s+(\d+)\b', cleaned)
        if under_match:
            price_filter["price_max"] = float(under_match.group(1))

        above_match = re.search(r'\babove\s+(\d+)\b', cleaned)
        if above_match:
            price_filter["price_min"] = float(above_match.group(1))

    return price_filter


def extract_qualifiers(text):
    """Extract product qualifiers (brand, type, variety) from text.

    Returns list of qualifier strings, e.g. ["organic", "green"].
    """
    cleaned = text.lower().strip()
    qualifiers = []
    seen = set()

    for pattern in QUALIFIER_PATTERNS:
        matches = re.findall(pattern, cleaned, re.IGNORECASE)
        for m in matches:
            if m.lower() not in seen and m.lower() not in UNIVERSAL_STOPWORDS:
                qualifiers.append(m.lower())
                seen.add(m.lower())

    return qualifiers


def detect_target(text):
    """Detect whether the user is targeting 'cart' or 'list'."""
    cleaned = text.lower().strip()
    if re.search(r'\b(?:to\s+)?my\s+cart\b', cleaned) or re.search(r'\badd.*\bto\s+cart\b', cleaned):
        return "cart"
    if re.search(r'\b(?:to\s+)?(?:my\s+)?list\b', cleaned) or re.search(r'\badd.*\bto\s+(?:my\s+)?list\b', cleaned):
        return "list"
    if re.search(r'\bfrom\s+cart\b', cleaned):
        return "cart"
    if re.search(r'\bfrom\s+(?:my\s+)?list\b', cleaned):
        return "list"
    return None


def parse_voice_command_local(transcript):
    """Parse a voice transcript into a structured command locally."""
    intent_result = classify_intent(transcript)
    intent = intent_result["intent"]
    confidence = intent_result["confidence"]
    ambiguity = intent_result["ambiguity"]
    target = detect_target(transcript)

    raw_items = split_items_from_text(transcript)
    items = []
    for raw in raw_items:
        name, qty = extract_quantity(raw)
        name = clean_item_name(name)
        if name:
            items.append({"name": name, "quantity": qty})

    # Extract search-specific filters
    search_filters = {}
    if intent == "search":
        # Detect category-based search
        cleaned_transcript = transcript.lower().strip()
        detected_category = None
        for cat_key, keywords in CATEGORY_KEYWORDS.items():
            for kw in keywords:
                if re.search(rf'\b{re.escape(kw)}\b', cleaned_transcript):
                    detected_category = cat_key
                    break
            if detected_category:
                break

        if detected_category:
            search_filters["category"] = detected_category

        price_filter = extract_price_range(transcript)
        if price_filter:
            search_filters.update(price_filter)
        qualifiers = extract_qualifiers(transcript)
        if qualifiers:
            search_filters["qualifiers"] = qualifiers

    return {
        "action": intent,
        "target": target or "list",
        "items": items,
        "search_filters": search_filters if search_filters else None,
        "confidence": confidence,
        "ambiguity": ambiguity,
        "source": "local",
        "raw_transcript": transcript,
    }


# ---------------------------------------------------------------------------
# OpenAI fallback
# ---------------------------------------------------------------------------

async def parse_with_openai(transcript):
    """Use OpenAI as a semantic fallback for difficult transcripts."""
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return None

    try:
        from openai import AsyncOpenAI
        client = AsyncOpenAI(api_key=api_key)

        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": """You are a shopping assistant parser. Parse the user's voice command into structured JSON.

Return ONLY valid JSON with this structure:
{
  "action": "add" | "remove" | "search",
  "target": "list" | "cart",
  "items": [{"name": "item_name", "quantity": 1}],
  "search_filters": {"price_min": null, "price_max": null, "qualifiers": []},
  "ambiguity": "none" | "low" | "high"
}

Rules:
- Extract item names (remove filler words, verbs, prepositions)
- Detect quantity from context (e.g., "two bottles" → quantity: 2)
- Handle multiple items: "bread, milk and eggs" → 3 items
- "add", "i need", "i want", "get me", "buy" → action: "add"
- "remove", "delete", "take off", "don't need" → action: "remove"
- "search", "find", "look for" → action: "search"
- "to cart" → target: "cart", "to list" → target: "list"
- For search: extract price constraints ("under $5" → price_max: 5, "between 10 and 50" → price_min: 10, price_max: 50)
- For search: extract qualifiers ("organic apples" → qualifiers: ["organic"])
- Single words with no verb → action: "add", ambiguity: "low"
- Negation ("don't need", "no more") → action: "remove"
- If unclear, default to "add" action with ambiguity: "high\""""
                },
                {
                    "role": "user",
                    "content": transcript
                }
            ],
            temperature=0.1,
            max_tokens=300,
        )

        result_text = response.choices[0].message.content.strip()
        result_text = re.sub(r'```json\n?', '', result_text)
        result_text = re.sub(r'\n?```', '', result_text)
        result = json.loads(result_text)
        result["source"] = "openai"
        result["confidence"] = 0.95
        result["raw_transcript"] = transcript
        return result

    except Exception as e:
        print(f"OpenAI parsing error: {e}")
        return None


# ---------------------------------------------------------------------------
# Main entry point
# ---------------------------------------------------------------------------

async def parse_voice_command(transcript):
    """Parse voice command with local NLP, falling back to OpenAI if needed."""
    local_result = parse_voice_command_local(transcript)

    if local_result["confidence"] >= 0.6 and local_result["ambiguity"] in ("none", "low"):
        return local_result

    openai_result = await parse_with_openai(transcript)
    if openai_result:
        return openai_result

    return local_result
