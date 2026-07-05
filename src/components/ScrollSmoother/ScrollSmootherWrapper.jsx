"use client";

import { useEffect } from "react";
import { gsap, ScrollSmoother, refreshScroll } from "@/lib/gsap";

export default function ScrollSmootherWrapper({ children }) {
  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollSmoother.create({
        wrapper: "#smooth-wrapper",
        content: "#smooth-content",
        smooth: 1.2,
        effects: true,
        smoothTouch: 0.1,
        normalizeScroll: true,
      });
      refreshScroll();
    });

    return () => {
      ScrollSmoother.get()?.kill();
      ctx.revert();
    };
  }, []);

  return (
    <div id="smooth-wrapper">
      <div id="smooth-content">{children}</div>
    </div>
  );
}
