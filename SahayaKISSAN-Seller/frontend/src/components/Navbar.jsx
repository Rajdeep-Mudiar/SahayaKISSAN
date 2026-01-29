import { useState, useEffect, useContext } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import "./Navbar.css";

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const closeMobileMenu = () => setMobileOpen(false);

  async function logout() {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.warn("Session already expired");
    } finally {
      setUser(null);
      navigate("/");
    }
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <div className="navbar__container">
        {/* LOGO */}
        <Link to="/" className="navbar__logo">
          <img src="/Logo.svg" alt="SahayaKISSAN" />
        </Link>

        {/* DESKTOP MENU */}
        <div className="navbar__menu">
          {user && (
            <>
              <Link to="/seller/my-sells" className="navbar__link">
                {t("sellerNav.mySells")}
              </Link>

              <Link to="/seller/add-new" className="navbar__link">
                {t("sellerNav.addNew")}
              </Link>

              <Link to="/seller/chats" className="navbar__link">
                💬 Chats
              </Link>

              {/* ✅ Charity added */}
              <Link to="/charity" className="navbar__link">
                🤝 Charity
              </Link>
            </>
          )}

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

        {/* LANGUAGE */}
        <select
          value={i18n.language}
          onChange={(e) => i18n.changeLanguage(e.target.value)}
          className="navbar__language"
        >
          <option value="en">EN</option>
          <option value="hi">हिंदी</option>
          <option value="as">অসমীয়া</option>
        </select>

        {/* HAMBURGER */}
        <button
          className="navbar__hamburger"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`navbar__mobile-menu ${
          mobileOpen ? "navbar__mobile-menu--open" : ""
        }`}
      >
        {user && (
          <>
            <Link to="/seller/my-sells" onClick={closeMobileMenu}>
              {t("sellerNav.mySells")}
            </Link>

            <Link to="/seller/add-new" onClick={closeMobileMenu}>
              {t("sellerNav.addNew")}
            </Link>

            <Link to="/seller/chats" onClick={closeMobileMenu}>
              💬 Chats
            </Link>

            {/* ✅ Charity in mobile */}
            <Link to="/charity" onClick={closeMobileMenu}>
              🤝 Charity
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
