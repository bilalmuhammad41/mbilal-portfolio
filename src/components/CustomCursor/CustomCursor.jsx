"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { Cursor, initMagneticElements } from "@/lib/cursor";
import "./CustomCursor.css";

/**
 * Returns true on desktop pointer devices without reduced-motion preference.
 * The custom cursor is intentionally disabled on touch and mobile viewports.
 */
function shouldEnableCursor() {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(pointer: coarse)").matches) return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  return window.matchMedia("(min-width: 768px)").matches;
}

/**
 * Mounts the custom cursor and magnetic attraction system.
 *
 * Render this once at the root layout level, outside any scroll
 * wrapper, so `mix-blend-mode` on the cursor works correctly.
 *
 * @example
 * ```tsx
 * // app/layout.tsx
 * import CustomCursor from "@/components/CustomCursor";
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         {children}
 *         <CustomCursor />
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */
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

  // Re-scan for [data-magnetic="true"] elements after each route change since
  // new elements may have mounted that weren't present on initial load.
  useEffect(() => {
    if (!cursorRef.current) return;
    cleanupMagneticRef.current?.();
    cleanupMagneticRef.current = initMagneticElements(document, {
      getStickTarget: () => cursorRef.current?.stickTarget ?? null,
    });
  }, [pathname]);

  return null;
}
