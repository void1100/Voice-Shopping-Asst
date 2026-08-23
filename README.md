# Adish Hussain

A voice-powered shopping list manager with smart suggestions, built with FastAPI + React.

## Features

- **Voice Commands** — Add, remove, and search items by voice ("Add 2 bottles of milk", "I need apples")
- **NLP Processing** — Understands varied phrases: "Add milk", "I want to buy bananas", "Get me bread"
- **Multilingual** — Voice support for English, Hindi, Spanish, French, German, Japanese
- **Smart Suggestions** — Recommends items based on shopping history and seasonal availability
- **Product Substitutes** — Suggests alternatives (e.g., almond milk for regular milk)
- **Auto-Categorization** — Items sorted into Dairy, Produce, Grains, etc.
- **Quantity Management** — Specify quantities via voice ("Buy 5 oranges")
- **Voice Search** — Search products by voice with price filtering
- **Mobile-First UI** — Dark glassmorphism design, optimized for phones

## Tech Stack

**Frontend:** React, Vite, Tailwind CSS, Axios, React Router, React Toastify  
**Backend:** Python, FastAPI, SQLAlchemy, SQLite  
**Voice:** Web Speech API (Chrome/Edge)

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

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/list` | Get all items |
| POST | `/add` | Add item |
| PUT | `/update/{id}` | Update item quantity/price |
| DELETE | `/delete/{id}` | Delete item by ID |
| DELETE | `/remove/{name}` | Delete item by name |
| GET | `/suggestions` | Get smart suggestions + seasonal items |
| GET | `/search?q=...` | Search products |
| GET | `/substitutes/{name}` | Get product substitutes |
| GET | `/categories` | Get category emojis |

## Deployment

### Frontend (Vercel)
1. Push to GitHub
2. Import repo on [vercel.com](https://vercel.com)
3. Set env variable: `VITE_BACKEND_URL=https://your-backend-url`
4. Deploy

### Backend (Render)
1. Push to GitHub
2. Create a new Web Service on [render.com](https://render.com)
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Deploy

### Backend (Railway)
1. Push to GitHub
2. New Project > Deploy from GitHub
3. Railway auto-detects Python
4. Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

## Voice Commands

| Command | Example |
|---------|---------|
| Add item | "Add milk", "I need apples", "Get me bread" |
| Add with quantity | "Add 2 bottles of water", "Buy 5 oranges" |
| Remove item | "Remove milk", "Delete bread" |
| Search | "Find organic apples", "Search for tea" |

## Project Structure

```
Voice-Shopping-Asst/
├── backend/
│   ├── main.py          # FastAPI routes
│   ├── database.py      # SQLite + SQLAlchemy setup
│   ├── models.py        # Pydantic schemas
│   ├── products.py      # Product DB, categories, substitutes
│   └── requirements.txt
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx       # Landing page with voice + suggestions
│   │   │   └── List.jsx       # Shopping list with quantity controls
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── Footer.jsx
│   │   ├── helper/
│   │   │   └── listening.utils.js  # Voice NLP engine
│   │   ├── App.jsx
│   │   └── index.css
│   ├── .env
│   └── package.json
├── render.yaml          # Render deployment config
└── README.md
```
