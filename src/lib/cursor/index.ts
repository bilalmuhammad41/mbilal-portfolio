/**
 * cb-cursor
 *
 * A GSAP-powered magnetic custom cursor with jelly deformation,
 * sticky attachment, blend-mode effects, and a gravity-based magnetic
 * attraction system for interactive elements.
 *
 * Designed to be self-contained and framework-agnostic.
 * A React adapter is available in `@/components/CustomCursor`.
 *
 * @module cb-cursor
 *
 * @example Minimal vanilla JS setup
 * ```ts
 * import { Cursor, initMagneticElements } from "@/lib/cursor";
 *
 * const cursor = new Cursor();
 * const destroyMagnetic = initMagneticElements(document, {
 *   getStickTarget: () => cursor.stickTarget,
 * });
 *
 * // Cleanup
 * cursor.destroy();
 * destroyMagnetic();
 * ```
 */

// ---- Core classes ----------------------------------------------------------
export { Cursor } from "./Cursor";
export { MagneticManager, initMagneticElements } from "./MagneticManager";

// ---- Types -----------------------------------------------------------------
export type {
  Point,
  BlendMode,
  CursorOptions,
  MagneticElementOptions,
  MagneticManagerOptions,
} from "./types";

// ---- Constants (re-exported for consumers who set attributes in code) ------
export { DATA_ATTRS, CSS_CLASSES, CURSOR_EVENTS } from "./constants";
