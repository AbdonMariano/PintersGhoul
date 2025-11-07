// ============================================================================
// POLYFILL ULTRA-CRÍTICO - PRIMERA LÍNEA DE CÓDIGO
// ============================================================================
// Este código DEBE ejecutarse ANTES que cualquier otra cosa
(function() {
  const g = global as any;
  
  // Definir require en global INMEDIATAMENTE
  if (!g.require) {
    g.require = typeof require !== 'undefined' ? require : (id: any) => {
      console.warn('[Polyfill] require llamado para:', id);
      return { uri: id, default: id };
    };
  }
  
  // Otros polyfills críticos
  if (!g.process) g.process = { env: {} };
  if (!g.window) g.window = g;
  if (!g.__DEV__) g.__DEV__ = true;
  
  console.log('[Index Polyfill] ✅ Todos los polyfills aplicados');
})();
// ============================================================================

// Ahora sí, imports seguros
import { registerRootComponent } from 'expo';
import { AppRegistry } from 'react-native';
import App from './App';

// Register the main component
registerRootComponent(App);

// Also register with AppRegistry for compatibility
AppRegistry.registerComponent('main', () => App);
