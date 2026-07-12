# Hooks Index

Custom React hooks in this repository. No `@gsap/react` or third-party hook libraries.

---

## usePageTransition

| Field | Value |
|-------|-------|
| Path | `src/components/PageTransition/PageTransitionContext.jsx` |
| Purpose | Access SPA navigation API from any child of `PageTransitionShell` |
| Parameters | none |
| Returns | `{ navigate, activeSlug, isTransitioning, registerPageRef }` |
| Side effects | none (reads context) |
| Dependencies | React context |
| Consumers | `TransitionLink.jsx`, `TransitionCurtain`, `TransitionOverlay` |
| Duplicate logic | none |
| Improvements | — |

### Return values

| Key | Type | Description |
|-----|------|-------------|
| `navigate` | `(slug: string) => void` | Trigger curtain transition to slug |
| `activeSlug` | `string` | Current registry key (e.g. `/projects`) |
| `isTransitioning` | `boolean` | True during curtain animation |
| `registerPageRef` | `(slug, ref) => void` | Internal — registers view DOM refs |

---

## useTheme

| Field | Value |
|-------|-------|
| Path | `src/components/Theme/ThemeContext.jsx` |
| Purpose | Read and toggle light/dark theme |
| Parameters | none |
| Returns | `{ theme: "light" \| "dark", toggleTheme: () => void }` |
| Side effects | none (reads context; toggle handled by provider) |
| Dependencies | `ThemeProvider` ancestor |
| Consumers | `ThemeToggle.jsx` only |
| Duplicate logic | none |
| Improvements | Re-enable `ThemeToggle` in Nav when theme switching is desired |

---

## useIsClient

| Field | Value |
|-------|-------|
| Path | `src/lib/useIsClient.js` |
| Purpose | SSR-safe client detection via `useSyncExternalStore` |
| Parameters | none |
| Returns | `boolean` — `true` on client, `false` during SSR |
| Side effects | none |
| Dependencies | React only |
| Consumers | `TransitionCurtain`, `TransitionOverlay` |
| Duplicate logic | Could replace ad-hoc `typeof window` checks elsewhere |
| Improvements | — |

### Implementation

```js
export function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}
```

---

## Hook usage rules

1. **Navigation** — use `usePageTransition` via `TransitionLink`; do not create alternate routing hooks
2. **Theme** — use `useTheme`; do not read `localStorage.theme` directly in components
3. **Client detection** — prefer `useIsClient` over inline `typeof window` checks (once adopted)
4. **GSAP in components** — use `useEffect` + `gsap.context()` cleanup pattern (see `ScrollSmootherWrapper`, `HomeView`); no dedicated GSAP hook exists yet
5. **New hooks** — add to this index; place in `src/lib/` if framework-agnostic, or next to the feature component if context-specific

## Related

- [../components/component-index.md](../components/component-index.md)
- [../architecture/routing.md](../architecture/routing.md)
