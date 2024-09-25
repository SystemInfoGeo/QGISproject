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
        <div className={styles.socialIcons}>
          <a href="#"><img src="/images/whatsapp.png" alt="whatsapp" /></a>
          <a href="#"><img src="/images/gmail.png" alt="gmail" /></a>
          <a href="#"><img src="/images/facebook.png" alt="facebook" /></a>
        </div>
      </main>

      <footer className={styles.footerContent}>
        <h2>Pourquoi choisir notre service ?</h2>
        <p>Nous offrons une solution complète de gestion des déchets, en optimisant les routes et en réduisant l'empreinte carbone.</p>

        <div className={styles.features}>
          <div className={styles.featureItem}>
            <h3>Efficacité</h3>
            <p>Optimisation des routes pour réduire le temps et les coûts de collecte.</p>
          </div>
          <div className={styles.featureItem}>
            <h3>Écologie</h3>
            <p>Réduction de l'empreinte écologique grâce à une gestion intelligente des itinéraires.</p>
          </div>
          <div className={styles.featureItem}>
            <h3>Innovation</h3>
            <p>Utilisation de la cartographie SIG pour une planification efficace.</p>
          </div>
        </div>

        <p>&copy; {new Date().getFullYear()} Mon Application</p>
      </footer>
    </div>
  );
}

