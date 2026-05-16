"use client";

import { useEffect } from "react";
import { ScrollSmoother } from "@/lib/gsap";

export default function ScrollSmootherWrapper({ children }) {
  useEffect(() => {
    const smoother = ScrollSmoother.create({
      smooth: 1,
      effects: true,
      smoothTouch: 0.1,
    });

    return () => smoother.kill();
  }, []);

  return (
    <div id="smooth-wrapper">
      <div id="smooth-content">{children}</div>
    </div>
  );
}
