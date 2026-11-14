'use client';

import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Projects.module.css';
import { portfolioData, Project } from '@/lib/portfolio.data';

export const Projects: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const deckRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState(0);
  const { projects } = portfolioData;

  useEffect(() => {
    if (typeof window === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      const cards = gsap.utils.toArray<HTMLElement>(`.${styles.projectCard}`);

      // Animation d'empilement 3D tactile (Stacking Cards façon Figma / Awwwards)
      cards.forEach((card, index) => {
        // Met à jour l'onglet actif au scroll
        ScrollTrigger.create({
          trigger: card,
          start: 'top 50%',
          end: 'bottom 50%',
          onEnter: () => setActiveTab(index),
          onEnterBack: () => setActiveTab(index),
        });

        // Les cartes antérieures se réduisent et s'estompent doucement lorsque la suivante monte dessus
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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
    const cards = document.querySelectorAll(`.${styles.projectCard}`);
    if (cards[index]) {
      const target = cards[index] as HTMLElement;
      const targetY = target.getBoundingClientRect().top + window.scrollY - 110;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    }
  };

  return (
    <section ref={sectionRef} id="projects" className={`section ${styles.projectsSection}`} aria-label="Projets">
      <div className="container">
        {/* En-tête de section */}
        <div className={styles.headerRow}>
          <div className={styles.titleGroup}>
            <span className={styles.sectionIndex}>02 //</span>
            <h2 className={styles.sectionTitle}>Projets</h2>
          </div>
          <p className={styles.headerSubtitle}>
            Une sélection d'applications concrètes, utiles et soignées avec interfaces immersives.
          </p>
        </div>

        {/* Barre de navigation Figma Tabs pour faire défiler/sélectionner les cartes */}
        <div className={styles.figmaTabsBar} role="tablist" aria-label="Sélectionner un projet">
          <div className={styles.tabsTrack}>
            {projects.map((project, idx) => (
              <button
                key={project.id}
                type="button"
                role="tab"
                aria-selected={activeTab === idx}
                className={`${styles.tabBtn} ${activeTab === idx ? styles.tabActive : ''}`}
                onClick={() => handleTabClick(idx)}
              >
                <span className={styles.tabDot} aria-hidden="true" />
                <span className={styles.tabIndex}>0{idx + 1}</span>
                <span className={styles.tabName}>{project.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Deck de Cartes Superposées (Sticky Stacking Deck) */}
        <div ref={deckRef} className={styles.deckContainer}>
          {projects.map((project: Project, index: number) => {
            const isLive = project.link && project.link !== '#';
            const stickyTop = `calc(clamp(85px, 12vh, 120px) + ${index * 26}px)`;

            return (
              <article
                key={project.id}
                className={styles.projectCard}
                style={{ top: stickyTop }}
                data-interactive="true"
              >
                {/* Barre de fenêtre style Figma / Canvas */}
                <div className={styles.figmaWindowHeader}>
                  <div className={styles.windowDots}>
                    <span className={`${styles.dot} ${styles.dotRed}`} />
                    <span className={`${styles.dot} ${styles.dotAmber}`} />
                    <span className={`${styles.dot} ${styles.dotGreen}`} />
                  </div>

                  <div className={styles.windowPill}>
                    <span className={styles.pillStatusDot} />
                    <span className={styles.pillText}>
                      {index === 0 && 'SaaS Production • Afrique'}
                      {index === 1 && 'Application Bureau • Python'}
                      {index === 2 && 'Assistant IA • Pédagogique'}
                    </span>
                  </div>

                  <span className={styles.deckIndex}>
                    0{index + 1} / 0{projects.length}
                  </span>
                </div>

                <div className={styles.cardGrid}>
                  {/* Colonne gauche : Descriptif, technologies & CTA */}
                  <div className={styles.cardDetails}>
                    <div className={styles.metaRow}>
                      <span className={styles.categoryBadge}>{project.category}</span>
                      {project.year && (
                        <span className={styles.yearBadge}>{project.year}</span>
                      )}
                    </div>

                    <h3 className={styles.projectTitle}>{project.title}</h3>
                    <p className={styles.projectDesc}>{project.description}</p>

                    {/* Fonctionnalités clés selon le projet */}
                    <div className={styles.featuresList}>
                      {index === 0 && (
                        <>
                          <div className={styles.featureItem}>
                            <span className={styles.checkIcon}>✓</span>
                            <span>Factures & Devis adaptés aux monnaies africaines</span>
                          </div>
                          <div className={styles.featureItem}>
                            <span className={styles.checkIcon}>✓</span>
                            <span>Envoi direct WhatsApp & téléchargement PDF instantané</span>
                          </div>
                        </>
                      )}
                      {index === 1 && (
                        <>
                          <div className={styles.featureItem}>
                            <span className={styles.checkIcon}>✓</span>
                            <span>Calcul automatique des moyennes & classements</span>
                          </div>
                          <div className={styles.featureItem}>
                            <span className={styles.checkIcon}>✓</span>
                            <span>Génération automatique de fiches & bulletins imprimables</span>
                          </div>
                        </>
                      )}
                      {index === 2 && (
                        <>
                          <div className={styles.featureItem}>
                            <span className={styles.checkIcon}>✓</span>
                            <span>Génération de questionnaires, examens & corrigés types</span>
                          </div>
                          <div className={styles.featureItem}>
                            <span className={styles.checkIcon}>✓</span>
                            <span>Correction assistée par IA & préparation de cours</span>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Tags technologiques */}
                    <div className={styles.techTagsRow}>
                      {project.technologies.map((tech) => (
                        <span key={tech} className={styles.techPill}>
                          <span className={styles.techPillDot} />
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Actions de redirection */}
                    <div className={styles.actionsRow}>
                      {isLive ? (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.primaryProjectBtn}
                          aria-label={`Accéder à ${project.title}`}
                        >
                          <span>Explorer l'application</span>
                          <span className={styles.btnArrow} aria-hidden="true">↗</span>
                        </a>
                      ) : (
                        <div className={styles.internalBadge}>
                          <span>Projet Réalisé</span>
                          <span className={styles.badgeCode}>✓ Code Finalisé</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Colonne droite : Mockup Figma UI interactif stylisé */}
                  <div className={styles.cardPreviewWrapper}>
                    <div className={styles.previewAura} />

                    {/* MOCKUP PROJET 1 : SaaS Facturation */}
                    {index === 0 && (
                      <div className={styles.figmaMockupBox}>
                        <div className={styles.mockupHeaderBar}>
                          <span className={styles.mockupTag}>SEPT-FACTURE // Dashboard</span>
                          <span className={styles.statusPillLive}>Payée ✓</span>
                        </div>
                        <div className={styles.mockupMetricGroup}>
                          <span className={styles.mockupMetricLabel}>Total Facturé</span>
                          <span className={styles.mockupMetricValue}>2 450,00 $</span>
                        </div>
                        <div className={styles.mockupItemsList}>
                          <div className={styles.mockupItem}>
                            <span>Développement Plateforme Web Next.js</span>
                            <span className={styles.itemPrice}>1 800 $</span>
                          </div>
                          <div className={styles.mockupItem}>
                            <span>Configuration Supabase & Authentification</span>
                            <span className={styles.itemPrice}>650 $</span>
                          </div>
                        </div>
                        <div className={styles.mockupFooterBtns}>
                          <span className={styles.microBtn}>📄 Télécharger PDF</span>
                          <span className={styles.microBtnAccent}>💬 WhatsApp Direct</span>
                        </div>
                      </div>
                    )}

                    {/* MOCKUP PROJET 2 : Gestion Scolaire Python */}
                    {index === 1 && (
                      <div className={styles.figmaMockupBox}>
                        <div className={styles.mockupHeaderBar}>
                          <span className={styles.mockupTag}>BULLETIN // Gestion Académique</span>
                          <span className={styles.statusPillGrade}>18.5 / 20</span>
                        </div>
                        <div className={styles.studentCard}>
                          <div className={styles.studentAvatar}>SN</div>
                          <div className={styles.studentInfo}>
                            <span className={styles.studentName}>Sept-neuf (Étudiant)</span>
                            <span className={styles.studentClass}>L3 Génie Logiciel & Systèmes</span>
                          </div>
                        </div>
                        <div className={styles.gradeBars}>
                          <div className={styles.gradeBarRow}>
                            <span>Algorithmique & Python</span>
                            <div className={styles.barTrack}><div className={styles.barFill} style={{ width: '96%' }} /></div>
                            <span className={styles.gradeNote}>19/20</span>
                          </div>
                          <div className={styles.gradeBarRow}>
                            <span>Bases de Données & SQL</span>
                            <div className={styles.barTrack}><div className={styles.barFill} style={{ width: '92%' }} /></div>
                            <span className={styles.gradeNote}>18/20</span>
                          </div>
                        </div>
                        <div className={styles.mockupFooterBtns}>
                          <span className={styles.microBtnAccent}>✓ Fiche Validée</span>
                          <span className={styles.microBtn}>Fiches Imprimables</span>
                        </div>
                      </div>
                    )}

                    {/* MOCKUP PROJET 3 : Assistant IA Enseignants */}
                    {index === 2 && (
                      <div className={styles.figmaMockupBox}>
                        <div className={styles.mockupHeaderBar}>
                          <span className={styles.mockupTag}>ASSISTANT PROF // Générateur IA</span>
                          <span className={styles.statusPillAi}>IA Active</span>
                        </div>
                        <div className={styles.aiPromptBubble}>
                          <span className={styles.promptLabel}>Prompt Enseignant :</span>
                          <p className={styles.promptText}>
                            « Préparer un examen d'informatique : 15 questions, corrigé type détaillé et barème par question. »
                          </p>
                        </div>
                        <div className={styles.aiResultCard}>
                          <span className={styles.aiResultIcon}>⚡</span>
                          <div className={styles.aiResultContent}>
                            <span className={styles.aiDocTitle}>Examen_Semestre_Corrigé.pdf</span>
                            <span className={styles.aiDocMeta}>15 questions générées • Corrigé inclus</span>
                          </div>
                        </div>
                        <div className={styles.mockupFooterBtns}>
                          <span className={styles.microBtnAccent}>✨ Générer nouveau sujet</span>
                          <span className={styles.microBtn}>Exporter PDF</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
