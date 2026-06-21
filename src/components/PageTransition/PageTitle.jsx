"use client";

import { splitTitleWords } from "./transitions";

export function PageTitle({ title, className = "" }) {
  const words = splitTitleWords(title);

  return (
    <h1
      className={`page-title ${className}`}
      aria-label={title}
    >
      {words.map((word, index) => (
        <span key={`${word}-${index}`} className="overflow-hidden inline-block">
          <span className="page-title-word inline-block">
            {word}
            {index < words.length - 1 ? "\u00A0" : ""}
          </span>
        </span>
      ))}
    </h1>
  );
}

export default PageTitle;
