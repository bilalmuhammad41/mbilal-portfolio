"use client";

import { useEffect, useState } from "react";
import "./Home.css";
import Marquee from "../../components/Marquee/Marquee";

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <section
      className="home section-container"
      id="home"
    >
      <Marquee text="available" separator="-" />

      <div className="home-hero">
        <div className="home-hero-text">
          <div className="overflow-hidden">
            <h1
              className={`home-headline ${isVisible ? "reveal-visible" : "reveal-hidden"}`}
            >
              Creatively
              <br />
              Technical
            </h1>
          </div>

          <div className="home-intro">
            <div className="overflow-hidden">
              <p
                className={`home-paragraph ${isVisible ? "reveal-visible" : "reveal-hidden"} delay-200`}
              >
                I engineer smooth digital products, craft premium UI, and rarely break production on a Friday. Let&apos;s build something cool.  
              </p>
            </div>
            <div className="overflow-hidden">
              
            </div>
            <div className="overflow-hidden">
              <p
                className={`home-paragraph ${isVisible ? "reveal-visible" : "reveal-hidden"} delay-400`}
              >
                Based in Pakistan, currently at Aeroglobe and available for
                freelance from August 2026.
              </p>
            </div>
          </div>

          <div className="overflow-hidden">
            <a
              href="#skills"
              className={`link-arrow home-cta ${isVisible ? "reveal-visible" : "reveal-hidden"} delay-500`}
            >
              What I do
            </a>
          </div>
        </div>

        <div className="home-meta">
          <div className="overflow-hidden">
            <p
              className={`home-meta-item ${isVisible ? "reveal-visible" : "reveal-hidden"} delay-600`}
            >
              Currently at Aeroglobe
            </p>
          </div>
          <div className="overflow-hidden">
            <a
              href="https://www.fiverr.com/mbilal41"
              target="_blank"
              rel="noopener noreferrer"
              className={`home-meta-item underline-effect ${isVisible ? "reveal-visible" : "reveal-hidden"} delay-600`}
            >
              Digital artist at Fiverr
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
