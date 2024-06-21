/* page.tsx */

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
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
            <li><Link href="#accueil"><a>Accueil</a></Link></li>
            <li><Link href="#about"><a>À propos</a></Link></li>
            <li><Link href="#services"><a>Services</a></Link></li>
            <li><Link href="#contact"><a>Contact</a></Link></li>
          </ul>
        </nav>
      </header>
      <main className={styles.main}>
        <section id="accueil" className={styles.hero}>
          <h2>Optimisez la collecte et la gestion des déchets</h2>
          <p>Suivez en temps réel, analysez les statistiques et recevez des notifications instantanées.</p>
          <button className={styles.button} onClick={navigateToLogin}>S'identifier</button>
        </section>
        <section id="about" className={styles.section}>
          <h2>À propos de nous</h2>
          <p>Nous fournissons des solutions complètes pour la gestion des déchets et le recyclage.</p>
          <Image src="/images/img2.jpg" alt="Camion de collecte" width={600} height={400} />
        </section>
        <section id="services" className={styles.section}>
          <h2>Nos Services</h2>
          <ul>
            <li>Suivi en Temps Réel</li>
            <li>Statistiques de Collecte</li>
            <li>Notifications en Temps Réel</li>
            <li>Solutions Personnalisées</li>
          </ul>
          <Image src="/images/img1.jpg" alt="Services de gestion des déchets" width={600} height={400} />
        </section>
      </main>
      <footer id="contact" className={styles.footer}>
        <p>&copy; 2024 Gestion des Déchets. Tous droits réservés.</p>
        <p>Contact: <a href="mailto:contact@gestiondechets.com">contact@gestiondechets.com</a></p>
      </footer>
    </div>
  );
}
