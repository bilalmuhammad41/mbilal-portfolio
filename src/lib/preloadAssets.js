import {
  arrow_down,
  arrow_right_up,
  close,
  lines,
  profile_picture,
} from "@/assets";
import { withBasePath } from "@/lib/basePath";

const IMAGE_ASSETS = [
  lines,
  close,
  arrow_down,
  arrow_right_up,
  profile_picture,
  withBasePath("/Logo.png"),
];

const FONT_ASSETS = [
  "16px Gilroy-normal",
  "16px Gilroy-medium",
  "600 16px Gilroy-semibold",
];

function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = resolve;
    img.onerror = resolve;
    img.src = src;
  });
}

function loadFont(descriptor) {
  if (typeof document === "undefined" || !document.fonts?.load) {
    return Promise.resolve();
  }
  return document.fonts.load(descriptor).catch(() => undefined);
}

function waitForWindowLoad() {
  if (typeof window === "undefined") {
    return Promise.resolve();
  }
  if (document.readyState === "complete") {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    window.addEventListener("load", resolve, { once: true });
  });
}

/**
 * Preloads critical images, fonts, and waits for the window load event.
 * Calls onProgress with a value from 0 to 1 as each task completes.
 */
export function preloadAssets({ onProgress } = {}) {
  const tasks = [
    ...IMAGE_ASSETS.map((src) => () => loadImage(src)),
    ...FONT_ASSETS.map((font) => () => loadFont(font)),
    () => waitForWindowLoad(),
  ];

  let completed = 0;
  const total = tasks.length;

  const report = () => {
    completed += 1;
    onProgress?.(completed / total);
  };

  return Promise.all(
    tasks.map((task) =>
      task()
        .then(report)
        .catch(report)
    )
  );
}
