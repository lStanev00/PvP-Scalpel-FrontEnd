# PvP Scalpel - Frontend

Fan-made World of Warcraft PvP analytics and community dashboard built with React and Vite.

Live preview: https://www.pvpscalpel.com

## Overview

PvP Scalpel is a frontend application that consumes a custom backend to display PvP rankings, character profiles, and guild data. It also ships a small Express server that renders Handlebars templates for SEO-friendly pages and then hydrates the React app on the client.

## Features

- PvP leaderboards for multiple brackets
- Character profile lookup with detailed stats
- Guild roster and recruitment pages
- Community posts and user profiles
- SEO-friendly server-rendered meta tags (Handlebars) + client hydration

## Tech Stack

- React 19 + React Router
- Vite 6
- CSS Modules
- Express + Handlebars (SEO rendering)

## Routes

- `/` Home
- `/leaderboard/:slug?` Leaderboards (`solo-shuffle`, `2v2`, `3v3`, `blitz`, `rated-bg`)
- `/check/:server/:realm/:name` Character details
- `/roster` Guild roster
- `/joinGuild` Recruitment
- `/posts` Community posts
- `/download` Launcher download
- `/login`, `/register`, `/profile` Auth + profile pages

## Project Structure

```
SEO/                    # Handlebars SEO templates (server-rendered)
src/
  components/           # Reusable UI components
  helpers/              # Small utilities
  hooks/                # React hooks + app context
  pages/                # Route pages
  SEO/                  # React SEO components (useSEO hook)
  Styles/               # CSS modules + global styles
  App.jsx               # App shell + router
  AppContent.jsx        # Route definitions
  main.jsx              # Entry point
server.mjs              # Express server for SEO + static hosting
```

## Getting Started

### Prerequisites

- Node.js >= 20.11
- npm >= 10.2

### Install

```
npm install
```

### Run (Vite dev server)

```
npm run dev
```

### Build

```
npm run build
```

### Run production server (Express + SEO templates)

```
npm run start
```

## Environment Variables

Client (Vite):

- `VITE_API_URL` - base URL for the backend API (default in `.env.development` is `/api`)

Server (Express):

- `API_URL` or `VITE_API_URL` - base URL for fetching dynamic SEO data (character profiles)
- `VITE_DEV_SERVER_URL` - optional; points the Handlebars layout to the Vite dev server for hydration

## SEO Notes

- Handlebars templates live in `SEO/` and mirror the React SEO components in `src/SEO/`.
- Dynamic character SEO is pre-rendered by the Express server using data from the backend API.
- When a character is not found, the server returns a clean "Character Not Found" SEO response.

## Docker

Build and run:

```
docker build -t pvpscalpel-frontend .
docker run -p 4173:4173 --env API_URL=https://your-backend.example.com pvpscalpel-frontend
```

## Contributing

Issues and PRs are welcome. Please keep changes focused and include clear notes or screenshots for UI updates.

## License

See `LICENSE.md`.
