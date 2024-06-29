import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import 'leaflet/dist/leaflet.css'

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Gestion de la Collecte des Déchets',
  description: 'Application de gestion de la collecte des déchets',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
