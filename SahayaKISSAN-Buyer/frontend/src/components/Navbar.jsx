import { useState, useEffect, useContext } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import "./Navbar.css";
import HomeExtraSection from "./AfterHeroSections";
export default function Navbar() {
  const { t, i18n } = useTranslation();
  const [openBusiness, setOpenBusiness] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleBusinessToggle = () => setOpenBusiness((prev) => !prev);
  const closeBusinessMenu = () => setOpenBusiness(false);
  const toggleMobileMenu = () => setMobileOpen((prev) => !prev);
  const closeMobileMenu = () => setMobileOpen(false);

  async function logout() {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    }
    setUser(null);
    navigate("/");
  }

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
        <Link to="/" className="navbar__logo">
          <img src="/Logo.svg" alt="SahayaKISSAN" />
        </Link>

        <div className="navbar__menu">
          <div
            className="navbar__dropdown"
            onMouseEnter={() => setOpenBusiness(true)}
            onMouseLeave={closeBusinessMenu}
          >
            <button className="navbar__link" onClick={handleBusinessToggle}>
              {t("business")}
            </button>

            {openBusiness && (
              <div className="navbar__megaMenu">
                <Link
                  to="/seeds"
                  className="mega-card"
                  onClick={closeBusinessMenu}
                >
                  <img src="/images/seeds-card.jpg" alt="Seeds" />
                  <h4>{t("seeds")}</h4>
                  <p>Buy certified seeds from verified farmers & suppliers</p>
                </Link>

                <Link
                  to="/tea"
                  className="mega-card"
                  onClick={closeBusinessMenu}
                >
                  <img src="/images/tea-card.webp" alt="Tea" />
                  <h4>{t("tea")}</h4>
                  <p>Quality tea saplings and plantation resources</p>
                </Link>

                <Link
                  to="/sensors-iot"
                  className="mega-card"
                  onClick={closeBusinessMenu}
                >
                  <img src="/images/sensors-iot.webp" alt="IoT" />
                  <h4>{t("sensorsAndIoT")}</h4>
                  <p>Smart sensors & IoT for modern precision farming</p>
                </Link>
              </div>
            )}
          </div>

          <Link to="/schemes" className="navbar__link">
            {t("schemes")}
          </Link>
          <a
            href="http://localhost:5175"
            target="_blank"
            rel="noopener noreferrer"
            className="navbar__link"
          >
            {t("chatbot")}
          </a>

          <Link
            to="https://sahaya-kissan-research.vercel.app/"
            className="navbar__link"
          >
            {t("research")}
          </Link>

          {!user ? (
            <NavLink
              to="/auth"
              className="navbar__link login-link"
              onClick={closeMobileMenu}
            >
              {t("login")}
            </NavLink>
          ) : (
            <button className="navbar__link logout-link" onClick={logout}>
              {t("logout")}
            </button>
          )}
        </div>

        <select
          value={i18n.language}
          onChange={(e) => i18n.changeLanguage(e.target.value)}
          className="navbar__language"
        >
          <option value="en">EN</option>
          <option value="hi">हिंदी</option>
          <option value="as">অসমীয়া</option>
        </select>

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
        className={`navbar__mobile-menu ${mobileOpen ? "navbar__mobile-menu--open" : ""}`}
      >
        <div className="navbar__mobile-container">
          <div className="navbar__mobile-business">
            <span className="navbar__mobile-title">{t("business")}</span>
            <Link
              to="/seeds"
              className="navbar__mobile-link"
              onClick={closeMobileMenu}
            >
              <span className="mobile-link-title">{t("seeds")}</span>
              <span className="mobile-link-cta">Buy certified seeds</span>
            </Link>
            <Link
              to="/tea"
              className="navbar__mobile-link"
              onClick={closeMobileMenu}
            >
              <span className="mobile-link-title">{t("tea")}</span>
              <span className="mobile-link-cta">Tea saplings & plantation</span>
            </Link>
            <Link
              to="/sensors-iot"
              className="navbar__mobile-link"
              onClick={closeMobileMenu}
            >
              <span className="mobile-link-title">{t("sensorsAndIoT")}</span>
              <span className="mobile-link-cta">Smart farming devices</span>
            </Link>
          </div>

          <Link
            to="/schemes"
            className="navbar__mobile-link"
            onClick={closeMobileMenu}
          >
            {t("schemes")}
          </Link>
          <a
            href="http://localhost:5175"
            target="_blank"
            rel="noopener noreferrer"
            className="navbar__mobile-link"
            onClick={closeMobileMenu}
          >
            {t("chatbot")}
          </a>

          <Link
            to="https://sahaya-kissan-research.vercel.app/"
            className="navbar__mobile-link"
            onClick={closeMobileMenu}
          >
            {t("research")}
          </Link>

          {!user ? (
            <NavLink
              to="/auth"
              className="navbar__mobile-link navbar__mobile-login"
              onClick={closeMobileMenu}
            >
              {t("login")}
            </NavLink>
          ) : (
            <button
              className="navbar__mobile-link mobile-logout-btn"
              onClick={logout}
            >
              {t("logout")}
            </button>
          )}

          <select
            value={i18n.language}
            onChange={(e) => {
              i18n.changeLanguage(e.target.value);
              closeMobileMenu();
            }}
            className="navbar__mobile-language"
          >
            <option value="en">EN</option>
            <option value="hi">हिंदी</option>
            <option value="as">অসমীয়া</option>
          </select>
        </div>
      </div>
    </nav>
  );
}
