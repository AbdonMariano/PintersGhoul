import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

const STORAGE_KEYS = {
  USER_SESSION: '@PinteresGhoul:userSession',
  // Nota: SecureStore no permite '@' ni ':' en las claves
  USER_CREDENTIALS: 'PinteresGhoul.credentials',
  SAVED_PINS: '@PinteresGhoul:savedPins',
  USER_PINS: '@PinteresGhoul:userPins',
  USER_PINS_PREFIX: '@PinteresGhoul:userPins:', // Para pines por usuario
  APP_SETTINGS: '@PinteresGhoul:settings',
};

export interface UserSession {
  userId: string;
  username: string;
  email?: string;
  displayName: string;
  bio?: string;
  avatar?: string;
  token?: string;
  lastLogin: string;
}

export class StorageService {
  // Guardar sesión de usuario (datos no sensibles)
  static async saveUserSession(session: UserSession): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_SESSION, JSON.stringify(session));
    } catch (error) {
      console.error('Error saving user session:', error);
      throw error;
    }
  }

  // Obtener sesión guardada
  static async getUserSession(): Promise<UserSession | null> {
    try {
      const sessionData = await AsyncStorage.getItem(STORAGE_KEYS.USER_SESSION);
      return sessionData ? JSON.parse(sessionData) : null;
    } catch (error) {
      console.error('Error getting user session:', error);
      return null;
    }
  }

  // Guardar credenciales de forma segura (solo para recordar usuario)
  static async saveCredentials(email: string, rememberMe: boolean = false): Promise<void> {
    try {
      if (rememberMe) {
        await SecureStore.setItemAsync(STORAGE_KEYS.USER_CREDENTIALS, JSON.stringify({ email, rememberMe }));
      } else {
        await SecureStore.deleteItemAsync(STORAGE_KEYS.USER_CREDENTIALS);
        // Intento de compatibilidad para eliminar una clave inválida antigua si existiera
        try { await SecureStore.deleteItemAsync('@PinteresGhoul:credentials' as any); } catch {}
      }
    } catch (error) {
      console.error('Error saving credentials:', error);
    }
  }

  // Obtener credenciales guardadas
  static async getSavedCredentials(): Promise<{ email: string; rememberMe: boolean } | null> {
    try {
      const credentials = await SecureStore.getItemAsync(STORAGE_KEYS.USER_CREDENTIALS);
      return credentials ? JSON.parse(credentials) : null;
    } catch (error) {
      console.error('Error getting credentials:', error);
      return null;
    }
  }

  // Guardar pins del usuario
  static async saveUserPins(pins: any[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_PINS, JSON.stringify(pins));
    } catch (error) {
      console.error('Error saving user pins:', error);
    }
  }

  // Obtener pins del usuario
  static async getUserPins(): Promise<any[]> {
    try {
      const pinsData = await AsyncStorage.getItem(STORAGE_KEYS.USER_PINS);
      return pinsData ? JSON.parse(pinsData) : [];
    } catch (error) {
      console.error('Error getting user pins:', error);
      return [];
    }
  }

  // Guardar pins de un usuario específico (por userId)
  static async saveUserPinsByUserId(userId: string, pins: any[]): Promise<void> {
    try {
      const key = `${STORAGE_KEYS.USER_PINS_PREFIX}${userId}`;
      await AsyncStorage.setItem(key, JSON.stringify(pins));
      console.log(`[StorageService] Pines guardados para usuario ${userId}:`, pins.length);
    } catch (error) {
      console.error(`Error saving pins for user ${userId}:`, error);
    }
  }

  // Obtener pins de un usuario específico (por userId)
  static async getUserPinsByUserId(userId: string): Promise<any[]> {
    try {
      const key = `${STORAGE_KEYS.USER_PINS_PREFIX}${userId}`;
      const pinsData = await AsyncStorage.getItem(key);
      const pins = pinsData ? JSON.parse(pinsData) : [];
      console.log(`[StorageService] Pines cargados para usuario ${userId}:`, pins.length);
      return pins;
    } catch (error) {
      console.error(`Error getting pins for user ${userId}:`, error);
      return [];
    }
  }

  // Guardar pins guardados/favoritos
  static async saveSavedPins(pins: any[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SAVED_PINS, JSON.stringify(pins));
    } catch (error) {
      console.error('Error saving saved pins:', error);
    }
  }

  // Obtener pins guardados
  static async getSavedPins(): Promise<any[]> {
    try {
      const pinsData = await AsyncStorage.getItem(STORAGE_KEYS.SAVED_PINS);
      return pinsData ? JSON.parse(pinsData) : [];
    } catch (error) {
      console.error('Error getting saved pins:', error);
      return [];
    }
  }

  // Guardar configuración de la app
  static async saveAppSettings(settings: any): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.APP_SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving app settings:', error);
    }
  }

  // Obtener configuración de la app
  static async getAppSettings(): Promise<any> {
    try {
      const settingsData = await AsyncStorage.getItem(STORAGE_KEYS.APP_SETTINGS);
      return settingsData ? JSON.parse(settingsData) : {
        darkMode: true,
        notifications: true,
        autoSave: true,
        dataSaver: false,
      };
    } catch (error) {
      console.error('Error getting app settings:', error);
      return null;
    }
  }

  // Limpiar todos los datos (logout)
  static async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.USER_SESSION,
        STORAGE_KEYS.SAVED_PINS,
        STORAGE_KEYS.USER_PINS,
      ]);
      await SecureStore.deleteItemAsync(STORAGE_KEYS.USER_CREDENTIALS);
      // Intento de compatibilidad para limpiar clave inválida antigua
      try { await SecureStore.deleteItemAsync('@PinteresGhoul:credentials' as any); } catch {}
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  }

  // Limpiar solo la sesión (mantener pins y configuración)
  static async clearSession(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_SESSION);
    } catch (error) {
      console.error('Error clearing session:', error);
    }
  }
}
