"use client";

import { useEffect, useState } from "react";
import Marquee from "@/components/Marquee/Marquee";
import TransitionLink from "@/components/PageTransition/TransitionLink";
import { projects } from "@/constants";
import "@/sections/Home/Home.css";
import "./views.css";

export default function HomeView() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timeoutId);
  }, []);

  const featured = projects.slice(0, 3);

  return (
    <div className="view-page">
      <section className="home section-container">
        <Marquee text="available" separator="-" />

        <div className="home-hero">
          <div className="home-hero-text">
            <div className="overflow-hidden">
              <h1
                className={`home-headline ${isVisible ? "reveal-visible" : "reveal-hidden"}`}
              >
                Frontend engineer
                <br />
                &amp; digital creator
              </h1>
            </div>

            <div className="home-intro">
              <div className="overflow-hidden">
                <p
                  className={`home-paragraph ${isVisible ? "reveal-visible" : "reveal-hidden"} delay-200`}
                >
                  I help brands and teams build scalable digital products with
                  thoughtful design systems and carefully crafted development.
                </p>
              </div>
              <div className="overflow-hidden">
                <p
                  className={`home-paragraph ${isVisible ? "reveal-visible" : "reveal-hidden"} delay-300`}
                >
                  For over 5 years I&apos;ve been creating as a digital artist,
                  and now I bring that same creative eye to web development.
                </p>
              </div>
            </div>

            <div className="overflow-hidden">
              <TransitionLink
                href="/services"
                className={`link-arrow home-cta ${isVisible ? "reveal-visible" : "reveal-hidden"} delay-500`}
              >
                What I do
              </TransitionLink>
            </div>
          </div>
        </div>
      </section>

      <section className="section-container home-preview">
        <p className="section-label">Portfolio</p>
        <h2 className="section-heading">MY GAME</h2>

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
        <TransitionLink href="/contact" className="link-arrow">
          Tell us
        </TransitionLink>
      </section>
    </div>
  );
}
