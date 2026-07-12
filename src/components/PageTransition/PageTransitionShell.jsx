"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { PAGE_REGISTRY } from "@/lib/pages";
import { normalizeSlug } from "@/lib/slug";
import ScrollSmootherWrapper from "@/components/ScrollSmoother/ScrollSmootherWrapper";
import {
  refreshScroll,
  scrollToTop,
  setScrollPaused,
} from "@/lib/gsap";
import {
  fadeContentIn,
  revealContentUnderCurtain,
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
    return new Promise((resolve) => {
      requestAnimationFrame(() => {
        const { contentEl, rootEl } = getPageElements(slug);
        if (!contentEl) {
          resolve();
          return;
        }

        const animation = skipCurtain
          ? fadeContentIn(contentEl, rootEl)
          : revealContentUnderCurtain(
              curtainRef.current,
              overlayRef.current,
              contentEl,
              rootEl
            );

        if (animation?.then) {
          animation.then(resolve);
        } else {
          resolve();
        }
      });
    });
  }, []);

  const runTransition = useCallback(
    async (fromSlug, toSlug, { updateUrl = false } = {}) => {
      isTransitioningRef.current = true;
      setIsTransitioning(true);
      setScrollPaused(true);

      await slideCurtainUp(curtainRef.current, overlayRef.current);

      skipPathSync.current = true;
      setActiveSlug(toSlug);

      if (updateUrl) {
        router.push(toSlug === "/" ? "/" : `${toSlug}/`);
      }

      scrollToTop(true);

      await playEnter(toSlug);

      requestAnimationFrame(() => {
        refreshScroll();
        setScrollPaused(false);
      });
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
      let cancelled = false;
      let attempts = 0;
      const maxAttempts = 30;

      const tryPlayInitialEnter = async () => {
        if (cancelled) return;

        const { contentEl } = getPageElements(slug);

        if (!contentEl) {
          attempts += 1;
          if (attempts < maxAttempts) {
            requestAnimationFrame(tryPlayInitialEnter);
            return;
          }

          hasPlayedInitial.current = true;
          return;
        }

        await playEnter(slug, { skipCurtain: true });

        if (!cancelled) {
          hasPlayedInitial.current = true;
          requestAnimationFrame(refreshScroll);
        }
      };

      const frame = requestAnimationFrame(() => {
        tryPlayInitialEnter();
      });

      return () => {
        cancelled = true;
        cancelAnimationFrame(frame);
      };
    }

    if (slug !== activeSlug) {
      const fromSlug = activeSlug;
      const frame = requestAnimationFrame(() => {
        runTransition(fromSlug, slug);
      });

      return () => cancelAnimationFrame(frame);
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
      <ScrollSmootherWrapper>
        <main className="main w-full bg-[var(--bg)]">
          <div className="site-views">
            {Object.entries(PAGE_REGISTRY).map(([slug, entry]) => {
              const View = entry.component;
              return (
                <PageView
                  key={slug}
                  slug={slug}
                  isActive={activeSlug === slug}
                  registerPageRef={registerPageRef}
                >
                  <View project={entry.project} formattedTime={formattedTime} />
                </PageView>
              );
            })}
          </div>
        </main>
      </ScrollSmootherWrapper>
      <TransitionCurtain ref={curtainRef} />
      <TransitionOverlay ref={overlayRef} />
    </PageTransitionProvider>
  );
};

function PageView({ slug, isActive, registerPageRef, children }) {
  const rootRef = useRef(null);
  const contentRef = useRef(null);

  useLayoutEffect(() => {
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
