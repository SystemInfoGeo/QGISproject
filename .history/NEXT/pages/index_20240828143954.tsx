'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../styles/accueil.module.css';

export default function Home() {
  // Déclare un hook pour utiliser la navigation de Next.js
  const router = useRouter();
  // Référence pour contrôler l'élément vidéo
  const videoRef = useRef<HTMLVideoElement>(null);
  // État pour gérer si la vidéo est en mode muet ou non
  const [isMuted, setIsMuted] = useState(true);

  // Fonction pour basculer l'état muet/non muet de la vidéo
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
          <h1>Clean Zone</h1>
        </div>
        <nav className={styles.nav}>
          <ul>
            <li><a href="/">Accueil</a></li>
            <li><a href="#about">À propos</a></li>
            <li><a href="/carte">Carte</a></li> {/* Lien vers la carte */}
            <li className={styles.dropdown}>
              <button className={styles.dropdownButton}>Contact</button>
              <div className={styles.dropdownContent}>
                <a href="https://www.facebook.com/YourPage" target="_blank">Facebook</a>
                <a href="mailto:yourmail@example.com">Gmail</a>
                <a href="tel:+213668541364">Téléphone : 0668 54 13 64</a>
              </div>
            </li>
            <li><a href="/signup">S'inscrire</a></li> {/* Lien vers la page d'inscription */}
            <li><a href="/login">Se connecter</a></li> {/* Lien vers la page de connexion */}
          </ul>
        </nav>
      </header>

      {/* Vidéo d'arrière-plan */}
      <main className={styles.mainContent}>
        <video ref={videoRef} autoPlay loop className={styles.backgroundVideo} muted={isMuted}>
          <source src="/videos/background.mp4" type="video/mp4" />
          Votre navigateur ne prend pas en charge la balise vidéo.
        </video>
        <div className={styles.overlay}>
          <h1>La cartographie avec les SIG pour une collecte des déchets plus verte et efficace</h1>
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
        <p className="boldText">Nous offrons une solution complète de gestion des déchets, en optimisant les routes et en réduisant l'empreinte carbone.</p>
        <div>
          <div>
            <h3 className="boldText">Efficacité</h3>
            <p className="boldText">Optimisation des routes pour réduire le temps et les coûts de collecte.</p>
          </div>
          <div>
            <h3 className="boldText">Écologie</h3>
            <p className="boldText">Réduction de l'empreinte écologique grâce à une gestion intelligente des itinéraires.</p>
          </div>
          <div>
            <h3 className="boldText">Innovation</h3>
            <p className="boldText">Utilisation de la cartographie SIG pour une planification efficace.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footerContent}>
        <p>Contactez-nous pour plus d'informations</p>
        <p>&copy; {new Date().getFullYear()} Clean Zone</p>
      </footer>
    </div>
  );
}
