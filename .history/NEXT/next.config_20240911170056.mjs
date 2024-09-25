import { EventEmitter } from 'events';

// Augmente la limite à 20 écouteurs
EventEmitter.defaultMaxListeners = 20;

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.cache = false; // Désactiver le cache Webpack pour le côté client
    }
    return config;
  },
};

export default nextConfig;
