import { EventEmitter } from 'events';

// Augmente la limite à 20 écouteurs
EventEmitter.defaultMaxListeners = 20;

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { dev, isServer }) => {
    if (!isServer) {
      config.cache = false; // Désactiver le cache Webpack pour le côté client

      // Ajoutez ces options pour mieux gérer le Hot Module Replacement (HMR)
      config.watchOptions = {
        poll: 1000, // Vérifie les changements toutes les secondes
        aggregateTimeout: 300, // Délai pour regrouper les changements
      };
    }

    // Désactive Fast Refresh (Hot Module Replacement)
    if (dev) {
      config.devServer = {
        hot: false,
      };
    }

    return config;
  },
};

export default nextConfig;
