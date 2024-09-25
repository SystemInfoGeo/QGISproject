import React from 'react';
import Navbar from './Navbar'; // Importez votre barre de navigation ici

const Apropos = () => {
  return (
    <>
      {/* Barre de navigation */}
      <Navbar />

      <div style={styles.container}>
        {/* En-tête */}
        <div style={styles.header}></div>

        {/* Section "Qui sommes-nous?" */}
        <div style={styles.quiSommesNousSection}>
          <h1 style={styles.title}>Qui sommes-nous ?</h1>
          <p style={styles.text}>
            Nous sommes des étudiantes en Master2 d'Ingénierie des Systèmes d'Information à l'Université Mouloud Mammeri de Tizi-Ouzou. Ce projet de fin d'études, réalisé dans le cadre de notre cursus, nous a été proposé par l'entreprise Codes Nova. Ensemble, nous avons travaillé sur la conception et la réalisation d'une solution innovante pour répondre aux problèmes de gestion des déchets dans la wilaya de Tizi-Ouzou, en particulier en optimisant la collecte des déchets.
          </p>
        </div>

        {/* Section "Pourquoi éliminer les déchets?" */}
        <div style={styles.dechetsSection}>
          <div style={styles.textBlock}>
            <h2 style={styles.subTitle}>Pourquoi cherche-t-on à éliminer les déchets ?</h2>
            <p style={styles.text}>
              Les déchets peuvent polluer les sols, contaminant les sources d'eau. Ils émettent des gaz nocifs dans l'air, affectant la qualité de l'air. Les déchets attirent les nuisibles, augmentant le risque de maladies. Ils contribuent au changement climatique par les émissions de gaz à effet de serre. Les déchets mal gérés dégradent les espaces naturels et urbains.
            </p>
          </div>
          <div style={styles.polygon}></div>
        </div>

        {/* Section "Comment ce projet aide?" */}
        <div style={styles.projetSection}>
          <h2 style={styles.subTitle}>Comment ce projet va-t-il nous aider ?</h2>
          <p style={styles.text}>
            Ce projet identifiera les zones de collecte de déchets dans la région. Il permettra de déterminer quels bacs se remplissent en premier pour une collecte priorisée. Il optimisera la collecte des déchets en suivant les itinéraires les plus efficaces et rapides. Grâce à ce projet, nous aurons un environnement plus propre tout en réduisant le temps et les coûts de la collecte des déchets.
          </p>
        </div>
      </div>
    </>
  );
};

// Styles en utilisant des objets JavaScript
const styles = {
  container: {
    position: 'relative',
    backgroundColor: '#F9F9F9',
    padding: '20px',
    fontFamily: "'Roboto', sans-serif",
  },
  header: {
    width: '100%',
    height: '300px',
    backgroundColor: '#4F7F51',
  },
  quiSommesNousSection: {
    textAlign: 'center',
    padding: '50px 20px',
    backgroundColor: '#E5F5E0',
    borderRadius: '20px',
    marginTop: '-150px',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontStyle: 'italic',
    fontWeight: '700',
    fontSize: '48px',
    color: '#2E3B4E',
  },
  text: {
    fontStyle: 'italic',
    fontWeight: '400',
    fontSize: '24px',
    lineHeight: '1.6',
    color: '#333',
    maxWidth: '80%',
    margin: '20px auto',
  },
  dechetsSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '50px',
    padding: '50px 20px',
    backgroundColor: '#E7EAF6',
    borderRadius: '20px',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
  },
  polygon: {
    width: '300px',
    height: '300px',
    backgroundColor: '#2E44B7',
    transform: 'rotate(-10deg)',
    borderRadius: '20px',
  },
  textBlock: {
    maxWidth: '60%',
  },
  subTitle: {
    fontStyle: 'italic',
    fontWeight: '600',
    fontSize: '36px',
    color: '#2E3B4E',
    marginBottom: '20px',
  },
  projetSection: {
    marginTop: '50px',
    textAlign: 'left',
    padding: '50px 20px',
    backgroundColor: '#F1F4F9',
    borderRadius: '20px',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
  },
};

export default Apropos;
