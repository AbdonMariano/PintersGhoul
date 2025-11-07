/**
 * Global Polyfills Setup - CRÍTICO
 * Este archivo se ejecuta PRIMERO gracias a metro.config.js
 * Proporciona polyfills necesarios para React Native/Hermes
 */

// Ejecutar inmediatamente
(function setupGlobalPolyfills() {
  const g = global as any;

  // 1. CRÍTICO: Asegurar que global.require existe
  if (typeof g.require === 'undefined') {
    if (typeof require === 'function') {
      g.require = require;
      console.log('[Global Polyfill] ✅ global.require configurado');
    } else {
      // Crear un stub que no falle
      g.require = function stubRequire(moduleName: string) {
        console.warn(`[Global Polyfill] ⚠️ require("${moduleName}") llamado pero require no está disponible`);
        return {};
      };
      console.warn('[Global Polyfill] ⚠️ global.require creado como stub');
    }
  } else {
    console.log('[Global Polyfill] ℹ️ global.require ya existe');
  }

  // 2. Asegurar que process y process.env existen
  if (typeof g.process === 'undefined') {
    g.process = { env: {} };
  }
  if (!g.process.env) {
    g.process.env = {};
  }
  
  // Configurar NODE_ENV si __DEV__ está disponible
  if (typeof g.__DEV__ !== 'undefined' && !g.process.env.NODE_ENV) {
    g.process.env.NODE_ENV = g.__DEV__ ? 'development' : 'production';
  }

  // 3. Asegurar que window existe (para librerías web)
  if (typeof g.window === 'undefined') {
    g.window = g;
  }

  // 4. Prevenir accesos a propiedades undefined
  if (typeof g.self === 'undefined') {
    g.self = g;
  }

  console.log('[Global Polyfill] 🚀 Inicialización completa');
  console.log('[Global Polyfill] Estado:', {
    'global.require': typeof g.require,
    'global.process': typeof g.process,
    'global.__DEV__': typeof g.__DEV__,
    'global.window': typeof g.window,
  });
})();

// Export para hacer que TypeScript lo reconozca como módulo
export {};
