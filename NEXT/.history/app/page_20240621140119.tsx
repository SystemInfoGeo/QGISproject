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
          <img src="/path/logo.png" alt="Logo" />
        </div>
        <div className={styles.headerContent}>
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
        </div>
      </header>

      {/* Reste de votre contenu ici */}

    </Layout>
  );
};

export default HomePage;
