/**
 * Configuration & Contenu Réel du Portfolio
 * Source unique de vérité pour l'ensemble des textes, données et liens du site.
 */

export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  technologies: string[];
  link: string;
  github?: string;
  year?: string;
  stats?: string;
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface PortfolioData {
  personal: {
    name: string;
    role: string;
    badge: string;
    heroHeadlinePart1: string;
    heroHeadlinePart2: string;
    heroSubtext: string;
    heroCtaPrimary: string;
    heroCtaSecondary: string;
    shortBio: string;
    aboutQuote: string;
    fullBio: string[];
    languages: string;
    email: string;
    status: string;
    availability: string;
  };
  navigation: {
    label: string;
    href: string;
  }[];
  socials: {
    name: string;
    label: string;
    url: string;
    icon: 'github' | 'linkedin' | 'email';
  }[];
  stats: {
    value: string;
    label: string;
  }[];
  skills: SkillCategory[];
  projects: Project[];
}

export const portfolioData: PortfolioData = {
  personal: {
    name: "Sept-neuf",
    role: "Développeur full-stack · Étudiant en informatique",
    badge: "Disponible pour un stage ou des missions freelance",
    heroHeadlinePart1: "Je transforme des idées",
    heroHeadlinePart2: "en applications web utiles",
    heroSubtext: "Développeur full-stack · Python, JavaScript, Next.js · Étudiant en informatique",
    heroCtaPrimary: "Voir mes projets",
    heroCtaSecondary: "Me contacter",
    shortBio: "Étudiant en informatique, je me forme en construisant. Ce qui me motive : créer des outils simples qui résolvent des problèmes réels, avec des interfaces propres et un code que je peux maintenir.",
    aboutQuote: "« Étudiant en informatique, je me forme en construisant. »",
    fullBio: [
      "J'ai déjà conçu une application de gestion scolaire en Next.js, une plateforme de facturation pour entrepreneurs africains et un assistant IA pour enseignants.",
      "Ce qui me motive : créer des outils simples qui résolvent des problèmes réels, avec des interfaces propres et un code que je peux maintenir."
    ],
    languages: "Français, lingala, swahili, english",
    email: "amanimoses886@gmail.com",
    status: "Disponible pour un stage ou des missions freelance",
    availability: "Disponible pour un stage ou des missions freelance."
  },
  navigation: [
    { label: "Accueil", href: "#hero" },
    { label: "À propos", href: "#about" },
    { label: "Projets", href: "#projects" },
    { label: "Compétences", href: "#skills" },
    { label: "Contact", href: "#contact" }
  ],
  socials: [
    {
      name: "GitHub",
      label: "github.com/septneuf04-droid",
      url: "https://github.com/septneuf04-droid",
      icon: "github"
    },
    {
      name: "LinkedIn",
      label: "LinkedIn",
      url: "#",
      icon: "linkedin"
    },
    {
      name: "Email",
      label: "amanimoses886@gmail.com",
      url: "mailto:amanimoses886@gmail.com",
      icon: "email"
    }
  ],
  stats: [
    { value: "03", label: "Projets réalisés" },
    { value: "05", label: "Technologies maîtrisées" }
  ],
  skills: [
    {
      category: "Solide",
      skills: ["HTML", "CSS", "JavaScript", "Python", "SQL"]
    },
    {
      category: "En pratique",
      skills: ["Next.js", "Supabase", "Tailwind CSS"]
    },
    {
      category: "En apprentissage",
      skills: ["GSAP", "Three.js / React Three Fiber", "Lenis", "Bases de données"]
    }
  ],
  projects: [
    {
      id: "project-1",
      title: "Application de gestion scolaire",
      category: "Gestion & Interface",
      description: "Gestion des étudiants, notes, moyennes et fiches, avec interface graphique professionnelle.",
      technologies: ["Python"],
      link: "#",
      year: "Python"
    },
    {
      id: "project-2",
      title: "SaaS de facturation pour entrepreneurs africains",
      category: "Plateforme SaaS",
      description: "Facturation simple et adaptée au contexte africain.",
      technologies: ["Next.js", "Supabase", "Tailwind", "Vercel"],
      link: "https://sept-facture.vercel.app/",
      year: "En ligne"
    },
    {
      id: "project-3",
      title: "Assistant IA pour enseignants",
      category: "Intelligence Artificielle",
      description: "Préparation de cours, génération de questionnaires, examens et corrigés, correction assistée, bulletins.",
      technologies: ["Next.js", "IA"],
      link: "#",
      year: "IA"
    }
  ]
};
