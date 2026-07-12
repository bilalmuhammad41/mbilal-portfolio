"use client";

import { forwardRef } from "react";
import { ArrowUpRightIcon } from "lucide-animated";

const HomeHeroLinkArrow = forwardRef(function HomeHeroLinkArrow(props, ref) {
  return (
    <span className="home-hero-link-arrow" aria-hidden="true">
      <ArrowUpRightIcon
        ref={ref}
        size={20}
        animateOnHover={true}
        {...props}
      />
    </span>
  );
});

export default HomeHeroLinkArrow;
