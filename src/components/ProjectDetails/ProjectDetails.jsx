"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useIsClient } from "@/lib/useIsClient";
import {
  splitTitleWords,
  slidePanelUp,
  slidePanelDown,
  fadeContentOut,
  enterPanelContent,
} from "@/components/PageTransition/transitions";

const ProjectDetails = ({ project, onClose }) => {
  const mounted = useIsClient();
  const detailsRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (!project || !mounted || !detailsRef.current || !contentRef.current) return;

    document.body.style.overflow = "hidden";

    const tl = slidePanelUp(detailsRef.current);
    tl.add(
      enterPanelContent(contentRef.current, detailsRef.current),
      "-=0.35"
    );

    return () => {
      document.body.style.overflow = "auto";
      tl.kill();
    };
  }, [project, mounted]);

  const handleClose = () => {
    if (!contentRef.current || !detailsRef.current) {
      onClose();
      return;
    }

    const tl = fadeContentOut(contentRef.current);
    tl.add(slidePanelDown(detailsRef.current)).add(() => onClose());
  };

  if (!project || !mounted) return null;

  const titleWords = splitTitleWords(project.title);

  return createPortal(
    <div className="fixed inset-0 z-[100]">
      <div
        ref={detailsRef}
        className="absolute inset-0 bg-[#0a0a0a] flex flex-col translate-y-full overflow-hidden"
      >
        <div ref={contentRef} className="flex flex-col flex-1 min-h-0">
          <div className="flex justify-between items-center p-6 md:px-12 md:py-8 border-b border-white/10 bg-[#0a0a0a]/90 backdrop-blur-md z-10 shrink-0">
            <h2 className="text-lg md:text-xl font-bold uppercase tracking-widest text-[#a0a1a3]">
              {project.title}
            </h2>
            <button
              onClick={handleClose}
              className="text-white hover:text-black hover:bg-white transition-colors uppercase text-xs md:text-sm tracking-widest border border-white/30 px-6 py-2 rounded-full"
            >
              Close
            </button>
          </div>

          <div className="flex-1 overflow-y-auto w-full text-white">
            <div className="w-full flex flex-col items-center justify-center py-20 md:py-32 px-6">
              <h1
                className="flex flex-wrap justify-center text-5xl md:text-[100px] lg:text-[150px] font-bold uppercase text-center leading-none tracking-tighter mb-8"
                aria-label={project.title}
              >
                {titleWords.map((word, index) => (
                  <span
                    key={`${word}-${index}`}
                    className="overflow-hidden inline-block"
                  >
                    <span className="project-title-word inline-block">
                      {word}
                      {index < titleWords.length - 1 ? "\u00A0" : ""}
                    </span>
                  </span>
                ))}
              </h1>

              <p className="text-lg md:text-2xl text-gray-400 max-w-3xl text-center mb-12 uppercase tracking-wide leading-relaxed">
                {project.description ||
                  "An immersive digital experience showcasing innovative design and seamless interactions."}
              </p>

              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-black px-12 py-5 rounded-full uppercase tracking-widest font-bold hover:scale-105 transition-transform"
                >
                  Visit Live Site
                </a>
              )}
            </div>

            <div className="w-full border-y border-white/10">
              <div className="max-w-[1700px] mx-auto w-full grid grid-cols-1 md:grid-cols-3">
                <div className="p-8 md:p-16 border-b md:border-b-0 md:border-r border-white/10">
                  <h3 className="text-sm font-bold mb-4 text-[#666] uppercase tracking-widest">
                    Role
                  </h3>
                  <p className="text-white text-xl md:text-3xl font-medium leading-tight">
                    Design &amp; Development
                  </p>
                </div>
                <div className="p-8 md:p-16 border-b md:border-b-0 md:border-r border-white/10">
                  <h3 className="text-sm font-bold mb-4 text-[#666] uppercase tracking-widest">
                    Context
                  </h3>
                  <p className="text-white text-xl md:text-3xl font-medium leading-tight">
                    Crafting a premium digital presence with a focus on kinetics
                    and typography.
                  </p>
                </div>
                <div className="p-8 md:p-16">
                  <h3 className="text-sm font-bold mb-4 text-[#666] uppercase tracking-widest">
                    Timeline
                  </h3>
                  <p className="text-white text-xl md:text-3xl font-medium leading-tight">
                    {project.year || "2023 - 2024"}
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full border-b border-white/10">
              <div className="max-w-[1700px] mx-auto w-full p-8 md:p-16">
                <h3 className="text-sm font-bold mb-8 text-[#666] uppercase tracking-widest">
                  The Approach
                </h3>
                <p className="text-white text-2xl md:text-5xl font-medium leading-tight max-w-5xl">
                  By prioritizing high-contrast typography and smooth GSAP
                  animations, we created a brutalist yet elegant layout that
                  keeps users engaged.
                </p>
              </div>
            </div>

            <div className="w-full px-6 py-24 md:p-16">
              <div className="w-full aspect-video bg-[#1a1a1a] flex items-center justify-center overflow-hidden relative group rounded-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50"></div>
                <span className="text-gray-600 uppercase tracking-widest text-xl font-semibold">
                  Project Visuals
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ProjectDetails;
