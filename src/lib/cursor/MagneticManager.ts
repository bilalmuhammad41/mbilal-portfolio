/**
 * @module MagneticManager
 *
 * Applies a gravity-like pull to elements marked with `data-magnetic="true"`.
 * Elements drift toward the mouse on hover and spring back on leave.
 *
 * When a cursor is stuck to a sticky element the magnetic pull is
 * reduced to a configurable fraction (`data-magnetic-attached`) so the
 * element moves less than the full-strength hover effect.
 *
 * @example Minimal setup
 * ```ts
 * import { initMagneticElements } from "@/lib/cursor";
 *
 * const destroy = initMagneticElements(document);
 * // later:
 * destroy();
 * ```
 *
 * @example With cursor integration
 * ```ts
 * const cursor = new Cursor();
 * const destroy = initMagneticElements(document, {
 *   getStickTarget: () => cursor.stickTarget,
 * });
 * ```
 */

import { gsap } from "gsap";
import type { MagneticElementOptions, MagneticManagerOptions, Point } from "./types";
import {
  MAGNETIC_DEFAULTS,
  DATA_ATTRS,
} from "./constants";
import {
  getElementCenter,
  getDistanceBetweenPoints,
  isPointInsideElement,
  findStickHost,
  readNumericAttribute,
} from "./utils";

// ---------------------------------------------------------------------------
// Per-element helpers
// ---------------------------------------------------------------------------

/**
 * Parses {@link MagneticElementOptions} from the `data-magnetic` attribute.
 * The attribute may be the string `"true"` (no options) or a JSON object.
 */
function parseMagneticElementOptions(el: HTMLElement): MagneticElementOptions {
  const raw = el.dataset.magnetic;
  if (!raw || raw === "true") return {};
  try {
    return JSON.parse(raw) as MagneticElementOptions;
  } catch {
    return {};
  }
}

function readAttachedStrength(stickHost: HTMLElement): number {
  return readNumericAttribute(
    stickHost,
    DATA_ATTRS.MAGNETIC_ATTACHED,
    MAGNETIC_DEFAULTS.ATTACHED_STRENGTH
  );
}

function readStickAttachDistance(stickHost: HTMLElement): number {
  return readNumericAttribute(
    stickHost,
    DATA_ATTRS.CURSOR_STICK_ATTACH,
    MAGNETIC_DEFAULTS.ATTACH_DISTANCE_PX
  );
}

function readStickReleaseDistance(stickHost: HTMLElement): number {
  return readNumericAttribute(
    stickHost,
    DATA_ATTRS.CURSOR_STICK_DISTANCE,
    MAGNETIC_DEFAULTS.RELEASE_DISTANCE_PX
  );
}

// ---------------------------------------------------------------------------
// MagneticElement — wraps a single DOM element
// ---------------------------------------------------------------------------

class MagneticElement {
  readonly el: HTMLElement;

  private readonly pullStrengthX: number;
  private readonly pullStrengthY: number;
  private readonly pullDuration: number;
  private readonly resetDuration: number;

  constructor(el: HTMLElement) {
    this.el = el;
    const opts = parseMagneticElementOptions(el);
    this.pullStrengthX = opts.x ?? MAGNETIC_DEFAULTS.PULL_STRENGTH_X;
    this.pullStrengthY = opts.y ?? MAGNETIC_DEFAULTS.PULL_STRENGTH_Y;
    this.pullDuration = opts.pullDuration ?? MAGNETIC_DEFAULTS.PULL_DURATION_S;
    this.resetDuration = opts.resetDuration ?? MAGNETIC_DEFAULTS.RESET_DURATION_S;
  }

  isEnabled(): boolean {
    return (
      this.el.dataset.magnetic === "true" &&
      !(this.el as HTMLButtonElement | HTMLInputElement).disabled
    );
  }

  /**
   * Animates the element toward the given mouse coordinates.
   * @param strength - Multiplier applied on top of the per-axis strengths.
   *                   Pass `< 1` when the cursor is stuck to reduce movement.
   */
  pull(mouseX: number, mouseY: number, strength = 1): void {
    if (!this.isEnabled()) return;

    const bound = this.el.getBoundingClientRect();
    const x =
      (mouseX - bound.left - bound.width / 2) * this.pullStrengthX * strength;
    const y =
      (mouseY - bound.top - bound.height / 2) * this.pullStrengthY * strength;

    gsap.to(this.el, {
      x,
      y,
      force3D: true,
      overwrite: true,
      duration: this.pullDuration,
    });
  }

  /** Springs the element back to its original position. */
  reset(duration?: number): void {
    gsap.to(this.el, {
      x: 0,
      y: 0,
      force3D: true,
      overwrite: true,
      duration: duration ?? this.resetDuration,
    });
  }
}

// ---------------------------------------------------------------------------
// MagneticManager — tracks all magnetic elements
// ---------------------------------------------------------------------------

/**
 * Manages a collection of magnetic elements within a root node.
 * Listens for `mousemove` on `document` and updates every tracked
 * element each move event.
 *
 * Prefer the {@link initMagneticElements} factory unless you need
 * direct access to `init` (e.g. for route-change re-scanning).
 */
export class MagneticManager {
  private readonly getStickTarget: () => HTMLElement | null;
  private mouse: Point = { x: -9999, y: -9999 };
  private items: MagneticElement[] = [];
  private readonly boundOnMouseMove: (event: MouseEvent) => void;

  constructor(options: MagneticManagerOptions = {}) {
    this.getStickTarget = options.getStickTarget ?? (() => null);
    this.boundOnMouseMove = this.onMouseMove.bind(this);
    document.addEventListener("mousemove", this.boundOnMouseMove);
  }

  /**
   * Scans `root` for `[data-magnetic="true"]` elements and registers
   * them. Call again (e.g. after route changes) to re-scan.
   */
  init(root: Document | HTMLElement = document): void {
    this.clearItems();
    root
      .querySelectorAll<HTMLElement>(`[${DATA_ATTRS.MAGNETIC}="true"]`)
      .forEach((el) => {
        if ((el as HTMLButtonElement | HTMLInputElement).disabled) return;
        this.items.push(new MagneticElement(el));
      });
  }

  private onMouseMove(event: MouseEvent): void {
    this.mouse = { x: event.clientX, y: event.clientY };
    this.update();
  }

  /** Manually trigger a magnetic update pass (useful in RAF loops). */
  update(): void {
    const stickTarget = this.getStickTarget();

    for (const item of this.items) {
      if (!item.isEnabled()) {
        item.reset();
        continue;
      }

      const stickHost = findStickHost(item.el);

      if (stickHost) {
        this.updateStickLinkedElement(item, stickHost, stickTarget);
        continue;
      }

      if (isPointInsideElement(item.el, this.mouse)) {
        item.pull(this.mouse.x, this.mouse.y);
      } else {
        item.reset();
      }
    }
  }

  /**
   * Handles an element that shares a sticky host with the cursor.
   * While the cursor is attached, pull strength is reduced so the
   * element moves less than during free hover.
   */
  private updateStickLinkedElement(
    item: MagneticElement,
    stickHost: HTMLElement,
    stickTarget: HTMLElement | null
  ): void {
    const isAttached = stickTarget === stickHost;
    const pullRange = isAttached
      ? readStickReleaseDistance(stickHost)
      : readStickAttachDistance(stickHost);
    const distanceToHost = getDistanceBetweenPoints(
      getElementCenter(stickHost),
      this.mouse
    );

    if (distanceToHost <= pullRange) {
      const strength = isAttached ? readAttachedStrength(stickHost) : 1;
      item.pull(this.mouse.x, this.mouse.y, strength);
    } else {
      item.reset();
    }
  }

  private clearItems(): void {
    for (const item of this.items) {
      gsap.set(item.el, { x: 0, y: 0 });
    }
    this.items = [];
  }

  /** Removes the `mousemove` listener and resets all tracked elements. */
  destroy(): void {
    document.removeEventListener("mousemove", this.boundOnMouseMove);
    this.clearItems();
  }
}

// ---------------------------------------------------------------------------
// Public factory
// ---------------------------------------------------------------------------

/**
 * Creates a {@link MagneticManager}, scans `root` for magnetic elements,
 * and returns a `destroy` function.
 *
 * @param root    - Root node to scan. Defaults to `document`.
 * @param options - Manager configuration.
 * @returns A cleanup function that removes listeners and resets transforms.
 *
 * @example
 * ```ts
 * const destroy = initMagneticElements(document, {
 *   getStickTarget: () => cursor.stickTarget,
 * });
 * ```
 */
export function initMagneticElements(
  root: Document | HTMLElement = document,
  options: MagneticManagerOptions = {}
): () => void {
  const manager = new MagneticManager(options);
  manager.init(root);
  return () => manager.destroy();
}
