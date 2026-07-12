"use client";

import NavLink from "./NavLink";
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

  return (
    <NavLink
      href={href}
      className={classes}
      onClick={onClick}
      external={external}
    >
      {rollText}
    </NavLink>
  );
};

export default NavRollLink;
