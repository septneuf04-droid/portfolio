'use client';

import React from 'react';
import styles from './Footer.module.css';
import { portfolioData } from '@/lib/portfolio.data';

interface FooterProps {
  onScrollToTop?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onScrollToTop }) => {
  const { personal, navigation, socials } = portfolioData;

  const handleBackToTop = () => {
    if (onScrollToTop) {
      onScrollToTop();
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.container}>
        <div className={styles.topSection}>
          <div className={styles.brandCol}>
            <div className={styles.brand}>
              {personal.name}
              <span className={styles.brandDot}>.</span>
            </div>
            <p className={styles.description}>
              {personal.shortBio}
            </p>
            <div className="status-pill" style={{ width: 'fit-content' }}>
              <span className="status-dot" aria-hidden="true" />
              <span>{personal.status}</span>
            </div>
          </div>

          <div className={styles.linksCol}>
            <div className={styles.linkGroup}>
              <div className={styles.groupTitle}>Navigation</div>
              {navigation.map((item) => (
                <a key={item.href} href={item.href} className={styles.link}>
                  {item.label}
                </a>
              ))}
            </div>

            <div className={styles.linkGroup}>
              <div className={styles.groupTitle}>Réseaux & Liens</div>
              {socials.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  {social.name}
                  <span aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.bottomSection}>
          <div>
            © {new Date().getFullYear()} {personal.name}. Tous droits réservés.
          </div>

          <button
            type="button"
            className={styles.backToTop}
            onClick={handleBackToTop}
            aria-label="Retourner en haut de page"
          >
            <span>Retour en haut</span>
            <span className={styles.arrowIcon} aria-hidden="true">↑</span>
          </button>
        </div>
      </div>
    </footer>
  );
};

