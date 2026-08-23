# Smart Grocery Desk

A voice-powered grocery shopping assistant with user accounts, shopping lists, cart, smart suggestions, and price filtering — built with FastAPI + React.

## Live Demo

- **Frontend:** [voice-shopping-asst-chi.vercel.app](https://voice-shopping-asst-chi.vercel.app)
- **Backend:** [voice-shopping-asst-773z.onrender.com](https://voice-shopping-asst-773z.onrender.com)

## Features

### Voice & Search
- **Voice Commands** — Add, remove, search, and move items by voice
- **NLP Processing** — Understands varied phrases: "Add milk", "I want to buy bananas", "Get me bread"
- **Voice Targets** — "Add milk to my list" vs "Add milk to cart" — voice knows the difference
- **Multilingual** — English, Hindi, Spanish, French, German, Japanese
- **Price Range Filtering** — "Find apples under 200", "Tea between 50 and 150"
- **Qualifier Search** — "Find organic apples", "Search for green tea", "Show whole wheat bread"
- **Smart Suggestions** — Recommends items based on shopping history and seasonal availability
- **Product Substitutes** — Suggests alternatives (almond milk for regular milk)

### User Accounts & Data
- **Email/Password Auth** — Register, login, JWT-based sessions
- **Private Shopping Lists** — Every user has their own list
- **Separate Cart** — Cart for items you're actively buying, list for future purchases
- **Move to Cart** — Copy list items to cart, or remove from list after moving
- **Ownership Checks** — Users can never see or modify another user's data

### Product Catalog
- **43+ Real Products** — With prices, categories, tags, and substitutes
- **8 Categories** — Dairy & Eggs, Fruits & Vegetables, Grains & Cereals, Beverages, Snacks, Cooking Essentials, Household, Meat & Fish
- **Real Product Images** — Unsplash photos for every product
- **Auto-Categorization** — Items sorted by category automatically

### UI
- **Professional Design** — Clean, BigBasket-style grocery interface
- **Dark/Light Theme** — Toggle between themes
- **Category Navigation** — Click any category pill to browse real products
- **Mobile-First** — Optimized for phones

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite 7, Tailwind CSS 4, Axios, React Router 7, React Toastify |
| **Backend** | Python 3.11+, FastAPI, SQLAlchemy, SQLite |
| **Auth** | JWT (python-jose), bcrypt password hashing |
| **Voice** | Web Speech API (Chrome/Edge) |
| **Deployment** | Vercel (frontend), Render (backend) |

## Quick Start

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 5000
```

### Frontend
```bash
cd client
npm install

# Create .env file
echo "VITE_BACKEND_URL=http://localhost:5000" > .env

npm run dev
```

Open http://localhost:5173

## API Endpoints

### Auth (no token required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Create account (name, email, password) |
| POST | `/auth/login` | Login, returns JWT token |
| GET | `/auth/me` | Get current user info |

### Shopping List (requires Bearer token)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/list` | Get current user's shopping list |
| POST | `/list` | Add item to list (merges if same item exists) |
| PUT | `/list/{id}` | Update item quantity/price |
| DELETE | `/list/{id}` | Delete item by ID |
| POST | `/list/batch` | Add multiple items at once |
| DELETE | `/list` | Clear entire list |

### Cart (requires Bearer token)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/cart` | Get current user's cart |
| POST | `/cart` | Add item to cart (merges if same item exists) |
| PUT | `/cart/{id}` | Update cart item quantity |
| DELETE | `/cart/{id}` | Delete cart item |
| POST | `/cart/from-list/{id}` | Copy list item to cart |
| DELETE | `/cart` | Clear entire cart |

### Products & Voice (public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/products?category=...` | Browse products by category |
| GET | `/search?q=...&price_min=&price_max=` | Search with price filters |
| GET | `/suggestions` | Smart suggestions + seasonal items |
| GET | `/substitutes/{name}` | Get product substitutes |
| GET | `/categories` | Get category emojis |
| POST | `/parse-voice` | Parse voice transcript into structured command |

## Voice Commands

| Command | Example |
|---------|---------|
| Add to list | "Add milk", "I need apples", "Get me bread" |
| Add with quantity | "Add 2 bottles of water", "Buy 5 oranges" |
| Add to cart | "Add milk to cart", "Put bread in my cart" |
| Remove from list | "Remove milk", "Delete bread" |
| Search | "Find organic apples", "Search for tea under 100" |
| Move to cart | "Move apples to cart" |

## Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) → Add New Project → Import repo
3. Set **Root Directory:** `client`
4. Set **Framework:** Vite
5. Add environment variable:
   | Key | Value |
   |-----|-------|
   | `VITE_BACKEND_URL` | `https://your-backend-url.onrender.com` |
6. Deploy

### Backend (Render)
1. Go to [render.com](https://render.com) → New Web Service → Connect repo
2. Set **Root Directory:** `backend`
3. Set **Language:** Python 3
4. Set **Build Command:** `pip install -r requirements.txt`
5. Set **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Add environment variables:
   | Key | Value |
   |-----|-------|
   | `FRONTEND_ORIGIN` | `https://your-app.vercel.app` |
   | `JWT_SECRET_KEY` | *(generate a random secret)* |
7. Deploy

> **Important:** After deployment, update `FRONTEND_ORIGIN` on Render to match your exact Vercel URL (with `https://`). Without this, CORS will block all requests.

## Project Structure

```
Voice-Shopping-Asst/
├── backend/
│   ├── main.py              # FastAPI app, public product endpoints
│   ├── database.py          # SQLAlchemy ORM models (User, ShoppingListItem, CartItem)
│   ├── schemas.py           # Pydantic request/response schemas
│   ├── auth.py              # JWT token creation, password hashing, auth dependency
│   ├── products.py          # Product database (43 items), categories, fuzzy matching
│   ├── semantic_nlp.py      # Voice NLP parser (intent, quantity, target detection)
│   ├── requirements.txt
│   ├── alembic.ini          # Alembic migration config
│   ├── alembic/             # Database migrations
│   ├── routes/
│   │   ├── auth_routes.py   # Register, login, profile
│   │   ├── list_routes.py   # User-scoped shopping list CRUD
│   │   └── cart_routes.py   # User-scoped cart CRUD
│   └── tests/
│       ├── conftest.py      # Test fixtures, test database setup
│       ├── test_api.py      # API endpoint tests (auth, list, cart, voice)
│       ├── test_products.py # Product matching, normalization tests
│       └── test_semantic_nlp.py # Voice parsing, intent classification tests
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx         # Landing page: voice, search, suggestions, categories
│   │   │   ├── List.jsx         # Shopping list with quantity controls
│   │   │   ├── Cart.jsx         # Cart with quantity controls
│   │   │   ├── Login.jsx        # Login form
│   │   │   └── Register.jsx     # Registration form
│   │   ├── components/
│   │   │   ├── Navbar.jsx       # Auth-aware nav with category pills
│   │   │   ├── Footer.jsx
│   │   │   ├── ProtectedRoute.jsx  # Route guard for authenticated pages
│   │   │   └── ThemeToggle.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Auth state, login/logout/register
│   │   ├── api/
│   │   │   └── client.js        # Axios instance with JWT interceptor
│   │   ├── utils/
│   │   │   └── productVisuals.js # Real product images (Unsplash)
│   │   ├── helper/
│   │   │   └── listening.utils.js # Voice NLP engine + command execution
│   │   ├── App.jsx
│   │   └── index.css
│   ├── vercel.json
│   └── package.json
├── render.yaml              # Render deployment config
└── README.md
```

## Testing

```bash
cd backend
pip install pytest pytest-asyncio
python -m pytest tests/ -v
```

93 tests covering auth, shopping list CRUD, cart CRUD, voice parsing, product matching, and input validation.

## License

MIT
