import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import styles from "./Navbar.module.css";
import logoImg from "../../assets/logo.png";

const navItems = [
    { to: "/guru-parampare", label: "Guru Parampare" },
    { to: "/institutions", label: "Our Institutions" },
  { to: "/events", label: "Events" },
  { to: "/seva-booking", label: "Online Seva Booking" },
  { to: "/publications", label: "Publications" },
  { to: "/gallery", label: "Gallery" },
];

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

  const toggleMenu = () => setIsMobileMenuOpen((prev) => !prev);

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}>
      <div className={styles.navContainer}>
        <Link to="/" className={styles.brandWrapper}>
          <div className={styles.logoMark}>
            <img
              src={logoImg}
              alt="Sri Sheshachala Sadguru Samsthana logo"
              className={styles.logoImage}
            />
          </div>

          <div className={styles.brandText}>
            <span className={styles.brandTitle}>
              Sri Sheshachala Sadguru Samsthana (R)
            </span>
            <span className={styles.brandSubtitle}>Anandavana, Agadi</span>
          </div>
        </Link>

        <nav className={styles.desktopNav} aria-label="Main navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          className={styles.mobileMenuBtn}
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-navigation"
          type="button"
        >
          <span className={`${styles.hamburger} ${isMobileMenuOpen ? styles.open : ""}`} />
        </button>
      </div>

      <div
        id="mobile-navigation"
        className={`${styles.mobileNav} ${isMobileMenuOpen ? styles.mobileNavOpen : ""}`}
      >
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} className={styles.mobileNavLink}>
            {item.label}
          </NavLink>
        ))}
      </div>
    </header>
  );
}