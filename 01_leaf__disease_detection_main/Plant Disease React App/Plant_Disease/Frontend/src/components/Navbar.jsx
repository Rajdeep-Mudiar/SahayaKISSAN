import { useState, useEffect } from "react";
import LogoSvg from "../assets/Logo.svg";
import "./Navbar.css";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMobileMenu = () => setMobileOpen((prev) => !prev);
  const closeMobileMenu = () => setMobileOpen(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleRouteChange = () => closeMobileMenu();
    window.addEventListener("popstate", handleRouteChange);
    return () => window.removeEventListener("popstate", handleRouteChange);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <div className="navbar__container">
        <a href="http://localhost:5173/" className="navbar__logo">
          <img src={LogoSvg} alt="SahayaKISSAN" />
        </a>

        <div className="navbar__menu">
          <a href="http://localhost:5173/" className="navbar__link">
            Home
          </a>

          <a href="http://localhost:5173/schemes" className="navbar__link">
            Schemes
          </a>

          <a
            href="http://localhost:5175"
            target="_blank"
            rel="noopener noreferrer"
            className="navbar__link navbar__chatbot-link"
          >
            SahayaBot
          </a>

          <a
            href="https://sahaya-kissan-research.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="navbar__link"
          >
            Research
          </a>
        </div>

        <button
          className="navbar__hamburger"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <div
        className={`navbar__mobile-menu ${
          mobileOpen ? "navbar__mobile-menu--open" : ""
        }`}
      >
        <div className="navbar__mobile-container">
          <a
            href="http://localhost:5173/"
            className="navbar__mobile-link"
            onClick={closeMobileMenu}
          >
            Home
          </a>

          <a
            href="http://localhost:5173/schemes"
            className="navbar__mobile-link"
            onClick={closeMobileMenu}
          >
            Schemes
          </a>

          <a
            href="http://localhost:5175"
            target="_blank"
            rel="noopener noreferrer"
            className="navbar__mobile-link navbar__chatbot-link"
            onClick={closeMobileMenu}
          >
            SahayaBot
          </a>

          <a
            href="https://sahaya-kissan-research.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="navbar__mobile-link"
            onClick={closeMobileMenu}
          >
            Research
          </a>
        </div>
      </div>
    </nav>
  );
}
