'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Home() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <div className="container-fluid p-0">
      {/* Barre de menu */}
      <header className="navbar navbar-expand-lg navbar-dark bg-success shadow-sm">
        <div className="container-fluid">
          <a className="navbar-brand d-flex align-items-center" href="/">
            <img src="/images/logo.jpg" alt="Logo" width={40} height={40} className="me-3" />
            <h1 className="h4 m-0">Clean Zone</h1>
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link" href="/">Accueil</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#about">À propos</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/carte">Carte</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/contact">Contact</a> {/* Bouton Contact simple */}
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/signup">S'inscrire</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/login">Se connecter</a>
              </li>
            </ul>
          </div>
        </div>
      </header>

      {/* Vidéo d'arrière-plan */}
      <main className="position-relative d-flex flex-column align-items-center justify-content-center vh-100 bg-dark text-white">
        <video ref={videoRef} autoPlay loop muted={isMuted} className="w-100 h-100 position-absolute top-0 start-0" style={{ objectFit: 'cover', zIndex: 1 }}>
          <source src="/videos/background.mp4" type="video/mp4" />
          Votre navigateur ne prend pas en charge la balise vidéo.
        </video>
        <div className="position-relative text-center" style={{ zIndex: 2, background: 'rgba(0, 0, 0, 0.5)', padding: '1rem', borderRadius: '8px' }}>
          <h1 className="display-4">La cartographie avec les SIG pour une collecte des déchets plus verte et efficace</h1>
        </div>
        <button className="btn btn-light position-absolute top-0 end-0 m-3" onClick={toggleMute} style={{ zIndex: 3 }}>
          <img 
            src={isMuted ? "/images/muet.png" : "/images/son.png"} 
            alt={isMuted ? "Activer le son" : "Couper le son"} 
            style={{ width: '24px', height: '24px' }}
          />
        </button>
      </main>

      {/* Section de contenu sous la vidéo */}
      <section className="text-center p-5 bg-light">
        <h2 className="mb-4">Pourquoi choisir notre service ?</h2>
        <p className="mb-5">Nous offrons une solution complète de gestion des déchets, en optimisant les routes et en réduisant l'empreinte carbone.</p>
        <div className="row">
          <div className="col-md-4 mb-4">
            <h3>Efficacité</h3>
            <p>Optimisation des routes pour réduire le temps et les coûts de collecte.</p>
          </div>
          <div className="col-md-4 mb-4">
            <h3>Écologie</h3>
            <p>Réduction de l'empreinte écologique grâce à une gestion intelligente des itinéraires.</p>
          </div>
          <div className="col-md-4 mb-4">
            <h3>Innovation</h3>
            <p>Utilisation de la cartographie SIG pour une planification efficace.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-3">
        <p>Contactez-nous pour plus d'informations</p>
        <p>&copy; {new Date().getFullYear()} Clean Zone</p>
      </footer>
    </div>
  );
}
