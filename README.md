# Left Brain Right Pixels

Portfolio of Muhammad Bilal — a creative developer site built with cinematic motion, smooth scrolling, and GSAP-driven page transitions.

## Tech stack

- **Next.js 16** (App Router, static export) — routing, build, GitHub Pages deploy
- **React 19** — UI and client state
- **GSAP** (`ScrollSmoother`, `ScrollTrigger`) — scroll, transitions, cursor
- **Tailwind CSS** + co-located CSS + CSS variables — styling and theming

## Architecture

Hybrid model: Next.js routes provide URLs and SSG; a client SPA shell (`PageTransitionShell`) mounts all views and swaps them with curtain transitions.

**Full documentation:** [docs/architecture/overview.md](docs/architecture/overview.md)  
**Agent instructions:** [AGENTS.md](AGENTS.md)

## Features

- Splash / loading screen with asset preload
- Desktop and mobile navigation with animated menu states
- Home, projects, services, blog, contact views
- GSAP ScrollSmoother for smooth scrolling
- Custom cursor with magnetic interactions
- Light/dark theme via CSS variables
- Responsive layout across breakpoints

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Other scripts

```bash
npm run build   # production static export → out/
npm run start   # run production server locally
npm run lint    # ESLint
```

## Deployment (GitHub Pages)

Live URL: **https://bilalmuhammad41.github.io/left-brain-right-pixels/**

Deployments are **manual** via GitHub Actions. See [.github/DEPLOYMENT.md](.github/DEPLOYMENT.md).

```bash
# Local static build (same as CI / Pages)
NEXT_PUBLIC_BASE_PATH=/left-brain-right-pixels npm run build
```

## Documentation

| Topic | Path |
|-------|------|
| Architecture | [docs/architecture/](docs/architecture/) |
| Components | [docs/components/component-index.md](docs/components/component-index.md) |
| Animation | [docs/architecture/animation.md](docs/architecture/animation.md) |
| Audits | [docs/audits/](docs/audits/) |

## Project status

Core views, navigation, page transitions, and cursor system are in place. Legacy section JSX was removed (PR 1); three CSS files under `src/sections/` remain imported by views. See [docs/audits/](docs/audits/) for remaining cleanup (PR 2–4).
