"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { PAGE_REGISTRY } from "@/lib/pages";
import { normalizeSlug } from "@/lib/slug";
import {
  fadeContentIn,
  revealContentUnderCurtain,
  setContentHidden,
  slideCurtainUp,
} from "./transitions";
import { PageTransitionProvider } from "./PageTransitionContext";
import TransitionCurtain from "./TransitionCurtain";
import TransitionOverlay from "./TransitionOverlay";
import "./PageViews.css";

const PageTransitionShell = ({ formattedTime, children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const curtainRef = useRef(null);
  const overlayRef = useRef(null);
  const pageRefs = useRef({});
  const skipPathSync = useRef(false);
  const hasPlayedInitial = useRef(false);
  const isTransitioningRef = useRef(false);

  const [activeSlug, setActiveSlug] = useState(() => normalizeSlug(pathname));
  const [isTransitioning, setIsTransitioning] = useState(false);

  const registerPageRef = useCallback((slug, ref) => {
    pageRefs.current[slug] = ref;
  }, []);

  const getPageElements = (slug) => {
    const pageRef = pageRefs.current[slug];
    if (!pageRef) return { contentEl: null, rootEl: null };
    return {
      contentEl: pageRef.contentRef?.current ?? null,
      rootEl: pageRef.rootRef?.current ?? null,
    };
  };

  const playEnter = useCallback((slug, { skipCurtain = false } = {}) => {
    const { contentEl, rootEl } = getPageElements(slug);
    if (!contentEl) return Promise.resolve();

    if (skipCurtain) {
      setContentHidden(contentEl);
      return fadeContentIn(contentEl, rootEl);
    }

    return revealContentUnderCurtain(
      curtainRef.current,
      overlayRef.current,
      contentEl,
      rootEl
    );
  }, []);

  const runTransition = useCallback(
    async (fromSlug, toSlug, { updateUrl = false } = {}) => {
      isTransitioningRef.current = true;
      setIsTransitioning(true);
      document.body.style.overflow = "hidden";

      await slideCurtainUp(curtainRef.current, overlayRef.current);

      skipPathSync.current = true;
      setActiveSlug(toSlug);

      if (updateUrl) {
        router.push(toSlug === "/" ? "/" : `${toSlug}/`);
      }

      window.scrollTo(0, 0);

      await playEnter(toSlug);

      document.body.style.overflow = "";
      isTransitioningRef.current = false;
      setIsTransitioning(false);
    },
    [playEnter, router]
  );

  const navigate = useCallback(
    (targetSlug) => {
      const nextSlug = normalizeSlug(targetSlug);
      if (isTransitioningRef.current || nextSlug === activeSlug) return;
      runTransition(activeSlug, nextSlug, { updateUrl: true });
    },
    [activeSlug, runTransition]
  );

  useEffect(() => {
    const slug = normalizeSlug(pathname);

    if (skipPathSync.current) {
      if (slug !== activeSlug) return;
      skipPathSync.current = false;
      return;
    }

    if (isTransitioningRef.current) return;

    if (slug === activeSlug && hasPlayedInitial.current) return;

    if (!hasPlayedInitial.current) {
      hasPlayedInitial.current = true;
      setActiveSlug(slug);

      const timer = setTimeout(() => {
        playEnter(slug, { skipCurtain: true });
      }, 50);

      return () => clearTimeout(timer);
    }

    if (slug !== activeSlug) {
      runTransition(activeSlug, slug);
    }
  }, [pathname, activeSlug, playEnter, runTransition]);

  const contextValue = {
    navigate,
    activeSlug,
    isTransitioning,
    registerPageRef,
  };

  return (
    <PageTransitionProvider value={contextValue}>
      {children}
      <main className="main w-full bg-[var(--bg)]">
        <div className="site-views">
          {Object.entries(PAGE_REGISTRY).map(([slug, { component: View }]) => (
            <PageView
              key={slug}
              slug={slug}
              isActive={activeSlug === slug}
              registerPageRef={registerPageRef}
            >
              <View formattedTime={formattedTime} />
            </PageView>
          ))}
        </div>
      </main>
      <TransitionCurtain ref={curtainRef} />
      <TransitionOverlay ref={overlayRef} />
    </PageTransitionProvider>
  );
};

function PageView({ slug, isActive, registerPageRef, children }) {
  const rootRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    registerPageRef(slug, { rootRef, contentRef });
  }, [slug, registerPageRef]);

  return (
    <div
      ref={rootRef}
      className={`page-view ${isActive ? "page-view--active" : ""}`}
      data-page={slug}
      aria-hidden={!isActive}
    >
      <div ref={contentRef} className="page-view__content">
        {children}
      </div>
    </div>
  );
}

export default PageTransitionShell;
