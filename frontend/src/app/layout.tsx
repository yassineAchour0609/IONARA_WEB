import type { Metadata } from 'next';
import './globals.css';
import { ShopProvider } from '@/context/ShopContext';

export const metadata: Metadata = {
  title: 'IONARA STORE | Vente de Comptes Jeux Vidéo & Abonnements Gaming',
  description: 'Boutique n°1 en Algérie pour l\'achat de comptes de jeux vidéo : Pack Steam 1,170+ jeux, GTA VI, EA FC 27, Xbox Game Pass, PlayStation, Valorant. Paiement rapide BaridiMob, CCP, CB.',
  keywords: ['IONARA', 'jeux video algerie', 'compte steam algerie', 'gta 6 algerie', 'baridimob jeux', 'xbox game pass algerie', 'ea fc 27 algerie'],
  icons: {
    icon: '/assets/logo/ionara-logo.svg',
  },
};

import SimpleNavbar from '@/components/ui/simple-navbar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#08090e] text-zinc-100 antialiased selection:bg-pink-500 selection:text-white font-sans">
        <ShopProvider>
          <SimpleNavbar />
          {children}
        </ShopProvider>
      </body>
    </html>
  );
}
