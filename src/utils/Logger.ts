/**
 * Servicio de logging centralizado para PintersGhoul
 * Desactiva logs en producción y permite integración con servicios de monitoreo
 */

// @ts-ignore - __DEV__ es una variable global de React Native
const isDev = typeof __DEV__ !== 'undefined' ? __DEV__ : process.env.NODE_ENV !== 'production';

export class Logger {
  /**
   * Log general para desarrollo
   */
  static log(...args: any[]): void {
    if (isDev) {
      console.log(...args);
    }
  }

  /**
   * Advertencias que deben ser revisadas
   */
  static warn(...args: any[]): void {
    if (isDev) {
      console.warn(...args);
    }
  }

  /**
   * Errores críticos
   * En producción, estos deberían enviarse a un servicio de monitoreo como Sentry
   */
  static error(...args: any[]): void {
    if (isDev) {
      console.error(...args);
    } else {
      // TODO: Integrar con servicio de monitoreo (Sentry, Crashlytics, etc.)
      // Ejemplo: Sentry.captureException(args[0]);
    }
  }

  /**
   * Información de debugging detallada
   */
  static debug(...args: any[]): void {
    if (isDev) {
      console.log('[DEBUG]', ...args);
    }
  }

  /**
   * Información importante que debe mostrarse incluso en producción
   */
  static info(...args: any[]): void {
    console.info(...args);
  }

  /**
   * Medir tiempos de ejecución
   */
  static time(label: string): void {
    if (isDev) {
      console.time(label);
    }
  }

  static timeEnd(label: string): void {
    if (isDev) {
      console.timeEnd(label);
    }
  }
}

// Export por defecto para importar más fácilmente
export default Logger;
