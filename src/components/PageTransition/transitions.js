import { gsap } from "@/lib/gsap";

export const splitTitleLetters = (title) => title.split("");

export const CURTAIN_EASE = "power4.inOut";
export const CURTAIN_DURATION = 0.9;

const CURTAIN_HOLD = 0.12;

export const TITLE_DURATION = 0.8;
export const TITLE_STAGGER = 0.03; 
export const WORD_DELAY = 0.05;
export const LETTER_STAGGER = 0.03; 

function getFadeTargets(rootEl) {
  if (!rootEl) return [];
  return Array.from(rootEl.querySelectorAll(".page-enter-fade"));
}

function getTitleLetters(rootEl) {
  return rootEl?.querySelectorAll(".page-title-letter") ?? [];
}

function preparePageEnter(contentEl, rootEl) {
  if (!contentEl) return;

  gsap.set(contentEl, { opacity: 1, y: 0 });

  const letters = getTitleLetters(rootEl);
  gsap.set(letters, { y: "100%", opacity: 1 });

  getFadeTargets(rootEl).forEach((el) => {
    gsap.set(el, { opacity: 0, y: 48 });
  });
}

function animateTitleStagger(rootEl, timeline, position) {
  let words = rootEl?.querySelectorAll(".page-title-word");
  if (!words || !words.length) {
    words = rootEl?.querySelectorAll(".page-title > span");
  }

  if (!words || !words.length) {
    // Fallback to legacy character-only query if no words are found
    const letters = getTitleLetters(rootEl);
    if (!letters.length) return;
    timeline.fromTo(
      letters,
      { y: "100%" },
      {
        y: "0%",
        duration: TITLE_DURATION,
        ease: "power4.out",
        stagger: TITLE_STAGGER,
      },
      position
    );
    return;
  }

  const basePosition = position !== undefined ? position : "+=0";
  const labelName = `title-start-${Math.random().toString(36).substring(2, 9)}`;
  timeline.addLabel(labelName, basePosition);

  words.forEach((wordEl, wordIndex) => {
    const letters = wordEl.querySelectorAll(".page-title-letter");
    if (!letters.length) return;

    const wordDelay = wordIndex * WORD_DELAY;
    timeline.fromTo(
      letters,
      { y: "100%" },
      {
        y: "0%",
        duration: TITLE_DURATION,
        ease: "power4.out",
        stagger: LETTER_STAGGER,
      },
      `${labelName}+=${wordDelay}`
    );
  });
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