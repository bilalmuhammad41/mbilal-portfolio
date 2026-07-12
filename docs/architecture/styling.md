# Styling Architecture

## Approach

**Tailwind CSS + co-located plain CSS + CSS custom properties.** No CSS Modules (no `.module.css` files).

| Layer                     | Location                      | Role                                            |
| ------------------------- | ----------------------------- | ----------------------------------------------- |
| Global tokens & utilities | `src/app/globals.css`         | Design tokens, layout utilities, scroll wrapper |
| Tailwind utilities        | Inline in JSX                 | Spacing, responsive, one-off layout             |
| Component CSS             | `{Component}/{Component}.css` | Component-specific styles                       |
| View CSS                  | `src/views/*.css`             | Page-specific overrides                         |
| Section CSS (legacy)      | `src/sections/*/*.css`        | Reused by active views                          |

## globals.css structure

1. `@tailwind base/components/utilities`
2. `:root` accent aliases (`--yellow-color`)
3. Theme tokens on `:root` / `[data-theme="dark"]` and `[data-theme="light"]`
4. Base reset (`*, body, html`)
5. ScrollSmoother layout (`#smooth-wrapper`, `#smooth-content`)
6. Shared section utilities
7. Interaction utilities (underline, link-arrow, reveal)

## Theme switching

Mechanism: `data-theme="light"|"dark"` on `<html>`

| Source        | File                                     |
| ------------- | ---------------------------------------- |
| Pre-hydration | Inline script in `src/app/layout.jsx`    |
| Runtime       | `src/components/Theme/ThemeProvider.jsx` |
| Persistence   | `localStorage.theme`                     |

All semantic colors use CSS variables — never hardcode `#161616` / `#ffffff` in new components.

## Tailwind config

File: `tailwind.config.js`

### Custom breakpoints

| Token | Width  |
| ----- | ------ |
| `xs`  | 375px  |
| `ss`  | 620px  |
| `sm`  | 768px  |
| `md`  | 1060px |
| `lg`  | 1200px |
| `xl`  | 1700px |

### Custom utilities

- `text-xlarge` — 120px
- `ease-in-expo`, `ease-out-expo` — cubic-bezier timing

### Content paths

Scans: `src/app/`, `src/components/`, `src/sections/`, `src/views/`

**Caveat:** Dynamic Tailwind class strings (e.g. `bg-${color}` in `Button.jsx`) may not survive purging.

## Co-located CSS convention

```
src/components/Nav/
  Nav.jsx
  Nav.css          ← imported in Nav.jsx
  NavRollLink.jsx
  NavRollLink.css
```

Same pattern for views, sections, page transition components.

## Global utility classes

| Class                                | Purpose                                 |
| ------------------------------------ | --------------------------------------- |
| `.section-container`                 | Max-width + horizontal padding          |
| `.section-label`                     | Uppercase muted label                   |
| `.section-heading`                   | Large section title                     |
| `.underline-effect`                  | Animated underline on hover             |
| `.link-arrow`                        | Uppercase link with arrow gap animation |
| `.reveal-hidden` / `.reveal-visible` | CSS translateY reveal (legacy)          |
| `.no-scrollbar`                      | Hide scrollbar                          |
| `.page-view` / `.page-view--active`  | Multi-view stacking (PageViews.css)     |

## Fonts

| Font    | Loading                                                                                    |
| ------- | ------------------------------------------------------------------------------------------ |
| DM Sans | Runtime `@font-face` via `src/lib/fontFaces.js` injected in root layout                    |
| Gilroy  | Files in `public/fonts/Gilroy/`; preloaded in `preloadAssets.js` but no `@font-face` rules |

Body default: `font-family: "DM Sans", sans-serif` in `globals.css`.

## Page view layout

`src/components/PageTransition/PageViews.css`:

- `.page-view` — absolute stacked, hidden by default
- `.page-view--active` — visible active view
- `.page-view__content` — animation target ref
- `.page-title`, `.page-title-letter` — title stagger initial state

## Adding styles for new features

1. Use existing tokens from `globals.css` — see [design-system.md](./design-system.md)
2. Prefer `.section-container` + semantic variables over one-off pixel values
3. Add component-specific rules in co-located `.css` next to the component
4. Use Tailwind for responsive spacing/layout only when it reduces CSS file size
5. For page enter animations, use `.page-enter-fade` class (GSAP target)
6. Do not introduce CSS Modules or styled-components without approval

## Related

- [design-system.md](./design-system.md) — token reference
- [animation.md](./animation.md) — motion CSS classes
- [../components/component-index.md](../components/component-index.md)
