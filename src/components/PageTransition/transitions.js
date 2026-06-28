import gsap from "gsap";

export const splitTitleWords = (title) => title.split(/\s+/).filter(Boolean);

/** Slow → fast → slow kinetic easing for the curtain slide */
export const CURTAIN_EASE = "power4.inOut";
export const CURTAIN_DURATION = 0.9;

const CURTAIN_HOLD = 0.12;
const TITLE_DURATION = 0.85;
const TITLE_STAGGER = 0.08;

function getFadeTargets(rootEl) {
  if (!rootEl) return [];
  return Array.from(rootEl.querySelectorAll(".page-enter-fade"));
}

function getTitleWords(rootEl) {
  return rootEl?.querySelectorAll(".page-title-word") ?? [];
}

function preparePageEnter(contentEl, rootEl) {
  if (!contentEl) return;

  gsap.set(contentEl, { opacity: 1, y: 0 });

  const words = getTitleWords(rootEl);
  gsap.set(words, { y: "100%", opacity: 1 });

  getFadeTargets(rootEl).forEach((el) => {
    gsap.set(el, { opacity: 0, y: 48 });
  });
}

function animateTitleStagger(rootEl, timeline, position) {
  const words = getTitleWords(rootEl);
  if (!words.length) return;

  timeline.fromTo(
    words,
    { y: "100%" },
    {
      y: "0%",
      duration: TITLE_DURATION,
      ease: "power4.out",
      stagger: TITLE_STAGGER,
    },
    position
  );
}

function animateBodyFadeIn(rootEl, timeline, position) {
  const fadeTargets = getFadeTargets(rootEl);
  if (!fadeTargets.length) return;

  timeline.to(
    fadeTargets,
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power3.out",
      stagger: 0.1,
    },
    position
  );
}

export function fadeContentIn(contentEl, rootEl) {
  if (!contentEl) return Promise.resolve();

  preparePageEnter(contentEl, rootEl);

  const tl = gsap.timeline();
  animateTitleStagger(rootEl, tl, 0);
  animateBodyFadeIn(rootEl, tl);

  return tl;
}

export function slideCurtainUp(curtainEl, overlayEl) {
  if (!curtainEl) return Promise.resolve();

  gsap.set(curtainEl, {
    yPercent: 100,
    opacity: 1,
    borderTopLeftRadius: "40px",
    borderTopRightRadius: "40px",
  });

  if (overlayEl) {
    gsap.set(overlayEl, { opacity: 0 });
  }

  const tl = gsap.timeline();

  if (overlayEl) {
    tl.to(
      overlayEl,
      {
        opacity: 1,
        duration: CURTAIN_DURATION * 0.65,
        ease: "power2.out",
      },
      0
    );
  }

  tl.to(
    curtainEl,
    {
      yPercent: 0,
      duration: CURTAIN_DURATION,
      ease: CURTAIN_EASE,
    },
    0
  ).to(
    curtainEl,
    {
      borderTopLeftRadius: "0px",
      borderTopRightRadius: "0px",
      duration: 0.25,
      ease: "power2.out",
    },
    `-=${CURTAIN_DURATION * 0.15}`
  );

  return tl;
}

export function revealContentUnderCurtain(curtainEl, overlayEl, contentEl, rootEl) {
  if (!contentEl) return Promise.resolve();

  preparePageEnter(contentEl, rootEl);

  const tl = gsap.timeline();

  tl.to({}, { duration: CURTAIN_HOLD });

  tl.to(
    curtainEl,
    {
      opacity: 0,
      duration: 0.15,
      ease: "power2.out",
    },
    0
  );

  if (overlayEl) {
    tl.set(overlayEl, { opacity: 0 }, 0);
  }

  animateTitleStagger(rootEl, tl, "+=0.00");
  animateBodyFadeIn(rootEl, tl, "+=0.0");

  tl.set(curtainEl, { yPercent: 100, opacity: 1 });

  return tl;
}
