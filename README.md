# ConnecTable

**Never eat alone at UW-Madison.**

ConnecTable matches students about to eat alone with a small table of 3–4 people around a shared vibe. AI-powered matching, real campus dining halls, custom conversation starters.

## Features

- **Auth** — Signup/login with email + password (NextAuth.js + bcrypt)
- **Vibe-Based Matching** — "Quiet lunch", "Tech talk", "Bad day", "Surprise me"
- **AI Groups** — GPT-4o-mini forms groups by interests, major, year, schedule, proximity
- **Smart Location** — Pin on map, GPS, address search, or pick dorm. Finds optimal dining hall via Haversine distance.
- **Schedule-Aware** — Add classes, auto-detect free time, only match when available
- **AI Icebreakers** — Custom conversation starters per table
- **Check-in** — "I'm here" at any dining hall
- **Privacy First** — No public profiles, no swiping, no followers

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 15, React 19, Tailwind CSS, Framer Motion, Lucide React |
| Auth | NextAuth.js v4 (credentials provider, JWT sessions) |
| Database | PostgreSQL (Neon) + Prisma ORM |
| AI | OpenAI GPT-4o-mini |
| Maps | Leaflet + OpenStreetMap + Nominatim geocoding |

## Setup

```bash
npm install
```

Create `.env` from `.env.example`:
```
OPENAI_API_KEY=your-key
DATABASE_URL="postgresql://..."     # Neon pooled connection
DIRECT_URL="postgresql://..."       # Neon direct connection
NEXTAUTH_SECRET="openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"
```

Push schema and seed:
```bash
npx prisma db push
npm run db:seed
```

Run:
```bash
npm run dev
```

## Deploy to Vercel

1. Push to GitHub
2. Import in Vercel
3. Add Neon Postgres integration (auto-sets DATABASE_URL + DIRECT_URL)
4. Add env vars: OPENAI_API_KEY, NEXTAUTH_SECRET, NEXTAUTH_URL
5. Deploy

## Flow

1. **Sign up** → email + password
2. **Onboard** → year, major, interests, dietary, location
3. **Find Table** → pick vibe + time + hall (or let AI choose)
4. **Get matched** → AI forms group of 3-4
5. **Show up** → table spot, intro prompt, icebreaker question
