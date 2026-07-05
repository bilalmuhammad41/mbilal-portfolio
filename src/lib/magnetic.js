import { gsap } from "@/lib/gsap";

const DEFAULT_ATTACH_DISTANCE = 80;
const DEFAULT_RELEASE_DISTANCE = 120;
const DEFAULT_ATTACHED_MAGNETIC_STRENGTH = 0.18;

function parseStickEnabled(el) {
  if (!el?.hasAttribute("data-cursor-stick")) return false;
  return el.dataset.cursorStick !== "false";
}

function readStickAttachDistance(el) {
  const distance = parseFloat(el?.dataset.cursorStickAttach);
  return Number.isFinite(distance) ? distance : DEFAULT_ATTACH_DISTANCE;
}

function readStickReleaseDistance(el) {
  const distance = parseFloat(el?.dataset.cursorStickDistance);
  return Number.isFinite(distance) ? distance : DEFAULT_RELEASE_DISTANCE;
}

function readAttachedMagneticStrength(stickHost) {
  const strength = parseFloat(stickHost?.dataset.magneticAttached);
  return Number.isFinite(strength)
    ? strength
    : DEFAULT_ATTACHED_MAGNETIC_STRENGTH;
}

function getElementCenter(el) {
  const rect = el.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
}

function getDistanceFromElementCenter(el, mouse) {
  const center = getElementCenter(el);
  return Math.hypot(mouse.x - center.x, mouse.y - center.y);
}

function isPointerInsideElement(el, mouse) {
  const rect = el.getBoundingClientRect();
  return (
    mouse.x >= rect.left &&
    mouse.x <= rect.right &&
    mouse.y >= rect.top &&
    mouse.y <= rect.bottom
  );
}

function getStickHost(el) {
  if (parseStickEnabled(el)) return el;

  const ancestor = el.closest("[data-cursor-stick]");
  if (ancestor && parseStickEnabled(ancestor)) return ancestor;

  return null;
}

function readMagneticOptions(el) {
  const raw = el.dataset.magnetic;
  if (!raw || raw === "true") return {};

  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

class MagneticElement {
  constructor(el) {
    this.el = el;
    this.options = {
      y: 0.35,
      x: 0.35,
      s: 0.2,
      rs: 0.7,
      ...readMagneticOptions(el),
    };
  }

  isEnabled() {
    return this.el.dataset.magnetic === "true" && !this.el.disabled;
  }

  pull(mouseX, mouseY, strength = 1) {
    if (!this.isEnabled()) return;

    const bound = this.el.getBoundingClientRect();
    const y =
      (mouseY - bound.top - bound.height / 2) *
      this.options.y *
      strength;
    const x =
      (mouseX - bound.left - bound.width / 2) *
      this.options.x *
      strength;

    gsap.to(this.el, {
      x,
      y,
      force3D: true,
      overwrite: true,
      duration: this.options.s,
    });
  }

  reset(duration) {
    gsap.to(this.el, {
      x: 0,
      y: 0,
      force3D: true,
      overwrite: true,
      duration: duration ?? this.options.rs,
    });
  }
}

class MagneticManager {
  constructor({ getStickTarget } = {}) {
    this.getStickTarget = getStickTarget ?? (() => null);
    this.mouse = { x: -9999, y: -9999 };
    this.items = [];
    this.onMouseMove = this.onMouseMove.bind(this);
    document.addEventListener("mousemove", this.onMouseMove);
  }

  init(root = document) {
    this.destroyItems();

    root.querySelectorAll('[data-magnetic="true"]').forEach((el) => {
      if (el.disabled) return;
      this.items.push(new MagneticElement(el));
    });
  }

  onMouseMove(event) {
    this.mouse.x = event.clientX;
    this.mouse.y = event.clientY;
    this.update();
  }

  update() {
    const stickTarget = this.getStickTarget();

    this.items.forEach((item) => {
      if (!item.isEnabled()) {
        item.reset();
        return;
      }

      const stickHost = getStickHost(item.el);

      if (stickHost) {
        const isAttached = stickTarget === stickHost;
        const range = isAttached
          ? readStickReleaseDistance(stickHost)
          : readStickAttachDistance(stickHost);
        const dist = getDistanceFromElementCenter(stickHost, this.mouse);

        if (dist <= range) {
          const strength = isAttached ? readAttachedMagneticStrength(stickHost) : 1;
          item.pull(this.mouse.x, this.mouse.y, strength);
        } else {
          item.reset();
        }
        return;
      }

      if (isPointerInsideElement(item.el, this.mouse)) {
        item.pull(this.mouse.x, this.mouse.y);
      } else {
        item.reset();
      }
    });
  }

  destroyItems() {
    this.items.forEach((item) => {
      gsap.set(item.el, { x: 0, y: 0 });
    });
    this.items = [];
  }

  destroy() {
    document.removeEventListener("mousemove", this.onMouseMove);
    this.destroyItems();
  }
}

export function initMagneticElements(root = document, options = {}) {
  const manager = new MagneticManager(options);
  manager.init(root);
  return () => manager.destroy();
}
