# Agent Instructions

Operating system for AI coding agents working on this repository.

**This portfolio prioritizes:** exceptional motion design, cinematic page transitions, polished micro-interactions, smooth scrolling, high performance, accessibility, and maintainability.

---

## Before writing any code

1. Read the relevant doc in `docs/` (see index below)
2. Search existing components, hooks, and utilities — **never assume something doesn't exist**
3. Check [docs/audits/redundancy-report.md](docs/audits/redundancy-report.md) before creating parallel implementations
4. Extend existing architecture — do not create isolated animation or routing systems

---

## Documentation index

| Need | Read |
|------|------|
| Architecture overview | [docs/architecture/overview.md](docs/architecture/overview.md) |
| Routing / new pages | [docs/architecture/routing.md](docs/architecture/routing.md) |
| Animation / motion | [docs/architecture/animation.md](docs/architecture/animation.md) |
| Styling / CSS | [docs/architecture/styling.md](docs/architecture/styling.md) |
| Design tokens / cursor attrs | [docs/architecture/design-system.md](docs/architecture/design-system.md) |
| Component inventory | [docs/components/component-index.md](docs/components/component-index.md) |
| Hooks | [docs/hooks/hooks-index.md](docs/hooks/hooks-index.md) |
| Utilities | [docs/utilities/utilities-index.md](docs/utilities/utilities-index.md) |
| Dependencies | [docs/packages/dependencies.md](docs/packages/dependencies.md) |
| Feature map | [docs/features/feature-map.md](docs/features/feature-map.md) |
| Architecture decisions | [docs/decisions/architecture-decisions.md](docs/decisions/architecture-decisions.md) |
| Redundancy (don't duplicate) | [docs/audits/redundancy-report.md](docs/audits/redundancy-report.md) |
| Technical debt | [docs/audits/technical-debt.md](docs/audits/technical-debt.md) |
| Cursor deep API | [src/lib/cursor/README.md](src/lib/cursor/README.md) |

---

## Hard rules

### Routing & navigation
- Internal links **must** use `TransitionLink` — never raw `<a href="/...">` for in-app routes
- New pages: view in `src/views/` + register in `src/lib/pages.js` + App Router stub
- Do not render page content in `src/app/(site)/*/page.jsx` — they return `null` by design

### Animation
- **GSAP only** — import scroll plugins from `@/lib/gsap`
- Do not add Framer Motion or use the `motion` package
- Page enter: `PageTitle` + `.page-enter-fade` classes
- Page transitions: extend `src/components/PageTransition/transitions.js`
- After layout changes: call `refreshScroll()`
- Interactive hover: use cursor `data-*` attributes (see design-system doc)

### Styling
- Use CSS variables from `globals.css` — no hardcoded theme colors
- Co-located `.css` next to components — no CSS Modules
- Reuse `.section-container`, `.section-label`, `.section-heading`, `.link-arrow`

### Components & utilities
- Search [component-index](docs/components/component-index.md) before creating UI
- Search [utilities-index](docs/utilities/utilities-index.md) before writing helpers
- New shared modules: update the matching index doc
- Do not use `src/sections/` for new pages — use `src/views/`

### Dependencies
- Do not add packages without checking if GSAP / existing utils cover the need
- See [dependencies.md](docs/packages/dependencies.md) for approved patterns

### Cleanup
- **Never delete code marked redundant without human approval**
- Report new redundancy in `docs/audits/redundancy-report.md`

---

## Common tasks

### Add a new page

```
1. src/views/MyView.jsx          — PageTitle + page-enter-fade + TransitionLink
2. src/lib/pages.js              — register slug
3. src/app/(site)/my-page/page.jsx — return null
4. src/constants/index.js        — NavItems entry
5. docs/features/feature-map.md  — update
```

### Add scroll animation

```js
import { gsap, ScrollTrigger, refreshScroll } from "@/lib/gsap";

useEffect(() => {
  const ctx = gsap.context(() => {
    ScrollTrigger.create({ /* ... */ });
  });
  return () => ctx.revert();
}, []);
```

### Add magnetic / cursor interaction

```jsx
<button
  data-magnetic="true"
  data-cursor-stick
  data-cursor-scale="2.6"
>
  Label
</button>
```

### Add static content

Edit `src/constants/index.js` or `src/constants/blog.js`.

---

## Project structure (quick reference)

```
src/
├── app/           Next.js routes + globals.css
├── components/    Reusable UI + shell + motion
├── constants/     Static data
├── lib/           Utilities, GSAP, cursor, page registry
├── views/         Active page content (USE THIS)
└── sections/      Legacy CSS only (Home, Projects, Skills styles)
```

---

## Architecture at a glance

Next.js static export → GitHub Pages. Client SPA shell (`PageTransitionShell`) mounts all views, swaps by slug with GSAP curtain transitions. ScrollSmoother wraps content. Custom cursor mounts at root.

See [docs/architecture/overview.md](docs/architecture/overview.md) for the full diagram.

---

## After implementing

1. Update relevant `docs/` index if you added shared code
2. Follow existing file naming and co-located CSS conventions
3. Do not commit unless explicitly asked
4. Run `npm run lint` if you touched JS/JSX/TS

---

## Operating principles

> Read docs → Search existing code → Extend systems → Document new modules → Keep docs in sync

Animation is architecture, not an afterthought. Future motion must integrate with GSAP, page transitions, and the cursor system — not replace them.
