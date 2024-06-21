// pages/index.tsx
'use client';
import { useRouter } from 'next/router';
import Image from 'next/image';
import styles from './page.module.css';

export default function Home() {
  const router = useRouter();

  const navigateToLogin = () => {
    router.push('/login');
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logoContainer}>
          <Image src="/images/logo.jpg" alt="Logo" width={50} height={50} />
          <h1>Gestion des Déchets</h1>
        </div>
        <nav className={styles.nav}>
          <ul>
            <li><a href="#">Accueil</a></li>
            <li><a href="#about">À propos</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#impact">Impact</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
      </header>
      {/* Le reste de votre contenu ici */}
    </div>
  );
}

