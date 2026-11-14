'use client';

import React, { useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Hero.module.css';
import { portfolioData } from '@/lib/portfolio.data';

// Import dynamique de Three.js / R3F (chargé côté client uniquement)
const HeroCanvas = dynamic(() => import('@/components/canvas/HeroCanvas'), {
  ssr: false,
  loading: () => null,
});

interface HeroProps {
  isLoaded: boolean;
}

export const Hero: React.FC<HeroProps> = ({ isLoaded }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleLine1Ref = useRef<HTMLSpanElement>(null);
  const titleLine2Ref = useRef<HTMLSpanElement>(null);
  const subtextRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const transitionLineRef = useRef<HTMLDivElement>(null);

  const { personal } = portfolioData;

  useEffect(() => {
    if (!isLoaded) return;
    if (typeof window === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    // Contexte GSAP isolé pour le Hero
    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (!prefersReducedMotion) {
        const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

        // Révélation d'entrée des éléments du Hero
        tl.fromTo(
          badgeRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, delay: 0.1 }
        )
          .fromTo(
            portraitRef.current,
            { opacity: 0, y: 50, scale: 0.96 },
            { opacity: 1, y: 0, scale: 1, duration: 1.4, ease: 'power3.out' },
            '-=0.6'
          )
          .fromTo(
            [titleLine1Ref.current, titleLine2Ref.current],
            { yPercent: 120, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 1.2, stagger: 0.14 },
            '-=0.8'
          )
          .fromTo(
            subtextRef.current,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 1.0 },
            '-=0.7'
          )
          .fromTo(
            ctaRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8 },
            '-=0.6'
          );

        // Parallaxe souris sur l'image du portrait (découplée du container pour éviter tout conflit)
        const portraitImg = portraitRef.current?.querySelector('img');
        const handleMouseMove = (e: MouseEvent) => {
          if (!portraitImg) return;
          const { innerWidth, innerHeight } = window;
          const moveX = (e.clientX / innerWidth - 0.5) * 16;
          const moveY = (e.clientY / innerHeight - 0.5) * 10;

          gsap.to(portraitImg, {
            x: moveX,
            y: moveY,
            duration: 1.2,
            ease: 'power2.out',
          });
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });

        // Nettoyage de l'événement souris
        const cleanupMouse = () => {
          window.removeEventListener('mousemove', handleMouseMove);
        };

        // Transition subtile vers la section suivante au scroll (effet de profondeur et d'estompement fluide)
        gsap.to(portraitRef.current, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.2,
          },
          y: -60,
          scale: 0.97,
          ease: 'none',
        });

        if (scrollIndicatorRef.current) {
          gsap.to(scrollIndicatorRef.current, {
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: '30% top',
              scrub: true,
            },
            opacity: 0,
            y: 15,
            ease: 'none',
          });
        }

        if (transitionLineRef.current) {
          gsap.fromTo(
            transitionLineRef.current,
            { scaleX: 0.25, opacity: 0.2 },
            {
              scaleX: 1,
              opacity: 1,
              scrollTrigger: {
                trigger: sectionRef.current,
                start: '50% top',
                end: 'bottom top',
                scrub: 1,
              },
              ease: 'power2.out',
            }
          );
        }

        return cleanupMouse;
      } else {
        // En mode reduced-motion, affichage direct garanti à 100% d'opacité
        gsap.set(
          [badgeRef.current, portraitRef.current, titleLine1Ref.current, titleLine2Ref.current, subtextRef.current, ctaRef.current],
          { opacity: 1, yPercent: 0, y: 0, scale: 1 }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [isLoaded]);

  return (
    <section ref={sectionRef} id="hero" className={styles.heroSection} aria-label="Section d'accueil">
      {/* Élément 3D immersif React Three Fiber en arrière-plan */}
      <HeroCanvas />

      {/* Portrait du créateur centré dans un container flexbox insensible aux conflits GSAP */}
      <div className={styles.portraitContainer} aria-hidden="true">
        <div ref={portraitRef} className={styles.portraitWrapper}>
          <div className={styles.portraitGlow} />
          <img
            src="/images/portrait.png"
            alt={personal.name}
            className={styles.portraitImg}
            loading="eager"
          />
        </div>
      </div>

      <div className={styles.container}>
        {/* Badge supérieur */}
        <div ref={badgeRef} className={styles.topBadgeWrapper}>
          <div className="status-pill">
            <span className="status-dot" aria-hidden="true" />
            <span>{personal.badge}</span>
          </div>
        </div>

        {/* Grille principale : Titre à gauche, sous-texte à droite */}
        <div className={styles.headlineGrid}>
          <div className={styles.titleBlock}>
            <div className={styles.titleLineMask}>
              <span ref={titleLine1Ref} className={styles.titleLine}>
                {personal.heroHeadlinePart1}
              </span>
            </div>
            <div className={styles.titleLineMask}>
              <span ref={titleLine2Ref} className={styles.titleLine}>
                {personal.heroHeadlinePart2}
                <span className={styles.accentDot}>.</span>
              </span>
            </div>
          </div>

          <div ref={subtextRef} className={styles.subtextBlock}>
            <p className={styles.subtext}>
              {personal.heroSubtext}
            </p>

            <div ref={ctaRef} className={styles.ctaGroup}>
              <a href="#projects" className={styles.primaryCta} data-interactive="true">
                <span>{personal.heroCtaPrimary}</span>
                <span aria-hidden="true">↓</span>
              </a>
              <a href="#contact" className={styles.secondaryCta} data-interactive="true">
                <span>{personal.heroCtaSecondary}</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Indicateur de défilement vers le bas */}
      <div ref={scrollIndicatorRef} className={styles.scrollIndicator} aria-hidden="true">
        <div className={styles.scrollMouse}>
          <div className={styles.scrollWheel} />
        </div>
        <span>Défiler</span>
      </div>

      {/* Ligne et halo de transition subtile vers la section suivante */}
      <div className={styles.transitionDivider} aria-hidden="true">
        <div ref={transitionLineRef} className={styles.transitionLine} />
      </div>
    </section>
  );
};
