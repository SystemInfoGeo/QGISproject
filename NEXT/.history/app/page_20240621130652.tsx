'use client';

import { useRouter } from 'next/navigation';
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
          <Image src="/images/logo.png" alt="Logo" width={50} height={50} />
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
          <h2>Solutions de gestion des déchets pour votre maison, entreprise ou ville</h2>
          <p>Améliorez la qualité de vie grâce à une gestion efficace des déchets.</p>
          <button className={styles.button} onClick={navigateToLogin}>S'identifier</button>
        </section>
        <section className={styles.section} id="about">
          <h2>À propos de nous</h2>
          <p>Nous fournissons des solutions complètes pour la gestion des déchets et le recyclage.</p>
          <Image src="/images/truck.jpg" alt="Camion de collecte" width={600} height={400} />
        </section>
        <section className={styles.section} id="services">
          <h2>Nos Services</h2>
          <ul>
            <li>Suivi en Temps Réel</li>
            <li>Statistiques de Collecte</li>
            <li>Notifications en Temps Réel</li>
            <li>Solutions Personnalisées</li>
          </ul>
          <Image src="/images/services.jpg" alt="Services de gestion des déchets" width={600} height={400} />
        </section>
        <section className={styles.section} id="impact">
          <h2>Impact des Déchets</h2>
          <blockquote>
            "La gestion des déchets est cruciale pour protéger notre environnement et notre santé."
          </blockquote>
          <p>Les déchets non gérés correctement peuvent entraîner des conséquences graves pour l'environnement, notamment la pollution de l'air, de l'eau et des sols. La collecte et le recyclage efficaces des déchets réduisent l'empreinte carbone, préservent les ressources naturelles et protègent la biodiversité.</p>
          <Image src="/images/impact.jpg" alt="Impact des déchets" width={600} height={400} />
        </section>
      </main>
      <footer className={styles.footer} id="contact">
        <p>&copy; 2024 Gestion des Déchets. Tous droits réservés.</p>
        <p>Contact: <a href="mailto:contact@gestiondechets.com">contact@gestiondechets.com</a></p>
      </footer>
    </div>
  );
}
