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
          <h1>cartographier pour mieux collecter</h1>
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
          <p>Optimisez</p> 
          la collecte des déchets grâce à la puissance de la cartographie.
        </div>
        <button className={styles.backgroundButton} onClick={navigateToCollect}>chemin de collecte</button>
      </section>
      <main className={styles.main}>
        <section className={styles.section}>
          <div>
            <h2>Impact des Déchets Non Ramassés</h2>
            <p>
              Les déchets ont un impact négatif majeur sur l'environnement, les villes et la santé humaine. Dans les villes, ils causent de la pollution visuelle et des mauvaises odeurs, rendant les espaces publics désagréables. Les déchets attirent aussi des animaux nuisibles, comme les rats et les insectes, qui peuvent transmettre des maladies aux humains. Quand les déchets s'accumulent dans les rues, ils finissent souvent par polluer les rivières et les océans, nuisant à la vie marine et à l'écosystème. De plus, les plastiques mettent très longtemps à se décomposer et libèrent des substances toxiques dans le sol et l'eau, contaminant ainsi les sources d'eau potable. Ces polluants peuvent ensuite entrer dans la chaîne alimentaire et affecter notre santé. Il est donc essentiel d'avoir un bon système de collecte des déchets pour garder nos villes propres, protéger l'environnement et assurer notre santé.
            </p>
          </div>
          <Image src="/images/impact.jpeg" alt="Impact des déchets" width={300} height={200} />
        </section>
        <section className={styles.section}>
          <div>
            <h2>Importance des SIG et QSIG</h2>
            <p>
              Les Systèmes d'Information Géographique (SIG) et les outils comme QSIG permettent une gestion optimisée des déchets. Ils facilitent la planification des routes, le suivi en temps réel des collectes et l'analyse des données pour améliorer l'efficacité et réduire les coûts.
            </p>
          </div>
          <Image src="/images/sig.jpeg" alt="SIG et QSIG" width={300} height={200} />
        </section>
      </main>
      <footer className={styles.footer} id="contact">
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h3>Contact</h3>
            <p>800-442-6454 | 626-961-6291</p>
            <p>Lundi - Vendredi: 8:00 - 17:00</p>
            <p>Samedi: 8:00 - 13:00</p>
            <p><a href="mailto:contact@gestiondechets.com">contact@gestiondechets.com</a></p>
          </div>
          <div className={styles.footerSection}>
            <h3>Liens Rapides</h3>
            <ul>
              <li><a href="#">Accueil</a></li>
              <li><a href="#about">À propos</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
          <div className={styles.footerSection}>
            <h3>Suivez-nous</h3>
            <p>Restez connecté via nos réseaux sociaux.</p>
          </div>
        </div>
        <p>&copy; 2024 Gestion des Déchets. Tous droits réservés.</p>
      </footer>
    </div>
  );
}
