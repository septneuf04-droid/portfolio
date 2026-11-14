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
    if (hasFinishedRef.current) return;

    // Si déjà vu dans cette session de navigation, affichage instantané direct (0ms)
    try {
      if (sessionStorage.getItem('portfolio_preloader_seen') === 'true') {
        if (containerRef.current) {
          containerRef.current.style.display = 'none';
        }
        hasFinishedRef.current = true;
        onCompleteRef.current();
        return;
      }
    } catch {
      // Ignorer si sessionStorage restreint
    }

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

      // 1. Progression ultra-rapide et rythmée du compteur (0.65s au lieu de 1.4s)
      tl.to(counterObj, {
        val: 100,
        duration: 0.65,
        ease: 'power2.out',
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

      // Micro pause imperceptible
      tl.to({}, { duration: 0.05 });

      // 2. Révélation immédiate du contenu
      tl.call(() => {
        hasFinishedRef.current = true;
        try {
          sessionStorage.setItem('portfolio_preloader_seen', 'true');
        } catch {}
        onCompleteRef.current();
      });

      // 3. Estompage vif des textes
      tl.to(
        [
          counterRef.current,
          `.${styles.topRow}`,
          `.${styles.bottomRow}`,
          `.${styles.progressBar}`,
        ],
        {
          opacity: 0,
          y: -8,
          duration: 0.22,
          ease: 'power2.out',
        }
      );

      // 4. Dissolution fluide et rapide de l'écran
      tl.to(
        containerRef.current,
        {
          opacity: 0,
          duration: 0.38,
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
        '-=0.15'
      );
    }, containerRef);

    // Filet de sécurité rapide : 1.5s max au cas où
    const safetyTimer = setTimeout(() => {
      if (!hasFinishedRef.current) {
        hasFinishedRef.current = true;
        if (containerRef.current) {
          containerRef.current.style.display = 'none';
        }
        onCompleteRef.current();
      }
    }, 1500);

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
