"use client";

import TransitionLink from "../PageTransition/TransitionLink";
import { isInternalPath } from "@/lib/slug";

export default function NavLink({
  href,
  children,
  className = "",
  onClick,
  external,
  ...props
}) {
  const isExternal = external ?? !isInternalPath(href);

  if (isExternal) {
    return (
      <a
        href={href}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <TransitionLink
      href={href}
      className={className}
      onClick={onClick}
      {...props}
    >
      {children}
    </TransitionLink>
  );
}
