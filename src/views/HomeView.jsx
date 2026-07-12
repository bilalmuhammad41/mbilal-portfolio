"use client";

import { useEffect, useRef, useState } from "react";
import HomeHeroLinkArrow from "@/components/HomeHeroLinkArrow/HomeHeroLinkArrow";
import PageTitle from "@/components/PageTransition/PageTitle";
import TransitionLink from "@/components/PageTransition/TransitionLink";
import { projects } from "@/constants";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import "@/sections/Home/Home.css";
import "./views.css";

export default function HomeView() {
  const [isVisible, setIsVisible] = useState(false);
  const introSectionRef = useRef(null);
  const circleRef = useRef(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const section = introSectionRef.current;
    const circle = circleRef.current;
    if (!section || !circle) return;

    const getPillStartWidth = () => circle.offsetHeight;

    const getPillMaxWidth = () => {
      const viewportMax = window.innerWidth * 0.8;
      const container = section.querySelector(".home-intro-content");
      const containerWidth = container?.getBoundingClientRect().width ?? viewportMax;

      return Math.min(viewportMax, containerWidth);
    };

    const ctx = gsap.context(() => {
      gsap.fromTo(
        circle,
        { width: getPillStartWidth },
        {
          width: () => Math.max(getPillStartWidth(), getPillMaxWidth()),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 60%",
            end: "top 10%",
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );
    }, introSectionRef);

    const handleResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      ctx.revert();
    };
  }, []);

  const featured = projects.slice(0, 3);

  return (
    <div className="view-page">
      <section className="home section-container">

        <div className="home-hero">
          <div className="home-hero-text">
            <div className="home-headline-wrap">
              <PageTitle title="PIXELS" className="home-headline" />
              <PageTitle title="WITH" className="home-headline" />
              <PageTitle title="PURPOSE" className="home-headline" />
            </div>
          </div>

          <div className="home-hero-footer">
            <div className="overflow-hidden">
              <a
                href="https://aeroglobe.io/"
                target="_blank"
                rel="noopener noreferrer"
                data-cursor-blend="difference"
                data-cursor-scale="2.8"
                className={`home-hero-link home-hero-link--arrow ${isVisible ? "reveal-visible" : "reveal-hidden"} delay-600`}
              >
                Currently at <br /> Aeroglobe
                <HomeHeroLinkArrow />
              </a>
            </div>
            <div className="overflow-hidden">
              <a
                href="https://www.fiverr.com/mbilal41"
                target="_blank"
                rel="noopener noreferrer"
                data-cursor-blend="difference"
                data-cursor-scale="2.8"
                className={`home-hero-link home-hero-link--arrow ${isVisible ? "reveal-visible" : "reveal-hidden"} delay-600`}
              >
                Digital Artist
                <HomeHeroLinkArrow/>
              </a>
            </div>
            <div className="overflow-hidden">
              <TransitionLink
                href="/contact"
                className={`home-hero-link ${isVisible ? "reveal-visible" : "reveal-hidden"} delay-600`}
              >
              </TransitionLink>
            </div>
          </div>
        </div>
      </section>

      <section ref={introSectionRef} className="home-intro-section">
        <div className="section-container home-intro-content">
          <div ref={circleRef} className="home-intro-circle" aria-hidden="true" />
          <div className="overflow-hidden home-intro-text-wrap">
            <p
              className={`home-intro-statement ${isVisible ? "reveal-visible" : "reveal-hidden"} delay-200`}
            >
              The technical horsepower of a software engineer with the taste of a designer.
            </p>
          </div>
        </div>
      </section>

      <section className="section-container home-preview">

        <div className="home-preview-list">
          {featured.map((project, index) => (
            <TransitionLink
              key={project.slug}
              href={`/projects/${project.slug}`}
              className="home-preview-item"
              
            >
              <span className="home-preview-index">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="home-preview-title">
                <strong>{project.title}</strong>
                <span className="project-card-dash"> – </span>
                {project.description}
              </span>
            </TransitionLink>
          ))}
        </div>

        <TransitionLink href="/projects" className="link-arrow">
          View all projects
        </TransitionLink>
      </section>

      <section className="section-container home-contact-teaser">
        <h2 className="footer-headline">
          Have
          <br />
          an idea?
        </h2>
        <TransitionLink
          href="/contact"
          className="link-arrow"
          
        >
          Tell me
        </TransitionLink>
      </section>
    </div>
  );
}
