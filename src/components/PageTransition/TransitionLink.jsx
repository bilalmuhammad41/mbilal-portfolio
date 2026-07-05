"use client";

import { usePageTransition } from "./PageTransitionContext";
import { isInternalPath } from "@/lib/slug";

const TransitionLink = ({
  href,
  children,
  className = "",
  onClick,
  ...props
}) => {
  const { navigate, isTransitioning } = usePageTransition();

  const handleClick = (event) => {
    onClick?.(event);
    if (event.defaultPrevented) return;

    if (!isInternalPath(href)) return;

    event.preventDefault();
    if (!isTransitioning) {
      navigate(href);
    }
  };

  return (
    <a data-cursor-blend="difference"
    data-cursor-scale="2.8" href={href} className={className} onClick={handleClick} {...props}>
      {children}
    </a>
  );
};

export default TransitionLink;
