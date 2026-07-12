"use client";

import { forwardRef, useRef } from "react";
import { createPortal } from "react-dom";
import { gsap } from "@/lib/gsap";
import { useIsClient } from "@/lib/useIsClient";
import "./TransitionOverlay.css";

const TransitionOverlay = forwardRef(function TransitionOverlay(_props, ref) {
  const initialized = useRef(false);
  const isClient = useIsClient();

  if (!isClient) return null;

  return createPortal(
    <div
      ref={(node) => {
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;

        if (node && !initialized.current) {
          initialized.current = true;
          gsap.set(node, { opacity: 0 });
        }
      }}
      className="transition-overlay"
      aria-hidden="true"
    />,
    document.body
  );
});

export default TransitionOverlay;
