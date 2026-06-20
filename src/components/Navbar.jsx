import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import styles from "./Navbar.module.css";
import logoImg from "../../assets/logo.jpeg";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}>
      <div className={styles.navContainer}>
        <Link to="/" className={styles.brandWrapper}>
          <div className={styles.logoMark} aria-hidden="true">
            <img src={logoImg} alt="Agadi Anandavana logo" className={styles.logoImage} />
          </div>

          <div className={styles.brandText}>
            <span className={styles.brandTitle}>Sri Sheshachala Sadguru Samsthana(R)</span>
            <span className={styles.brandSubtitle}>Anandavana, Agadi</span>
          </div>
        </Link>

        <nav className={styles.desktopNav} aria-label="Main Navigation">
          <NavLink
            to="/events"
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
          >
            Events
          </NavLink>

          <NavLink
            to="/gallery"
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
          >
            Gallery
          </NavLink>
        </nav>

        <button
          className={styles.mobileMenuBtn}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <div className={`${styles.hamburger} ${isMobileMenuOpen ? styles.open : ""}`} />
        </button>
      </div>

      <div className={`${styles.mobileNav} ${isMobileMenuOpen ? styles.mobileNavOpen : ""}`}>
        <NavLink to="/events" className={styles.mobileNavLink}>
          Events
        </NavLink>
        <NavLink to="/gallery" className={styles.mobileNavLink}>
          Gallery
        </NavLink>
      </div>
    </header>
  );
}