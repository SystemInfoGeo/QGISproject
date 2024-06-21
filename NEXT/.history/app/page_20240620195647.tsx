'use client';

import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function Home() {
  const router = useRouter();

  const navigateToLogin = () => {
    router.push('/login');
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Gestion des Déchets</h1>
        <p>Optimisez la collecte et la gestion des déchets dans votre ville.</p>
        <button className={styles.button} onClick={navigateToLogin}>S'identifier</button>
      </header>
      <main className={styles.main}>
        <section className={styles.section}>
          <h2>Suivi en Temps Réel</h2>
          <p>Suivez le parcours des camions de collecte et optimisez les itinéraires.</p>
        </section>
        <section className={styles.section}>
          <h2>Statistiques</h2>
          <p>Consultez les statistiques de collecte pour améliorer l'efficacité.</p>
        </section>
        <section className={styles.section}>
          <h2>Notifications</h2>
          <p>Recevez des notifications en temps réel sur l'état des collectes.</p>
        </section>
      </main>
    </div>
  );
}
