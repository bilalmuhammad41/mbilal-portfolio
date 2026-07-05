"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Cursor from "@/lib/cursor";
import { initMagneticElements } from "@/lib/magnetic";
import "./CustomCursor.css";

function shouldEnableCursor() {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(pointer: coarse)").matches) return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  return window.matchMedia("(min-width: 768px)").matches;
}

export default function CustomCursor() {
  const pathname = usePathname();
  const cursorRef = useRef(null);
  const cleanupMagneticRef = useRef(null);

  useEffect(() => {
    if (!shouldEnableCursor()) return;

    cursorRef.current = new Cursor();
    cleanupMagneticRef.current = initMagneticElements(document, {
      getStickTarget: () => cursorRef.current?.stickTarget ?? null,
    });

    return () => {
      cleanupMagneticRef.current?.();
      cursorRef.current?.destroy();
      cursorRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!cursorRef.current) return;

    cleanupMagneticRef.current?.();
    cleanupMagneticRef.current = initMagneticElements(document, {
      getStickTarget: () => cursorRef.current?.stickTarget ?? null,
    });
  }, [pathname]);

  return null;
}
