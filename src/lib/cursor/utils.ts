/**
 * @module utils
 * Pure DOM and math helpers shared across the library.
 * None of these functions have side-effects.
 */

import type { Point } from "./types";
import type { DATA_ATTRS } from "./constants";

// ---------------------------------------------------------------------------
// Geometry
// ---------------------------------------------------------------------------

/**
 * Returns the centre point of an element's bounding box in viewport
 * coordinates. Reflects the element's live rendered position including
 * any CSS/GSAP transforms.
 */
export function getElementCenter(el: HTMLElement): Point {
  const rect = el.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
}

/** Euclidean distance between two points. */
export function getDistanceBetweenPoints(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/** Euclidean distance from a point to the centre of a DOM element. */
export function getDistanceFromElementCenter(
  el: HTMLElement,
  point: Point
): number {
  return getDistanceBetweenPoints(getElementCenter(el), point);
}

/** Returns `true` when `point` falls within the element's bounding box. */
export function isPointInsideElement(el: HTMLElement, point: Point): boolean {
  const rect = el.getBoundingClientRect();
  return (
    point.x >= rect.left &&
    point.x <= rect.right &&
    point.y >= rect.top &&
    point.y <= rect.bottom
  );
}

/**
 * Linear interpolation — moves `current` towards `target` by `factor`
 * each call. `factor = 1` snaps immediately; `factor ~= 0.1–0.2` gives
 * smooth easing.
 */
export function lerp(current: number, target: number, factor: number): number {
  return current + (target - current) * factor;
}

/**
 * Converts a direction vector to a rotation angle in degrees,
 * suitable for CSS / GSAP `rotate`.
 */
export function getAngleDegrees(dx: number, dy: number): number {
  return (Math.atan2(dy, dx) * 180) / Math.PI;
}

// ---------------------------------------------------------------------------
// DOM attribute helpers
// ---------------------------------------------------------------------------

/**
 * Reads a numeric `data-*` attribute from an element.
 * Returns `fallback` when the attribute is absent or non-numeric.
 */
export function readNumericAttribute(
  el: HTMLElement | null | undefined,
  attribute: (typeof DATA_ATTRS)[keyof typeof DATA_ATTRS] | string,
  fallback: number
): number {
  const raw = el?.getAttribute(attribute);
  const value = parseFloat(raw ?? "");
  return Number.isFinite(value) ? value : fallback;
}

/**
 * Returns `true` when `data-cursor-stick` is present and not `"false"`.
 */
export function isStickEnabled(el: HTMLElement): boolean {
  if (!el.hasAttribute("data-cursor-stick")) return false;
  return el.dataset.cursorStick !== "false";
}

/**
 * Walks up from `el` to find the nearest ancestor (inclusive) that has
 * `data-cursor-stick` enabled. Returns `null` if none found.
 */
export function findStickHost(el: HTMLElement): HTMLElement | null {
  if (isStickEnabled(el)) return el;
  const ancestor = el.closest<HTMLElement>("[data-cursor-stick]");
  if (ancestor && isStickEnabled(ancestor)) return ancestor;
  return null;
}

/**
 * Reads a blend-mode string from `data-cursor-blend`.
 * Returns `null` when absent, `"none"`, or `"default"`.
 */
export function readBlendMode(el: HTMLElement): string | null {
  const mode = el.dataset.cursorBlend;
  if (!mode || mode === "none" || mode === "default") return null;
  return mode;
}
