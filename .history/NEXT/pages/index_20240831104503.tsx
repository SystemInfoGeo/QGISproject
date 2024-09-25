'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Home() {
  const router = useRouter();
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <div>
      {/* Barre de navigation */}
      <nav className="navbar navbar-expand-lg navbar-light bg-success shadow-sm">
        <div className="container-fluid">
          <a className="navbar-brand d-flex align-items-center" href="/">
            <img src="/images/logo.jpg" alt="Logo" width={40} height={40} className="me-2" />
            Clean Zone
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className={`nav-link ${router.pathname === '/' ? 'active' : ''}`} href="/">Accueil</a>
              </li>
              <li className="nav-item">
                <a className={`nav-link ${router.pathname === '#about' ? 'active' : ''}`} href="#about">À propos</a>
              </li>
              <li className="nav-item">
                <a className={`nav-link ${router.pathname === '/CARTE' ? 'active' : ''}`} href="/CARTE">Carte</a>
              </li>
              <li className="nav-item">
                <a className={`nav-link ${router.pathname === '/contact' ? 'active' : ''}`} href="/contact">Contact</a>
              </li>
              <li className="nav-item">
                <a className={`nav-link ${router.pathname === '/signup' ? 'active' : ''}`} href="/signup">S'inscrire</a>
              </li>
              <li className="nav-item">
                <a className={`nav-link ${router.pathname === '/login' ? 'active' : ''}`} href="/login">Se connecter</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Vidéo de fond */}
      <header className="position-relative">
        <video ref={videoRef} autoPlay loop muted={isMuted} className="w-100 h-100" style={{ objectFit: 'cover' }}>
          <source src="/videos/background.mp4" type="video/mp4" />
          Votre navigateur ne prend pas en charge la vidéo.
        </video>
        <div className="position-absolute top-50 start-50 translate-middle text-center text-white" style={{ zIndex: 2, background: 'rgba(0, 0, 0, 0.5)', padding: '2rem', borderRadius: '8px' }}>
          <h1 className="display-4">La cartographie avec les SIG pour une collecte des déchets plus verte et efficace</h1>
        </div>
        <button className="btn btn-light position-absolute top-0 end-0 m-3" onClick={toggleMute} style={{ zIndex: 3 }}>
          <img 
            src={isMuted ? "/images/muet.png" : "/images/son.png"} 
            alt={isMuted ? "Activer le son" : "Couper le son"} 
            style={{ width: '24px', height: '24px' }}
          />
        </button>
      </header> 

      {/* Section de contenu sous la vidéo */}
      <section className="text-center py-5 bg-light">
        <div className="container">
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
        </div>
      </section>

      {/* Pied de page */}
      <footer className="bg-dark text-white text-center py-4">
        <p>Contactez-nous pour plus d'informations</p>
        <p>&copy; {new Date().getFullYear()} Clean Zone</p>
      </footer>

      <style jsx>{`
        /* Style personnalisé */
        .navbar {
          background-color: #76a688;
        }

        .nav-link {
          color: white !important;
        }

        .nav-link:hover {
          background-color: rgba(255, 255, 255, 0.2);
          border-radius: 5px;
        }

        .nav-link.active {
          font-weight: bold;
          background-color: rgba(255, 255, 255, 0.3);
          border-radius: 5px;
        }

        /* Vidéo de fond */
        header {
          height: 80vh;
          position: relative;
        }

        video {
          object-fit: cover;
          width: 100%;
          height: 100%;
        }

        .position-absolute img {
          width: 24px;
          height: 24px;
        }

        .sectionContent {
          background-color: #f4f4f4;
          padding: 2rem;
        }

        .footerContent {
          background-color: #333;
          padding: 2rem;
          color: white;
          text-align: center;
          margin-top: auto;
        }
      `}</style>
    </div>
  );
}
