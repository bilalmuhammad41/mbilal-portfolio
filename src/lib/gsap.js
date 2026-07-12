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
    if (instant) {
      smoother.scrollTop(0);
    } else {
      smoother.scrollTo(0, true);
    }
    return;
  }
  window.scrollTo({ top: 0, behavior: instant ? "auto" : "smooth" });
}

export function refreshScroll() {
  ScrollSmoother.get()?.refresh();
  ScrollTrigger.refresh();
}

export function setScrollPaused(paused) {
  ScrollSmoother.get()?.paused(paused);
}

export { gsap, ScrollTrigger, ScrollSmoother };
