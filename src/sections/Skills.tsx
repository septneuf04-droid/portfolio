'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Skills.module.css';
import { portfolioData, SkillCategory } from '@/lib/portfolio.data';

export const Skills: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { skills } = portfolioData;

  useEffect(() => {
    if (typeof window === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      gsap.from(`.${styles.categoryCard}`, {
        scrollTrigger: {
          trigger: `.${styles.categoriesGrid}`,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
        opacity: 0,
        y: 40,
        stagger: 0.15,
        duration: 0.85,
        ease: 'power3.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="skills" className={`section ${styles.skillsSection}`} aria-label="Compétences techniques">
      <div className="container">
        {/* En-tête de section */}
        <div className={styles.headerRow}>
          <span className={styles.sectionIndex}>03 //</span>
          <h2 className={styles.sectionTitle}>Compétences & Outils</h2>
        </div>

        {/* Grille des catégories */}
        <div className={styles.categoriesGrid}>
          {skills.map((categoryGroup: SkillCategory, idx: number) => (
            <div key={idx} className={styles.categoryCard} data-interactive="true">
              <div className={styles.categoryHeader}>
                <div className={styles.categoryIcon} aria-hidden="true">
                  {idx === 0 && (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="16 18 22 12 16 6"/>
                      <polyline points="8 6 2 12 8 18"/>
                    </svg>
                  )}
                  {idx === 1 && (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <ellipse cx="12" cy="5" rx="9" ry="3"/>
                      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
                      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
                    </svg>
                  )}
                  {idx === 2 && (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                      <line x1="8" y1="21" x2="16" y2="21"/>
                      <line x1="12" y1="17" x2="12" y2="21"/>
                    </svg>
                  )}
                </div>
                <h3 className={styles.categoryTitle}>{categoryGroup.category}</h3>
              </div>

              <div className={styles.skillsPills}>
                {categoryGroup.skills.map((skill, sIdx) => (
                  <div key={sIdx} className={styles.skillPill}>
                    <span className={styles.pillDot} aria-hidden="true" />
                    <span>{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

