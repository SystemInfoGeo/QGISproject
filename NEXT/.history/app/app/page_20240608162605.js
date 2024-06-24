import React from 'react';
import './page.module.css';
import L from 'leaflet';
if (typeof window !== 'undefined') {
  require('leaflet/dist/leaflet.css');
}



function Header() {
  return (
    <header>
      <h1>SIG pour la Gestion des Déchets - Tizi Ouzou</h1>
      <p>Optimisez la gestion des déchets avec la cartographie et l'analyse spatiale.</p>
    </header>
  );
}

function Description() {
  return (
    <section id="description">
      <h2>À propos de notre application</h2>
      <p>
        Notre système géographique de gestion des déchets à Tizi Ouzou est conçu pour améliorer l'efficacité et l'efficience de la gestion des déchets dans la région. Grâce à l'utilisation de la cartographie et de l'analyse spatiale, nous prenons des décisions éclairées pour optimiser la collecte et le traitement des déchets.
      </p>
    </section>
  );
}

function Features() {
  return (
    <section id="features">
      <h2>Fonctionnalités</h2>
      <ul>
        <li>Cartographie des points de collecte des déchets</li>
        <li>Analyse spatiale pour optimiser les itinéraires de collecte</li>
        <li>Suivi en temps réel des camions de collecte</li>
        <li>Rapports et statistiques sur la gestion des déchets</li>
      </ul>
    </section>
  );
}

class Map extends React.Component {
  componentDidMount() {
    this.map = L.map('map-container').setView([36.7169, 4.0497], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
  }

  render() {
    return (
      <section id="map">
        <h2>Carte Interactive</h2>
        <div id="map-container" style={{ height: '500px' }}></div>
      </section>
    );
  }
}

function Footer() {
  return (
    <footer>
      <h2>Contact</h2>
      <p>
        Pour plus d'informations ou pour signaler des problèmes, contactez-nous à{' '}
        <a href="mailto:contact@sigdechets-tiziouzou.com">contact@sigdechets-tiziouzou.com</a>.
      </p>
    </footer>
  );
}

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <Description />
        <Features />
        <Map />
      </main>
      <Footer />
    </div>
  );
}

export default App;