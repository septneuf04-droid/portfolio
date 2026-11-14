'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from './Preloader.module.css';
import { portfolioData } from '@/lib/portfolio.data';

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const onCompleteRef = useRef(onComplete);
  const hasFinishedRef = useRef(false);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    // Si l'animation a déjà été complétée, ne pas la relancer
    if (hasFinishedRef.current) return;

    // Détection prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      if (containerRef.current) {
        containerRef.current.style.display = 'none';
      }
      hasFinishedRef.current = true;
      onCompleteRef.current();
      return;
    }

    const ctx = gsap.context(() => {
      const counterObj = { val: 0 };
      const tl = gsap.timeline();

      // 1. Progression douce et feutrée du compteur
      tl.to(counterObj, {
        val: 100,
        duration: 1.4,
        ease: 'power2.inOut',
        onUpdate: () => {
          const current = Math.round(counterObj.val);
          if (counterRef.current) {
            counterRef.current.textContent = String(current).padStart(2, '0');
          }
          if (fillRef.current) {
            fillRef.current.style.width = `${current}%`;
          }
        },
      });

      // Pause subtile à 100%
      tl.to({}, { duration: 0.1 });

      // 2. Révélation du Hero en fondu croisé
      tl.call(() => {
        hasFinishedRef.current = true;
        onCompleteRef.current();
      });

      // 3. Estompage doux des textes
      tl.to(
        [
          counterRef.current,
          `.${styles.topRow}`,
          `.${styles.bottomRow}`,
          `.${styles.progressBar}`,
        ],
        {
          opacity: 0,
          y: -10,
          duration: 0.45,
          ease: 'power2.out',
        }
      );

      // 4. Dissolution soyeuse du rideau
      tl.to(
        containerRef.current,
        {
          opacity: 0,
          scale: 1.02,
          duration: 0.75,
          ease: 'power2.inOut',
          onStart: () => {
            if (containerRef.current) {
              containerRef.current.style.pointerEvents = 'none';
            }
          },
          onComplete: () => {
            if (containerRef.current) {
              containerRef.current.style.display = 'none';
            }
          },
        },
        '-=0.3'
      );
    }, containerRef);

    // Filet de sécurité absolu : si jamais l'animation est ralentie ou bloquée
    const safetyTimer = setTimeout(() => {
      if (!hasFinishedRef.current) {
        hasFinishedRef.current = true;
        if (containerRef.current) {
          containerRef.current.style.display = 'none';
        }
        onCompleteRef.current();
      }
    }, 3000);

    return () => {
      clearTimeout(safetyTimer);
      ctx.revert();
    };
  }, []);

  return (
    <div ref={containerRef} className={styles.preloader} aria-label="Chargement du portfolio">
      <div className={styles.topRow}>
        <span className={styles.brand}>{portfolioData.personal.name}</span>
        <span className={styles.tagline}>{portfolioData.personal.role}</span>
      </div>

      <div className={styles.centerContent}>
        <div ref={counterRef} className={styles.counter}>
          00
        </div>
        <div className={styles.progressBar} aria-hidden="true">
          <div ref={fillRef} className={styles.progressFill} />
        </div>
      </div>

      <div className={styles.bottomRow}>
        <span>{portfolioData.personal.role}</span>
        <span>© {new Date().getFullYear()}</span>
      </div>
    </div>
  );
};
