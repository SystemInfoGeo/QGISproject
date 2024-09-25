import { useState, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../components/Navbar';
import '../styles/Accueil.css';  // Importation du fichier CSS

export default function Accueil() {
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
      <Navbar />  {/* Utilisation du composant Navbar */}
      
      {/* Vidéo de fond */}
      <header className="position-relative video-header">
        <video ref={videoRef} autoPlay loop muted={isMuted} className="w-100 h-100 video-background">
          <source src="/videos/background.mp4" type="video/mp4" />
          Votre navigateur ne prend pas en charge la vidéo.
        </video>

        {/* Triangle avec le texte */}
        <div className="triangle-container">
          <div className="triangle"></div>
          <div className="triangle-text">
            <h1 className="triangle-title">
              La cartographie<br />
              avec les SIG<br />
              pour une collecte des déchets<br />
              plus verte et efficace
            </h1>
          </div>
        </div>

        <button className="btn btn-light position-absolute top-0 end-0 m-3" onClick={toggleMute} style={{ zIndex: 3 }}>
          <img 
            src={isMuted ? "/images/muet.png" : "/images/son.png"} 
            alt={isMuted ? "Activer le son" : "Couper le son"} 
            className="mute-button"
          />
        </button>
      </header>

      {/* Section de contenu sous la vidéo */}
      <section className="text-center p-5 bg-light">
        <h2 className="section-title">Pourquoi choisir notre service ?</h2>
        <p className="section-text">
          Nous offrons une solution complète de gestion des déchets, en optimisant les routes, en réduisant l'empreinte carbone, et en vous aidant à atteindre vos objectifs de durabilité.
        </p>
        <div className="container">
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="icon mb-3">
                <img src="/images/efficacite.png" alt="Efficacité" className="icon-img" />
              </div>
              <h3 className="feature-title">Efficacité</h3>
              <p className="feature-text">
                Optimisation des routes pour réduire le temps et les coûts de collecte. Nos outils avancés de gestion des itinéraires permettent de maximiser l'efficacité opérationnelle, tout en minimisant les trajets inutiles.
              </p>
            </div>
            <div className="col-md-4 mb-4">
              <div className="icon mb-3">
                <img src="/images/ecologie.png" alt="Écologie" className="icon-img" />
              </div>
              <h3 className="feature-title">Écologie</h3>
              <p className="feature-text">
                Réduction de l'empreinte écologique grâce à une gestion intelligente des itinéraires. Nous vous aidons à réduire vos émissions de CO2, contribuant ainsi à un avenir plus vert.
              </p>
            </div>
            <div className="col-md-4 mb-4">
              <div className="icon mb-3">
                <img src="/images/innovation.png" alt="Innovation" className="icon-img" />
              </div>
              <h3 className="feature-title">Innovation</h3>
              <p className="feature-text">
                Utilisation de la cartographie SIG pour une planification efficace. Nos solutions innovantes vous donnent un avantage concurrentiel en intégrant les dernières technologies de géolocalisation.
              </p>
            </div>
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
