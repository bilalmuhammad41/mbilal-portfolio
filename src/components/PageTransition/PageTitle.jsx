"use client";

export function PageTitle({ title, className = "", noEndSpace = false }) {
  const words = (title || "").split(" ");

  return (
    <h1
      className={`page-title ${noEndSpace ? "page-title--no-end-space" : ""} ${className}`.trim()}
      aria-label={title}
    >
      {words.map((word, wordIndex) => {
        const letters = word.split("");

        return (
          <span key={`word-${wordIndex}`} className="page-title-word inline-block whitespace-nowrap">
            <span className="overflow-hidden inline-block">
              {letters.map((letter, letterIndex) => (
                <span
                  key={`letter-${wordIndex}-${letterIndex}`}
                  className="page-title-letter inline-block"
                >
                  {letter}
                </span>
              ))}
            </span>
            {wordIndex < words.length - 1 ? "\u00A0" : ""}
          </span>
        );
      })}
    </h1>
  );
}

export default PageTitle;
