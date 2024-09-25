import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Accueil() {
  const router = useRouter();
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  // Animation à l'apparition des sections
  useEffect(() => {
    const sections = document.querySelectorAll('.fade-in');
    const options = {
      threshold: 0.3,
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, options);

    sections.forEach(section => {
      observer.observe(section);
    });
  }, []);

  return (
    <div>
      {/* Barre de navigation */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
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
                <a className="nav-link" href="/">Accueil</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#about">À propos</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/CARTE">Carte</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/contact">Contact</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/signup">S'inscrire</a>
              </li>
              <li className="nav-item">
                <a className="btn btn-outline-primary" href="/login">Se connecter</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Titre à gauche et vidéo */}
      <div className="d-flex align-items-center" style={{ height: '75vh' }}>
        <div className="title-container text-white fade-in" style={{ zIndex: 2, padding: '2rem', background: 'rgba(0, 0, 0, 0.6)', borderRadius: '8px', flex: '0 0 50%', maxWidth: '50%' }}>
          <h1 className="display-4">La cartographie avec les SIG pour une collecte des déchets plus verte et efficace</h1>
        </div>
        <div className="video-container" style={{ flex: '1', position: 'relative', overflow: 'hidden' }}>
          <video ref={videoRef} autoPlay loop muted={isMuted} className="w-100 h-100" style={{ objectFit: 'cover' }}>
            <source src="/videos/background.mp4" type="video/mp4" />
            Votre navigateur ne prend pas en charge la vidéo.
          </video>
        </div>
        <button className="btn btn-light position-absolute top-0 end-0 m-3" onClick={toggleMute} style={{ zIndex: 3 }}>
          <img 
            src={isMuted ? "/images/muet.png" : "/images/son.png"} 
            alt={isMuted ? "Activer le son" : "Couper le son"} 
            style={{ width: '24px', height: '24px' }}
          />
        </button>
      </div>

      {/* Section de contenu sous la vidéo */}
      <section className="text-center p-5 bg-light fade-in">
        <h2 className="mb-4" style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>Pourquoi choisir notre service ?</h2>
        <p className="mb-5" style={{ fontSize: '1.25rem', maxWidth: '800px', margin: '0 auto' }}>Nous offrons une solution complète de gestion des déchets, en optimisant les routes et en réduisant l'empreinte carbone.</p>
        <div className="row">
          <div className="col-md-4 mb-4">
            <div className="icon mb-3 text-center">
              <img src="/images/efficacite.png" alt="Efficacité" style={{ width: '150px', height: '150px' }} />
            </div>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>Efficacité</h3>
            <p style={{ fontSize: '1.1rem' }}>Optimisation des routes pour réduire le temps et les coûts de collecte.</p>
          </div>
          <div className="col-md-4 mb-4">
            <div className="icon mb-3 text-center">
              <img src="/images/ecologie.png" alt="Écologie" style={{ width: '150px', height: '150px' }} />
            </div>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>Écologie</h3>
            <p style={{ fontSize: '1.1rem' }}>Réduction de l'empreinte écologique grâce à une gestion intelligente des itinéraires.</p>
          </div>
          <div className="col-md-4 mb-4">
            <div className="icon mb-3 text-center">
              <img src="/images/innovation.png" alt="Innovation" style={{ width: '150px', height: '150px' }} />
            </div>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>Innovation</h3>
            <p style={{ fontSize: '1.1rem' }}>Utilisation de la cartographie SIG pour une planification efficace.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-3">
        <p>Contactez-nous pour plus d'informations</p>
        <p>&copy; {new Date().getFullYear()} Clean Zone</p>
      </footer>

      {/* Styles inline supplémentaires */}
      <style jsx>{`
        .fade-in {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        .visible {
          opacity: 1;
          transform: translateY(0);
        }
        .icon img {
          transition: transform 0.3s ease;
        }
        .icon img:hover {
          transform: scale(1.1);
        }
        .video-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5); /* Filtre sombre pour améliorer la lisibilité */
        }
      `}</style>
    </div>
  );
}
