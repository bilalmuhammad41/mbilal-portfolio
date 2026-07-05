/**
 * @module constants
 * All tuneable values and string keys in one place.
 * Import named constants instead of inlining magic numbers.
 */

// ---------------------------------------------------------------------------
// Cursor defaults
// ---------------------------------------------------------------------------

/** Baseline values for every {@link CursorOptions} field. */
export const CURSOR_DEFAULTS = {
  VISIBLE_TIMEOUT_MS: 300,
  BASE_SIZE_PX: 12,
  DEFAULT_STICK_SCALE: 2.6,
  DEFAULT_BLEND_SCALE: 2.4,
  SIZE_EASE: 0.18,
  FOLLOW_EASE: 0.22,
  STICK_FOLLOW_EASE: 0.16,
  STICK_PARALLAX: 0.12,
  STICK_ATTACH_DISTANCE_PX: 80,
  STICK_RELEASE_DISTANCE_PX: 120,
  JELLY_STRETCH_X: 0.15,
  JELLY_SQUASH_Y: 0.15,
  JELLY_MIN_SCALE_Y: 0.9,

  /** Cursor diameter when hovering interactive form fields. */
  POINTER_SIZE_PX: 8,

  /**
   * Scale factor applied while the mouse button is held down
   * (multiplied onto the computed jelly scale).
   */
  PRESS_SCALE_REDUCTION: 0.94,

  /**
   * Uniform scale applied to the free cursor while the mouse button
   * is held down.
   */
  PRESS_FREE_SCALE: 0.9,

  /**
   * Minimum cursor-to-mouse distance (px) before the jelly rotation
   * angle is calculated. Below this threshold the angle stays at 0
   * to avoid jitter when the cursor is nearly on top of the mouse.
   */
  JELLY_ANGLE_THRESHOLD_PX: 4,

  /**
   * Weight given to the linear component of the jelly stretch curve.
   * The remaining weight goes to the logarithmic component.
   */
  JELLY_STRETCH_LINEAR_WEIGHT: 0.7,

  /** Weight given to the logarithmic component of the jelly stretch curve. */
  JELLY_STRETCH_LOG_WEIGHT: 0.3,
} as const;

// ---------------------------------------------------------------------------
// Magnetic defaults
// ---------------------------------------------------------------------------

/** Baseline values for every {@link MagneticElementOptions} field. */
export const MAGNETIC_DEFAULTS = {
  PULL_STRENGTH_X: 0.35,
  PULL_STRENGTH_Y: 0.35,
  PULL_DURATION_S: 0.2,
  RESET_DURATION_S: 0.7,

  /**
   * Strength multiplier while the cursor is stuck to the associated
   * element. Lower values keep the element more stationary.
   */
  ATTACHED_STRENGTH: 0.18,

  ATTACH_DISTANCE_PX: 80,
  RELEASE_DISTANCE_PX: 120,
} as const;

// ---------------------------------------------------------------------------
// HTML data attributes
// ---------------------------------------------------------------------------

/**
 * Every `data-*` attribute read by the library.
 * Use these constants when programmatically setting attributes instead
 * of hard-coding strings.
 *
 * @example
 * ```ts
 * el.setAttribute(DATA_ATTRS.CURSOR_STICK, "true");
 * ```
 */
export const DATA_ATTRS = {
  /**
   * Enable stick behaviour on an element.
   * Value: `"true"` | `"false"`.
   */
  CURSOR_STICK: "data-cursor-stick",

  /**
   * Distance from element center (px) that triggers cursor attachment.
   * Overrides the global `stickAttachDistance` option.
   */
  CURSOR_STICK_ATTACH: "data-cursor-stick-attach",

  /**
   * Distance from element center (px) that triggers cursor release.
   * Overrides the global `stickReleaseDistance` option.
   */
  CURSOR_STICK_DISTANCE: "data-cursor-stick-distance",

  /**
   * Scale multiplier for `baseSize` when the cursor is near/on this
   * element. Works for both sticky and blend elements.
   */
  CURSOR_SCALE: "data-cursor-scale",

  /**
   * Mix-blend-mode to apply while hovering this element.
   * Value: any supported {@link BlendMode} string.
   */
  CURSOR_BLEND: "data-cursor-blend",

  /**
   * Whitespace-separated CSS modifier names appended to the cursor
   * root class while hovering. E.g. `data-cursor="drag"` adds
   * `cb-cursor--drag`.
   */
  CURSOR_STATE: "data-cursor",

  /**
   * Text shown inside the cursor label while hovering.
   * Also adds `cb-cursor--text` to the root.
   */
  CURSOR_TEXT: "data-cursor-text",

  /**
   * Enable magnetic behaviour. Value: `"true"` or a JSON object
   * matching {@link MagneticElementOptions}.
   */
  MAGNETIC: "data-magnetic",

  /**
   * Magnetic pull strength (0–1) used while the cursor is stuck to
   * the associated sticky parent. Default: `0.18`.
   */
  MAGNETIC_ATTACHED: "data-magnetic-attached",
} as const;

// ---------------------------------------------------------------------------
// CSS class names
// ---------------------------------------------------------------------------

/** Every BEM class name used by the cursor markup. */
export const CSS_CLASSES = {
  ROOT: "cb-cursor",
  INNER: "cb-cursor__inner",
  TEXT_LABEL: "cb-cursor__text",

  VISIBLE: "cb-cursor--visible",
  STICK: "cb-cursor--stick",
  ACTIVE: "cb-cursor--active",
  POINTER: "cb-cursor--pointer",
  TEXT_STATE: "cb-cursor--text",

  /**
   * Prefix for blend-mode modifier classes.
   * The full class is `cb-cursor--blend-<mode>`.
   */
  BLEND_PREFIX: "cb-cursor--blend-",
} as const;

// ---------------------------------------------------------------------------
// Custom events
// ---------------------------------------------------------------------------

/** Custom DOM events dispatched or listened to by the library. */
export const CURSOR_EVENTS = {
  /**
   * Dispatch this event on `document` to programmatically release the
   * cursor from whatever element it is currently stuck to.
   *
   * @example
   * ```ts
   * document.dispatchEvent(new CustomEvent(CURSOR_EVENTS.RELEASE_STICK));
   * ```
   */
  RELEASE_STICK: "cursor:release-stick",
} as const;

// ---------------------------------------------------------------------------
// Selector
// ---------------------------------------------------------------------------

/** Elements that trigger the `cb-cursor--pointer` state. */
export const INTERACTIVE_FORM_SELECTOR = "input, textarea, select" as const;
