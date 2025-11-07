import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
  Animated,
  Share,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/Colors';
import AnimatedButton from '../components/AnimatedButton';

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

interface ImageDetailScreenProps {
  pin: Pin;
  onBack: () => void;
  onLike: (id: string) => void;
  onSave: (id: string) => void;
  onShare: (pin: Pin) => void;
}

const { width, height } = Dimensions.get('window');

export default function ImageDetailScreen({
  pin,
  onBack,
  onLike,
  onSave,
  onShare,
}: ImageDetailScreenProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      
      // En Expo Go, usamos Share en vez de MediaLibrary (que tiene limitaciones)
      await Share.share({
        message: `${pin.title}\n\n${pin.description}\n\nPor: ${pin.author}`,
      });
      
    } catch (error) {
      console.error('[ImageDetail] Download error:', error);
      Alert.alert('Error', 'No se pudo compartir la imagen');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    try {
      setIsSharing(true);
      await Share.share({
        message: `Mira este increíble pin: ${pin.title}\n\n${pin.description}\n\nPor: ${pin.author}`,
      });
    } catch (error) {
      console.error('[ImageDetail] Share error:', error);
      Alert.alert('Error', 'No se pudo compartir');
    } finally {
      setIsSharing(false);
    }
  };

  const handleLike = () => {
    onLike(pin.id);
  };

  const handleSave = () => {
    onSave(pin.id);
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <LinearGradient
        colors={[Colors.gradientStart, Colors.gradientEnd]}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <AnimatedButton
            onPress={onBack}
            style={styles.backButton}
          >
            <Text style={styles.backIcon}>←</Text>
          </AnimatedButton>
          <Text style={styles.title}>Detalle del Pin</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.imageContainer}>
            <ScrollView
              maximumZoomScale={3}
              minimumZoomScale={1}
              contentContainerStyle={{ flex: 1 }}
              style={{ width: '100%', height: height * 0.5 }}
            >
              {typeof pin.imageUri === 'string' && pin.imageUri ? (
                <Image 
                  source={{ uri: pin.imageUri }} 
                  style={styles.image}
                  resizeMode="contain"
                  onError={(e) => console.warn('[ImageDetail] Image load error:', e.nativeEvent.error)}
                />
              ) : typeof pin.imageUri === 'number' ? (
                <Image 
                  source={pin.imageUri}
                  style={styles.image}
                  resizeMode="contain"
                  onError={(e) => console.warn('[ImageDetail] Image load error (local):', e.nativeEvent.error)}
                />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Text style={styles.imagePlaceholderText}>Imagen no disponible</Text>
                </View>
              )}
            </ScrollView>
            <View style={styles.imageOverlay}>
              <View style={styles.topActions}>
                <AnimatedButton
                  onPress={handleLike}
                  style={styles.actionButton}
                >
                  <Text style={[styles.actionIcon, pin.isLiked && styles.likedIcon]}>
                    {pin.isLiked ? '❤️' : '🤍'}
                  </Text>
                </AnimatedButton>
                <AnimatedButton
                  onPress={handleSave}
                  style={styles.actionButton}
                >
                  <Text style={[styles.actionIcon, pin.isSaved && styles.savedIcon]}>
                    📌
                  </Text>
                </AnimatedButton>
                <AnimatedButton
                  onPress={handleShare}
                  style={styles.actionButton}
                >
                  <Text style={styles.actionIcon}>↗</Text>
                </AnimatedButton>
              </View>
            </View>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.pinTitle}>{pin.title}</Text>
            <Text style={styles.pinDescription}>{pin.description}</Text>
            
            <View style={styles.authorContainer}>
              <Text style={styles.authorLabel}>Por:</Text>
              <Text style={styles.authorName}>{pin.author}</Text>
            </View>

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statIcon}>❤️</Text>
                <Text style={styles.statNumber}>{pin.likes}</Text>
                <Text style={styles.statLabel}>Likes</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statIcon}>👁️</Text>
                <Text style={styles.statNumber}>1.2K</Text>
                <Text style={styles.statLabel}>Vistas</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statIcon}>📌</Text>
                <Text style={styles.statNumber}>45</Text>
                <Text style={styles.statLabel}>Guardados</Text>
              </View>
            </View>
          </View>

          <View style={styles.actionsContainer}>
            <AnimatedButton
              onPress={handleDownload}
              disabled={isDownloading}
              gradient
              gradientColors={[Colors.redGradientStart, Colors.redGradientEnd]}
              style={styles.downloadButton}
            >
              <Text style={styles.downloadButtonText}>
                {isDownloading ? 'Descargando...' : '⬇️ Descargar Imagen'}
              </Text>
            </AnimatedButton>

            <AnimatedButton
              onPress={handleShare}
              disabled={isSharing}
              style={styles.shareButton}
            >
              <Text style={styles.shareButtonText}>
                {isSharing ? 'Compartiendo...' : '↗ Compartir'}
              </Text>
            </AnimatedButton>
          </View>

          <View style={styles.tagsContainer}>
            <Text style={styles.tagsTitle}>Etiquetas:</Text>
            <View style={styles.tagsList}>
              <Text style={styles.tag}>#TokyoGhoul</Text>
              <Text style={styles.tag}>#Kaneki</Text>
              <Text style={styles.tag}>#Anime</Text>
              <Text style={styles.tag}>#Manga</Text>
              <Text style={styles.tag}>#Ghoul</Text>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 20,
    color: Colors.text,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  placeholder: {
    width: 40,
  },
  imageContainer: {
    position: 'relative',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: height * 0.5,
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
  },
  topActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 15,
  },
  actionButton: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
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
  infoContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  pinTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 10,
  },
  pinDescription: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
    marginBottom: 15,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  authorLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginRight: 5,
  },
  authorName: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingVertical: 15,
  },
  statItem: {
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 20,
    marginBottom: 5,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  actionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  downloadButton: {
    marginBottom: 15,
    borderRadius: 12,
    overflow: 'hidden',
  },
  downloadButtonText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 15,
  },
  shareButton: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
  },
  shareButtonText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  tagsContainer: {
    paddingHorizontal: 20,
    marginBottom: 100,
  },
  tagsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 10,
  },
  tagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: Colors.primary,
    color: Colors.text,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 8,
    marginBottom: 8,
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.surface,
  },
  imagePlaceholderText: {
    color: Colors.textSecondary,
    fontSize: 16,
  },
});
