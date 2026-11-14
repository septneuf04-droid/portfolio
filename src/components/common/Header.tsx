'use client';

import React, { useState, useEffect } from 'react';
import styles from './Header.module.css';
import { portfolioData } from '@/lib/portfolio.data';

interface HeaderProps {
  onNavigate?: (href: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { personal, navigation } = portfolioData;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
      if (window.scrollY > 120 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    const handleResize = () => {
      if (window.innerWidth > 860 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobileMenuOpen]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(href);
    } else {
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`} role="banner">
      <div className={styles.container}>
        {/* Brand / Logo */}
        <a
          href="#hero"
          className={styles.brand}
          onClick={(e) => handleLinkClick(e, '#hero')}
          aria-label={`${personal.name} - Retour en haut`}
        >
          <span className={styles.brandIcon} aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 2 7 12 12 22 7 12 2"/>
              <polyline points="2 17 12 22 22 17"/>
              <polyline points="2 12 12 17 22 12"/>
            </svg>
          </span>
          <span>
            {personal.name.split(' ')[0]}
            <span className={styles.brandDot}>.</span>
          </span>
        </a>

        {/* Navigation Centrée (Desktop) */}
        <nav className={styles.nav} aria-label="Navigation principale">
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={styles.navLink}
              onClick={(e) => handleLinkClick(e, item.href)}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Actions à droite : Bouton Pilule Contact + Bouton Menu Mobile */}
        <div className={styles.headerActions}>
          <a
            href="#contact"
            className={styles.ctaButton}
            onClick={(e) => handleLinkClick(e, '#contact')}
            aria-label="Accéder à la section Contact"
          >
            <span className={styles.ctaIcon} aria-hidden="true">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="7" y1="17" x2="17" y2="7"/>
                <polyline points="7 7 17 7 17 17"/>
              </svg>
            </span>
            <span>Contact</span>
          </a>

          {/* Bouton Hamburger Dropdown Mobile */}
          <button
            type="button"
            className={`${styles.mobileToggle} ${isMobileMenuOpen ? styles.mobileToggleOpen : ''}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu de navigation'}
            aria-expanded={isMobileMenuOpen}
          >
            <span className={styles.burgerLine} />
            <span className={styles.burgerLine} />
            <span className={styles.burgerLine} />
          </button>
        </div>

        {/* Menu Dropdown Déroulant sur Mobile */}
        <div
          className={`${styles.mobileDropdown} ${isMobileMenuOpen ? styles.mobileDropdownOpen : ''}`}
          role="navigation"
          aria-label="Menu mobile"
        >
          <ul className={styles.mobileNavList}>
            {navigation.map((item, index) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={styles.mobileNavLink}
                  onClick={(e) => handleLinkClick(e, item.href)}
                >
                  <span>{item.label}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className={styles.mobileNavIndex}>0{index + 1}</span>
                    <span className={styles.mobileNavArrow} aria-hidden="true">→</span>
                  </div>
                </a>
              </li>
            ))}
          </ul>

          <div className={styles.mobileDropdownFooter}>
            <div className="status-pill" style={{ width: 'fit-content' }}>
              <span className="status-dot" aria-hidden="true" />
              <span>{personal.status}</span>
            </div>
            <p className={styles.mobileContactText}>
              {personal.email}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
