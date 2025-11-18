const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Resolver: mantener las extensiones por defecto
config.resolver = {
  ...config.resolver,
  sourceExts: Array.from(new Set([...(config.resolver?.sourceExts || []), 'jsx', 'js', 'ts', 'tsx'])),
  assetExts: [...(config.resolver?.assetExts || []), 'png', 'jpg', 'jpeg', 'gif', 'webp'],
};

// Importante: NO reemplazar los polyfills por defecto; añadir el nuestro al final
const baseGetPolyfills = config.serializer && typeof config.serializer.getPolyfills === 'function'
  ? config.serializer.getPolyfills.bind(config.serializer)
  : () => [];

config.serializer = {
  ...config.serializer,
  getPolyfills: (...args) => {
    const defaults = baseGetPolyfills(...args);
    return [
      ...defaults,
      path.resolve(__dirname, 'global-polyfills.js'),
    ];
  },
};

module.exports = config;
