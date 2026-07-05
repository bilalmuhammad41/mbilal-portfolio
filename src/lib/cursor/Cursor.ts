/**
 * @module Cursor
 *
 * A GSAP-powered custom cursor with jelly deformation, sticky attachment,
 * blend-mode effects, and magnetic element support.
 *
 * The cursor appends two DOM nodes to `container`:
 * - `.cb-cursor` — the outer wrapper positioned via `transform: translate`
 * - `.cb-cursor__inner` — the visible circle; scaled / rotated for jelly
 * - `.cb-cursor__text` — optional label shown via `data-cursor-text`
 *
 * @example Minimal usage
 * ```ts
 * import { Cursor } from "@/lib/cursor";
 *
 * const cursor = new Cursor();
 * // later:
 * cursor.destroy();
 * ```
 *
 * @example Custom options
 * ```ts
 * const cursor = new Cursor({
 *   baseSize: 14,
 *   followEase: 0.18,
 *   stickParallax: 0.15,
 * });
 * ```
 */

import { gsap } from "gsap";
import type { CursorOptions, Point } from "./types";
import {
  CURSOR_DEFAULTS,
  CSS_CLASSES,
  DATA_ATTRS,
  CURSOR_EVENTS,
  INTERACTIVE_FORM_SELECTOR,
} from "./constants";
import {
  getElementCenter,
  getDistanceFromElementCenter,
  isPointInsideElement,
  isStickEnabled,
  readBlendMode,
  readNumericAttribute,
  lerp,
  getAngleDegrees,
} from "./utils";

// ---------------------------------------------------------------------------
// Resolved options (all fields required after merging defaults)
// ---------------------------------------------------------------------------

type ResolvedCursorOptions = Required<CursorOptions>;

function resolveOptions(options: CursorOptions): ResolvedCursorOptions {
  return {
    container: options.container ?? document.body,
    visibleTimeout: options.visibleTimeout ?? CURSOR_DEFAULTS.VISIBLE_TIMEOUT_MS,
    baseSize: options.baseSize ?? CURSOR_DEFAULTS.BASE_SIZE_PX,
    defaultStickScale: options.defaultStickScale ?? CURSOR_DEFAULTS.DEFAULT_STICK_SCALE,
    defaultBlendScale: options.defaultBlendScale ?? CURSOR_DEFAULTS.DEFAULT_BLEND_SCALE,
    sizeEase: options.sizeEase ?? CURSOR_DEFAULTS.SIZE_EASE,
    followEase: options.followEase ?? CURSOR_DEFAULTS.FOLLOW_EASE,
    stickFollowEase: options.stickFollowEase ?? CURSOR_DEFAULTS.STICK_FOLLOW_EASE,
    stickParallax: options.stickParallax ?? CURSOR_DEFAULTS.STICK_PARALLAX,
    stickAttachDistance: options.stickAttachDistance ?? CURSOR_DEFAULTS.STICK_ATTACH_DISTANCE_PX,
    stickReleaseDistance: options.stickReleaseDistance ?? CURSOR_DEFAULTS.STICK_RELEASE_DISTANCE_PX,
    jellyStretchX: options.jellyStretchX ?? CURSOR_DEFAULTS.JELLY_STRETCH_X,
    jellySquashY: options.jellySquashY ?? CURSOR_DEFAULTS.JELLY_SQUASH_Y,
    jellyMinScaleY: options.jellyMinScaleY ?? CURSOR_DEFAULTS.JELLY_MIN_SCALE_Y,
  };
}

// ---------------------------------------------------------------------------
// Cursor class
// ---------------------------------------------------------------------------

export class Cursor {
  private readonly options: ResolvedCursorOptions;

  // ---- DOM nodes -----------------------------------------------------------
  /** The outer wrapper element. Position is set via GSAP `x`/`y`. */
  private readonly rootEl: HTMLElement;
  /** The visible circle. Scale, rotate, width, height are applied here. */
  private readonly innerEl: HTMLElement;
  /** The optional text label shown by `data-cursor-text`. */
  private readonly textEl: HTMLElement;

  // ---- Runtime state -------------------------------------------------------
  private mouse: Point = { x: -9999, y: -9999 };
  private pos: Point = { x: -9999, y: -9999 };
  private currentSize: number;
  private rafId: number | null = null;
  private visibilityTimer: ReturnType<typeof setTimeout> | null = null;
  private isVisible = false;

  // ---- Stick state ---------------------------------------------------------
  /**
   * The element the cursor is currently stuck to, or `null` when free.
   * This is intentionally `public` so external systems (e.g. the
   * magnetic manager) can read which element is attached.
   */
  public stickTarget: HTMLElement | null = null;
  private activeStickScale: number;
  private activeStickAttachDistance: number;
  private activeStickReleaseDistance: number;
  private isPointerOverStickTarget = false;

  // ---- Blend state ---------------------------------------------------------
  private blendTarget: HTMLElement | null = null;
  private activeBlendScale: number;

  // ---- Bound event handlers (stored for proper removeEventListener) --------
  private readonly handlers: {
    mouseLeave: () => void;
    mouseEnter: () => void;
    mouseMove: (e: MouseEvent) => void;
    mouseDown: () => void;
    mouseUp: () => void;
    pointerEnter: (e: MouseEvent) => void;
    pointerLeave: (e: MouseEvent) => void;
    cursorStateEnter: (e: MouseEvent) => void;
    cursorStateLeave: (e: MouseEvent) => void;
    cursorTextEnter: (e: MouseEvent) => void;
    cursorTextLeave: (e: MouseEvent) => void;
    stickEnter: (e: MouseEvent) => void;
    stickLeave: (e: MouseEvent) => void;
    blendEnter: (e: MouseEvent) => void;
    blendLeave: (e: MouseEvent) => void;
    releaseStickEvent: () => void;
    iframeEnter: (e: MouseEvent) => void;
    iframeLeave: (e: MouseEvent) => void;
  };

  constructor(options: CursorOptions = {}) {
    this.options = resolveOptions(options);
    this.currentSize = this.options.baseSize;
    this.activeStickScale = this.options.defaultStickScale;
    this.activeStickAttachDistance = this.options.stickAttachDistance;
    this.activeStickReleaseDistance = this.options.stickReleaseDistance;
    this.activeBlendScale = this.options.defaultBlendScale;

    // ---- Build DOM ----------------------------------------------------------
    this.rootEl = document.createElement("div");
    this.rootEl.className = CSS_CLASSES.ROOT;
    this.rootEl.setAttribute("aria-hidden", "true");

    this.innerEl = document.createElement("div");
    this.innerEl.className = CSS_CLASSES.INNER;

    this.textEl = document.createElement("div");
    this.textEl.className = CSS_CLASSES.TEXT_LABEL;

    this.rootEl.append(this.innerEl, this.textEl);
    this.options.container.appendChild(this.rootEl);

    // ---- Bind event handlers ------------------------------------------------
    this.handlers = {
      mouseLeave: this.onMouseLeave.bind(this),
      mouseEnter: this.onMouseEnter.bind(this),
      mouseMove: this.onMouseMove.bind(this),
      mouseDown: this.onMouseDown.bind(this),
      mouseUp: this.onMouseUp.bind(this),
      pointerEnter: this.onPointerEnter.bind(this),
      pointerLeave: this.onPointerLeave.bind(this),
      cursorStateEnter: this.onCursorStateEnter.bind(this),
      cursorStateLeave: this.onCursorStateLeave.bind(this),
      cursorTextEnter: this.onCursorTextEnter.bind(this),
      cursorTextLeave: this.onCursorTextLeave.bind(this),
      stickEnter: this.onStickEnter.bind(this),
      stickLeave: this.onStickLeave.bind(this),
      blendEnter: this.onBlendEnter.bind(this),
      blendLeave: this.onBlendLeave.bind(this),
      releaseStickEvent: this.releaseStick.bind(this),
      iframeEnter: (e: MouseEvent) => {
        if ((e.target as HTMLElement).closest("iframe")) this.hide();
      },
      iframeLeave: (e: MouseEvent) => {
        if ((e.target as HTMLElement).closest("iframe")) this.show();
      },
    };

    this.bindEvents();
    this.startRenderLoop();
  }

  // ---------------------------------------------------------------------------
  // Event binding
  // ---------------------------------------------------------------------------

  private bindEvents(): void {
    const { container } = this.options;
    const { handlers: h } = this;

    container.addEventListener("mouseleave", h.mouseLeave);
    container.addEventListener("mouseenter", h.mouseEnter);
    container.addEventListener("mousemove", h.mouseMove);
    container.addEventListener("mousedown", h.mouseDown);
    container.addEventListener("mouseup", h.mouseUp);

    // Capture phase: fires before the element's own listener, giving us early
    // notification of enter/leave for nested elements.
    container.addEventListener("mouseenter", h.pointerEnter, true);
    container.addEventListener("mouseleave", h.pointerLeave, true);
    container.addEventListener("mouseenter", h.cursorStateEnter, true);
    container.addEventListener("mouseleave", h.cursorStateLeave, true);
    container.addEventListener("mouseenter", h.cursorTextEnter, true);
    container.addEventListener("mouseleave", h.cursorTextLeave, true);
    container.addEventListener("mouseenter", h.stickEnter, true);
    container.addEventListener("mouseleave", h.stickLeave, true);
    container.addEventListener("mouseenter", h.blendEnter, true);
    container.addEventListener("mouseleave", h.blendLeave, true);
    container.addEventListener("mouseenter", h.iframeEnter, true);
    container.addEventListener("mouseleave", h.iframeLeave, true);

    document.addEventListener(CURSOR_EVENTS.RELEASE_STICK, h.releaseStickEvent);
  }

  // ---------------------------------------------------------------------------
  // Render loop
  // ---------------------------------------------------------------------------

  private startRenderLoop(): void {
    const tick = () => {
      this.rafId = requestAnimationFrame(tick);
      this.render();
    };
    tick();
  }

  private render(): void {
    if (!this.isVisible) return;

    if (this.stickTarget) {
      this.checkStickRelease();
    } else {
      this.checkStickAttach();
    }

    if (this.stickTarget) {
      this.renderStuck();
    } else {
      this.renderFree();
    }

    gsap.set(this.rootEl, { x: this.pos.x, y: this.pos.y, force3D: true });
  }

  /**
   * Renders the cursor while it is stuck to an element.
   *
   * Position: lerps toward `elementCenter + (mouse − elementCenter) × parallax`
   * so the cursor drifts a fraction of the way toward the mouse.
   *
   * Jelly: stretch/squash is computed from the cursor's actual position to
   * the mouse, making the deformation reflect the real pull direction.
   */
  private renderStuck(): void {
    const { options, mouse } = this;
    // Live element center (includes any GSAP / CSS transform displacement).
    const elementCenter = getElementCenter(this.stickTarget!);

    // Parallax target: element center + fraction toward mouse.
    const targetX = elementCenter.x + (mouse.x - elementCenter.x) * options.stickParallax;
    const targetY = elementCenter.y + (mouse.y - elementCenter.y) * options.stickParallax;

    this.pos = {
      x: lerp(this.pos.x, targetX, options.stickFollowEase),
      y: lerp(this.pos.y, targetY, options.stickFollowEase),
    };

    // Direction and distance from cursor position to mouse.
    const dx = mouse.x - this.pos.x;
    const dy = mouse.y - this.pos.y;
    const cursorToMouseDist = Math.hypot(dx, dy);

    const stretchFactor = this.computeStretchFactor(cursorToMouseDist);
    const { scaleX, scaleY } = this.computeJellyScales(stretchFactor);
    const rotationAngle =
      cursorToMouseDist > CURSOR_DEFAULTS.JELLY_ANGLE_THRESHOLD_PX
        ? getAngleDegrees(dx, dy)
        : 0;

    const targetSize = this.getTargetSize();
    this.currentSize = lerp(this.currentSize, targetSize, options.sizeEase);

    const isPressed = this.rootEl.classList.contains(CSS_CLASSES.ACTIVE);
    const pressReduction = isPressed ? CURSOR_DEFAULTS.PRESS_SCALE_REDUCTION : 1;

    gsap.set(this.innerEl, {
      xPercent: -50,
      yPercent: -50,
      width: this.currentSize,
      height: this.currentSize,
      rotate: rotationAngle,
      scaleX: scaleX * pressReduction,
      scaleY: scaleY * pressReduction,
    });
  }

  /** Renders the cursor while it is following the mouse freely. */
  private renderFree(): void {
    const { options, mouse } = this;

    this.pos = {
      x: lerp(this.pos.x, mouse.x, options.followEase),
      y: lerp(this.pos.y, mouse.y, options.followEase),
    };

    const targetSize = this.getTargetSize();
    this.currentSize = lerp(this.currentSize, targetSize, options.sizeEase);

    const isPressed = this.rootEl.classList.contains(CSS_CLASSES.ACTIVE);
    const uniformScale = isPressed
      ? CURSOR_DEFAULTS.PRESS_FREE_SCALE
      : 1;

    gsap.set(this.innerEl, {
      xPercent: -50,
      yPercent: -50,
      width: this.currentSize,
      height: this.currentSize,
      rotate: 0,
      scaleX: uniformScale,
      scaleY: uniformScale,
    });
  }

  // ---------------------------------------------------------------------------
  // Jelly maths
  // ---------------------------------------------------------------------------

  /**
   * Maps `distancePx` to a 0–1 stretch factor using a blend of linear
   * and logarithmic curves so near-field motion is smooth and far-field
   * motion keeps rising.
   */
  private computeStretchFactor(distancePx: number): number {
    const maxDist = this.activeStickReleaseDistance;
    if (maxDist <= 0 || distancePx <= 0) return 0;

    const normalized = Math.min(distancePx / maxDist, 1);
    const logNormalized = Math.log1p(distancePx) / Math.log1p(maxDist);

    return (
      normalized * CURSOR_DEFAULTS.JELLY_STRETCH_LINEAR_WEIGHT +
      logNormalized * CURSOR_DEFAULTS.JELLY_STRETCH_LOG_WEIGHT
    );
  }

  /** Converts a 0–1 stretch factor to `scaleX` / `scaleY` values. */
  private computeJellyScales(stretchFactor: number): {
    scaleX: number;
    scaleY: number;
  } {
    const { options } = this;
    const scaleX = 1 + stretchFactor * options.jellyStretchX;
    const scaleY = Math.max(
      options.jellyMinScaleY,
      1 - stretchFactor * options.jellySquashY
    );
    return { scaleX, scaleY };
  }

  // ---------------------------------------------------------------------------
  // Size
  // ---------------------------------------------------------------------------

  private getTargetSize(): number {
    if (this.stickTarget) {
      return this.options.baseSize * this.activeStickScale;
    }
    if (this.blendTarget) {
      return this.options.baseSize * this.activeBlendScale;
    }
    if (this.rootEl.classList.contains(CSS_CLASSES.POINTER)) {
      return CURSOR_DEFAULTS.POINTER_SIZE_PX;
    }
    return this.options.baseSize;
  }

  // ---------------------------------------------------------------------------
  // Stick — attach / release
  // ---------------------------------------------------------------------------

  private checkStickAttach(): void {
    if (this.stickTarget) return;
    const target = this.findNearestStickTarget();
    if (target) {
      this.attachToStickTarget(target, {
        isPointerDirectlyOver: isPointInsideElement(target, this.mouse),
      });
    }
  }

  private checkStickRelease(): void {
    if (!this.stickTarget || this.isPointerOverStickTarget) return;

    const dist = getDistanceFromElementCenter(this.stickTarget, this.mouse);
    if (dist > this.activeStickReleaseDistance) {
      this.releaseStick();
    }
  }

  private findNearestStickTarget(): HTMLElement | null {
    const candidates = this.options.container.querySelectorAll<HTMLElement>(
      `[${DATA_ATTRS.CURSOR_STICK}]`
    );
    let nearest: HTMLElement | null = null;
    let nearestDistance = Infinity;

    for (const el of candidates) {
      if (!isStickEnabled(el)) continue;
      const attachDist = readNumericAttribute(
        el,
        DATA_ATTRS.CURSOR_STICK_ATTACH,
        this.options.stickAttachDistance
      );
      const dist = getDistanceFromElementCenter(el, this.mouse);
      if (dist <= attachDist && dist < nearestDistance) {
        nearest = el;
        nearestDistance = dist;
      }
    }

    return nearest;
  }

  private attachToStickTarget(
    target: HTMLElement,
    { isPointerDirectlyOver = false }: { isPointerDirectlyOver?: boolean } = {}
  ): void {
    const isAlreadyAttached = this.stickTarget === target;

    this.stickTarget = target;
    this.activeStickScale = readNumericAttribute(
      target,
      DATA_ATTRS.CURSOR_SCALE,
      this.options.defaultStickScale
    );
    this.activeStickReleaseDistance = readNumericAttribute(
      target,
      DATA_ATTRS.CURSOR_STICK_DISTANCE,
      this.options.stickReleaseDistance
    );
    this.activeStickAttachDistance = readNumericAttribute(
      target,
      DATA_ATTRS.CURSOR_STICK_ATTACH,
      this.options.stickAttachDistance
    );
    this.isPointerOverStickTarget = isPointerDirectlyOver;

    if (!isAlreadyAttached) {
      // Snap position to element center so the cursor doesn't jump.
      const center = getElementCenter(target);
      this.pos = { x: center.x, y: center.y };
    }

    this.rootEl.classList.add(CSS_CLASSES.STICK);
    this.syncBlendState();
  }

  /** Releases the cursor from its stuck element and resets state. */
  releaseStick(): void {
    this.stickTarget = null;
    this.isPointerOverStickTarget = false;
    this.activeStickScale = this.options.defaultStickScale;
    this.activeStickReleaseDistance = this.options.stickReleaseDistance;
    this.activeStickAttachDistance = this.options.stickAttachDistance;
    this.rootEl.classList.remove(CSS_CLASSES.STICK);
    this.syncBlendState();
    gsap.set(this.innerEl, { rotate: 0, scaleX: 1, scaleY: 1 });
  }

  // ---------------------------------------------------------------------------
  // Blend mode
  // ---------------------------------------------------------------------------

  private getStickBlendMode(): string | null {
    if (!this.stickTarget) return null;
    return readBlendMode(this.stickTarget);
  }

  private hasActiveStickBlend(): boolean {
    return this.getStickBlendMode() !== null;
  }

  private applyBlendMode(mode: string): void {
    this.rootEl.classList.add(`${CSS_CLASSES.BLEND_PREFIX}${mode}`);
  }

  private removeBlendClasses(): void {
    // Remove all blend-mode modifiers.
    for (const cls of Array.from(this.rootEl.classList)) {
      if (cls.startsWith(CSS_CLASSES.BLEND_PREFIX)) {
        this.rootEl.classList.remove(cls);
      }
    }
  }

  private syncBlendState(): void {
    const stickBlend = this.getStickBlendMode();
    if (stickBlend) {
      this.applyBlendMode(stickBlend);
      return;
    }
    if (this.blendTarget) {
      const mode = readBlendMode(this.blendTarget);
      if (mode) {
        this.applyBlendMode(mode);
        return;
      }
    }
    this.removeBlendClasses();
  }

  private releaseBlend(): void {
    if (this.hasActiveStickBlend()) return;
    this.blendTarget = null;
    this.removeBlendClasses();
  }

  // ---------------------------------------------------------------------------
  // Visibility
  // ---------------------------------------------------------------------------

  show(): void {
    if (this.isVisible) return;
    if (this.visibilityTimer !== null) clearTimeout(this.visibilityTimer);
    this.rootEl.classList.add(CSS_CLASSES.VISIBLE);
    this.visibilityTimer = setTimeout(() => {
      this.isVisible = true;
    }, 0);
  }

  hide(): void {
    if (this.visibilityTimer !== null) clearTimeout(this.visibilityTimer);
    this.rootEl.classList.remove(CSS_CLASSES.VISIBLE);
    this.visibilityTimer = setTimeout(() => {
      this.isVisible = false;
    }, this.options.visibleTimeout);
  }

  // ---------------------------------------------------------------------------
  // State helpers (public — useful for external integrations)
  // ---------------------------------------------------------------------------

  /**
   * Adds CSS modifier classes to the root cursor element.
   * @param state - Whitespace-separated list of modifier names.
   *                `"drag loading"` → adds `cb-cursor--drag cb-cursor--loading`.
   */
  addState(state: string): void {
    state
      .split(/\s+/)
      .filter(Boolean)
      .forEach((name) => this.rootEl.classList.add(`${CSS_CLASSES.ROOT}--${name}`));
  }

  /** Removes CSS modifier classes previously added by {@link addState}. */
  removeState(state: string): void {
    state
      .split(/\s+/)
      .filter(Boolean)
      .forEach((name) => this.rootEl.classList.remove(`${CSS_CLASSES.ROOT}--${name}`));
  }

  /** Shows a text label inside the cursor. Also adds `cb-cursor--text`. */
  showText(text: string): void {
    this.textEl.textContent = text;
    this.rootEl.classList.add(CSS_CLASSES.TEXT_STATE);
  }

  /** Hides the cursor text label. */
  hideText(): void {
    this.textEl.textContent = "";
    this.rootEl.classList.remove(CSS_CLASSES.TEXT_STATE);
  }

  // ---------------------------------------------------------------------------
  // Event handlers
  // ---------------------------------------------------------------------------

  private onMouseLeave(): void {
    this.hide();
  }

  private onMouseEnter(): void {
    this.show();
  }

  private onMouseMove(event: MouseEvent): void {
    this.mouse = { x: event.clientX, y: event.clientY };
    this.checkStickAttach();
    this.checkStickRelease();
    this.show();
  }

  private onMouseDown(): void {
    this.addState("active");
  }

  private onMouseUp(): void {
    this.removeState("active");
  }

  private onPointerEnter(event: MouseEvent): void {
    if (!(event.target as HTMLElement).closest(INTERACTIVE_FORM_SELECTOR)) return;
    this.addState("pointer");
  }

  private onPointerLeave(event: MouseEvent): void {
    const target = (event.target as HTMLElement).closest(INTERACTIVE_FORM_SELECTOR);
    if (!target) return;
    const related = event.relatedTarget as HTMLElement | null;
    if (related && target.contains(related)) return;
    this.removeState("pointer");
  }

  private onCursorStateEnter(event: MouseEvent): void {
    const target = (event.target as HTMLElement).closest<HTMLElement>(
      `[${DATA_ATTRS.CURSOR_STATE}]`
    );
    if (!target?.dataset.cursor) return;
    this.addState(target.dataset.cursor);
  }

  private onCursorStateLeave(event: MouseEvent): void {
    const target = (event.target as HTMLElement).closest<HTMLElement>(
      `[${DATA_ATTRS.CURSOR_STATE}]`
    );
    if (!target?.dataset.cursor) return;
    const related = event.relatedTarget as HTMLElement | null;
    if (related && target.contains(related)) return;
    this.removeState(target.dataset.cursor);
  }

  private onCursorTextEnter(event: MouseEvent): void {
    const target = (event.target as HTMLElement).closest<HTMLElement>(
      `[${DATA_ATTRS.CURSOR_TEXT}]`
    );
    if (!target?.dataset.cursorText) return;
    this.showText(target.dataset.cursorText);
  }

  private onCursorTextLeave(event: MouseEvent): void {
    const target = (event.target as HTMLElement).closest<HTMLElement>(
      `[${DATA_ATTRS.CURSOR_TEXT}]`
    );
    if (!target) return;
    const related = event.relatedTarget as HTMLElement | null;
    if (related && target.contains(related)) return;
    this.hideText();
  }

  private onStickEnter(event: MouseEvent): void {
    const target = (event.target as HTMLElement).closest<HTMLElement>(
      `[${DATA_ATTRS.CURSOR_STICK}]`
    );
    if (!target || !isStickEnabled(target)) return;
    this.attachToStickTarget(target, { isPointerDirectlyOver: true });
  }

  private onStickLeave(event: MouseEvent): void {
    const target = (event.target as HTMLElement).closest<HTMLElement>(
      `[${DATA_ATTRS.CURSOR_STICK}]`
    );
    if (!target || !isStickEnabled(target)) return;
    const related = event.relatedTarget as HTMLElement | null;
    if (related && target.contains(related)) return;
    if (related?.closest<HTMLElement>(`[${DATA_ATTRS.CURSOR_STICK}]`) === target) return;
    this.isPointerOverStickTarget = false;
  }

  private onBlendEnter(event: MouseEvent): void {
    const target = (event.target as HTMLElement).closest<HTMLElement>(
      `[${DATA_ATTRS.CURSOR_BLEND}]`
    );
    if (!target) return;
    const mode = readBlendMode(target);
    if (!mode) return;
    this.blendTarget = target;
    this.activeBlendScale = readNumericAttribute(
      target,
      DATA_ATTRS.CURSOR_SCALE,
      this.options.defaultBlendScale
    );
    this.syncBlendState();
  }

  private onBlendLeave(event: MouseEvent): void {
    const target = (event.target as HTMLElement).closest<HTMLElement>(
      `[${DATA_ATTRS.CURSOR_BLEND}]`
    );
    if (!target) return;
    const related = event.relatedTarget as HTMLElement | null;
    if (related && target.contains(related)) return;
    if (this.stickTarget === target || this.hasActiveStickBlend()) {
      this.blendTarget = null;
      return;
    }
    this.releaseBlend();
  }

  // ---------------------------------------------------------------------------
  // Cleanup
  // ---------------------------------------------------------------------------

  /** Stops the render loop, removes all listeners, and removes the DOM nodes. */
  destroy(): void {
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
    if (this.visibilityTimer !== null) clearTimeout(this.visibilityTimer);

    const { container } = this.options;
    const { handlers: h } = this;

    container.removeEventListener("mouseleave", h.mouseLeave);
    container.removeEventListener("mouseenter", h.mouseEnter);
    container.removeEventListener("mousemove", h.mouseMove);
    container.removeEventListener("mousedown", h.mouseDown);
    container.removeEventListener("mouseup", h.mouseUp);
    container.removeEventListener("mouseenter", h.pointerEnter, true);
    container.removeEventListener("mouseleave", h.pointerLeave, true);
    container.removeEventListener("mouseenter", h.cursorStateEnter, true);
    container.removeEventListener("mouseleave", h.cursorStateLeave, true);
    container.removeEventListener("mouseenter", h.cursorTextEnter, true);
    container.removeEventListener("mouseleave", h.cursorTextLeave, true);
    container.removeEventListener("mouseenter", h.stickEnter, true);
    container.removeEventListener("mouseleave", h.stickLeave, true);
    container.removeEventListener("mouseenter", h.blendEnter, true);
    container.removeEventListener("mouseleave", h.blendLeave, true);
    container.removeEventListener("mouseenter", h.iframeEnter, true);
    container.removeEventListener("mouseleave", h.iframeLeave, true);
    document.removeEventListener(CURSOR_EVENTS.RELEASE_STICK, h.releaseStickEvent);

    this.rootEl.remove();
  }
}
