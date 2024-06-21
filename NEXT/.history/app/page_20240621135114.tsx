// pages/index.tsx

import Head from 'next/head';
import Link from 'next/link';
import styles from './page.module.css';
import Layout from './layout';

const HomePage = () => {
  return (
    <Layout>
      <Head>
        <title>Page d'accueil - Système d'Informations Géographiques pour la Collecte des Déchets</title>
      </Head>

      {/* En-tête */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <img src="/images/logo.jpg" alt="Logo" />
        </div>
        <div className={styles.slogan}>
          Votre slogan ici
        </div>
        <nav className={styles.navbar}>
          <ul>
            <li><Link href="/"><a>Accueil</a></Link></li>
            <li><Link href="/about"><a>À propos</a></Link></li>
            <li><Link href="/contact"><a>Contact</a></Link></li>
            <li><Link href="/login"><a>Se connecter</a></Link></li>
          </ul>
        </nav>
      </header>

      {/* Photo large */}
      <div className={styles.heroImage}>
        <img src="/images/background.jpg" alt="Photo représentative" />
      </div>

      {/* Sections sophistiquées */}
      <section className={styles.section}>
        <h2>L'impact de ne pas ramasser les déchets</h2>
        <p>Ici vous pouvez parler de l'impact sur la nature et les humains.</p>
      </section>

      <section className={styles.section}>
        <h2>Avantages de la collecte des déchets</h2>
        <p>Expliquez les avantages de votre système de collecte des déchets.</p>
      </section>

      {/* Ajoutez d'autres sections sophistiquées selon vos besoins */}

    </Layout>
  );
};

export default HomePage;
