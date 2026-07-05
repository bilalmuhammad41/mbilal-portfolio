/**
 * @module types
 * Core TypeScript interfaces and type aliases for the cb-cursor library.
 */

// ---------------------------------------------------------------------------
// Primitives
// ---------------------------------------------------------------------------

/** An (x, y) coordinate pair. */
export interface Point {
  readonly x: number;
  readonly y: number;
}

/** CSS mix-blend-mode values supported by the cursor. */
export type BlendMode = "difference" | "multiply" | "screen" | "overlay" | "exclusion";

// ---------------------------------------------------------------------------
// Cursor options
// ---------------------------------------------------------------------------

/**
 * Configuration for the {@link Cursor} instance.
 * Every field is optional; sensible defaults are applied for each.
 */
export interface CursorOptions {
  /**
   * The element that the cursor DOM node is appended to and that
   * mouse events are listened on. Defaults to `document.body`.
   */
  container?: HTMLElement;

  /**
   * Milliseconds to wait before fully hiding the cursor after
   * `mouseleave`. Allows CSS transitions to complete. Default: `300`.
   */
  visibleTimeout?: number;

  /** Base diameter of the cursor dot in pixels. Default: `12`. */
  baseSize?: number;

  /**
   * Scale multiplier applied to `baseSize` when the cursor is stuck
   * to a sticky element. Can be overridden per-element via
   * `data-cursor-scale`. Default: `2.6`.
   */
  defaultStickScale?: number;

  /**
   * Scale multiplier applied to `baseSize` when hovering a blend
   * element. Can be overridden per-element via `data-cursor-scale`.
   * Default: `2.4`.
   */
  defaultBlendScale?: number;

  /**
   * Lerp factor (0–1) for cursor-size transitions each frame.
   * Higher = snappier. Default: `0.18`.
   */
  sizeEase?: number;

  /**
   * Lerp factor (0–1) for the free cursor chasing the mouse each frame.
   * Default: `0.22`.
   */
  followEase?: number;

  /**
   * Lerp factor (0–1) for the stuck cursor chasing its parallax
   * target each frame. Default: `0.16`.
   */
  stickFollowEase?: number;

  /**
   * How far (as a fraction 0–1) the stuck cursor drifts toward the
   * mouse from the element center. `0` = cursor pinned to center,
   * `1` = cursor follows mouse fully. Default: `0.12`.
   */
  stickParallax?: number;

  /**
   * Default distance from element center (px) at which the cursor
   * auto-attaches to a sticky element. Override per-element with
   * `data-cursor-stick-attach`. Default: `80`.
   */
  stickAttachDistance?: number;

  /**
   * Default distance from element center (px) at which the cursor
   * releases from a sticky element. Override per-element with
   * `data-cursor-stick-distance`. Default: `120`.
   */
  stickReleaseDistance?: number;

  /**
   * Maximum horizontal stretch multiplier added to `scaleX` during
   * jelly deformation. Default: `0.15`.
   */
  jellyStretchX?: number;

  /**
   * Maximum vertical squash subtracted from `scaleY` during jelly
   * deformation. Default: `0.15`.
   */
  jellySquashY?: number;

  /**
   * Minimum `scaleY` value during jelly deformation to prevent the
   * cursor from flattening completely. Default: `0.9`.
   */
  jellyMinScaleY?: number;
}

// ---------------------------------------------------------------------------
// Magnetic options
// ---------------------------------------------------------------------------

/**
 * Per-element magnetic pull configuration.
 * Can be supplied as JSON in `data-magnetic='{"x":0.4,"pullDuration":0.3}'`.
 */
export interface MagneticElementOptions {
  /** Horizontal pull strength multiplier (0–1). Default: `0.35`. */
  x?: number;

  /** Vertical pull strength multiplier (0–1). Default: `0.35`. */
  y?: number;

  /**
   * GSAP tween duration in seconds for the pull animation.
   * Default: `0.2`.
   */
  pullDuration?: number;

  /**
   * GSAP tween duration in seconds when snapping back to origin.
   * Default: `0.7`.
   */
  resetDuration?: number;
}

/**
 * Options for the {@link MagneticManager} and
 * {@link initMagneticElements} helper.
 */
export interface MagneticManagerOptions {
  /**
   * Callback that returns the element the cursor is currently stuck
   * to. Used to reduce magnetic strength while attached. If not
   * provided the magnetic system is unaware of cursor state.
   */
  getStickTarget?: () => HTMLElement | null;
}
