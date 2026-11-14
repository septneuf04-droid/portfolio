import type { Metadata, Viewport } from 'next';
import { Syne, Plus_Jakarta_Sans } from 'next/font/google';
import '@/styles/globals.css';
import { portfolioData } from '@/lib/portfolio.data';

const syne = Syne({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-display',
  display: 'swap',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#090707',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: `${portfolioData.personal.name} — ${portfolioData.personal.role}`,
  description: `${portfolioData.personal.shortBio}`,
  keywords: [
    'Sept-neuf',
    'Développeur full-stack',
    'Étudiant en informatique',
    'Python',
    'JavaScript',
    'Next.js',
    'Supabase',
    'Tailwind CSS',
    'Portfolio'
  ],
  authors: [{ name: portfolioData.personal.name }],
  creator: portfolioData.personal.name,
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://sept-facture.vercel.app',
    title: `${portfolioData.personal.name} — ${portfolioData.personal.role}`,
    description: portfolioData.personal.shortBio,
    siteName: `${portfolioData.personal.name} Portfolio`,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${portfolioData.personal.name} — ${portfolioData.personal.role}`,
    description: portfolioData.personal.shortBio,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: portfolioData.personal.name,
    jobTitle: portfolioData.personal.role,
    description: portfolioData.personal.shortBio,
    email: portfolioData.personal.email,
    sameAs: portfolioData.socials.filter((s) => s.url !== '#').map((s) => s.url),
  };

  return (
    <html lang="fr" className={`${syne.variable} ${plusJakartaSans.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
