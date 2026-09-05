# ⚔️ Pokeski

> A mobile-first Pokémon GO raid companion — find your best counters instantly, right when you need them.

---

## Table of Contents

- [What Is Pokeski?](#what-is-pokeski?)
- [Why This App Exists](#why-this-app-exists)
- [Who It's For](#who-its-for)
- [Core Features](#core-features)
- [Planned Features](#planned-features)
- [How the App Works](#how-the-app-works)
- [App Structure & Pages](#app-structure--pages)
- [Tech Stack & Why](#tech-stack--why)
- [Data Sources](#data-sources)
- [Project File Structure](#project-file-structure)
- [Getting Started](#getting-started)
- [Credits](#credits)

---

## What Is Pokeski?

Pokeski is a mobile-first web app built for Pokémon GO players. It shows you which Pokémon are currently in raids, and when you tap on one, it tells you exactly which Pokémon to use against it — ranked, with the right moves, and explained clearly.

No login. No account. No bloat. You open it, find your raid boss, see your counters, and get back to the game.

---

## Why This App Exists

Pokémon GO raids are time-limited. When a raid egg hatches, you have a short window to gather a group and battle. Most players — even experienced ones — don't have every type matchup memorized. The current options for looking this up are:

- **Community sites like LeekDuck or Pokémon GO Hub** — accurate but built for browsing, not for quickly finding one specific answer while standing at a gym
- **In-game suggestions** — limited and don't explain the reasoning
- **Memory** — not reliable for niche bosses or newer players

Pokeski solves this by doing one thing well: you tap the boss you're about to fight and immediately see exactly which Pokémon to use, what moves they should have, and why those moves work — all in a layout designed for one hand on a phone screen.

---

## Who It's For

- **Active Pokémon GO players** who participate in raids regularly
- **Newer players** who don't yet know the type advantage system
- **Experienced players** who want a quick reference without opening a full website
- **Anyone** who has been caught off-guard by a boss they didn't prepare for

---

## Core Features

These are the features in the current version of the app.

---

### 1. Live Raid Boss List

When you open the app, it immediately fetches today's active raid bosses from a live data source. The list is always current — it updates automatically when Niantic rotates the raid pool, so you never see outdated information.

Each boss is displayed as a card showing:

- **Pokémon image** (regular and shiny versions, side by side)
- **Name**
- **Tier badge** — 1★, 3★, 5★, or Mega
- **Type badges** — color-coded by type (Fire, Psychic, Dragon, etc.)
- **CP range** — both the normal catch CP and the weather-boosted catch CP, shown as min–max
- **Shiny indicator** — a ✨ icon if the boss can currently be encountered as shiny

---

### 2. Tier Filter

A tab bar at the top of the boss list lets you filter by raid tier:

| Tab  | Shows                       |
| ---- | --------------------------- |
| All  | Every active raid boss      |
| 1★   | Tier 1 bosses (solo-able)   |
| 3★   | Tier 3 bosses (small group) |
| 5★   | Legendary and Tier 5 bosses |
| Mega | Mega Evolution raid bosses  |

This lets players quickly find what they're looking for — if you're at a Mega Raid, you don't need to scroll past all the Tier 1 bosses.

---

### 3. Counter Lookup — The Core Feature

Tapping any raid boss opens the Counter View. This is the heart of the app.

**The Counter View shows:**

#### Boss Summary

A full-size display of the boss with all its key information — name, tier, types, CP range, and shiny availability — so you can confirm you tapped the right one.

#### Weakness Chart

A visual row of type badges showing every type that deals increased damage to this boss. This is calculated using the actual Pokémon GO type effectiveness values, which are different from the main series games.

Pokémon GO uses these multipliers (not the main series ×2 / ×0.5):

| Situation                  | Multiplier       |
| -------------------------- | ---------------- |
| 1 weakness                 | ×1.6 damage      |
| 2 weaknesses (double weak) | ×2.56 damage     |
| 1 resistance               | ×0.625 damage    |
| 2 resistances              | ×0.390625 damage |

The weakness chart instantly tells a player: "this boss is a Psychic type, so Ghost and Dark moves will hurt it most."

#### Top 8 Counters

A ranked list of the 8 best Pokémon to use against this boss. For each counter:

| Info shown        | Example             |
| ----------------- | ------------------- |
| Pokémon image     | Gengar sprite       |
| Name              | Gengar              |
| Type badges       | Ghost · Poison      |
| Best Fast Move    | Shadow Claw         |
| Best Charged Move | Shadow Ball         |
| Damage multiplier | 1.6×                |
| Top Pick badge    | ⭐ shown on rank #1 |

The ranking is based on which Pokémon can deal the highest damage multiplier to the specific boss using their best available moveset. A Pokémon with a 2.56× move ranks above one with a 1.6× move. Within the same multiplier, stronger attackers rank higher.

**Why this matters for players:** A player doesn't need to understand type theory to use Pokeski. They just look at the list, see which Pokémon they own from that list, and use the moves shown. The ranking does the thinking for them.

---

## Planned Features

These are not in the current version but are planned for future releases.

| Feature                     | Description                                                                               |
| --------------------------- | ----------------------------------------------------------------------------------------- |
| **Shiny sprites**           | Show both the regular and shiny version of each boss sprite side by side on the boss card |
| **Current events tab**      | A second tab showing active in-game events, start/end dates, and what they affect         |
| **Weather boost indicator** | Show which weather condition currently boosts the boss and its potential counters         |
| **Shadow & Mega counters**  | Separate counter calculations for Shadow Raid bosses                                      |
| **My Box**                  | Let users mark which counter Pokémon they actually own                                    |
| **Field research tab**      | Show current field research tasks and their rewards                                       |
| **Egg hatch chart**         | Show which Pokémon are currently hatching from 2km, 5km, 7km, and 10km eggs               |
| **PWA / offline mode**      | Make the app installable on a phone home screen with offline caching                      |

---

## How the App Works

Pokeski pulls data from two separate community-maintained sources and combines them to produce the counter recommendations.

```
Step 1 — App loads
  → Fetches current raid bosses from ScrapedDuck
    (ScrapedDuck scrapes LeekDuck.com automatically)
  → Displays boss cards grouped by tier

Step 2 — User taps a boss
  → Reads the boss's type(s) from the fetched data
  → Fetches the full Pokémon GO Pokédex from pokemon-go-api
    (cached after first load — not re-fetched every time)
  → Loops through every Pokémon in the Pokédex
  → For each Pokémon, checks every fast move and charged move
  → Calculates the damage multiplier each move deals to the boss
  → Finds the best moveset for each Pokémon
  → Filters out Pokémon with no super-effective moves
  → Sorts by highest multiplier
  → Returns the top 8

Step 3 — Counter view renders
  → Boss summary displayed
  → Weakness types listed
  → Top 8 counters shown with best moves and multipliers
```

**No backend required.** All calculations happen in the user's browser. The only network requests are the two JSON fetches from the data sources.

---

## App Structure & Pages

Pokeski is a **single-page application**. There is no traditional page navigation — the app switches between two views using conditional rendering.

---

### View 1 — Raid Boss List (Home)

This is what the user sees on load.

```
┌─────────────────────────────┐
│  ⚔️ Pokeski               │  ← App header
│  Find your best counters    │
├─────────────────────────────┤
│  All  1★  3★  5★  Mega     │  ← Tier filter tabs
├─────────────────────────────┤
│  12 active raids            │  ← Live count
├──────────────┬──────────────┤
│ [Boss Card]  │ [Boss Card]  │
│              │              │  ← 2-column boss grid
│ [Boss Card]  │ [Boss Card]  │
│              │              │
│ [Boss Card]  │ [Boss Card]  │
├─────────────────────────────┤
│ Data: LeekDuck / ScrapedDuck│  ← Required credit
└─────────────────────────────┘
```

**Each Boss Card:**

```
┌─────────────────────┐
│   [img]    [✨ img] │  ← Regular + shiny sprite
│   Mewtwo            │  ← Name
│   [ 5★ ]            │  ← Tier badge
│  [Psychic]          │  ← Type badge(s)
│  CP 1932 – 2041     │  ← Normal CP range
│  CP 2416 – 2551 ☁️  │  ← Boosted CP range
└─────────────────────┘
```

---

### View 2 — Counter Lookup

This replaces View 1 when a boss is tapped.

```
┌─────────────────────────────┐
│  ← Back to raid bosses      │  ← Back button
├─────────────────────────────┤
│  [Boss image]  Mewtwo       │
│                [5★]         │  ← Boss summary
│                [Psychic]    │
│                CP 1932-2041 │
├─────────────────────────────┤
│  WEAK AGAINST               │
│  [Ghost] [Dark] [Bug]       │  ← Type weakness badges
├─────────────────────────────┤
│  TOP COUNTERS               │
│                             │
│  ⭐ TOP PICK                │
│  [img] Gengar    Ghost 1.6× │
│        ⚡ Shadow Claw        │
│        💥 Shadow Ball        │
│  ─────────────────────────  │
│  [img] Darkrai   Dark  1.6× │
│        ⚡ Snarl              │
│        💥 Dark Pulse         │
│  ─────────────────────────  │
│  [img] Weavile   Dark  1.6× │  ← Counter list
│        ⚡ Snarl              │
│        💥 Foul Play          │
│  ...                        │
└─────────────────────────────┘
```

---

## Tech Stack & Why

| Technology       | Role         | Why this choice                                                                                                                                                                                           |
| ---------------- | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Vue 3**        | UI framework | Already familiar from prior projects. Composition API is a natural fit for composables like `useRaidBosses` and `useCounters`. No learning curve — focus stays on the app.                                |
| **TypeScript**   | Type safety  | Two external APIs with different data shapes. TypeScript interfaces catch mismatches before they reach users. Especially useful when the Pokédex has thousands of entries.                                |
| **Vite**         | Build tool   | Produces significantly smaller bundles than webpack alternatives. On a 4G cellular connection at a park, faster load times are a real user benefit. Dev server starts in under a second.                  |
| **Tailwind CSS** | Styling      | Mobile-first by default — you write for small screens first and override upward. Touch target sizing, spacing, and one-hand-friendly layouts are straightforward to implement. No fighting media queries. |

**No backend. No database. No router. No state management library.**

The app makes exactly two network requests: one for the raid boss list, one for the Pokédex. Everything else runs in the browser. This keeps the app fast, free to host, and simple to maintain.

---

## Data Sources

Pokeski combines two community-maintained data sources.

---

### ScrapedDuck — Raid Boss List

**Endpoint used:**

```
GET https://raw.githubusercontent.com/bigfoott/ScrapedDuck/data/raids.json
```

ScrapedDuck is an open-source project that automatically scrapes [LeekDuck.com](https://leekduck.com) (with permission) and pushes clean JSON data to a GitHub branch. The data updates whenever Niantic rotates the raid pool.

Each raid boss entry includes:

- Name, tier, types
- Regular and shiny images (Leek Duck CDN)
- CP range (normal and weather-boosted)
- Shiny availability
- Weather boost conditions

**Terms:** Free to use. No ads, no paywall. Credit required — see [Credits](#credits).

---

### pokemon-go-api — Pokédex & Movesets

**Endpoint used:**

```
GET https://pokemon-go-api.github.io/pokemon-go-api/api/pokedex.json
```

This community API pulls from Niantic's GameMaster files (maintained by PokeMiners) and exposes clean JSON with every Pokémon's GO-specific movesets and stats. This is the source used to calculate which Pokémon deal the most damage to each boss.

Each Pokémon entry includes:

- National Pokédex number (used for sprites)
- GO-specific fast moves and charged moves
- Each move's type (used in type effectiveness calculations)
- Base stats (attack, defense, stamina)

**Terms:** Free to use for educational and non-commercial projects.

---

### Type Effectiveness — Hardcoded in App

The Pokémon GO type chart is hardcoded in `src/utils/typeChart.ts`. GO uses different multipliers than the main series, so this is not pulled from any API — it's a static lookup table maintained in the codebase.

---

## Project File Structure

```
pokeski/
├── public/
│   └── favicon.ico
└── src/
    ├── assets/
    │   └── main.css              ← Tailwind directives
    │
    ├── types/
    │   └── pokemon.ts            ← TypeScript interfaces for all data shapes
    │
    ├── utils/
    │   └── typeChart.ts          ← GO type effectiveness multipliers + helpers
    │
    ├── composables/
    │   ├── useRaidBosses.ts      ← Fetches + filters ScrapedDuck raid data
    │   └── useCounters.ts        ← Fetches Pokédex, calculates top counters
    │
    ├── components/
    │   ├── shared/
    │   │   └── TypeBadge.vue     ← Reusable colored type pill
    │   │
    │   ├── boss/
    │   │   ├── TierFilter.vue    ← Tier tab bar (All / 1★ / 3★ / 5★ / Mega)
    │   │   ├── BossGrid.vue      ← 2-column grid of boss cards
    │   │   └── BossCard.vue      ← Individual boss card
    │   │
    │   └── counter/
    │       ├── CounterPanel.vue  ← Full counter view layout
    │       ├── BossDetail.vue    ← Boss summary at top of counter view
    │       ├── WeaknessList.vue  ← Weakness type badge row
    │       └── CounterCard.vue   ← Individual counter Pokémon card
    │
    ├── App.vue                   ← Root component, switches between views
    └── main.ts                   ← App entry point
```

---

## Getting Started

```bash
# Clone the repo
git clone https://github.com/your-username/pokeski.git
cd pokeski

# Install dependencies
npm install

# Start the dev server
npm run dev

# Build for production
npm run build
```

Requires Node.js 18+. No environment variables or API keys needed — all data sources are public and free.

---

## Credits

- Raid boss data provided by [LeekDuck.com](https://leekduck.com)
- Raid JSON delivered via [ScrapedDuck](https://github.com/bigfoott/ScrapedDuck) by [@bigfoott](https://github.com/bigfoott)
- Pokémon GO Pokédex data via [pokemon-go-api](https://github.com/pokemon-go-api/pokemon-go-api)
- Pokémon sprites via [PokéAPI](https://pokeapi.co)
- Built with [Vue 3](https://vuejs.org), [Vite](https://vitejs.dev), and [Tailwind CSS](https://tailwindcss.com)

---

_Pokeski is an independent fan project and is not affiliated with Niantic, The Pokémon Company, or Nintendo._
