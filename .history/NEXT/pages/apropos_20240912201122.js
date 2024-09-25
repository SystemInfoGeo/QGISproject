import React from 'react';

const Apropos = () => {
  return (
    <div style={styles.container}>
      {/* En-tête */}
      <div style={styles.header}></div>

      {/* Section "Qui sommes-nous?" */}
      <div style={styles.quiSommesNousSection}>
        <h1 style={styles.title}>Qui sommes-nous ?</h1>
        <p style={styles.text}>
          Nous sommes des étudiantes en Master2 d'Ingénierie des Systèmes d'Information à l'Université Mouloud Mammeri de Tizi-Ouzou. Ce projet de fin d'études, réalisé dans le cadre de notre cursus, nous a été proposé par l'entreprise Codes Nova...
        </p>
      </div>

      {/* Section "Pourquoi éliminer les déchets?" */}
      <div style={styles.dechetsSection}>
        <div style={styles.polygon}></div>
        <div style={styles.textBlock}>
          <h2 style={styles.subTitle}>Pourquoi cherche-t-on à éliminer les déchets ?</h2>
          <p style={styles.text}>
            Les déchets peuvent polluer les sols, contaminant les sources d'eau. Ils émettent des gaz nocifs dans l'air, affectant la qualité de l'air...
          </p>
        </div>
      </div>

      {/* Section "Comment ce projet aide?" */}
      <div style={styles.projetSection}>
        <h2 style={styles.subTitle}>Comment ce projet va-t-il nous aider ?</h2>
        <p style={styles.text}>
          Ce projet identifiera les zones de collecte de déchets dans la région. Il permettra de déterminer quels bacs se remplissent en premier pour une collecte priorisée...
        </p>
      </div>
    </div>
  );
};

// Styles en utilisant des objets JavaScript
const styles = {
  container: {
    position: 'relative',
    backgroundColor: '#FFFFFF',
    padding: '20px',
  },
  header: {
    width: '100%',
    height: '669px',
    backgroundColor: '#4F7F51',
  },
  quiSommesNousSection: {
    textAlign: 'center',
    marginTop: '-400px',
  },
  title: {
    fontStyle: 'italic',
    fontWeight: '600',
    fontSize: '128px',
    color: '#000',
  },
  text: {
    fontStyle: 'italic',
    fontWeight: '500',
    fontSize: '96px',
    lineHeight: '140%',
    color: '#000',
    maxWidth: '80%',
    margin: 'auto',
  },
  dechetsSection: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '50px',
  },
  polygon: {
    width: '2084px',
    height: '1948px',
    backgroundColor: '#2E44B7',
    transform: 'rotate(-10.8deg)',
  },
  textBlock: {
    maxWidth: '600px',
  },
  subTitle: {
    fontStyle: 'italic',
    fontWeight: '600',
    fontSize: '96px',
    color: '#000',
  },
  projetSection: {
    marginTop: '50px',
    textAlign: 'left',
  },
};

export default Apropos;
