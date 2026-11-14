'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * HeroScene: Scène 3D interactive utilisant Three.js / R3F
 * Direction artistique fidèle à la référence : Silhouette sombre aux contours
 * tranchants illuminée par un éclairage rim light carmin + ambre doré sur fond solaire.
 */
export const HeroScene: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireframeRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  const { pointer, viewport } = useThree();

  // Particules lumineuses d'ambiance (étincelles incandescentes)
  const particleCount = 65;
  const [particlePositions] = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }

    return [positions];
  }, []);

  // Animation fluide et amortie
  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (meshRef.current) {
      meshRef.current.rotation.x = time * 0.22;
      meshRef.current.rotation.y = time * 0.3;

      // Parallaxe souris douce
      const targetX = (pointer.x * viewport.width) / 14;
      const targetY = (pointer.y * viewport.height) / 14;

      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.05);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY + Math.sin(time * 0.7) * 0.12, 0.05);
    }

    if (wireframeRef.current && meshRef.current) {
      wireframeRef.current.rotation.x = -meshRef.current.rotation.x * 0.8;
      wireframeRef.current.rotation.y = -meshRef.current.rotation.y * 0.8;
      wireframeRef.current.position.copy(meshRef.current.position);
    }

    if (particlesRef.current) {
      particlesRef.current.rotation.y = time * 0.05;
      particlesRef.current.rotation.x = Math.sin(time * 0.03) * 0.08;
    }

    if (lightRef.current) {
      lightRef.current.position.x = pointer.x * 3;
      lightRef.current.position.y = pointer.y * 3 + 1;
    }
  });

  return (
    <>
      {/* Éclairage d'ambiance chaud */}
      <ambientLight intensity={0.45} color="#35120c" />

      {/* Rim light vermillon vif (#F03D1A) */}
      <directionalLight
        position={[-4, 3, -2]}
        intensity={4.2}
        color="#F03D1A"
      />

      {/* Lumière clé ambre doré (#FFA834) */}
      <directionalLight
        position={[4, -2, 3]}
        intensity={3.2}
        color="#FFA834"
      />

      {/* Lumière ponctuelle dynamique */}
      <pointLight
        ref={lightRef}
        position={[0, 1, 2]}
        intensity={2.8}
        distance={9}
        color="#F5781E"
      />

      {/* Halo orbital 3D d'arrière-plan créant la profondeur derrière le portrait */}
      <group position={[0, 0.1, -1.5]}>
        <mesh ref={meshRef} scale={1.05}>
          <torusGeometry args={[1.5, 0.08, 16, 80]} />
          <meshPhysicalMaterial
            color="#FF6E1A"
            roughness={0.2}
            metalness={0.9}
            clearcoat={1.0}
            emissive="#FF3A14"
            emissiveIntensity={0.6}
            transparent
            opacity={0.4}
          />
        </mesh>

        <mesh ref={wireframeRef} scale={1.2}>
          <icosahedronGeometry args={[1.8, 1]} />
          <meshBasicMaterial
            color="#FFA834"
            wireframe
            transparent
            opacity={0.12}
          />
        </mesh>
      </group>

      {/* Étincelles dorées flottantes */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.065}
          color="#FFA834"
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>
    </>
  );
};
