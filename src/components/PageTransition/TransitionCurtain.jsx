"use client";

import { forwardRef, useRef } from "react";
import { createPortal } from "react-dom";
import { gsap } from "@/lib/gsap";
import { useIsClient } from "@/lib/useIsClient";
import "./TransitionCurtain.css";

const TransitionCurtain = forwardRef(function TransitionCurtain(_props, ref) {
  const isClient = useIsClient();
  const initialized = useRef(false);

  if (!isClient) return null;

  return createPortal(
    <div
      ref={(node) => {
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;

        if (node && !initialized.current) {
          initialized.current = true;
          gsap.set(node, { yPercent: 100, opacity: 1 });
        }
      }}
      className="transition-curtain"
      aria-hidden="true"
    />,
    document.body
  );
});

export default TransitionCurtain;
