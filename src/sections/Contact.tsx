'use client';

import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Contact.module.css';
import { portfolioData } from '@/lib/portfolio.data';

export const Contact: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);
  const { personal, socials } = portfolioData;

  useEffect(() => {
    if (typeof window === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      gsap.from(`.${styles.contentWrapper} > *`, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
        opacity: 0,
        y: 40,
        stagger: 0.12,
        duration: 0.85,
        ease: 'power3.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(personal.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <section ref={sectionRef} id="contact" className={styles.contactSection} aria-label="Section Contact">
      <div className={styles.ambientBackdrop} aria-hidden="true" />

      <div className="container">
        <div className={styles.contentWrapper}>
          <div className={styles.headerRow}>
            <span className={styles.sectionIndex}>04 //</span>
            <span className={styles.sectionTitle}>Contact</span>
          </div>

          <h2 className={styles.bigCallout}>
            Construisons des applications <span className={styles.calloutGradient}>utiles et concrètes</span>.
          </h2>

          <p className={styles.subtext}>
            {personal.availability} N’hésitez pas à me contacter par email ou via mes réseaux pour échanger.
          </p>

          <div className={styles.actionsGroup}>
            <a
              href={`mailto:${personal.email}`}
              className={styles.primaryEmailBtn}
              data-interactive="true"
            >
              <span>Me contacter par email</span>
              <span aria-hidden="true">→</span>
            </a>

            <button
              type="button"
              className={styles.copyEmailBtn}
              onClick={handleCopyEmail}
              data-interactive="true"
              aria-label="Copier l'adresse email"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
              <span>{personal.email}</span>
            </button>
          </div>

          {copied && (
            <div className={styles.copySuccess} role="status">
              ✓ Adresse email copiée dans le presse-papier !
            </div>
          )}

          <div className={styles.socialsRow}>
            {socials.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target={social.url.startsWith('http') ? '_blank' : undefined}
                rel={social.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                className={styles.socialLink}
                data-interactive="true"
              >
                <span>{social.name}</span>
                <span aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
