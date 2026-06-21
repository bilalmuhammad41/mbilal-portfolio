"use client";

import { forwardRef, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import "./TransitionCurtain.css";

const TransitionCurtain = forwardRef(function TransitionCurtain(_props, ref) {
  const [mounted, setMounted] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

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
