import { EventEmitter } from 'events';

// Augmente la limite à 20 écouteurs pour éviter les erreurs liées au nombre d'écoutes dans Node.js
EventEmitter.defaultMaxListeners = 20;

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { dev, isServer }) => {
    if (!isServer && dev) {
      // Désactiver Fast Refresh / Hot Module Replacement
      config.watchOptions = {
        poll: 1000, // Vérifie les changements toutes les secondes
        aggregateTimeout: 300, // Regroupe les changements en un seul lot
      };
    }

    return config;
  },
};

export default nextConfig;
