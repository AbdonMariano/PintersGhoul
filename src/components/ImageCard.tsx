import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Share,
  Dimensions,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/Colors';
import ShopTheLookModal from './ShopTheLookModal';
import CommentsModal from './CommentsModal';
import { CommentService } from '../services/CommentService';
import { getDeviceType } from '../utils/responsive';

const { width: screenWidth } = Dimensions.get('window');

// Relación de aspecto óptima de Pinterest: 2:3 (ancho:alto)
const OPTIMAL_ASPECT_RATIO = 2 / 3;
const MIN_ASPECT_RATIO = 0.5; // Imágenes muy verticales (1:2)
const MAX_ASPECT_RATIO = 1.5; // Imágenes horizontales limitadas

interface Pin {
  id: string;
  imageUri: string | number; // string (remota) o number (require local)
  title: string;
  description: string;
  author: string;
  likes: number;
  isLiked: boolean;
  isSaved: boolean;
  width?: number; // Ancho original de la imagen (opcional)
  height?: number; // Alto original de la imagen (opcional)
}

interface ImageCardProps {
  pin: Pin;
  onLike: (id: string) => void;
  onSave: (id: string) => void;
  onShowOptions: (pin: Pin) => void;
  onImagePress: (pin: Pin) => void;
  height?: number; // Altura dinámica para masonry layout
  columnWidth?: number; // Ancho de la columna
  isDarkMode?: boolean; // Tema oscuro o claro
}

export default function ImageCard({ pin, onLike, onSave, onShowOptions, onImagePress, height, columnWidth, isDarkMode = true }: ImageCardProps) {
  // Calcular altura dinámica basada en relación de aspecto
  const imageHeight = useMemo(() => {
    if (height) return height;
    
    // Calcular ancho disponible (ancho de pantalla / 2 columnas - padding)
    const availableWidth = columnWidth || (screenWidth - 48) / 2;
    
    // Si el pin tiene dimensiones, calcular relación de aspecto real
    if (pin.width && pin.height) {
      let aspectRatio = pin.width / pin.height;
      
      // Limitar aspectRatio a rangos razonables (evitar imágenes extremas)
      aspectRatio = Math.max(MIN_ASPECT_RATIO, Math.min(MAX_ASPECT_RATIO, aspectRatio));
      
      return availableWidth / aspectRatio;
    }
    
    // Por defecto, usar relación óptima de Pinterest (2:3)
    // Esto favorece imágenes verticales que se ven mejor en móviles
    return availableWidth / OPTIMAL_ASPECT_RATIO;
  }, [height, columnWidth, pin.width, pin.height]);
  
  const [isDownloading, setIsDownloading] = useState(false);
  const [showShopTheLook, setShowShopTheLook] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentCount, setCommentCount] = useState<number>(() => CommentService.getCommentThread(pin.id).totalComments);

  // Colores dinámicos basados en el tema
  const themeColors = {
    background: isDarkMode ? Colors.surface : Colors.pinterestSurface,
    text: isDarkMode ? Colors.text : Colors.pinterestText,
    textSecondary: isDarkMode ? Colors.textSecondary : Colors.pinterestTextSecondary,
    border: isDarkMode ? '#333' : Colors.pinterestBorder,
  };

  const handleDownload = async () => {
    if (!pin.imageUri || isDownloading) return;
    
    try {
      setIsDownloading(true);
      
      // Solo compartir, ya que la descarga completa requiere Development Build
      await Share.share({
        message: `Mira este increíble pin: ${pin.title}\n${pin.imageUri}`,
      });
      
    } catch (error) {
      console.error('[ImageCard] Download error:', error);
      Alert.alert('Error', 'No se pudo compartir la imagen');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    if (!pin.imageUri) {
      Alert.alert('Error', 'No se pudo compartir la imagen');
      return;
    }
    
    try {
      await Share.share({
        message: `${pin.title}\n\n${pin.description}\n\nPor: ${pin.author}`,
      });
    } catch (error) {
      console.error('[ImageCard] Share error:', error);
      Alert.alert('Error', 'No se pudo compartir');
    }
  };

  const handleShopTheLook = () => {
    setShowShopTheLook(true);
  };

  const handleComments = () => {
    setShowComments(true);
  };

  // Normalizar source para soportar Web (donde require() puede devolver objeto)
  const normalizedSource = useMemo(() => {
    if (typeof pin.imageUri === 'number') return pin.imageUri;
    if (typeof pin.imageUri === 'string' && pin.imageUri.length > 0) return { uri: pin.imageUri };
    if (pin.imageUri && typeof pin.imageUri === 'object') {
      // Intentar extraer uri interna
      // Algunos assets en web exponen { uri: '...' }
      // Si no, devolver el objeto crudo y dejar que RN lo gestione
      const anyObj: any = pin.imageUri;
      if (anyObj.uri) return { uri: anyObj.uri };
      return anyObj;
    }
    return null;
  }, [pin.imageUri]);

  // Mejorar calidad de imagen en pantallas grandes
  const imageQuality = useMemo(() => {
    const deviceType = getDeviceType();
    if (deviceType === 'laptop' || deviceType === 'desktop' || deviceType === 'tv') {
      return 'high';
    }
    return 'normal';
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background, borderColor: themeColors.border }]}>
      <TouchableOpacity onPress={() => onImagePress(pin)} activeOpacity={0.9}>
        {normalizedSource ? (
          <Image
            source={normalizedSource}
            style={[styles.image, { height: imageHeight }]}
            resizeMode="cover"
            fadeDuration={150}
            progressiveRenderingEnabled={true}
          />
        ) : (
          <View style={[styles.image, { height: imageHeight, alignItems: 'center', justifyContent: 'center', backgroundColor: themeColors.background }]}>
            <Text style={{ color: themeColors.textSecondary, fontSize: 12 }}>📷</Text>
            <Text style={{ color: themeColors.textSecondary, fontSize: 10, marginTop: 4 }}>Sin imagen</Text>
          </View>
        )}
        
        {/* Botón de tres puntos flotante en la esquina superior derecha */}
        <TouchableOpacity 
          style={[styles.optionsButton, { backgroundColor: themeColors.background }]} 
          onPress={() => onShowOptions(pin)}
        >
          <Text style={[styles.optionsIcon, { color: themeColors.text }]}>⋯</Text>
        </TouchableOpacity>
      </TouchableOpacity>
      
      <View style={styles.bottomInfo}>
        <View style={styles.userInfo}>
          <Text style={[styles.author, { color: themeColors.textSecondary }]}>{pin.author}</Text>
          <Text style={[styles.title, { color: themeColors.text }]} numberOfLines={1}>{pin.title}</Text>
        </View>
        
        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.actionItem} 
            onPress={() => onLike(pin.id)}
          >
            <Text style={[styles.actionIcon, pin.isLiked && styles.likedIcon]}>
              {pin.isLiked ? '❤️' : '🤍'}
            </Text>
            <Text style={[styles.actionText, { color: themeColors.textSecondary }]}>{pin.likes}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionItem} onPress={handleComments}>
            <Text style={styles.actionIcon}>💬</Text>
            <Text style={[styles.actionText, { color: themeColors.textSecondary }]}>{commentCount}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionItem} 
            onPress={handleDownload}
            disabled={isDownloading}
          >
            <Text style={styles.actionIcon}>
              {isDownloading ? '⏳' : '⬇️'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionItem} 
            onPress={() => onSave(pin.id)}
          >
            <Text style={[styles.actionIcon, pin.isSaved && styles.savedIcon]}>
              {pin.isSaved ? '📌' : '🔖'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ShopTheLookModal
        visible={showShopTheLook}
        onClose={() => setShowShopTheLook(false)}
        pinImage={pin.imageUri}
        pinTitle={pin.title}
      />

      <CommentsModal
        visible={showComments}
        onClose={() => setShowComments(false)}
        pinId={pin.id}
        pinTitle={pin.title}
        pinImage={pin.imageUri}
        onCommentsChanged={setCommentCount}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.ghoulBlack,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
    marginBottom: 0,
    borderWidth: 1,
    // Mejora visual para web/desktop
    ...(Platform.OS === 'web' ? {
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      cursor: 'pointer',
    } : {}),
  },
  image: {
    width: '100%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: '#1a1a1a',
    // Antialiasing en web
    ...(Platform.OS === 'web' ? {
      imageRendering: '-webkit-optimize-contrast',
    } : {}),
  },
  optionsButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  optionsIcon: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  bottomInfo: {
    backgroundColor: 'rgba(0,0,0,0.85)',
    padding: 12,
  },
  userInfo: {
    marginBottom: 8,
  },
  author: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  title: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 8,
  },
  actionItem: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 45,
  },
  actionText: {
    color: Colors.text,
    fontSize: 11,
    marginTop: 2,
    fontWeight: '600',
  },
  actionIcon: {
    fontSize: 18,
    color: Colors.text,
  },
  likedIcon: {
    color: Colors.primary,
  },
  savedIcon: {
    color: Colors.primary,
  },
});
