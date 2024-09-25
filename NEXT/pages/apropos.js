import React from 'react';
import Navbar from '../components/Navbar';
import '../styles/Apropos.css'; // Importez le fichier CSS externe

const Apropos = () => {
  return (
    <>
      {/* Barre de navigation */}
      <Navbar />

      <div className="container">
        {/* En-tête */}
        <div className="header"></div>

        {/* Section "Qui sommes-nous?" */}
        <div className="quiSommesNousSection">
          <h1 className="title">Qui sommes-nous ?</h1>
          <p className="text">
            Nous sommes des étudiantes en Master2 d'Ingénierie des Systèmes d'Information à l'Université Mouloud Mammeri de Tizi-Ouzou. Ce projet de fin d'études, réalisé dans le cadre de notre cursus, nous a été proposé par l'entreprise Codes Nova. Ensemble, nous avons travaillé sur la conception et la réalisation d'une solution innovante pour répondre aux problèmes de gestion des déchets dans la wilaya de Tizi-Ouzou, en particulier en optimisant la collecte des déchets.
          </p>
        </div>

        {/* Section "Pourquoi éliminer les déchets?" */}
        <div className="dechetsSection">
          <div className="textBlock">
            <h2 className="subTitle">Pourquoi cherche-t-on à éliminer les déchets ?</h2>
            <p className="text">
              Les déchets peuvent polluer les sols, contaminant les sources d'eau. Ils émettent des gaz nocifs dans l'air, affectant la qualité de l'air. Les déchets attirent les nuisibles, augmentant le risque de maladies. Ils contribuent au changement climatique par les émissions de gaz à effet de serre. Les déchets mal gérés dégradent les espaces naturels et urbains.
            </p>
          </div>
          <div className="polygon"></div>
        </div>

        {/* Section "Comment ce projet aide?" */}
        <div className="projetSection">
          <h2 className="subTitle">Comment ce projet va-t-il nous aider ?</h2>
          <p className="text">
            Ce projet identifiera les zones de collecte de déchets dans la région. Il permettra de déterminer quels bacs se remplissent en premier pour une collecte priorisée. Il optimisera la collecte des déchets en suivant les itinéraires les plus efficaces et rapides. Grâce à ce projet, nous aurons un environnement plus propre tout en réduisant le temps et les coûts de la collecte des déchets.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-3">
        <p className="footerText">Contactez-nous pour plus d'informations</p>
        <p className="footerText">&copy; {new Date().getFullYear()} Clean Zone</p>
      </footer>
    </>
  );
};

export default Apropos;
