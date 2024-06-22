'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './page.module.css';

export default function Home() {
  const router = useRouter();

  const navigateToCollect = () => {
    router.push('collect');
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
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
      </header>
      <section className={styles.backgroundSection}>
        <div className={styles.backgroundText}>
          Optimisez la collecte des déchets grâce à la puissance de la cartographie.
        </div>
        <button className={styles.backgroundButton} onClick={navigateToCollect}>Voir chemin de collecte</button>
      </section>
      <main className={styles.main}>
        <section className={styles.section}>
          <Image src="/images/impact.jpg" alt="Impact des déchets" width={300} height={200} />
          <div>
            <h2>Impact des Déchets Non Ramassés</h2>
            <p>
              Les déchets non ramassés peuvent avoir des effets dévastateurs sur les villes, les habitants et l'environnement. Ils peuvent causer des problèmes de santé, attirer les nuisibles et polluer l'air et l'eau. Une gestion efficace des déchets est cruciale pour maintenir un environnement sain et sûr.
            </p>
          </div>
        </section>
        <section className={styles.section}>
          <Image src="/images/sig.jpg" alt="SIG et QSIG" width={300} height={200} />
          <div>
            <h2>Importance des SIG et QSIG</h2>
            <p>
              Les Systèmes d'Information Géographique (SIG) et les outils comme QSIG permettent une gestion optimisée des déchets. Ils facilitent la planification des routes, le suivi en temps réel des collectes et l'analyse des données pour améliorer l'efficacité et réduire les coûts.
            </p>
          </div>
        </section>
      </main>
      <footer className={styles.footer} id="contact">
        <p>&copy; 2024 Gestion des Déchets. Tous droits réservés.</p>
        <p>Contact: <a href="mailto:contact@gestiondechets.com">contactez_nous@gestiondechets.com</a></p>
      </footer>
    </div>
  );
}
