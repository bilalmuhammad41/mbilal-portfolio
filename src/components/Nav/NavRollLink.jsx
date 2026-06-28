"use client";

import TransitionLink from "../PageTransition/TransitionLink";
import { isInternalPath } from "@/lib/slug";
import "./NavRollLink.css";

const NavRollLink = ({
  href,
  children,
  className = "",
  onClick,
  external = false,
}) => {
  const rollText = (
    <span className="nav-roll-link__inner">
      <span className="nav-roll-link__text">{children}</span>
      <span className="nav-roll-link__text" aria-hidden="true">
        {children}
      </span>
    </span>
  );

  const classes = `nav-roll-link ${className}`.trim();

  if (external || !isInternalPath(href)) {
    return (
      <a
        href={href}
        className={classes}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
      >
        {rollText}
      </a>
    );
  }

  return (
    <TransitionLink href={href} className={classes} onClick={onClick}>
      {rollText}
    </TransitionLink>
  );
};

export default NavRollLink;
