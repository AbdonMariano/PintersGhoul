import React, { useState, useRef, memo, useCallback, useMemo } from 'react';
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
  Modal,
  StatusBar,
  Pressable,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/Colors';
import CommentsModal from '../components/CommentsModal';
import { CommentService } from '../services/CommentService';

interface Pin {
  id: string;
  imageUri: string | number;
  title: string;
  description: string;
  author: string;
  likes: number;
  isLiked: boolean;
  isSaved: boolean;
}

interface ImageDetailScreenProps {
  pin: Pin;
  visible: boolean;
  onBack: () => void;
  onLike: (id: string) => void;
  onSave: (id: string) => void;
  onShare: (pin: Pin) => void;
}

const { width, height } = Dimensions.get('window');

// Componente optimizado con memo
const ImageDetailScreen = memo(({
  pin,
  visible,
  onBack,
  onLike,
  onSave,
  onShare,
}: ImageDetailScreenProps) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true); // Modo oscuro por defecto
  const [commentCount, setCommentCount] = useState<number>(() => 
    CommentService.getCommentThread(pin.id).totalComments
  );

  // Toggle para cambiar entre modo claro y oscuro
  const toggleTheme = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);

  // Handlers optimizados con useCallback
  const handleDownload = useCallback(async () => {
    try {
      setIsDownloading(true);
      await Share.share({
        message: `${pin.title}\n\n${pin.description}\n\nPor: ${pin.author}`,
      });
    } catch (error) {
      console.error('[ImageDetail] Download error:', error);
      Alert.alert('Error', 'No se pudo compartir la imagen');
    } finally {
      setIsDownloading(false);
    }
  }, [pin.title, pin.description, pin.author]);

  const handleShare = useCallback(async () => {
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
  }, [pin.title, pin.description, pin.author]);

  const handleLike = useCallback(() => {
    onLike(pin.id);
  }, [onLike, pin.id]);

  const handleSave = useCallback(() => {
    onSave(pin.id);
  }, [onSave, pin.id]);

  const handleOpenComments = useCallback(() => {
    setShowComments(true);
  }, []);

  const handleCloseComments = useCallback(() => {
    setShowComments(false);
  }, []);

  // Normalizar la fuente de imagen para compatibilidad cross-plataforma
  const normalizedSource = useMemo(() => {
    if (typeof pin.imageUri === 'number') return pin.imageUri;
    if (typeof pin.imageUri === 'string' && pin.imageUri.length > 0) return { uri: pin.imageUri, cache: 'force-cache' };
    if (pin.imageUri && typeof pin.imageUri === 'object') {
      const anyObj: any = pin.imageUri;
      if (anyObj.uri) return { uri: anyObj.uri, cache: 'force-cache' };
      return anyObj;
    }
    return null;
  }, [pin.imageUri]);

  // No renderizar nada si no está visible (optimización crítica)
  if (!visible) return null;

  // Colores dinámicos basados en el tema
  const themeColors = {
    background: isDarkMode ? Colors.background : Colors.pinterestBackground,
    surface: isDarkMode ? Colors.surface : Colors.pinterestSurface,
    text: isDarkMode ? Colors.text : Colors.pinterestText,
    textSecondary: isDarkMode ? Colors.textSecondary : Colors.pinterestTextSecondary,
    border: isDarkMode ? '#333' : Colors.pinterestBorder,
    gradientStart: isDarkMode ? Colors.gradientStart : '#F0F0F0',
    gradientEnd: isDarkMode ? Colors.gradientEnd : '#FFFFFF',
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      presentationStyle="fullScreen"
      onRequestClose={onBack}
      transparent={false}
      hardwareAccelerated={true}
    >
      <StatusBar 
        barStyle={isDarkMode ? "light-content" : "dark-content"} 
        backgroundColor={themeColors.background} 
      />
      <View style={[styles.container, { backgroundColor: themeColors.background }]}>
        <LinearGradient
          colors={[themeColors.gradientStart, themeColors.gradientEnd]}
          style={styles.gradient}
        >
        <View style={[styles.header, { backgroundColor: isDarkMode ? 'transparent' : themeColors.surface }]}>
          <Pressable
            onPress={onBack}
            style={[styles.backButton, { backgroundColor: themeColors.surface }]}
          >
            <Text style={[styles.backIcon, { color: themeColors.text }]}>←</Text>
          </Pressable>
          <Text style={[styles.title, { color: themeColors.text }]}>Detalle del Pin</Text>
          
          {/* Botón de toggle de tema */}
          <Pressable
            onPress={toggleTheme}
            style={[styles.themeButton, { backgroundColor: themeColors.surface }]}
          >
            <Text style={styles.themeIcon}>{isDarkMode ? '☀️' : '🌙'}</Text>
          </Pressable>
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
        >
          <View style={[styles.imageContainer, { backgroundColor: themeColors.background }]}>
            {/* Imagen principal optimizada con normalización cross-plataforma */}
            <View style={styles.imageWrapper}>
              {normalizedSource ? (
                <Image
                  source={normalizedSource}
                  style={styles.image}
                  resizeMode="contain"
                  fadeDuration={100}
                  progressiveRenderingEnabled={true}
                />
              ) : (
                <View style={[styles.imagePlaceholder, { backgroundColor: themeColors.surface }]}>
                  <Text style={styles.imagePlaceholderText}>📷</Text>
                  <Text style={[styles.imagePlaceholderSubtext, { color: themeColors.textSecondary }]}>Imagen no disponible</Text>
                </View>
              )}
            </View>
            
            <View style={styles.imageOverlay}>
              <View style={styles.topActions}>
                <Pressable
                  onPress={handleLike}
                  style={[styles.actionButton, { backgroundColor: themeColors.surface }]}
                >
                  <Text style={[styles.actionIcon, pin.isLiked && styles.likedIcon]}>
                    {pin.isLiked ? '❤️' : '🤍'}
                  </Text>
                </Pressable>
                <Pressable
                  onPress={handleSave}
                  style={[styles.actionButton, { backgroundColor: themeColors.surface }]}
                >
                  <Text style={[styles.actionIcon, pin.isSaved && styles.savedIcon]}>
                    📌
                  </Text>
                </Pressable>
                <Pressable
                  onPress={handleShare}
                  style={[styles.actionButton, { backgroundColor: themeColors.surface }]}
                >
                  <Text style={styles.actionIcon}>↗</Text>
                </Pressable>
              </View>
            </View>
          </View>

          <View style={styles.infoContainer}>
            <Text style={[styles.pinTitle, { color: themeColors.text }]}>{pin.title}</Text>
            <Text style={[styles.pinDescription, { color: themeColors.textSecondary }]}>{pin.description}</Text>
            
            <View style={styles.authorContainer}>
              <Text style={[styles.authorLabel, { color: themeColors.textSecondary }]}>Por:</Text>
              <Text style={[styles.authorName, { color: themeColors.text }]}>{pin.author}</Text>
            </View>

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statIcon}>❤️</Text>
                <Text style={[styles.statNumber, { color: themeColors.text }]}>{pin.likes}</Text>
                <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>Likes</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statIcon}>👁️</Text>
                <Text style={[styles.statNumber, { color: themeColors.text }]}>1.2K</Text>
                <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>Vistas</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statIcon}>📌</Text>
                <Text style={[styles.statNumber, { color: themeColors.text }]}>45</Text>
                <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>Guardados</Text>
              </View>
            </View>
          </View>

          <View style={styles.actionsContainer}>
            <Pressable
              onPress={handleDownload}
              disabled={isDownloading}
              style={styles.downloadButton}
            >
              <LinearGradient
                colors={[Colors.redGradientStart, Colors.redGradientEnd]}
                style={styles.buttonGradient}
              >
                <Text style={styles.downloadButtonText}>
                  {isDownloading ? 'Descargando...' : '⬇️ Descargar Imagen'}
                </Text>
              </LinearGradient>
            </Pressable>

            <Pressable
              onPress={handleShare}
              disabled={isSharing}
              style={[styles.shareButton, { 
                backgroundColor: isDarkMode ? Colors.surface : themeColors.surface,
                borderColor: themeColors.border 
              }]}
            >
              <Text style={[styles.shareButtonText, { color: themeColors.text }]}>
                {isSharing ? 'Compartiendo...' : '↗ Compartir'}
              </Text>
            </Pressable>
          </View>

          <View style={styles.tagsContainer}>
            <Text style={[styles.tagsTitle, { color: themeColors.text }]}>Etiquetas:</Text>
            <View style={styles.tagsList}>
              {["#TokyoGhoul", "#Kaneki", "#Anime", "#Manga", "#Ghoul"].map((tag, idx) => (
                <Text 
                  key={tag + idx} 
                  style={[styles.tag, { 
                    backgroundColor: isDarkMode ? Colors.surface : themeColors.surface,
                    color: themeColors.text,
                    borderColor: themeColors.border
                  }]}
                >
                  {tag}
                </Text>
              ))}
            </View>
          </View>

          {/* Sección de Comentarios */}
          <View style={styles.commentsSection}>
            <Pressable 
              style={styles.commentsHeader}
              onPress={handleOpenComments}
            >
              <Text style={[styles.commentsSectionTitle, { color: themeColors.text }]}>
                💬 Comentarios ({commentCount})
              </Text>
              <Text style={[styles.viewAllComments, { color: Colors.pinterestRed }]}>Ver todos →</Text>
            </Pressable>
            
            <Pressable 
              style={[styles.addCommentButton, { 
                backgroundColor: themeColors.surface,
                borderColor: themeColors.border
              }]}
              onPress={handleOpenComments}
            >
              <Text style={[styles.addCommentText, { color: themeColors.textSecondary }]}>
                Agregar un comentario...
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>

    {/* Modal de Comentarios */}
    <CommentsModal
      visible={showComments}
      onClose={handleCloseComments}
      pinId={pin.id}
      pinTitle={pin.title}
      pinImage={pin.imageUri}
      onCommentsChanged={setCommentCount}
    />
    </Modal>
  );
});

export default ImageDetailScreen;

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
  themeButton: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    ...(Platform.OS === 'web' ? {
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    } : {}),
  },
  themeIcon: {
    fontSize: 20,
  },
  placeholder: {
    width: 40,
  },
  imageContainer: {
    position: 'relative',
    width: width,
    height: height * 0.6,
    backgroundColor: Colors.background,
  },
  imageScrollView: {
    width: '100%',
    height: '100%',
  },
  imageScrollContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width,
    height: height * 0.6,
    backgroundColor: '#1a1a1a',
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
  buttonGradient: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  downloadButtonText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  shareButton: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    borderWidth: 1,
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
    borderWidth: 1,
  },
  commentsSection: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 100,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 20,
  },
  commentsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  commentsSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  viewAllComments: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  addCommentButton: {
    backgroundColor: Colors.background,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
  },
  addCommentText: {
    color: Colors.text + '80',
    fontSize: 14,
  },
  imagePlaceholder: {
    flex: 1,
    width: width,
    height: height * 0.6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
  },
  imagePlaceholderText: {
    color: '#999',
    fontSize: 48,
    marginBottom: 8,
  },
  imagePlaceholderSubtext: {
    color: '#666',
    fontSize: 14,
  },
  imageWrapper: {
    width: width,
    height: height * 0.6,
    backgroundColor: '#1a1a1a',
  },
});
