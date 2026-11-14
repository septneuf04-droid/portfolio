/**
 * PORTFOLIO SEPT-NEUF - ORCHESTRATION JS
 * Stack : Pure Vanilla JS (ES6+) + CDN GSAP / ScrollTrigger / Lenis / Three.js
 * Zéro build step, Performance 100%, Animations Awwwards fluides.
 */

(function () {
  'use strict';

  // ==========================================================================
  // 1. DÉTECTION DES PRÉFÉRENCES (Reduced Motion & Touch)
  // ==========================================================================
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // ==========================================================================
  // 2. SMOOTH SCROLL LENIS & SYNCHRONISATION GSAP
  // ==========================================================================
  let lenis = null;
  if (typeof Lenis !== 'undefined' && !prefersReducedMotion) {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      lenis.on('scroll', ScrollTrigger.update);

      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }
  }

  // Helper pour défilement fluide universel
  function scrollToTarget(target, offset = 0) {
    if (lenis) {
      lenis.scrollTo(target, { offset });
    } else {
      if (typeof target === 'number') {
        window.scrollTo({ top: target, behavior: 'smooth' });
      } else {
        const el = typeof target === 'string' ? document.querySelector(target) : target;
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY + offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
    }
  }

  // ==========================================================================
  // 3. CURSEUR PERSONNALISÉ (Desktop souris uniquement)
  // ==========================================================================
  const cursorDot = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');

  if (cursorDot && cursorRing && !isTouchDevice && !prefersReducedMotion) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
      cursorDot.classList.remove('cursor-hidden');
      cursorRing.classList.remove('cursor-hidden');
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
      cursorDot.classList.add('cursor-hidden');
      cursorRing.classList.add('cursor-hidden');
    });

    // Amorti fluide de l'anneau
    function renderCursor() {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;
      requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    // Effet d'agrandissement au survol des éléments interactifs
    const interactiveElements = 'a, button, [data-interactive="true"], input, textarea';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(interactiveElements)) {
        document.body.classList.add('cursor-hovered');
      }
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(interactiveElements)) {
        document.body.classList.remove('cursor-hovered');
      }
    });
  }

  // ==========================================================================
  // 4. HEADER & MENU MOBILE
  // ==========================================================================
  const header = document.getElementById('header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDropdown = document.getElementById('mobile-dropdown');

  // Détection du scroll pour styliser le header
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    if (window.scrollY > 120 && mobileDropdown && mobileDropdown.classList.contains('is-open')) {
      closeMobileMenu();
    }
  }, { passive: true });

  function closeMobileMenu() {
    if (mobileToggle) {
      mobileToggle.classList.remove('is-open');
      mobileToggle.setAttribute('aria-expanded', 'false');
    }
    if (mobileDropdown) {
      mobileDropdown.classList.remove('is-open');
    }
  }

  function toggleMobileMenu() {
    const isOpen = mobileDropdown.classList.toggle('is-open');
    mobileToggle.classList.toggle('is-open', isOpen);
    mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  }

  if (mobileToggle && mobileDropdown) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMobileMenu();
    });

    document.addEventListener('click', (e) => {
      if (!mobileDropdown.contains(e.target) && !mobileToggle.contains(e.target)) {
        closeMobileMenu();
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMobileMenu();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 860) closeMobileMenu();
    });
  }

  // Liens d'ancrage fluides
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.length > 1) {
        e.preventDefault();
        closeMobileMenu();
        scrollToTarget(href, -20);
      }
    });
  });

  // Bouton retour en haut
  const backToTopBtn = document.getElementById('back-to-top-btn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      scrollToTarget(0);
    });
  }

  // Bouton copie email avec toast
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const copyToast = document.getElementById('copy-toast');
  if (copyEmailBtn && copyToast) {
    copyEmailBtn.addEventListener('click', async () => {
      const email = 'amanimoses886@gmail.com';
      try {
        await navigator.clipboard.writeText(email);
        copyToast.classList.add('is-visible');
        setTimeout(() => {
          copyToast.classList.remove('is-visible');
        }, 3000);
      } catch (err) {
        window.location.href = `mailto:${email}`;
      }
    });
  }

  // ==========================================================================
  // 5. SCÈNE 3D THREE.JS (Halo Orbital & Particules Dorées)
  // ==========================================================================
  function initThreeHeroScene() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 5.5);

    function resizeRenderer() {
      const parent = canvas.parentElement;
      const width = parent.clientWidth;
      const height = parent.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }
    resizeRenderer();
    window.addEventListener('resize', resizeRenderer, { passive: true });

    // Éclairages de studio
    const ambientLight = new THREE.AmbientLight('#35120c', 0.45);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight('#F03D1A', 4.2);
    dirLight1.position.set(-4, 3, -2);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight('#FFA834', 3.2);
    dirLight2.position.set(4, -2, 3);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight('#F5781E', 2.8, 9);
    pointLight.position.set(0, 1, 2);
    scene.add(pointLight);

    // Groupe orbital
    const group = new THREE.Group();
    group.position.set(0, 0.1, -1.5);
    scene.add(group);

    // Torus métallique
    const torusGeom = new THREE.TorusGeometry(1.5, 0.08, 16, 64);
    const torusMat = new THREE.MeshStandardMaterial({
      color: '#FF6E1A',
      roughness: 0.25,
      metalness: 0.8,
      emissive: '#FF3A14',
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.4,
    });
    const torusMesh = new THREE.Mesh(torusGeom, torusMat);
    torusMesh.scale.set(1.05, 1.05, 1.05);
    group.add(torusMesh);

    // Cage géométrique wireframe
    const icoGeom = new THREE.IcosahedronGeometry(1.8, 1);
    const icoMat = new THREE.MeshBasicMaterial({
      color: '#FFA834',
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    });
    const icoMesh = new THREE.Mesh(icoGeom, icoMat);
    icoMesh.scale.set(1.2, 1.2, 1.2);
    group.add(icoMesh);

    // Particules flottantes
    const particleCount = 35;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    const particleGeom = new THREE.BufferGeometry();
    particleGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.065,
      color: '#FFA834',
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(particleGeom, particleMat);
    scene.add(particles);

    // Interaction souris
    let targetPointerX = 0;
    let targetPointerY = 0;
    window.addEventListener('mousemove', (e) => {
      targetPointerX = (e.clientX / window.innerWidth) * 2 - 1;
      targetPointerY = -(e.clientY / window.innerHeight) * 2 + 1;
    }, { passive: true });

    // Boucle de rendu
    const clock = new THREE.Clock();
    let currentX = 0;
    let currentY = 0;

    function animateThree() {
      requestAnimationFrame(animateThree);
      const time = clock.getElapsedTime();

      torusMesh.rotation.x = time * 0.22;
      torusMesh.rotation.y = time * 0.3;

      icoMesh.rotation.x = -torusMesh.rotation.x * 0.8;
      icoMesh.rotation.y = -torusMesh.rotation.y * 0.8;

      particles.rotation.y = time * 0.05;
      particles.rotation.x = Math.sin(time * 0.03) * 0.08;

      // Parallaxe douce
      currentX += (targetPointerX * 0.6 - currentX) * 0.05;
      currentY += (targetPointerY * 0.4 + Math.sin(time * 0.7) * 0.12 - currentY) * 0.05;

      group.position.x = currentX;
      group.position.y = 0.1 + currentY;

      pointLight.position.x = targetPointerX * 3;
      pointLight.position.y = targetPointerY * 3 + 1;

      renderer.render(scene, camera);
    }
    animateThree();
  }

  // ==========================================================================
  // 6. ANIMATIONS HERO ET SCROLLTRIGGER GSAP
  // ==========================================================================
  function initHeroAnimations() {
    if (typeof gsap === 'undefined') return;

    const heroBadge = document.getElementById('hero-badge');
    const heroPortrait = document.getElementById('hero-portrait');
    const heroPortraitImg = document.getElementById('hero-portrait-img');
    const heroTitle1 = document.getElementById('hero-title-1');
    const heroTitle2 = document.getElementById('hero-title-2');
    const heroSubtext = document.getElementById('hero-subtext');
    const heroCta = document.getElementById('hero-cta');
    const scrollIndicator = document.getElementById('hero-scroll-indicator');
    const heroSection = document.getElementById('hero');
    const transitionLine = document.getElementById('hero-transition-line');

    if (prefersReducedMotion) {
      gsap.set([heroBadge, heroPortrait, heroTitle1, heroTitle2, heroSubtext, heroCta], {
        opacity: 1,
        y: 0,
        scale: 1,
      });
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    tl.fromTo(
      heroBadge,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, delay: 0.1 }
    )
      .fromTo(
        heroPortrait,
        { opacity: 0, y: 50, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 1.4, ease: 'power3.out' },
        '-=0.6'
      )
      .fromTo(
        [heroTitle1, heroTitle2],
        { yPercent: 120, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1.2, stagger: 0.14 },
        '-=0.8'
      )
      .fromTo(
        heroSubtext,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.0 },
        '-=0.7'
      )
      .fromTo(
        heroCta,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 },
        '-=0.6'
      );

    // Parallaxe souris délicate sur le portrait
    if (heroPortraitImg && !isTouchDevice) {
      window.addEventListener('mousemove', (e) => {
        const moveX = (e.clientX / window.innerWidth - 0.5) * 16;
        const moveY = (e.clientY / window.innerHeight - 0.5) * 10;
        gsap.to(heroPortraitImg, {
          x: moveX,
          y: moveY,
          duration: 1.2,
          ease: 'power2.out',
        });
      }, { passive: true });
    }

    // Transition au défilement
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.to(heroPortrait, {
        scrollTrigger: {
          trigger: heroSection,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2,
        },
        y: -60,
        scale: 0.97,
        ease: 'none',
      });

      if (scrollIndicator) {
        gsap.to(scrollIndicator, {
          scrollTrigger: {
            trigger: heroSection,
            start: 'top top',
            end: '30% top',
            scrub: true,
          },
          opacity: 0,
          y: 15,
          ease: 'none',
        });
      }

      if (transitionLine) {
        gsap.fromTo(
          transitionLine,
          { scaleX: 0.25, opacity: 0.2 },
          {
            scaleX: 1,
            opacity: 1,
            scrollTrigger: {
              trigger: heroSection,
              start: '50% top',
              end: 'bottom top',
              scrub: 1,
            },
            ease: 'power2.out',
          }
        );
      }
    }
  }

  // ==========================================================================
  // 7. FIGMA STACKING CARDS & TABS SWITCHER
  // ==========================================================================
  function initStackingCards() {
    const cards = gsap.utils.toArray('.project-card');
    const tabs = document.querySelectorAll('.tab-btn');
    if (!cards.length) return;

    // Configurer le sticky top avec décalage esthétique
    cards.forEach((card, index) => {
      card.style.top = `calc(clamp(85px, 12vh, 120px) + ${index * 26}px)`;
    });

    if (prefersReducedMotion || typeof ScrollTrigger === 'undefined') return;

    cards.forEach((card, index) => {
      // Détection de la carte active lors du scroll pour actualiser les onglets
      ScrollTrigger.create({
        trigger: card,
        start: 'top 50%',
        end: 'bottom 50%',
        onEnter: () => setActiveTab(index),
        onEnterBack: () => setActiveTab(index),
      });

      // Effet de compression / fondu des cartes précédentes
      if (index < cards.length - 1) {
        const nextCard = cards[index + 1];
        gsap.to(card, {
          scale: 0.94 - (cards.length - 1 - index) * 0.02,
          opacity: 0.55,
          filter: 'blur(1.2px) brightness(0.7)',
          ease: 'none',
          scrollTrigger: {
            trigger: nextCard,
            start: 'top 80%',
            end: 'top 20%',
            scrub: true,
          },
        });
      }
    });

    function setActiveTab(activeIdx) {
      tabs.forEach((tab, idx) => {
        const isCurrent = idx === activeIdx;
        tab.classList.toggle('tab-active', isCurrent);
        tab.setAttribute('aria-selected', isCurrent ? 'true' : 'false');
      });
    }

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const targetIdx = parseInt(tab.getAttribute('data-project-idx'), 10);
        if (!isNaN(targetIdx) && cards[targetIdx]) {
          setActiveTab(targetIdx);
          scrollToTarget(cards[targetIdx], -110);
        }
      });
    });
  }

  // ==========================================================================
  // 8. ANIMATIONS D'APPARITION DES SECTIONS (About, Skills, Contact)
  // ==========================================================================
  function initSectionScrollAnimations() {
    if (prefersReducedMotion || typeof ScrollTrigger === 'undefined') return;

    // About section
    gsap.from('.about-header', {
      scrollTrigger: {
        trigger: '#about',
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
      opacity: 0,
      x: -25,
      duration: 0.8,
      ease: 'power3.out',
    });

    gsap.from('.about-manifesto > *', {
      scrollTrigger: {
        trigger: '#about',
        start: 'top 75%',
        toggleActions: 'play none none reverse',
      },
      opacity: 0,
      y: 40,
      stagger: 0.15,
      duration: 0.9,
      ease: 'power3.out',
    });

    gsap.from('.stat-card', {
      scrollTrigger: {
        trigger: '.stats-grid',
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
      opacity: 0,
      scale: 0.94,
      y: 30,
      stagger: 0.1,
      duration: 0.8,
      ease: 'power3.out',
    });

    // Skills section
    gsap.from('.category-card', {
      scrollTrigger: {
        trigger: '.skills-grid',
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
      opacity: 0,
      y: 40,
      stagger: 0.15,
      duration: 0.85,
      ease: 'power3.out',
    });

    // Contact section
    gsap.from('.contact-content-wrapper > *', {
      scrollTrigger: {
        trigger: '#contact',
        start: 'top 75%',
        toggleActions: 'play none none reverse',
      },
      opacity: 0,
      y: 40,
      stagger: 0.12,
      duration: 0.85,
      ease: 'power3.out',
    });
  }

  // ==========================================================================
  // 9. GESTION DU PRELOADER (Ultra-rapide avec mémoire de session)
  // ==========================================================================
  function initPreloader(onComplete) {
    const preloader = document.getElementById('preloader');
    const counter = document.getElementById('preloader-counter');
    const fill = document.getElementById('preloader-fill');

    if (!preloader) {
      if (onComplete) onComplete();
      return;
    }

    let alreadySeen = false;
    try {
      alreadySeen = sessionStorage.getItem('portfolio_preloader_seen') === 'true';
    } catch (e) { }

    if (alreadySeen || prefersReducedMotion || typeof gsap === 'undefined') {
      preloader.style.display = 'none';
      if (onComplete) onComplete();
      return;
    }

    const counterObj = { val: 0 };
    const tl = gsap.timeline();

    tl.to(counterObj, {
      val: 100,
      duration: 0.65,
      ease: 'power2.out',
      onUpdate: () => {
        const current = Math.round(counterObj.val);
        if (counter) counter.textContent = String(current).padStart(2, '0');
        if (fill) fill.style.width = `${current}%`;
      },
    });

    tl.call(() => {
      try {
        sessionStorage.setItem('portfolio_preloader_seen', 'true');
      } catch (e) { }
      if (onComplete) onComplete();
    });

    tl.to([counter, '.preloader-top', '.preloader-bottom', '.preloader-progress-bar'], {
      opacity: 0,
      y: -8,
      duration: 0.22,
      ease: 'power2.out',
    });

    tl.to(preloader, {
      opacity: 0,
      duration: 0.35,
      ease: 'power2.out',
      onComplete: () => {
        preloader.style.display = 'none';
      },
    });
  }

  // ==========================================================================
  // INITIALISATION GLOBALE DU DOM
  // ==========================================================================
  document.addEventListener('DOMContentLoaded', () => {
    // Initialise Three.js tout de suite
    initThreeHeroScene();

    // Initialise le Preloader puis lance les animations
    initPreloader(() => {
      initHeroAnimations();
      initStackingCards();
      initSectionScrollAnimations();
    });
  });

})();
