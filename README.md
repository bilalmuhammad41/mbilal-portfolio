# Mbilal-portfolio

A single-page front-end project focused on layout, motion, and scroll-driven interactions.

## Tech stack

- **Next.js** (App Router) — routing, build, and deployment
- **React** — UI and client-side state
- **Tailwind CSS** + custom CSS — layout, responsiveness, and animations
- **GSAP** (`ScrollSmoother`, `ScrollTrigger`) — smooth scrolling and scroll effects

## Features

- Splash / loading screen
- Desktop and mobile navigation with animated menu states
- Home, projects, about, and footer sections
- GSAP ScrollSmoother for smooth scrolling
- Responsive layout across breakpoints

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Other scripts

```bash
npm run build   # production build
npm run start   # run production server locally
npm run lint    # ESLint
```

## Deployment (GitHub Pages)

Live URL: **https://bilalmuhammad41.github.io/mbilal-portfolio/**

Deployments are **manual** via GitHub Actions. See [.github/DEPLOYMENT.md](.github/DEPLOYMENT.md) for setup, releases, and how to run the deploy workflow.

```bash
# Local static build (same as CI / Pages)
NEXT_PUBLIC_BASE_PATH=/mbilal-portfolio npm run build
```

## Project status

Core sections and navigation are in place. Possible follow-ups include richer hover interactions in the projects list and dedicated detail views per project.
