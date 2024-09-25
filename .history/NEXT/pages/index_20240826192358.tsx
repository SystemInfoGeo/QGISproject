'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '../hooks/useAuth'; 
import styles from '../styles/accueil.module.css';

export default function Home() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const authenticated = useAuth(); // Utilise le hook pour vérifier l'authentification

  // Fonction qui gère l'accès à la page de collecte
  const handleAccessCollectClick = () => {
    if (!authenticated) {
      alert("Accès réservé aux membres autorisés du personnel de collecte. Veuillez contacter l'administrateur pour obtenir un accès.");
    } else {
      router.push('/collect'); // Redirige vers la page de collecte
    }
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
          <h1>Clean Zone</h1>
        </div>
        <nav className={styles.nav}>
          <ul>
            <li><a href="/">Accueil</a></li> {/* Changement de href pour s'assurer que cela ramène à la page d'accueil */}
            <li><a href="#about">À propos</a></li>
            <li><a href="#" onClick={handleAccessCollectClick}>Accès Collecte</a></li> {/* Bouton mis à jour ici */}
            <li className={styles.dropdown}>
             <button className={styles.dropdownButton}>Contact</button>
             <div className={styles.dropdownContent}>
               <a href="https://www.facebook.com/YourPage" target="_blank">Facebook</a>
               <a href="mailto:yourmail@example.com">Gmail</a>
               <a href="tel:+213668541364">Téléphone : 0668 54 13 64</a>  {/* Numéro de téléphone ajouté */}
             </div>
            </li>
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
          <button className={styles.collectButton} onClick={handleAccessCollectClick}>
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
