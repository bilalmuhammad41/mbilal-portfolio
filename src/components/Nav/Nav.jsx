"use client";

import { useState, useEffect } from "react";
import { NavItems, MobileNavItems } from "../../constants";
import TransitionLink from "../PageTransition/TransitionLink";
import NavRollLink from "./NavRollLink";
import ThemeToggle from "../Theme/ThemeToggle";
import { isInternalPath } from "@/lib/slug";
import "./Nav.css";

const Nav = ({ formattedTime }) => {
  const [desktopMenuOpen, setDesktopMenuOpen] = useState(false);
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [mobileMenuBtnVisible, setMobileMenuBtnVisible] = useState(true);
  const [closeBtnVisible, setCloseBtnVisible] = useState(false);
  const [logoVisible, setLogoVisible] = useState(true);

  const closeDesktopMenu = () => setDesktopMenuOpen(false);

  useEffect(() => {
    const handleScroll = () => closeDesktopMenu();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMenuClick = () => setDesktopMenuOpen(true);

  const closeBtnClick = () => {
    setCloseBtnVisible(false);
    setLogoVisible(false);

    document
      .querySelectorAll(".mobile-nav-items-text")
      .forEach((text) => {
        text.classList.remove("mobile-nav-items-text-visible");
        text.classList.add("mobile-nav-items-text-not-visible");
      });

    document
      .querySelectorAll(".mobile-nav-bottom-text")
      .forEach((text) => {
        text.classList.remove("mobile-nav-bottom-text-visible");
        text.classList.add("mobile-nav-bottom-text-not-visible");
      });

    setTimeout(() => {
      setMobileMenuBtnVisible(true);
      setMobileMenuVisible(false);
    }, 400);
  };

  const handleMobileMenuClick = () => {
    setTimeout(() => {
      setCloseBtnVisible(true);
      setLogoVisible(true);

      document
        .querySelectorAll(".mobile-nav-items-text")
        .forEach((text) => {
          text.classList.add("mobile-nav-items-text-visible");
          text.classList.remove("mobile-nav-items-text-not-visible");
        });
    }, 200);

    setTimeout(() => {
      document
        .querySelectorAll(".mobile-nav-bottom-text")
        .forEach((text) => {
          text.classList.add("mobile-nav-bottom-text-visible");
          text.classList.remove("mobile-nav-bottom-text-not-visible");
        });
    }, 400);

    setMobileMenuVisible(true);
    setMobileMenuBtnVisible(false);
  };

  const handleDesktopNavClick = () => {
    closeDesktopMenu();
  };

  const renderMobileNavLink = (item, className, onNavigate) => {
    if (isInternalPath(item.link)) {
      return (
        <TransitionLink
          href={item.link}
          className={className}
          onClick={onNavigate}
        >
          {item.title}
        </TransitionLink>
      );
    }

    return (
      <a
        href={item.link}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onNavigate}
      >
        {item.title}
      </a>
    );
  };

  return (
    <nav className="nav-bar">
      <div className="nav-inner section-container">
        <TransitionLink href="/" className="nav-logo">
          Muhammad Bilal
        </TransitionLink>

        <div className="nav-right">
          <div
            className={`nav-menu-stack sm:flex hidden ${desktopMenuOpen ? "nav-menu-stack--open" : ""}`}
          >
            <div className="nav-menu-slot">
              <ul className="nav-links">
                {NavItems.map((item, index) => (
                  <li
                    className={`nav-link select-none ${desktopMenuOpen ? "menu-visible" : "menu-not-visible"}`}
                    key={index}
                    style={{ transitionDelay: desktopMenuOpen ? `${index * 40}ms` : `${index * 10}ms` }}
                  >
                    <NavRollLink
                      href={item.link}
                      external={!isInternalPath(item.link)}
                      onClick={handleDesktopNavClick}
                    >
                      {item.title}
                    </NavRollLink>
                  </li>
                ))}
              </ul>

              <div className="menu-btn-container" onClick={handleMenuClick}>
                <div
                  className={`menu-btn-track ${desktopMenuOpen ? "menu-button-not-visible" : "menu-button-visible"}`}
                >
                  <button type="button" className="menu-button">
                    <span>Menu</span>
                    <span className="menu-plus">+</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="nav-actions">
            <ThemeToggle />
            <div
              className={`max-sm:flex hidden menu-btn-container ${mobileMenuBtnVisible ? "menu-button-visible" : "menu-button-not-visible"}`}
              onClick={handleMobileMenuClick}
            >
              <button type="button" className="menu-button">
                <span>Menu</span>
                <span className="menu-plus">+</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`mobile-menu max-sm:flex hidden ${mobileMenuVisible ? "mobile-menu-visible" : "mobile-menu-not-visible"}`}
      >
        <div className="mobile-menu-header section-container">
          <div className="mobile-menu-header-inner">
            <TransitionLink
              href="/"
              className={`nav-logo nav-logo-dark ${logoVisible ? "logo-visible" : "logo-not-visible"}`}
              onClick={closeBtnClick}
            >
              Muhammad Bilal
            </TransitionLink>

            <div className="mobile-menu-header-actions">
              <ThemeToggle className="mobile-theme-toggle" />
              <div
                className={`close-btn-container ${closeBtnVisible ? "close-btn-visible" : "close-btn-not-visible"}`}
                onClick={closeBtnClick}
              >
                <button type="button" className="menu-button menu-button-dark">
                  <span>Close</span>
                  <span className="menu-plus">×</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mobile-menu-items">
          <ul>
            {MobileNavItems.map((item, index) => (
              <li key={index} className="mobile-nav-items overflow-hidden">
                {renderMobileNavLink(
                  item,
                  "mobile-nav-items-text",
                  closeBtnClick
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="mobile-menu-footer section-container">
          <span className="mobile-nav-bottom-text mobile-nav-bottom-text-not-visible">
            2026
          </span>
          <span
            className="mobile-nav-bottom-text mobile-nav-bottom-text-not-visible"
            id="time"
          >
            {formattedTime}
          </span>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
