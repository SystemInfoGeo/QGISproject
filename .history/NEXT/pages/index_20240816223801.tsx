'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../styles/accueil.module.css';

export default function Home() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  const navigateToCollect = () => {
    router.push('/collect');
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logoContainer}>
          <img src="/images/logo.jpg" alt="Logo" width={40} height={40} />
          <h1>Cartographier pour mieux collecter</h1>
        </div>
        <nav className={styles.nav}>
          <ul>
            <li><a href="#">Accueil</a></li>
            <li><a href="#about">À propos</a></li>
            <li><a href="#se connecter">Se connecter</a></li>
          </ul>
        </nav>
      </header>
      
      <main className={styles.mainContent}>
        <video ref={videoRef} autoPlay loop className={styles.backgroundVideo} muted={isMuted}>
          <source src="/videos/background.mp4" type="video/mp4" />
          Votre navigateur ne prend pas en charge la balise vidéo.
        </video>
        <button className={styles.muteButton} onClick={toggleMute}>
          <img 
            src={isMuted ? "/images/muet.png" : "/images/son.png"} 
            alt={isMuted ? "Activer le son" : "Couper le son"} 
            className={styles.muteIcon} 
          />
        </button>
        <div className={styles.overlay}>
          <div className={styles.content}>
            <h1>La cartographie avec les SIG pour une collecte des déchets plus verte et efficace</h1>
            <button className={styles.collectButton} onClick={navigateToCollect}>Chemin de collecte</button>
          </div>
        </div>
      </main>

      {/* Nouveau contenu sous la vidéo */}
      <section className={styles.belowVideoContent}>
        <h2>Pourquoi choisir notre solution ?</h2>
        <p>
          Notre système de collecte optimisé vous aide à réduire les coûts, minimiser les distances
          parcourues et améliorer l'efficacité de vos opérations de gestion des déchets.
        </p>
        <p>
          En utilisant des technologies avancées de cartographie, nous vous permettons d'assurer
          une collecte plus rapide, plus verte et plus rentable.
        </p>
        <button className={styles.ctaButton} onClick={navigateToCollect}>Découvrir plus</button>
      </section>
    </div>
  );
}
