'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './About.module.css';
import { portfolioData } from '@/lib/portfolio.data';

export const About: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { personal, stats } = portfolioData;

  useEffect(() => {
    if (typeof window === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      // Animation d'entrée douce de l'en-tête depuis le Hero
      gsap.from(`.${styles.headerRow}`, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
        opacity: 0,
        x: -25,
        duration: 0.8,
        ease: 'power3.out',
      });

      // Animation d'apparition par scroll
      gsap.from(`.${styles.manifestoCol} > *`, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
        opacity: 0,
        y: 40,
        stagger: 0.15,
        duration: 0.9,
        ease: 'power3.out',
      });

      // Animation des cartes statistiques
      gsap.from(`.${styles.statCard}`, {
        scrollTrigger: {
          trigger: `.${styles.statsGrid}`,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
        opacity: 0,
        scale: 0.94,
        y: 30,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power3.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="about" className={`section ${styles.aboutSection}`} aria-label="Aperçu À propos">
      <div className="container">
        {/* En-tête de section */}
        <div className={styles.headerRow}>
          <span className={styles.sectionIndex}>01 //</span>
          <h2 className={styles.sectionTitle}>À propos</h2>
        </div>

        {/* Grille de contenu */}
        <div className={styles.contentGrid}>
          {/* Manifeste & Biographie */}
          <div className={styles.manifestoCol}>
            <div className={styles.bigQuote}>
              « Étudiant en informatique, je me forme en <span className={styles.highlight}>construisant</span>. »
            </div>

            <div className={styles.paragraphGroup}>
              {personal.fullBio.map((paragraph, index) => (
                <p key={index} className={styles.paragraph}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Statistiques et Carte de Profil */}
          <div className={styles.statsCol}>
            <div className={styles.statsGrid}>
              {stats.map((stat, idx) => (
                <div key={idx} className={styles.statCard} data-interactive="true">
                  <div className={styles.statValue}>{stat.value}</div>
                  <div className={styles.statLabel}>{stat.label}</div>
                </div>
              ))}
            </div>

            <div className={styles.identityCard}>
              <div className={styles.identityTitle}>Profil & Disponibilité</div>
              <ul className={styles.identityList}>
                <li className={styles.identityItem}>
                  <span className={styles.itemCheck} aria-hidden="true">✓</span>
                  <span>{personal.role}</span>
                </li>
                <li className={styles.identityItem}>
                  <span className={styles.itemCheck} aria-hidden="true">✓</span>
                  <span>{personal.availability}</span>
                </li>
                <li className={styles.identityItem}>
                  <span className={styles.itemCheck} aria-hidden="true">✓</span>
                  <span>Langues : {personal.languages}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
