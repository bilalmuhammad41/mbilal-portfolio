# Utilities Index

Shared utilities in `src/lib/`, `src/constants/`, `src/assets/`, and `src/lib/cursor/`.

**Rule:** Search here before implementing helpers. Do not reimplement slug normalization, base path handling, scroll utilities, or cursor geometry.

---

## lib/gsap.js

| Export | Purpose | Use when | Never reimplement |
|--------|---------|----------|-------------------|
| `gsap` | GSAP with plugins registered | Any GSAP animation needing ScrollTrigger/Smoother | Separate `gsap.registerPlugin` calls |
| `ScrollTrigger` | Scroll-linked animations | Scrub, pin, scroll listeners | Raw scroll listeners for same effects |
| `ScrollSmoother` | Smooth scroll instance | Creating/accessing smoother | Alternative smooth-scroll libraries |
| `getScrollSmoother()` | Get active smoother | Nav scroll root detection | Direct DOM queries for scroll container |
| `scrollToTop(instant?)` | Reset scroll position | Page transitions | Manual `window.scrollTo` in transition flow |
| `refreshScroll()` | Refresh smoother + ST | After DOM/layout changes | Per-component ST refresh without central call |
| `setScrollPaused(paused)` | Pause/resume scroll | During transitions/overlays | CSS `overflow: hidden` alone |

**Import:** `import { gsap, ScrollTrigger, refreshScroll } from "@/lib/gsap"`

---

## lib/basePath.js

| Export | Purpose | Use when |
|--------|---------|----------|
| `basePath` | `NEXT_PUBLIC_BASE_PATH` or `""` | GitHub Pages path prefix |
| `withBasePath(path)` | Prefix public asset URLs | Any `/public` asset reference |

**Consumers:** `layout.jsx`, `assets/index.js`, `preloadAssets.js`, `slug.js`, `fontFaces.js`

---

## lib/slug.js

| Export | Purpose | Use when |
|--------|---------|----------|
| `normalizeSlug(pathname)` | Pathname → registry key | Mapping URL to `PAGE_REGISTRY` |
| `isInternalPath(href)` | Detect same-origin path links | Link components branching internal/external |

---

## lib/pages.js

| Export | Purpose | Use when |
|--------|---------|----------|
| `PAGE_REGISTRY` | Slug → `{ component, title, project? }` | Adding pages, listing routes |
| `PAGE_SLUGS` | All registry keys | Iteration, static generation helpers |

---

## lib/projects.js

| Export | Purpose | Use when |
|--------|---------|----------|
| `getProjectBySlug(slug)` | Find project in constants | Project detail lookup |
| `getProjectDetailSlug(project)` | Build `/projects/{slug}` path | Project card links |

---

## lib/preloadAssets.js

| Export | Purpose | Use when |
|--------|---------|----------|
| `preloadAssets({ onProgress? })` | Load images, fonts, wait for window load | Splash screen only |

Preloads DM Sans weights from `PRELOAD_FONT_DESCRIPTORS` in `fontFaces.js`.

---

## lib/fontFaces.js

| Export | Purpose | Use when |
|--------|---------|----------|
| `getFontFacesCSS()` | DM Sans `@font-face` CSS string | Root layout inline `<style>` |
| `PRELOAD_FONT_DESCRIPTORS` | Splash preload font weights | `preloadAssets.js` |

---

## lib/useIsClient.js

| Export | Purpose | Use when |
|--------|---------|----------|
| `useIsClient()` | SSR-safe client flag | Client-only rendering (currently unused) |

---

## lib/cursor/ (TypeScript)

Framework-agnostic GSAP cursor system. **Full API:** [src/lib/cursor/README.md](../../src/lib/cursor/README.md)

| Module | Exports | Purpose |
|--------|---------|---------|
| `index.ts` | `Cursor`, `initMagneticElements`, types, constants | Public API |
| `Cursor.ts` | `Cursor` class | Jelly cursor, stick, blend, text label |
| `MagneticManager.ts` | `MagneticManager`, `initMagneticElements` | Magnetic pull on `[data-magnetic]` |
| `utils.ts` | `getElementCenter`, `lerp`, attribute readers | Geometry + DOM helpers |
| `constants.ts` | `CURSOR_DEFAULTS`, `MAGNETIC_DEFAULTS`, `DATA_ATTRS`, `CSS_CLASSES`, `CURSOR_EVENTS` | Tuneable values |
| `types.ts` | `Point`, `CursorOptions`, etc. | TypeScript interfaces |

### Key constants

| Constant | Purpose |
|----------|---------|
| `CURSOR_EVENTS.RELEASE_STICK` | `"cursor:release-stick"` — release sticky cursor |
| `DATA_ATTRS.MAGNETIC` | `"data-magnetic"` attribute key |
| `CSS_CLASSES.CURSOR` | `.cb-cursor` root class |

**Never reimplement:** cursor lerp, jelly deformation, magnetic pull math — extend `constants.ts` instead.

---

## constants/index.js

| Export | Purpose |
|--------|---------|
| `projects` | Project cards + detail pages |
| `NavItems` | Desktop nav links |
| `MobileNavItems` | Mobile nav links |
| `skills` | Services page skill list |
| `socials` | Social link URLs |

---

## constants/blog.js

| Export | Purpose |
|--------|---------|
| `blogPosts` | Blog listing data |
| `interestOptions` | Contact form interest dropdown |

---

## assets/index.js

| Export | Public path | File |
|--------|-------------|------|
| `lines` | `/lines.png` | Decorative lines |
| `close` | `/close.png` | Close icon |
| `arrow_down` | `/arrow-down-line.png` | Arrow |
| `arrow_right_up` | `/arrow-right-up-line.png` | Arrow |
| `profile_picture` | `/profile_picture.jpg` | Profile photo |

All paths base-path aware via `withBasePath`.

---

## Utility categories NOT present (do not duplicate elsewhere)

These do not exist as standalone modules — use existing patterns:

| Category | Existing solution |
|----------|-------------------|
| Debounce/throttle | Not extracted — inline in components if needed |
| Easing | GSAP eases + Tailwind `ease-in-expo`/`ease-out-expo` |
| Formatting | Inline (e.g. clock in `SiteShell`) |
| DOM helpers | `lib/cursor/utils.ts` for cursor-specific geometry only |

If a utility is needed in 2+ places, extract to `src/lib/` and document here.

---

## Import conventions

```js
// GSAP + scroll
import { gsap, ScrollTrigger, refreshScroll } from "@/lib/gsap";

// Routing
import { normalizeSlug, isInternalPath } from "@/lib/slug";
import { PAGE_REGISTRY } from "@/lib/pages";

// Assets
import { profile_picture } from "@/assets";

// Cursor (from React components)
import { Cursor, initMagneticElements, CURSOR_EVENTS } from "@/lib/cursor";
```

## Related

- [../architecture/animation.md](../architecture/animation.md)
- [../packages/dependencies.md](../packages/dependencies.md)
