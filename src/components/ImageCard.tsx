import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Share,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/Colors';
import ShopTheLookModal from './ShopTheLookModal';
import CommentsModal from './CommentsModal';
import { CommentService } from '../services/CommentService';

interface Pin {
  id: string;
  imageUri: string | number; // string (remota) o number (require local)
  title: string;
  description: string;
  author: string;
  likes: number;
  isLiked: boolean;
  isSaved: boolean;
}

interface ImageCardProps {
  pin: Pin;
  onLike: (id: string) => void;
  onSave: (id: string) => void;
  onShowOptions: (pin: Pin) => void;
  onImagePress: (pin: Pin) => void;
  height?: number; // Altura dinámica para masonry layout
}

export default function ImageCard({ pin, onLike, onSave, onShowOptions, onImagePress, height }: ImageCardProps) {
  // Altura dinámica basada en el ID del pin para variación
  const dynamicHeight = height || (200 + (parseInt(pin.id, 10) % 5) * 50);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showShopTheLook, setShowShopTheLook] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentCount, setCommentCount] = useState<number>(() => CommentService.getCommentThread(pin.id).totalComments);

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

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => onImagePress(pin)} activeOpacity={0.9}>
        {typeof pin.imageUri === 'string' && pin.imageUri ? (
          <Image 
            source={{ uri: pin.imageUri }} 
            style={[styles.image, { height: dynamicHeight }]}
            resizeMode="cover"
            onError={(e) => console.warn('[ImageCard] Image load error:', e.nativeEvent.error)}
          />
        ) : typeof pin.imageUri === 'number' ? (
          <Image 
            source={pin.imageUri}
            style={[styles.image, { height: dynamicHeight }]}
            resizeMode="cover"
            onError={(e) => console.warn('[ImageCard] Image load error (local):', e.nativeEvent.error)}
          />
        ) : (
          <View style={[styles.image, { height: dynamicHeight, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.surface }]}>
            <Text style={{ color: Colors.textSecondary }}>Imagen no disponible</Text>
          </View>
        )}
      </TouchableOpacity>
      
      <View style={styles.overlay}>
        <View style={styles.topActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>↻</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleComments}>
            <Text style={styles.actionIcon}>💬</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => onSave(pin.id)}>
            <Text style={styles.actionIcon}>📌</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <Text style={styles.actionIcon}>↗</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.bottomInfo}>
        <View style={styles.userInfo}>
          <Text style={styles.author}>{pin.author}</Text>
          <Text style={styles.title}>{pin.title}</Text>
          <Text style={styles.description}>{pin.description}</Text>
        </View>
        
        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.actionItem} 
            onPress={() => onLike(pin.id)}
          >
            <Text style={[styles.actionIcon, pin.isLiked && styles.likedIcon]}>
              {pin.isLiked ? '❤️' : '🤍'}
            </Text>
            <Text style={styles.actionText}>{pin.likes}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionItem} onPress={handleComments}>
            <Text style={styles.actionIcon}>💬</Text>
            <Text style={styles.actionText}>{commentCount}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem} onPress={handleShopTheLook}>
            <Text style={styles.actionIcon}>🛒</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionItem} onPress={handleShare}>
            <Text style={styles.actionIcon}>↗</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionItem} 
            onPress={() => onSave(pin.id)}
          >
            <Text style={[styles.actionIcon, pin.isSaved && styles.savedIcon]}>
              {pin.isSaved ? '📌' : '📌'}
            </Text>
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
            onPress={() => onShowOptions(pin)}
          >
            <Text style={styles.actionIcon}>⋯</Text>
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
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: Colors.ghoulBlack,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: 0, // Eliminado margin para que MasonryLayout controle el spacing
  },
  image: {
    width: '100%',
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
  },
  topActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 20,
  },
  actionButton: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 20,
    color: Colors.text,
  },
  bottomInfo: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 15,
  },
  userInfo: {
    marginBottom: 10,
  },
  author: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  title: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
    paddingVertical: 8,
    gap: 8,
  },
  actionItem: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 50,
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  actionText: {
    color: Colors.text,
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
  likedIcon: {
    color: Colors.primary,
  },
  savedIcon: {
    color: Colors.primary,
  },
});
