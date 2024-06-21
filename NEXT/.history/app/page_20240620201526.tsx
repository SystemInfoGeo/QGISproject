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
          <Image src="/images/logo.jpg" alt="Logo" width={50} height={50} />
          <h1>Gestion des Déchets</h1>
        </div>
        <p>Optimisez la collecte et la gestion des déchets dans votre ville.</p>
        <button className={styles.button} onClick={navigateToLogin}>S'identifier</button>
      </header>
      <main className={styles.main}>
        <section className={styles.section}>
          <h2>Suivi en Temps Réel</h2>
          <p>Suivez le parcours des camions de collecte et optimisez les itinéraires.</p>
          <Image src="/images/img2.jpg" alt="Camion de collecte" width={600} height={400} />
        </section>
        <section className={styles.section}>
          <h2>Statistiques</h2>
          <p>Consultez les statistiques de collecte pour améliorer l'efficacité.</p>
          <Image src="/images/img1.jpg" alt="Statistiques de collecte" width={600} height={400} />
        </section>
        <section className={styles.section}>
          <h2>Notifications</h2>
          <p>Recevez des notifications en temps réel sur l'état des collectes.</p>
          <Image src="/images/img3.jpg" alt="Notifications" width={600} height={400} />
        </section>
      </main>
      <footer className={styles.footer}>
        <p>&copy; 2024 Gestion des Déchets. Tous droits réservés.</p>
        <p>Contact: <a href="mailto:contactnous@gestiondechets.com">contact@gestiondechets.com</a></p>
      </footer>
    </div>
  );
}
