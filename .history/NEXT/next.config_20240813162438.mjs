import { EventEmitter } from 'events';

// Augmente la limite à 20 écouteurs
EventEmitter.defaultMaxListeners = 20;

/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;

