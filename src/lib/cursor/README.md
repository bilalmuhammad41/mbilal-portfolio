# cb-cursor

A GSAP-powered custom cursor with **jelly deformation**, **sticky attachment**, **blend-mode effects**, and a **magnetic attraction** system. Written in TypeScript, framework-agnostic, and designed to be dropped into any web project.

---

## Requirements

| Peer dependency | Version |
|---|---|
| `gsap` | `^3.x` |

No GSAP plugins are needed.

---

## Installation (standalone use)

Copy the `cursor/` folder into your project and install `gsap`:

```bash
npm install gsap
```

If you use TypeScript, make sure `lib` includes `"dom"` in your `tsconfig.json`.

---

## Quick start

```ts
import { Cursor, initMagneticElements } from "./cursor";

// 1. Create the cursor (appends DOM to document.body by default)
const cursor = new Cursor();

// 2. Enable magnetic attraction on all [data-magnetic="true"] elements
const destroyMagnetic = initMagneticElements(document, {
  getStickTarget: () => cursor.stickTarget,
});

// 3. Cleanup on unmount / page destroy
cursor.destroy();
destroyMagnetic();
```

---

## React (Next.js) adapter

```tsx
// components/CustomCursor/CustomCursor.tsx
"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { Cursor, initMagneticElements } from "@/lib/cursor";
import "./CustomCursor.css";

function shouldEnableCursor(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(pointer: coarse)").matches) return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  return window.matchMedia("(min-width: 768px)").matches;
}

export default function CustomCursor() {
  const pathname = usePathname();
  const cursorRef = useRef<Cursor | null>(null);
  const cleanupMagneticRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!shouldEnableCursor()) return;

    cursorRef.current = new Cursor();
    cleanupMagneticRef.current = initMagneticElements(document, {
      getStickTarget: () => cursorRef.current?.stickTarget ?? null,
    });

    return () => {
      cleanupMagneticRef.current?.();
      cursorRef.current?.destroy();
      cursorRef.current = null;
    };
  }, []);

  // Re-scan for magnetic elements after route changes
  useEffect(() => {
    if (!cursorRef.current) return;
    cleanupMagneticRef.current?.();
    cleanupMagneticRef.current = initMagneticElements(document, {
      getStickTarget: () => cursorRef.current?.stickTarget ?? null,
    });
  }, [pathname]);

  return null;
}
```

Place `<CustomCursor />` inside your root layout **outside** any scroll wrapper.

---

## CSS

Copy `CustomCursor.css` into your project and import it where you mount the cursor component. The stylesheet uses CSS custom properties for colours, so you can theme it without editing the file:

```css
/* Override in your global styles */
:root {
  --cursor-color: #ffffff;
}
```

The cursor uses `mix-blend-mode: difference` on elements with `data-cursor-blend="difference"`, which requires the cursor to be a sibling of (not nested inside) the scrollable content.

---

## HTML data attributes API

Every cursor behaviour is driven by `data-*` attributes on your HTML elements. No JavaScript required beyond the initial setup.

### Sticky cursor

The cursor enlarges and "sticks" to an element when the mouse moves within a configurable radius.

| Attribute | Type | Description |
|---|---|---|
| `data-cursor-stick` | `"true"` \| `"false"` | Enable / disable stickiness. Setting to `"false"` dynamically detaches. |
| `data-cursor-stick-attach` | `number` (px) | Distance from element centre that triggers attachment. Default: `80`. |
| `data-cursor-stick-distance` | `number` (px) | Distance from element centre that releases the cursor. Default: `120`. |
| `data-cursor-scale` | `number` | Multiplier on `baseSize` while stuck. Default: `2.6`. |

```html
<button
  data-cursor-stick="true"
  data-cursor-scale="4"
  data-cursor-stick-attach="50"
  data-cursor-stick-distance="100"
>
  Hover me
</button>
```

**Programmatic release** — dispatch a DOM event from anywhere to force-release:

```ts
import { CURSOR_EVENTS } from "@/lib/cursor";
document.dispatchEvent(new CustomEvent(CURSOR_EVENTS.RELEASE_STICK));
```

---

### Blend mode

Inverts the cursor colour (or applies another blend mode) while hovering.

| Attribute | Type | Description |
|---|---|---|
| `data-cursor-blend` | `"difference"` \| `"multiply"` \| etc. | CSS `mix-blend-mode` value to apply. |
| `data-cursor-scale` | `number` | Multiplier on `baseSize` while hovering. Default: `2.4`. |

```html
<a href="/about" data-cursor-blend="difference" data-cursor-scale="2.8">
  About
</a>
```

---

### Custom state

Adds a CSS modifier class to the cursor root, letting you style it for specific contexts.

| Attribute | Type | Description |
|---|---|---|
| `data-cursor` | `string` | Whitespace-separated modifier name(s). Added while hovering. |

```html
<!-- Adds cb-cursor--drag while hovering -->
<div data-cursor="drag">Drag me</div>
```

```css
.cb-cursor--drag .cb-cursor__inner {
  cursor: grab;
  border: 2px solid white;
}
```

---

### Text label

Shows a short label inside the cursor.

| Attribute | Type | Description |
|---|---|---|
| `data-cursor-text` | `string` | Text to display. Also adds `cb-cursor--text`. |

```html
<div data-cursor-text="Play">▶</div>
```

---

### Magnetic attraction

Elements drift toward the mouse on hover and spring back on leave.

| Attribute | Type | Description |
|---|---|---|
| `data-magnetic` | `"true"` \| JSON | Enable magnetic pull. Pass a JSON object for custom options. |
| `data-magnetic-attached` | `number` (0–1) | Pull strength while the cursor is stuck to this element's sticky parent. Default: `0.18`. |

```html
<!-- Default strength -->
<button data-magnetic="true">Hover</button>

<!-- Custom strength and spring -->
<button data-magnetic='{"x": 0.5, "y": 0.5, "pullDuration": 0.15, "resetDuration": 0.6}'>
  Strong pull
</button>

<!-- Reduce movement while cursor is attached -->
<div
  data-cursor-stick="true"
  data-magnetic="true"
  data-magnetic-attached="0.1"
>
  Menu
</div>
```

**Magnetic element options** (JSON in `data-magnetic`):

| Key | Type | Default | Description |
|---|---|---|---|
| `x` | `number` | `0.35` | Horizontal pull strength (0–1). |
| `y` | `number` | `0.35` | Vertical pull strength (0–1). |
| `pullDuration` | `number` (s) | `0.2` | GSAP tween duration toward mouse. |
| `resetDuration` | `number` (s) | `0.7` | GSAP tween duration snapping back. |

---

## Constructor options

All options are optional. Defaults are shown below.

```ts
new Cursor({
  // Element the cursor DOM node is appended to and events listened on.
  container: document.body,

  // Milliseconds before hiding after mouseleave (lets CSS transition complete).
  visibleTimeout: 300,

  // Base diameter of the cursor circle in pixels.
  baseSize: 12,

  // Scale factor applied to baseSize when stuck to an element.
  // Per-element override: data-cursor-scale
  defaultStickScale: 2.6,

  // Scale factor applied to baseSize when hovering a blend element.
  defaultBlendScale: 2.4,

  // Lerp factor for cursor size transitions (0–1). Higher = snappier.
  sizeEase: 0.18,

  // Lerp factor for the free cursor chasing the mouse.
  followEase: 0.22,

  // Lerp factor for the stuck cursor chasing its parallax target.
  stickFollowEase: 0.16,

  // Fraction (0–1) of the mouse offset added to cursor position while stuck.
  // 0 = cursor pinned to element centre; 1 = cursor follows mouse fully.
  stickParallax: 0.12,

  // Default stick attach radius in pixels.
  stickAttachDistance: 80,

  // Default stick release radius in pixels.
  stickReleaseDistance: 120,

  // Jelly deformation: max horizontal stretch added to scaleX.
  jellyStretchX: 0.15,

  // Jelly deformation: max vertical squash subtracted from scaleY.
  jellySquashY: 0.15,

  // Jelly deformation: minimum scaleY (prevents full flattening).
  jellyMinScaleY: 0.9,
});
```

---

## Public API

### `Cursor`

```ts
// The element the cursor is currently stuck to (null when free).
// Read-only in practice; exposed for magnetic system integration.
cursor.stickTarget: HTMLElement | null

cursor.show(): void          // Make the cursor visible
cursor.hide(): void          // Fade out the cursor
cursor.addState(s: string)   // Add CSS modifier(s), e.g. "drag loading"
cursor.removeState(s: string)
cursor.showText(t: string)   // Show label inside cursor
cursor.hideText(): void
cursor.releaseStick(): void  // Force-release from stuck element
cursor.destroy(): void       // Full teardown
```

### `initMagneticElements`

```ts
const destroy = initMagneticElements(
  root?: Document | HTMLElement,   // Defaults to document
  options?: MagneticManagerOptions
): () => void
```

### `MagneticManager`

For advanced use cases where you need direct control:

```ts
const manager = new MagneticManager({ getStickTarget: () => cursor.stickTarget });
manager.init(root);     // Scan root for [data-magnetic="true"]
manager.update();       // Manually trigger a magnetic update pass
manager.destroy();      // Remove listeners and reset all elements
```

---

## CSS modifier reference

| Class | When active |
|---|---|
| `cb-cursor--visible` | Cursor is shown |
| `cb-cursor--stick` | Cursor is attached to a sticky element |
| `cb-cursor--active` | Mouse button held down |
| `cb-cursor--pointer` | Hovering `input`, `textarea`, or `select` |
| `cb-cursor--text` | `data-cursor-text` is active |
| `cb-cursor--blend-<mode>` | `data-cursor-blend` is active (e.g. `cb-cursor--blend-difference`) |
| `cb-cursor--<name>` | Any value from `data-cursor="<name>"` |

---

## How jelly deformation works

When stuck, the cursor measures the distance from its current position to the mouse each frame. That distance is mapped through a blended linear + logarithmic curve (configurable via `jellyStretchX`, `jellySquashY`, `jellyMinScaleY`) and converted to a `scaleX` / `scaleY` + `rotate` applied to `.cb-cursor__inner`. The result: the dot stretches toward the mouse and squashes perpendicular to it, like a ball of jelly being pulled.

The cursor drifts a fraction of the way toward the mouse (`stickParallax`) with easing (`stickFollowEase`), so it visibly follows the mouse without leaving the element area.

---

## How magnetic works

Each `[data-magnetic="true"]` element is tracked by `MagneticManager`. On every `mousemove`:

- **Free hover**: if the pointer is inside the element's bounding box, `gsap.to` animates the element toward `(mouse − elementCenter) × strength`.
- **Stick-linked**: if the element shares a sticky host with the cursor, the active range switches to the release distance once attached, and pull strength drops to `data-magnetic-attached` so the element moves subtly without fighting the stuck cursor.
- **Outside range**: element springs back to `{ x: 0, y: 0 }` via `gsap.to`.

---

## File structure

```
cursor/
├── index.ts          Public API barrel export
├── types.ts          TypeScript interfaces
├── constants.ts      Named constants (no magic numbers)
├── utils.ts          Pure DOM + math helpers
├── Cursor.ts         Core cursor class
├── MagneticManager.ts  Magnetic attraction system
└── README.md         This file
```
