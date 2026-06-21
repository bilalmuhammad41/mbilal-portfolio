import gsap from "gsap";

export const splitTitleWords = (title) => title.split(/\s+/).filter(Boolean);

/** Slow → fast → slow kinetic easing for the curtain slide */
export const CURTAIN_EASE = "power4.inOut";
export const CURTAIN_DURATION = 1.15;

const CURTAIN_HOLD = 0.2;

export function setContentHidden(contentEl) {
  if (!contentEl) return;
  gsap.set(contentEl, { opacity: 0, y: 24 });
}

export function fadeContentOut(contentEl) {
  if (!contentEl) return Promise.resolve();
  return gsap.to(contentEl, {
    opacity: 0,
    y: 16,
    duration: 0.45,
    ease: "power2.in",
  });
}

export function fadeContentIn(contentEl, rootEl) {
  if (!contentEl) return Promise.resolve();

  const words = rootEl?.querySelectorAll(".page-title-word") ?? [];
  gsap.set(words, { y: "100%" });

  const tl = gsap.timeline();

  tl.to(contentEl, {
    opacity: 1,
    y: 0,
    duration: 0.6,
    ease: "power2.out",
  });

  if (words.length) {
    tl.to(
      words,
      {
        y: "0%",
        duration: 0.7,
        ease: "power4.out",
        stagger: 0.06,
      },
      "-=0.35"
    );
  }

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

  setContentHidden(contentEl);
  const words = rootEl?.querySelectorAll(".page-title-word") ?? [];
  gsap.set(words, { y: "100%" });

  const tl = gsap.timeline();

  tl.to({}, { duration: CURTAIN_HOLD })
    .to(contentEl, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power2.out",
    })
    .to(
      curtainEl,
      {
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
      },
      "-=0.25"
    );

  if (overlayEl) {
    tl.to(
      overlayEl,
      {
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
      },
      "-=0.5"
    );
  }

  if (words.length) {
    tl.to(
      words,
      {
        y: "0%",
        duration: 0.7,
        ease: "power4.out",
        stagger: 0.06,
      },
      "-=0.55"
    );
  }

  tl.set(curtainEl, { yPercent: 100, opacity: 1 });

  if (overlayEl) {
    tl.set(overlayEl, { opacity: 0 });
  }

  return tl;
}

export function slidePanelUp(panelEl) {
  if (!panelEl) return gsap.timeline();

  gsap.set(panelEl, {
    y: "100%",
    borderTopLeftRadius: "40px",
    borderTopRightRadius: "40px",
  });

  const tl = gsap.timeline();

  tl.to(panelEl, {
    y: "0%",
    duration: 1,
    ease: CURTAIN_EASE,
  }).to(
    panelEl,
    {
      borderTopLeftRadius: "0px",
      borderTopRightRadius: "0px",
      duration: 0.2,
    },
    "-=0.2"
  );

  return tl;
}

export function slidePanelDown(panelEl) {
  if (!panelEl) return gsap.timeline();

  return gsap.to(panelEl, {
    y: "100%",
    borderTopLeftRadius: "40px",
    borderTopRightRadius: "40px",
    duration: 0.6,
    ease: "power3.inOut",
  });
}

export function enterPanelContent(contentEl, rootEl) {
  if (!contentEl) return gsap.timeline();

  setContentHidden(contentEl);
  const words = rootEl?.querySelectorAll(".project-title-word") ?? [];
  gsap.set(words, { y: "100%" });

  const tl = gsap.timeline();

  tl.to(contentEl, {
    opacity: 1,
    y: 0,
    duration: 0.6,
    ease: "power2.out",
  }).to(
    words,
    {
      y: "0%",
      duration: 0.7,
      ease: "power4.out",
      stagger: 0.06,
    },
    "-=0.45"
  );

  return tl;
}
