/**
 * Global Polyfills - Se ejecuta PRIMERO vía metro.config.js getPolyfills
 * JavaScript puro - sin dependencias
 */

// IIFE inmediata - ejecutar ANTES de cualquier código
(function() {
  'use strict';
  
  var g = typeof global !== 'undefined' ? global : (typeof window !== 'undefined' ? window : this);
  
  // 1. CRÍTICO: global.require
  if (typeof g.require === 'undefined') {
    if (typeof require !== 'undefined' && typeof require === 'function') {
      g.require = require;
    } else {
      g.require = function(id) {
        // Stub para cuando require no existe
        return { uri: id, default: id };
      };
    }
  }
  
  // 2. process.env
  if (typeof g.process === 'undefined') {
    g.process = { env: {} };
  }
  
  // 3. window
  if (typeof g.window === 'undefined') {
    g.window = g;
  }
  
  // 4. self
  if (typeof g.self === 'undefined') {
    g.self = g;
  }
})();
