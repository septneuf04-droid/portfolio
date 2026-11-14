'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

/**
 * Hook d'initialisation unique de Lenis et de sa synchronisation avec GSAP ScrollTrigger.
 * Conforme aux spécifications techniques et aux meilleures pratiques d'animation Awwwards.
 */
export function useLenisGsap() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // 1. Enregistrement sécurisé du plugin ScrollTrigger côté client
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    // 2. Détection prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 3. Initialisation de Lenis avec options optimisées
    const lenis = new Lenis({
      duration: prefersReducedMotion ? 0.01 : 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Courbe exponentielle fluide
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: !prefersReducedMotion,
      touchMultiplier: 1.5,
      infinite: false,
    });

    lenisRef.current = lenis;

    // 4. Synchronisation : chaque défilement de Lenis met à jour ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // 5. Intégration dans le moteur de rendu de GSAP (gsap.ticker)
    // Au lieu d'avoir deux boucles requestAnimationFrame distinctes, Lenis utilise la boucle centrale de GSAP
    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);

    // Désactive le lagSmoothing pour éviter les sauts lors des charges de frame
    gsap.ticker.lagSmoothing(0);

    // 6. Rafraîchissement de ScrollTrigger une fois le DOM stabilisé
    ScrollTrigger.refresh();

    // 7. Nettoyage au démontage
    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return lenisRef;
}

