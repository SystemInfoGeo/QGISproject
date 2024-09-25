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
    <div className={styles.mainContent}>
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
          Your browser does not support the video tag.
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
    </div>
  );
}
