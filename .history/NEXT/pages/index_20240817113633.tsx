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
      {/* Barre de menu */}
      <header className={styles.header}>
        <div className={styles.logoContainer}>
          <img src="/images/logo.jpg" alt="Logo" width={40} height={40} />
          <h1>Cartographier pour mieux collecter</h1>
        </div>
        <nav className={styles.nav}>
          <ul>
            <li><a href="#">Accueil</a></li>
            <li><a href="#about">À propos</a></li>
            <li><a href="#se-connecter">Se connecter</a></li>
          </ul>
        </nav>
      </header>

      {/* Vidéo */}
      <main className={styles.mainContent}>
        <video ref={videoRef} autoPlay loop className={styles.backgroundVideo} muted={isMuted}>
          <source src="/videos/background.mp4" type="video/mp4" />
          Votre navigateur ne prend pas en charge la balise vidéo.
        </video>
        <div className={styles.overlay}>
          <h1>La cartographie avec les SIG pour une collecte des déchets plus verte et efficace</h1>
          <button className={styles.collectButton} onClick={navigateToCollect}>
            Chemin de collecte
          </button>
        </div>
        <button className={styles.muteButton} onClick={toggleMute}>
          <img 
            src={isMuted ? "/images/muet.png" : "/images/son.png"} 
            alt={isMuted ? "Activer le son" : "Couper le son"} 
          />
        </button>
      </main>

      {/* Section de contenu sous la vidéo */}
      <section className={styles.sectionContent}>
        <h2 className="boldText">Pourquoi choisir notre service ?</h2>
        <p>Nous offrons une solution complète de gestion des déchets, en optimisant les routes et en réduisant l'empreinte carbone.</p>
        <div>
          <div>
            <h3>Efficacité</h3>
            <p className="boldText">Optimisation des routes pour réduire le temps et les coûts de collecte.</p>
          </div>
          <div>
            <h3>Écologie</h3>
            <p className="boldText">Réduction de l'empreinte écologique grâce à une gestion intelligente des itinéraires.</p>
          </div>
          <div>
            <h3>Innovation</h3>
            <p className="boldText">Utilisation de la cartographie SIG pour une planification efficace.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footerContent}>
        <p>Contactez-nous pour plus d'informations</p>
        <p>&copy; {new Date().getFullYear()} Mon Application</p>
      </footer>
    </div>
  );
}
