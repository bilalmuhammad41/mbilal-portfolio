import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

export function getScrollSmoother() {
  return ScrollSmoother.get();
}

export function scrollToTop(instant = true) {
  const smoother = ScrollSmoother.get();
  if (smoother) {
    smoother.scrollTo(0, instant);
    return;
  }
  window.scrollTo(0, 0);
}

export function refreshScroll() {
  ScrollSmoother.get()?.refresh();
  ScrollTrigger.refresh();
}

export function setScrollPaused(paused) {
  ScrollSmoother.get()?.paused(paused);
}

export { gsap, ScrollTrigger, ScrollSmoother };
