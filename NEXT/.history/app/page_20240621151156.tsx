// pages/index.tsx

import { useRouter } from 'next/router';
import Image from 'next/image';
import styles from './page.module.css';

export default function Home() {
  const router = useRouter();

  const navigateToCollect = () => {
    router.push('/collect'); // Redirige vers la page Collect
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
      <main className={styles.main}>
        <section className={styles.hero}>
          <h2>Optimisez la collecte et la gestion des déchets</h2>
          <p>Suivez en temps réel, analysez les statistiques et recevez des notifications instantanées.</p>
          <button className={styles.button} onClick={navigateToCollect}>Voir la collecte</button>
        </section>
        {/* Reste du contenu de la page */}
      </main>
      <footer className={styles.footer} id="contact">
        <p>&copy; 2024 Gestion des Déchets. Tous droits réservés.</p>
        <p>Contact: <a href="mailto:contact@gestiondechets.com">contactez_nous@gestiondechets.com</a></p>
      </footer>
    </div>
  );
}
