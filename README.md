<p align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" />
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" />
  <img src="https://img.shields.io/badge/Anthropic_Claude-D97757?style=for-the-badge&logo=anthropic&logoColor=white" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" />
  <img src="https://img.shields.io/badge/Leaflet-199900?style=for-the-badge&logo=leaflet&logoColor=white" />
</p>

<h1 align="center">ConnecTable</h1>
<p align="center"><strong>Never eat alone at UW-Madison.</strong></p>
<p align="center">
  AI-powered social dining — join a small table of 3–4 students around a shared vibe.<br/>
  Built with Claude by Anthropic. Deployed on Vercel.
</p>

---

## What is ConnecTable?

ConnecTable matches students who are about to eat alone with a small group of 3–4 people around a shared vibe or topic. You pick your mood, choose a time, and AI handles the rest — finding your people, picking the optimal dining hall based on everyone's location, and generating a custom conversation starter so there's zero awkwardness when you sit down.

No public profiles. No swiping. No followers. Just real meals with real people.

## Features

| Feature | Description |
|---------|-------------|
| 🔐 **Auth** | Email + password signup/login via NextAuth.js |
| 🎯 **Vibe Matching** | 12 vibes — "Quiet lunch", "Tech talk", "Bad day", "Surprise me", etc. |
| 🤖 **AI Groups** | Claude forms balanced groups by interests, major, year, schedule, proximity |
| 📍 **Smart Location** | Pin on map, GPS, address search (Nominatim), or pick your dorm. Finds optimal dining hall via Haversine distance. |
| 📅 **Schedule-Aware** | Add your classes, auto-detect free time, only match when available |
| 💬 **AI Icebreakers** | Custom conversation starters generated per table composition |
| ✅ **Check-in** | "I'm here" at any dining hall — see who's eating now |
| 🚪 **Leave Table** | Changed your mind? Leave a table anytime |
| 🔒 **Privacy First** | No public profiles, no swiping, no follower counts |

## Built With

| Layer | Technology |
|-------|-----------|
| **AI** | [Claude](https://anthropic.com/claude) by Anthropic — powers the entire app: codebase architecture, group matching, icebreaker generation, and conversation starters |
| **Frontend** | [Next.js 15](https://nextjs.org) · [React 19](https://react.dev) · [Tailwind CSS](https://tailwindcss.com) · [Framer Motion](https://www.framer.com/motion/) · [Lucide React](https://lucide.dev) |
| **Auth** | [NextAuth.js v4](https://next-auth.js.org) — credentials provider with bcrypt + JWT sessions |
| **Database** | [PostgreSQL](https://www.postgresql.org) on [Neon](https://neon.tech) · [Prisma ORM](https://www.prisma.io) |
| **Maps** | [Leaflet](https://leafletjs.com) + [OpenStreetMap](https://www.openstreetmap.org) + [Nominatim](https://nominatim.org) geocoding |
| **Hosting** | [Vercel](https://vercel.com) |

## UW-Madison Dining Halls

- **Gordon Avenue Market** — Southeast (Sellery/Witte area)
- **Rheta's Market** — Lakeshore (Dejope)
- **Four Lakes Market** — Lakeshore (Smith/Slichter area)
- **Liz's Market** — Observatory Drive
- **Carson's Market** — Southeast

## How It Works

```
Sign up → Onboard (year, major, interests, location)
       → Set your class schedule
       → Pick a vibe + time
       → AI matches you with 2-3 students
       → Get a table spot, intro prompt, and icebreaker
       → Show up and connect
```

## Setup

```bash
git clone https://github.com/Soham109/claudehacks2026.git
cd claudehacks2026
npm install
```

Create `.env` from `.env.example`:

```env
OPENAI_API_KEY=your-key
DATABASE_URL=postgresql://...     # Neon pooled
DIRECT_URL=postgresql://...       # Neon direct
NEXTAUTH_SECRET=openssl-rand-base64-32
NEXTAUTH_URL=http://localhost:3000
```

Push schema and seed:

```bash
npx prisma db push
npm run db:seed
```

Run locally:

```bash
npm run dev
```

## Deploy to Vercel

1. Push to GitHub
2. Import in [Vercel](https://vercel.com/new)
3. Set framework to **Next.js**
4. Add env vars: `DATABASE_URL`, `DIRECT_URL`, `OPENAI_API_KEY`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
5. Deploy

## Team

Built by **Soham Aggarwal** and **Aniket** — UW-Madison, 2026.

Made with Claude at ClaudeHacks 2026.

---

<p align="center">
  <sub>Built for Badgers who eat alone sometimes.</sub>
</p>
