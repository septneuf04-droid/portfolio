'use client';

import React, { useState } from 'react';
import { useLenisGsap } from '@/hooks/useLenisGsap';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { CustomCursor } from '@/components/common/CustomCursor';
import { Preloader } from '@/components/common/Preloader';
import { Hero } from '@/sections/Hero';
import { About } from '@/sections/About';
import { Projects } from '@/sections/Projects';
import { Skills } from '@/sections/Skills';
import { Contact } from '@/sections/Contact';

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const lenisRef = useLenisGsap();

  const handleLoaded = React.useCallback(() => {
    setIsLoaded(true);
  }, []);

  const handleSmoothNavigate = (href: string) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(href, {
        offset: -40,
        duration: 1.2,
      });
    } else {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToTop = () => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { duration: 1.4 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Préloader cinématique Awwwards avec indicateur chiffré */}
      <Preloader onComplete={handleLoaded} />

      {/* Curseur fluide personnalisé (désactivé sur tactile & reduced motion) */}
      <CustomCursor />

      {/* Barre de navigation principale */}
      <Header onNavigate={handleSmoothNavigate} />

      {/* Contenu principal et sections */}
      <main id="main-content">
        <Hero isLoaded={isLoaded} />
        <About />
        <Projects />
        <Skills />
        <Contact />
      </main>

      {/* Pied de page et liens de clôture */}
      <Footer onScrollToTop={handleScrollToTop} />
    </>
  );
}

