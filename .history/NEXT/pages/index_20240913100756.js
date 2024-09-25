import { useState, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../components/Navbar';

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
      <header className="position-relative" style={{ height: '75vh', overflow: 'hidden' }}>
        <video ref={videoRef} autoPlay loop muted={isMuted} className="w-100 h-100" style={{ objectFit: 'cover' }}>
          <source src="/videos/background.mp4" type="video/mp4" />
          Votre navigateur ne prend pas en charge la vidéo.
        </video>

        {/* Triangle avec le texte */}
        <div className="triangle-container">
          <div className="triangle"></div>
          <div className="triangle-text">
            <h1 className="display-4" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', lineHeight: '1.2', margin: '0' }}>
              La cartographie avec les SIG<br/>
              pour une collecte des déchets <br/>
              plus verte et efficace
            </h1>
          </div>
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
      <section className="text-center p-5 bg-light">
        <h2 className="mb-4" style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>Pourquoi choisir notre service ?</h2>
        <p className="mb-5" style={{ fontSize: '1.25rem', maxWidth: '800px', margin: '0 auto', color: '#555' }}>
          Nous offrons une solution complète de gestion des déchets, en optimisant les routes, en réduisant l'empreinte carbone, et en vous aidant à atteindre vos objectifs de durabilité.
        </p>
        <div className="container">
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="icon mb-3">
                <img src="/images/efficacite.png" alt="Efficacité" 
                     style={{ width: '120px', height: '120px', transition: 'transform 0.3s, box-shadow 0.3s' }} />
              </div>
              <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'black' }}>Efficacité</h3>
              <p style={{ fontSize: '1.2rem', color: '#555' }}>
                Optimisation des routes pour réduire le temps et les coûts de collecte. Nos outils avancés de gestion des itinéraires permettent de maximiser l'efficacité opérationnelle, tout en minimisant les trajets inutiles.
              </p>
            </div>
            <div className="col-md-4 mb-4">
              <div className="icon mb-3">
                <img src="/images/ecologie.png" alt="Écologie" 
                     style={{ width: '120px', height: '120px', transition: 'transform 0.3s, box-shadow 0.3s' }} />
              </div>
              <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'black' }}>Écologie</h3>
              <p style={{ fontSize: '1.2rem', color: '#555' }}>
                Réduction de l'empreinte écologique grâce à une gestion intelligente des itinéraires. Nous vous aidons à réduire vos émissions de CO2, contribuant ainsi à un avenir plus vert.
              </p>
            </div>
            <div className="col-md-4 mb-4">
              <div className="icon mb-3">
                <img src="/images/innovation.png" alt="Innovation" 
                     style={{ width: '120px', height: '120px', transition: 'transform 0.3s, box-shadow 0.3s' }} />
              </div>
              <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'black' }}>Innovation</h3>
              <p style={{ fontSize: '1.2rem', color: '#555' }}>
                Utilisation de la cartographie SIG pour une planification efficace. Nos solutions innovantes vous donnent un avantage concurrentiel en intégrant les dernières technologies de géolocalisation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-3">
        <p style={{ fontSize: '1.2rem' }}>Contactez-nous pour plus d'informations</p>
        <p style={{ fontSize: '1.2rem' }}>&copy; {new Date().getFullYear()} Clean Zone</p>
      </footer>

      {/* Styles inline supplémentaires */}
      <style jsx>{`
        .icon img {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .icon img:hover {
          transform: scale(1.2);
          box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.2);
        }
        .triangle-container {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          display: flex;
          align-items: center;
          z-index: 2;
        }
        .triangle {
          width: 0;
          height: 0;
          border-left: 300px solid rgba(0, 0, 0, 0.5);  /* Triangle avec opacité modifiée */
          border-top: 400px solid transparent;
          border-bottom: 400px solid transparent;
        }
        .triangle-text {
          position: absolute;
          left: 15px;
          top: 120px;
          z-index: 3;
          line-height: 1.1;
        }
        h2 {
          color: #2E3B4E;
        }
      `}</style>
    </div>
  );
}
