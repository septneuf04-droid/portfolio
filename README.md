# Portfolio Créatif Immersif (Awwwards Level)

Portfolio front-end immersif recréant la direction artistique de l'image de référence (ambiance incandescente, contrastes sombres, typographie éditoriale percutante, 3D interactive et animations soignées).

## Stack Technique Stricte
- **Framework** : Next.js 14 (App Router)
- **Animation** : GSAP 3 (+ ScrollTrigger) synchronisé avec `gsap.ticker`
- **3D Interactive** : Three.js via React Three Fiber (`@react-three/fiber`)
- **Smooth Scroll** : Lenis
- **Styling** : CSS Modules & Variables CSS globales natives (sans Tailwind ni bibliothèques tierces)
- **Typographies** : `Syne` (display) & `Plus Jakarta Sans` (texte courant) via `next/font/google`

## Commandes d'Exécution

```bash
# Lancer le serveur de développement local
npm run dev

# Construire la version optimisée pour la production
npm run build

# Démarrer la version de production
npm run start
```

## Personnalisation Facile
- **Textes, Données & Projets** : Éditez simplement `src/lib/portfolio.data.ts`.
- **Palette de Couleurs & Variables** : Ajustez les variables CSS dans `src/styles/globals.css`.
- **Paramètres de la Scène 3D** : Géométries, matériaux et éclairages modifiables dans `src/components/canvas/HeroScene.tsx`.

