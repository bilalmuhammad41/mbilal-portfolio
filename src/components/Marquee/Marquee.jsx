"use client";

import "./Marquee.css";

const Marquee = ({ text = "contact", separator = "-", repeat = 12 }) => {
  const items = Array.from({ length: repeat }, (_, i) => (
    <span key={i} className="marquee-item">
      {text}
      <span className="marquee-separator">{separator}</span>
    </span>
  ));

  return (
    <div className="marquee-wrapper" aria-hidden="true">
      <div className="marquee-track">
        {items}
        {items}
      </div>
    </div>
  );
};

export default Marquee;
