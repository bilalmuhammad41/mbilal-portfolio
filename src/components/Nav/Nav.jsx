"use client";

import { useState, useEffect } from "react";
import { NavItems, MobileNavItems } from "../../constants";
import TransitionLink from "../PageTransition/TransitionLink";
import ThemeToggle from "../Theme/ThemeToggle";
import { isInternalPath } from "@/lib/slug";
import "./Nav.css";

const Nav = ({ formattedTime }) => {
  const [menuBtnVisible, setMenuBtnVisible] = useState(true);
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [mobileMenuBtnVisible, setMobileMenuBtnVisible] = useState(true);
  const [closeBtnVisible, setCloseBtnVisible] = useState(false);
  const [logoVisible, setLogoVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const navLinks = document.querySelectorAll(".nav-link");
      navLinks.forEach((link, index) => {
        setTimeout(() => {
          link.classList.remove("menu-visible");
          link.classList.remove("underline-effect");
          link.classList.add("menu-not-visible");
        }, index * 10);
      });

      setMenuBtnVisible(true);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMenuClick = () => {
    setMenuBtnVisible(false);

    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach((link, index) => {
      setTimeout(() => {
        link.classList.add("menu-visible");
        link.classList.add("underline-effect");
        link.classList.remove("menu-not-visible");
      }, index * 40);
    });
  };

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

  const renderNavLink = (item, className, onNavigate) => {
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
          <ThemeToggle className="nav-theme-toggle max-sm:hidden" />

          <ul className="nav-links sm:flex hidden">
            {NavItems.map((item, index) => (
              <li
                className="nav-link select-none menu-not-visible"
                key={index}
              >
                {renderNavLink(item, "")}
              </li>
            ))}
          </ul>

          <div
            className="sm:flex hidden menu-btn-container overflow-hidden absolute z-10"
            onClick={handleMenuClick}
          >
            <button
              className={`menu-button ${menuBtnVisible ? "menu-button-visible underline-effect" : "menu-button-not-visible"}`}
            >
              <span>Menu</span>
              <span className="menu-plus">+</span>
            </button>
          </div>

          <div
            className={`max-sm:flex hidden menu-btn-container overflow-hidden absolute ${mobileMenuBtnVisible ? "menu-button-visible underline-effect" : "menu-button-not-visible"}`}
            onClick={handleMobileMenuClick}
          >
            <button className="menu-button">
              <span>Menu</span>
              <span className="menu-plus">+</span>
            </button>
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

            <div
              className={`close-btn-container ${closeBtnVisible ? "close-btn-visible" : "close-btn-not-visible"}`}
              onClick={closeBtnClick}
            >
              <button className="menu-button menu-button-dark">
                <span>Close</span>
                <span className="menu-plus">×</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mobile-menu-items">
          <ul>
            {MobileNavItems.map((item, index) => (
              <li key={index} className="mobile-nav-items overflow-hidden">
                {renderNavLink(
                  item,
                  "mobile-nav-items-text",
                  closeBtnClick
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="mobile-menu-footer section-container">
          <ThemeToggle className="mobile-theme-toggle" />
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
