import { gsap } from "@/lib/gsap";

const POINTER_SELECTOR = "input, textarea, select";

function parseStickEnabled(el) {
  if (!el?.hasAttribute("data-cursor-stick")) return false;
  return el.dataset.cursorStick !== "false";
}

function parseBlendMode(el) {
  const mode = el?.dataset.cursorBlend;
  if (!mode || mode === "none" || mode === "default") return null;
  return mode;
}

export default class Cursor {
  constructor(options = {}) {
    this.options = {
      container: document.body,
      visibleTimeout: 300,
      baseSize: 12,
      stickScale: 2.6,
      blendScale: 2.4,
      sizeEase: 0.18,
      followEase: 0.22,
      stickPull: 0.26,
      stickAttachDistance: 80,
      stickMaxDistance: 38,
      stickReleaseDistance: 120,
      jellyStretchX: 0.38,
      jellySquashY: 0.1,
      jellyMinScaleY: 0.9,
      ...options,
    };

    this.mouse = { x: -9999, y: -9999 };
    this.pos = { x: -9999, y: -9999 };
    this.stickTarget = null;
    this.blendTarget = null;
    this.stickScale = this.options.stickScale;
    this.stickReleaseDistance = this.options.stickReleaseDistance;
    this.stickAttachDistance = this.options.stickAttachDistance;
    this.stickMaxDistance = this.options.stickMaxDistance;
    this.isPointerOverStickTarget = false;
    this.blendScale = this.options.blendScale;
    this.currentSize = this.options.baseSize;
    this.visible = false;
    this.visibleInt = null;
    this.rafId = null;

    this.el = document.createElement("div");
    this.el.className = "cb-cursor";
    this.el.setAttribute("aria-hidden", "true");

    this.inner = document.createElement("div");
    this.inner.className = "cb-cursor__inner";

    this.text = document.createElement("div");
    this.text.className = "cb-cursor__text";

    this.el.append(this.inner, this.text);
    this.options.container.appendChild(this.el);

    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onPointerEnter = this.onPointerEnter.bind(this);
    this.onPointerLeave = this.onPointerLeave.bind(this);
    this.onCursorStateEnter = this.onCursorStateEnter.bind(this);
    this.onCursorStateLeave = this.onCursorStateLeave.bind(this);
    this.onCursorTextEnter = this.onCursorTextEnter.bind(this);
    this.onCursorTextLeave = this.onCursorTextLeave.bind(this);
    this.onStickEnter = this.onStickEnter.bind(this);
    this.onStickLeave = this.onStickLeave.bind(this);
    this.onBlendEnter = this.onBlendEnter.bind(this);
    this.onBlendLeave = this.onBlendLeave.bind(this);
    this.onReleaseStick = this.onReleaseStick.bind(this);
    this.render = this.render.bind(this);

    this.bind();
    this.startLoop();
  }

  bind() {
    const { container } = this.options;

    container.addEventListener("mouseleave", this.onMouseLeave);
    container.addEventListener("mouseenter", this.onMouseEnter);
    container.addEventListener("mousemove", this.onMouseMove);
    container.addEventListener("mousedown", this.onMouseDown);
    container.addEventListener("mouseup", this.onMouseUp);

    container.addEventListener("mouseenter", this.onPointerEnter, true);
    container.addEventListener("mouseleave", this.onPointerLeave, true);
    container.addEventListener("mouseenter", this.onCursorStateEnter, true);
    container.addEventListener("mouseleave", this.onCursorStateLeave, true);
    container.addEventListener("mouseenter", this.onCursorTextEnter, true);
    container.addEventListener("mouseleave", this.onCursorTextLeave, true);
    container.addEventListener("mouseenter", this.onStickEnter, true);
    container.addEventListener("mouseleave", this.onStickLeave, true);
    container.addEventListener("mouseenter", this.onBlendEnter, true);
    container.addEventListener("mouseleave", this.onBlendLeave, true);
    document.addEventListener("cursor:release-stick", this.onReleaseStick);
    container.addEventListener(
      "mouseenter",
      (event) => {
        if (event.target.closest("iframe")) this.hide();
      },
      true
    );
    container.addEventListener(
      "mouseleave",
      (event) => {
        if (event.target.closest("iframe")) this.show();
      },
      true
    );
  }

  startLoop() {
    const tick = () => {
      this.rafId = requestAnimationFrame(tick);
      this.render();
    };
    tick();
  }

  getTargetSize() {
    if (this.stickTarget) {
      return this.options.baseSize * this.stickScale;
    }
    if (this.blendTarget) {
      return this.options.baseSize * this.blendScale;
    }
    if (this.el.classList.contains("cb-cursor--pointer")) {
      return 8;
    }
    return this.options.baseSize;
  }

  readScaleFromElement(el, fallback) {
    const scale = parseFloat(el?.dataset.cursorScale);
    return Number.isFinite(scale) ? scale : fallback;
  }

  readStickReleaseDistance(el) {
    const distance = parseFloat(el?.dataset.cursorStickDistance);
    return Number.isFinite(distance)
      ? distance
      : this.options.stickReleaseDistance;
  }

  readStickMaxDistance(el) {
    const distance = parseFloat(el?.dataset.cursorStickMax);
    return Number.isFinite(distance)
      ? distance
      : this.options.stickMaxDistance;
  }

  readStickAttachDistance(el) {
    const distance = parseFloat(el?.dataset.cursorStickAttach);
    return Number.isFinite(distance)
      ? distance
      : this.options.stickAttachDistance;
  }

  getElementCenter(el) {
    const rect = el.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
  }

  getDistanceFromElementCenter(el) {
    const center = this.getElementCenter(el);
    return Math.hypot(this.mouse.x - center.x, this.mouse.y - center.y);
  }

  isPointerInsideElement(el) {
    const rect = el.getBoundingClientRect();
    return (
      this.mouse.x >= rect.left &&
      this.mouse.x <= rect.right &&
      this.mouse.y >= rect.top &&
      this.mouse.y <= rect.bottom
    );
  }

  findStickTargetInRange() {
    const candidates =
      this.options.container.querySelectorAll("[data-cursor-stick]");
    let nearest = null;
    let nearestDist = Infinity;

    candidates.forEach((el) => {
      if (!parseStickEnabled(el)) return;

      const attachDistance = this.readStickAttachDistance(el);
      const dist = this.getDistanceFromElementCenter(el);
      if (dist <= attachDistance && dist < nearestDist) {
        nearest = el;
        nearestDist = dist;
      }
    });

    return nearest;
  }

  checkStickAttach() {
    if (this.stickTarget) return;

    const target = this.findStickTargetInRange();
    if (target) {
      this.attachToStickTarget(target, {
        isPointerOver: this.isPointerInsideElement(target),
      });
    }
  }

  getStickBlendMode() {
    if (!this.stickTarget) return null;
    return parseBlendMode(this.stickTarget);
  }

  hasActiveStickBlend() {
    return Boolean(this.getStickBlendMode());
  }

  applyBlendMode(mode) {
    if (!mode) return;
    this.el.classList.add(`cb-cursor--blend-${mode}`);
  }

  removeBlendClasses() {
    this.el.classList.remove("cb-cursor--blend-difference");
  }

  syncBlendState() {
    const stickBlend = this.getStickBlendMode();
    if (stickBlend) {
      this.applyBlendMode(stickBlend);
      return;
    }

    if (this.blendTarget) {
      const mode = parseBlendMode(this.blendTarget);
      if (mode) this.applyBlendMode(mode);
      return;
    }

    this.removeBlendClasses();
  }

  getMouseDistanceFromStickTarget() {
    if (!this.stickTarget) return Infinity;
    return this.getDistanceFromElementCenter(this.stickTarget);
  }

  checkStickRelease() {
    if (!this.stickTarget) return;
    if (this.isPointerOverStickTarget) return;

    if (this.getMouseDistanceFromStickTarget() > this.stickReleaseDistance) {
      this.releaseStick();
    }
  }

  getStretchFactor(mouseDist) {
    const maxDist = this.stickReleaseDistance;
    if (maxDist <= 0 || mouseDist <= 0) return 0;

    const normalized = Math.min(mouseDist / maxDist, 1);
    const logComponent = Math.log1p(mouseDist) / Math.log1p(maxDist);

    // Linear growth keeps stretch rising with distance; log softens the near field.
    return normalized * 0.7 + logComponent * 0.3;
  }

  getJellyScales(stretchFactor) {
    const t = stretchFactor;
    const scaleX = 1 + t * this.options.jellyStretchX;
    const scaleY = Math.max(
      this.options.jellyMinScaleY,
      1 - t * this.options.jellySquashY
    );

    return { scaleX, scaleY };
  }

  clampPosToAnchor(anchor) {
    const dx = this.pos.x - anchor.x;
    const dy = this.pos.y - anchor.y;
    const dist = Math.hypot(dx, dy);

    if (dist === 0 || dist <= this.stickMaxDistance) {
      return dist;
    }

    const ratio = this.stickMaxDistance / dist;
    this.pos.x = anchor.x + dx * ratio;
    this.pos.y = anchor.y + dy * ratio;

    return this.stickMaxDistance;
  }

  getAnchor() {
    if (!this.stickTarget) return null;
    return this.getElementCenter(this.stickTarget);
  }

  render() {
    if (!this.visible) return;

    const { mouse, pos, options } = this;
    let anchor = this.getAnchor();

    if (anchor) {
      this.checkStickRelease();
      anchor = this.getAnchor();
    } else {
      this.checkStickAttach();
      anchor = this.getAnchor();
    }

    if (anchor) {
      const dx = mouse.x - anchor.x;
      const dy = mouse.y - anchor.y;
      const mouseDist = Math.hypot(dx, dy);
      const pullRatio = Math.min(
        mouseDist / Math.max(this.stickMaxDistance, 1),
        1
      );
      const targetX = anchor.x + dx * options.stickPull * pullRatio;
      const targetY = anchor.y + dy * options.stickPull * pullRatio;

      pos.x = targetX;
      pos.y = targetY;
      this.clampPosToAnchor(anchor);

      const stretchFactor = this.getStretchFactor(mouseDist);
      const { scaleX, scaleY } = this.getJellyScales(stretchFactor);
      const angle =
        mouseDist > 4 ? (Math.atan2(dy, dx) * 180) / Math.PI : 0;
      const targetSize = this.getTargetSize();
      this.currentSize +=
        (targetSize - this.currentSize) * this.options.sizeEase;

      gsap.set(this.inner, {
        xPercent: -50,
        yPercent: -50,
        width: this.currentSize,
        height: this.currentSize,
        rotate: angle,
        scaleX: this.el.classList.contains("cb-cursor--active")
          ? scaleX * 0.94
          : scaleX,
        scaleY: this.el.classList.contains("cb-cursor--active")
          ? scaleY * 0.94
          : scaleY,
      });
    } else {
      pos.x += (mouse.x - pos.x) * options.followEase;
      pos.y += (mouse.y - pos.y) * options.followEase;

      const targetSize = this.getTargetSize();
      this.currentSize +=
        (targetSize - this.currentSize) * this.options.sizeEase;
      const activeScale = this.el.classList.contains("cb-cursor--active") ? 0.9 : 1;
      gsap.set(this.inner, {
        xPercent: -50,
        yPercent: -50,
        width: this.currentSize,
        height: this.currentSize,
        rotate: 0,
        scaleX: activeScale,
        scaleY: activeScale,
      });
    }

    gsap.set(this.el, { x: pos.x, y: pos.y, force3D: true });
  }

  onMouseLeave() {
    this.hide();
  }

  onMouseEnter() {
    this.show();
  }

  onMouseMove(event) {
    this.mouse.x = event.clientX;
    this.mouse.y = event.clientY;
    this.checkStickAttach();
    this.checkStickRelease();
    this.show();
  }

  onMouseDown() {
    this.setState("active");
  }

  onMouseUp() {
    this.removeState("active");
  }

  attachToStickTarget(target, { isPointerOver = false } = {}) {
    const isSameTarget = this.stickTarget === target;

    this.stickTarget = target;
    this.stickScale = this.readScaleFromElement(
      target,
      this.options.stickScale
    );
    this.stickReleaseDistance = this.readStickReleaseDistance(target);
    this.stickAttachDistance = this.readStickAttachDistance(target);
    this.stickMaxDistance = this.readStickMaxDistance(target);
    this.isPointerOverStickTarget = isPointerOver;

    if (!isSameTarget) {
      const anchor = this.getAnchor();
      if (anchor) {
        this.pos.x = anchor.x;
        this.pos.y = anchor.y;
      }
    }

    this.el.classList.add("cb-cursor--stick");
    this.syncBlendState();
  }

  onStickEnter(event) {
    const target = event.target.closest("[data-cursor-stick]");
    if (!target || !parseStickEnabled(target)) return;

    this.attachToStickTarget(target, { isPointerOver: true });
  }

  onStickLeave(event) {
    const target = event.target.closest("[data-cursor-stick]");
    if (!target || !parseStickEnabled(target)) return;

    const related = event.relatedTarget;
    if (related && target.contains(related)) return;
    if (related?.closest("[data-cursor-stick]") === target) return;

    this.isPointerOverStickTarget = false;
  }

  onBlendEnter(event) {
    const target = event.target.closest("[data-cursor-blend]");
    if (!target) return;

    const mode = parseBlendMode(target);
    if (!mode) return;

    this.blendTarget = target;
    this.blendScale = this.readScaleFromElement(
      target,
      this.options.blendScale
    );
    this.syncBlendState();
  }

  onBlendLeave(event) {
    const target = event.target.closest("[data-cursor-blend]");
    if (!target) return;

    const related = event.relatedTarget;
    if (related && target.contains(related)) return;

    if (this.stickTarget === target || this.hasActiveStickBlend()) {
      this.blendTarget = null;
      return;
    }

    this.releaseBlend();
  }

  onPointerEnter(event) {
    const target = event.target.closest(POINTER_SELECTOR);
    if (!target) return;
    this.setState("pointer");
  }

  onPointerLeave(event) {
    const target = event.target.closest(POINTER_SELECTOR);
    if (!target) return;

    const related = event.relatedTarget;
    if (related && target.contains(related)) return;

    this.removeState("pointer");
  }

  onCursorStateEnter(event) {
    const target = event.target.closest("[data-cursor]");
    if (!target) return;
    this.setState(target.dataset.cursor);
  }

  onCursorStateLeave(event) {
    const target = event.target.closest("[data-cursor]");
    if (!target) return;

    const related = event.relatedTarget;
    if (related && target.contains(related)) return;

    this.removeState(target.dataset.cursor);
  }

  onCursorTextEnter(event) {
    const target = event.target.closest("[data-cursor-text]");
    if (!target) return;
    this.setText(target.dataset.cursorText);
  }

  onCursorTextLeave(event) {
    const target = event.target.closest("[data-cursor-text]");
    if (!target) return;

    const related = event.relatedTarget;
    if (related && target.contains(related)) return;

    this.removeText();
  }

  onReleaseStick() {
    this.releaseStick();
  }

  releaseStick() {
    this.stickTarget = null;
    this.isPointerOverStickTarget = false;
    this.stickScale = this.options.stickScale;
    this.stickReleaseDistance = this.options.stickReleaseDistance;
    this.stickAttachDistance = this.options.stickAttachDistance;
    this.stickMaxDistance = this.options.stickMaxDistance;
    this.el.classList.remove("cb-cursor--stick");
    this.syncBlendState();
    gsap.set(this.inner, { rotate: 0, scaleX: 1, scaleY: 1 });
  }

  releaseBlend() {
    if (this.hasActiveStickBlend()) return;

    this.blendTarget = null;
    this.removeBlendClasses();
  }

  setState(state) {
    state
      .split(/\s+/)
      .filter(Boolean)
      .forEach((name) => this.el.classList.add(`cb-cursor--${name}`));
  }

  removeState(state) {
    state
      .split(/\s+/)
      .filter(Boolean)
      .forEach((name) => this.el.classList.remove(`cb-cursor--${name}`));
  }

  setText(text) {
    this.text.textContent = text;
    this.el.classList.add("cb-cursor--text");
  }

  removeText() {
    this.text.textContent = "";
    this.el.classList.remove("cb-cursor--text");
  }

  show() {
    if (this.visible) return;

    clearTimeout(this.visibleInt);
    this.el.classList.add("cb-cursor--visible");

    this.visibleInt = setTimeout(() => {
      this.visible = true;
    }, 0);
  }

  hide() {
    clearTimeout(this.visibleInt);
    this.el.classList.remove("cb-cursor--visible");

    this.visibleInt = setTimeout(() => {
      this.visible = false;
    }, this.options.visibleTimeout);
  }

  destroy() {
    const { container } = this.options;

    cancelAnimationFrame(this.rafId);

    container.removeEventListener("mouseleave", this.onMouseLeave);
    container.removeEventListener("mouseenter", this.onMouseEnter);
    container.removeEventListener("mousemove", this.onMouseMove);
    container.removeEventListener("mousedown", this.onMouseDown);
    container.removeEventListener("mouseup", this.onMouseUp);
    container.removeEventListener("mouseenter", this.onPointerEnter, true);
    container.removeEventListener("mouseleave", this.onPointerLeave, true);
    container.removeEventListener("mouseenter", this.onCursorStateEnter, true);
    container.removeEventListener("mouseleave", this.onCursorStateLeave, true);
    container.removeEventListener("mouseenter", this.onCursorTextEnter, true);
    container.removeEventListener("mouseleave", this.onCursorTextLeave, true);
    container.removeEventListener("mouseenter", this.onStickEnter, true);
    container.removeEventListener("mouseleave", this.onStickLeave, true);
    container.removeEventListener("mouseenter", this.onBlendEnter, true);
    container.removeEventListener("mouseleave", this.onBlendLeave, true);
    document.removeEventListener("cursor:release-stick", this.onReleaseStick);

    clearTimeout(this.visibleInt);
    this.el.remove();
  }
}
