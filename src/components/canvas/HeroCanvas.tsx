'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { HeroScene } from './HeroScene';
import styles from './HeroCanvas.module.css';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

export const HeroCanvas: React.FC = () => {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div className={styles.canvasWrapper} aria-hidden="true">
      {/* Halo incandescent de fond */}
      <div className={styles.ambientGlow} />

      {/* Si l'utilisateur préfère réduire les animations, on remplace le rendu WebGL par un visuel statique optimisé */}
      {prefersReducedMotion ? (
        <div className={styles.staticFallback} />
      ) : (
        <div className={styles.canvasInner}>
          <Suspense fallback={<div className={styles.staticFallback} />}>
            <Canvas
              camera={{ position: [0, 0, 4.2], fov: 45 }}
              dpr={[1, 1.75]} // Plafonné pour préserver la batterie et le framerate 60fps
              gl={{
                powerPreference: 'high-performance',
                antialias: true,
                alpha: true,
              }}
            >
              <HeroScene />
            </Canvas>
          </Suspense>
        </div>
      )}
    </div>
  );
};

export default HeroCanvas;

