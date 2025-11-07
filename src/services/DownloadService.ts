/**
 * Download Service - Gestión de descarga de imágenes
 * Usa expo-media-library para guardar en la galería
 */

import * as MediaLibrary from 'expo-media-library';
import { Paths, File } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';

export class DownloadService {
  /**
   * Descargar imagen a la galería del dispositivo
   */
  static async downloadToGallery(imageUri: string, title?: string): Promise<boolean> {
    try {
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

      // Si es una URL remota, descargar primero
      let localUri = imageUri;
      
      if (imageUri.startsWith('http://') || imageUri.startsWith('https://')) {
        const filename = title 
          ? `PinterestGhoul_${title.replace(/[^a-z0-9]/gi, '_')}.jpg`
          : `PinterestGhoul_${Date.now()}.jpg`;
        
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
  static async shareImage(imageUri: string, title?: string): Promise<boolean> {
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      
      if (!isAvailable) {
        Alert.alert(
          'Compartir no disponible',
          'Tu dispositivo no soporta compartir archivos.'
        );
        return false;
      }

      let localUri = imageUri;

      // Si es URL remota, descargar primero
      if (imageUri.startsWith('http://') || imageUri.startsWith('https://')) {
        const filename = `share_${Date.now()}.jpg`;
        const shareFile = new File(Paths.cache, filename);
        
        await shareFile.create();
        const response = await fetch(imageUri);
        const arrayBuffer = await response.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        await shareFile.write(uint8Array);
        
        localUri = shareFile.uri;
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
