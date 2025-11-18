/**
 * Download Service - Gestión de descarga de imágenes
 * Usa expo-media-library para guardar en la galería
 */

import * as MediaLibrary from 'expo-media-library';
import { Paths, File } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Asset } from 'expo-asset';
import { Alert, Platform } from 'react-native';

export class DownloadService {
  private static sanitizeFilename(name?: string, fallbackPrefix: string = 'PinterestGhoul'): string {
    const base = (name || `${fallbackPrefix}_${Date.now()}`).toString();
    const clean = base.replace(/[^a-z0-9_\-\.]/gi, '_');
    return clean.endsWith('.jpg') || clean.endsWith('.png')
      ? clean
      : `${clean}.jpg`;
  }

  private static async resolveUri(imageUri: string | number): Promise<string> {
    if (typeof imageUri === 'number') {
      const asset = Asset.fromModule(imageUri);
      await asset.downloadAsync();
      if (asset.localUri) return asset.localUri;
      if (asset.uri) return asset.uri; // Web suele exponer asset.uri
      throw new Error('No se pudo resolver la URI del asset local');
    }
    return imageUri;
  }

  private static async downloadOnWeb(imageUri: string | number, title?: string): Promise<boolean> {
    try {
      const resolved = await this.resolveUri(imageUri);
      const filename = this.sanitizeFilename(title);

      // Descarga vía fetch -> blob para soportar CORS y URIs locales servidas por dev server
      const response = await fetch(resolved, { mode: 'cors' as RequestMode }).catch(() => fetch(resolved));
      if (!response || !response.ok) {
        // Como fallback, intenta abrir en nueva pestaña si no se puede fetchar
        window.open(resolved, '_blank');
        Alert.alert('Descarga', 'Abrimos la imagen en una pestaña para que puedas guardarla manualmente.');
        return true;
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      Alert.alert('✅ Descarga iniciada', `Guardando ${filename} desde la web.`);
      return true;
    } catch (e) {
      console.error('[Download][Web] Error:', e);
      Alert.alert('Error', 'No se pudo iniciar la descarga en la web.');
      return false;
    }
  }

  /**
   * Descargar imagen a la galería del dispositivo
   */
  static async downloadToGallery(imageUri: string | number, title?: string): Promise<boolean> {
    try {
      // Soporte Web: guardar el archivo vía descarga del navegador
      if (Platform.OS === 'web') {
        return await this.downloadOnWeb(imageUri, title);
      }

      // Solicitar permisos
      const { status } = await MediaLibrary.requestPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permisos requeridos',
          'Necesitamos acceso a tu galería para guardar la imagen.'
        );
        return false;
      }

      // Mostrar indicador de inicio
      console.log('[Download] Iniciando descarga...');

      let localUri: string;
      
      // Manejar imágenes locales (require)
      if (typeof imageUri === 'number') {
        console.log('[Download] Procesando imagen local...');
        
        // Cargar el asset local
        const asset = Asset.fromModule(imageUri);
        await asset.downloadAsync();
        
        if (!asset.localUri) {
          throw new Error('No se pudo cargar la imagen local');
        }
        
        localUri = asset.localUri;
        console.log('[Download] Imagen local cargada:', localUri);
      }
      // Manejar URLs remotas
      else if (imageUri.startsWith('http://') || imageUri.startsWith('https://')) {
        const filename = this.sanitizeFilename(title);
        
        const downloadFile = new File(Paths.cache, filename);
        
        console.log('[Download] Descargando desde:', imageUri);
        
        await downloadFile.create();
        const response = await fetch(imageUri);
        const arrayBuffer = await response.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        await downloadFile.write(uint8Array);
        
        localUri = downloadFile.uri;
        
        console.log('[Download] Descargado a:', localUri);
      }
      // URI local del sistema de archivos
      else {
        localUri = imageUri;
      }

      // Guardar en la galería
      const asset = await MediaLibrary.createAssetAsync(localUri);
      
      // Crear álbum "PinterestGhoul" si no existe
      const album = await MediaLibrary.getAlbumAsync('PinterestGhoul');
      
      if (album) {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      } else {
        await MediaLibrary.createAlbumAsync('PinterestGhoul', asset, false);
      }

      console.log('[Download] ✅ Guardado en galería');
      
      Alert.alert(
        '✅ Descarga completada',
        'La imagen se guardó en tu galería en el álbum "PinterestGhoul"'
      );
      
      return true;
    } catch (error) {
      console.error('[Download] Error:', error);
      
      Alert.alert(
        '❌ Error al descargar',
        'No se pudo guardar la imagen. Inténtalo de nuevo.'
      );
      
      return false;
    }
  }

  /**
   * Compartir imagen usando el diálogo nativo
   */
  static async shareImage(imageUri: string | number, title?: string): Promise<boolean> {
    try {
      // Soporte Web: usar Web Share API si está disponible o abrir en nueva pestaña
      if (Platform.OS === 'web') {
        try {
          const resolved = await this.resolveUri(imageUri);
          if (typeof navigator !== 'undefined' && (navigator as any).share) {
            await (navigator as any).share({ title: title || 'Compartir imagen', url: resolved });
            return true;
          }
          window.open(resolved, '_blank');
          Alert.alert('Compartir', 'Abrimos la imagen en una pestaña para que puedas compartir/guardar.');
          return true;
        } catch (e) {
          console.error('[Share][Web] Error:', e);
          Alert.alert('Error', 'No se pudo compartir en la web.');
          return false;
        }
      }

      const isAvailable = await Sharing.isAvailableAsync();
      
      if (!isAvailable) {
        Alert.alert(
          'Compartir no disponible',
          'Tu dispositivo no soporta compartir archivos.'
        );
        return false;
      }

      let localUri: string;

      // Manejar imágenes locales (require)
      if (typeof imageUri === 'number') {
        console.log('[Share] Procesando imagen local...');
        
        // Cargar el asset local
        const asset = Asset.fromModule(imageUri);
        await asset.downloadAsync();
        
        if (!asset.localUri) {
          throw new Error('No se pudo cargar la imagen local');
        }
        
        localUri = asset.localUri;
      }
      // Si es URL remota, descargar primero
      else if (imageUri.startsWith('http://') || imageUri.startsWith('https://')) {
        const filename = `share_${Date.now()}.jpg`;
        const shareFile = new File(Paths.cache, filename);
        
        await shareFile.create();
        const response = await fetch(imageUri);
        const arrayBuffer = await response.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        await shareFile.write(uint8Array);
        
        localUri = shareFile.uri;
      }
      // URI local del sistema de archivos
      else {
        localUri = imageUri;
      }

      await Sharing.shareAsync(localUri, {
        dialogTitle: title || 'Compartir imagen',
        mimeType: 'image/jpeg',
      });

      return true;
    } catch (error) {
      console.error('[Share] Error:', error);
      Alert.alert('Error', 'No se pudo compartir la imagen.');
      return false;
    }
  }

  /**
   * Copiar enlace de imagen al portapapeles
   */
  static async copyImageLink(imageUri: string): Promise<boolean> {
    try {
      // En una app real, esto generaría un enlace compartible
      // Por ahora, solo copiamos la URI
      
      // Expo Clipboard ya no existe en SDK 50+, usar @react-native-clipboard/clipboard
      // Por ahora solo mostramos un alert
      
      Alert.alert(
        '📋 Enlace copiado',
        `Enlace de la imagen:\n${imageUri.substring(0, 50)}...`
      );
      
      return true;
    } catch (error) {
      console.error('[Copy] Error:', error);
      return false;
    }
  }

  /**
   * Obtener tamaño de archivo de imagen  
   */
  static async getImageSize(imageUri: string): Promise<{ width: number; height: number } | null> {
    try {
      // Este método es un placeholder para una implementación futura
      // Requeriría usar React Native Image.getSize o similar
      return null;
    } catch (error) {
      console.error('[ImageSize] Error:', error);
      return null;
    }
  }

  /**
   * Limpiar caché de descargas
   */
  static async clearDownloadCache(): Promise<void> {
    try {
      const cacheDir = Paths.cache;
      const files = cacheDir.list();
      
      for (const file of files) {
        if (file instanceof File) {
          const filename = file.name;
          if (filename.includes('PinterestGhoul_') || filename.includes('share_')) {
            await file.delete();
          }
        }
      }
      
      console.log('[Download] Caché limpiada');
    } catch (error) {
      console.error('[ClearCache] Error:', error);
    }
  }
}
